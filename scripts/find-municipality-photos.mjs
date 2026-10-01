#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = resolve(root, 'data/territory.json');
const outputArg = process.argv.indexOf('--output');
if (outputArg < 0 || !process.argv[outputArg + 1]) {
  console.error('Uso: node scripts/find-municipality-photos.mjs --output <arquivo-json>');
  process.exit(2);
}
const outputPath = resolve(root, process.argv[outputArg + 1]);
const dataset = JSON.parse(await readFile(inputPath, 'utf8'));
const municipalities = dataset.municipalities;
const wait = ms => new Promise(resolvePromise => setTimeout(resolvePromise, ms));

function plain(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ').trim();
}

async function search(municipality) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${municipality.name} Bahia`,
    gsrnamespace: '6',
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiextmetadatafilter: 'Artist|AttributionRequired|Credit|ImageDescription|LicenseShortName|LicenseUrl|ObjectName|UsageTerms',
    iiurlwidth: '960',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': 'BahiaDoSulPortal/0.1 (municipality photo source research; https://estadobahiadosul.com.br)' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Wikimedia Commons respondeu HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(`Wikimedia Commons: ${data.error.info || data.error.code}`);
  return Object.values(data.query?.pages || {}).map(page => {
    const image = page.imageinfo?.[0];
    if (!image || !image.mime?.startsWith('image/')) return null;
    const meta = image.extmetadata || {};
    const description = plain(meta.ImageDescription?.value);
    const title = plain(meta.ObjectName?.value || page.title.replace(/^File:/, ''));
    const haystack = `${title} ${description}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normalizedName = municipality.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return {
      fileTitle: page.title,
      title,
      description,
      author: plain(meta.Artist?.value || meta.Credit?.value),
      creditLine: plain(meta.Credit?.value),
      license: plain(meta.LicenseShortName?.value || meta.UsageTerms?.value),
      licenseUrl: plain(meta.LicenseUrl?.value),
      attributionRequired: plain(meta.AttributionRequired?.value).toLowerCase() === 'true',
      fileUrl: image.url,
      thumbnailUrl: image.thumburl,
      sourceUrl: image.descriptionurl,
      mime: image.mime,
      width: image.width,
      height: image.height,
      containsMunicipalityName: haystack.includes(normalizedName),
      reviewStatus: 'NEEDS_HUMAN_REVIEW',
    };
  }).filter(Boolean);
}

const results = [];
for (const [index, municipality] of municipalities.entries()) {
  if (!municipality.id || municipality.review) {
    results.push({ ibgeCode: municipality.id || null, name: municipality.name, status: 'TERRITORY_REVIEW_REQUIRED', candidates: [] });
    continue;
  }
  let candidates = [];
  let error = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      candidates = await search(municipality);
      error = null;
      break;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Consulta não concluída';
      if (attempt < 3) await wait(1000 * (attempt + 1));
    }
  }
  results.push({
    ibgeCode: municipality.id,
    name: municipality.name,
    status: error ? 'SEARCH_FAILED' : 'NEEDS_HUMAN_REVIEW',
    error,
    candidates,
  });
  if ((index + 1) % 10 === 0 || index + 1 === municipalities.length) {
    console.log(`Consultados ${index + 1}/${municipalities.length} registros`);
  }
  await wait(500);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: 'Wikimedia Commons API', results }, null, 2)}\n`, 'utf8');
const withCandidates = results.filter(item => item.candidates?.length).length;
const failures = results.filter(item => item.status === 'SEARCH_FAILED').length;
console.log(`Candidatos encontrados para ${withCandidates}/${municipalities.length}; consultas com falha: ${failures}. Todos seguem pendentes de conferência humana.`);
console.log(`Arquivo: ${outputPath}`);
