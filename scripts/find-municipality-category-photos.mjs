#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const municipalities = JSON.parse(await readFile(resolve(root, 'data/territory.json'), 'utf8')).municipalities;
const outputArg = process.argv.indexOf('--output');
if (outputArg < 0 || !process.argv[outputArg + 1]) {
  console.error('Uso: node scripts/find-municipality-category-photos.mjs --output <arquivo-json>');
  process.exit(2);
}
const output = resolve(root, process.argv[outputArg + 1]);
const wait = ms => new Promise(resolvePromise => setTimeout(resolvePromise, ms));
const clean = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'").replace(/\s+/g, ' ').trim();

async function categoryImages(name) {
  const params = new URLSearchParams({
    action: 'query', generator: 'categorymembers', gcmtitle: `Category:${name} (Bahia)`,
    gcmtype: 'file', gcmlimit: '30', prop: 'imageinfo', iiprop: 'url|mime|extmetadata',
    iiextmetadatafilter: 'Artist|AttributionRequired|Credit|ImageDescription|LicenseShortName|LicenseUrl|ObjectName|UsageTerms',
    iiurlwidth: '960', format: 'json', origin: '*',
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': 'BahiaDoSulPortal/0.1 (municipality image source research; https://estadobahiadosul.com.br)' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.info || data.error.code);
  return Object.values(data.query?.pages || {}).flatMap(page => {
    const info = page.imageinfo?.[0];
    if (!info?.mime?.startsWith('image/')) return [];
    const meta = info.extmetadata || {};
    return [{
      title: clean(meta.ObjectName?.value || page.title.replace(/^File:/, '')),
      description: clean(meta.ImageDescription?.value),
      author: clean(meta.Artist?.value || meta.Credit?.value),
      creditLine: clean(meta.Credit?.value),
      license: clean(meta.LicenseShortName?.value || meta.UsageTerms?.value),
      licenseUrl: clean(meta.LicenseUrl?.value),
      attributionRequired: clean(meta.AttributionRequired?.value).toLowerCase() === 'true',
      fileUrl: info.url,
      thumbnailUrl: info.thumburl,
      sourceUrl: info.descriptionurl,
      mime: info.mime,
      fileTitle: page.title,
    }];
  });
}

const results = [];
for (const [index, municipality] of municipalities.entries()) {
  if (!municipality.id || municipality.review) {
    results.push({ ibgeCode: municipality.id || null, name: municipality.name, status: 'TERRITORY_REVIEW_REQUIRED', candidates: [] });
    continue;
  }
  let candidates = [];
  let error = null;
  try { candidates = await categoryImages(municipality.name); }
  catch (cause) { error = cause instanceof Error ? cause.message : 'Consulta não concluída'; }
  results.push({ ibgeCode: municipality.id, name: municipality.name, status: error ? 'SEARCH_FAILED' : candidates.length ? 'CATEGORY_FOUND' : 'CATEGORY_EMPTY', error, candidates });
  if ((index + 1) % 20 === 0 || index + 1 === municipalities.length) console.log(`Categorias consultadas ${index + 1}/${municipalities.length}`);
  await wait(350);
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: 'Wikimedia Commons municipality categories', results }, null, 2)}\n`);
console.log(`Categorias com imagens: ${results.filter(item => item.candidates.length).length}/${municipalities.length}; arquivo: ${output}`);
