import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { indexingEnabled, publicMetadata, publicPages, siteUrl } from '../lib/site';
import robots from '../app/robots';
import sitemap from '../app/sitemap';
import { candidate, candidateTrajectory } from '../data/candidate';
import { collectionReady, publicConfig } from '../lib/config';

process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'bahia-sitemap-test-')), 'site.sqlite');
after(async () => { const { db } = await import('../lib/store'); await db().close(); });

test('candidate presentation keeps 1026 and individually sourced public milestones', () => {
  assert.equal(candidate.election.number, '1026');
  assert.equal(candidateTrajectory.length, 4);
  for (const milestone of candidateTrajectory) {
    assert.ok(milestone.title && milestone.text && milestone.source);
    assert.equal(new URL(milestone.url).protocol, 'https:');
  }
  assert.match(candidateTrajectory[0].text, /não eleito/);
  assert.match(candidateTrajectory[1].text, /não uma comprovação do vínculo atual/);
});

test('production indexing is enabled only for the intended environment and supports an explicit stop', async () => {
  const previous = { env: process.env.VERCEL_ENV, flag: process.env.PUBLIC_INDEXING_ENABLED };
  try {
    delete process.env.PUBLIC_INDEXING_ENABLED;
    process.env.VERCEL_ENV = 'preview';
    assert.equal(indexingEnabled(), false);
    assert.equal((publicMetadata('/participar/abaixo-assinado', 'Abaixo-assinado', 'Descrição de teste suficientemente longa para indexação pública e compartilhamento no portal Bahia do Sul.').robots as {index:boolean}).index, false);
    assert.deepEqual(await sitemap(), []);
    assert.deepEqual(robots().rules, { userAgent: '*', disallow: '/' });
    process.env.VERCEL_ENV = 'production';
    assert.equal(indexingEnabled(), true);
    assert.equal((publicMetadata('/participar/abaixo-assinado', 'Abaixo-assinado', 'Descrição de teste suficientemente longa para indexação pública e compartilhamento no portal Bahia do Sul.').robots as {index:boolean}).index, true);
    assert.equal((await sitemap()).length, publicPages.length);
    const rules = robots().rules as { disallow: string[] };
    for (const path of ['/admin', '/api/', '/certificado/', '/participar/gerenciar', '/participar/confirmar', '/buscar']) assert.ok(rules.disallow.includes(path));
    process.env.PUBLIC_INDEXING_ENABLED = 'false';
    assert.equal(indexingEnabled(), false);
  } finally {
    if (previous.env === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = previous.env;
    if (previous.flag === undefined) delete process.env.PUBLIC_INDEXING_ENABLED; else process.env.PUBLIC_INDEXING_ENABLED = previous.flag;
  }
});

test('public pages have unique canonical addresses and complete social previews; no private routes in sitemap list', () => {
  assert.equal(new Set(publicPages.map(page => page.path)).size, publicPages.length);
  for (const page of publicPages) {
    assert.doesNotMatch(page.path, /admin|api\/|certificado|confirmar|gerenciar|buscar/);
    const meta = publicMetadata(page.path, page.title, page.description);
    assert.equal(meta.title, page.title);
    assert.equal(meta.alternates?.canonical, siteUrl + page.path);
    assert.ok(meta.openGraph && meta.twitter && meta.description);
    assert.ok(String(meta.description).length >= 120, `${page.path} should have a useful description`);
    assert.equal((meta.twitter as {card?:string})?.card, 'summary_large_image');
  }
  assert.ok(publicPages.some(page => page.path === '/participar/abaixo-assinado'));
});

test('Professor Guilherme contact is public without opening the petition collection', () => {
  const previous = Object.fromEntries(['PRIVACY_EMAIL','COLLECTION_ENABLED','PRIVACY_REVIEWED','TRUST_PROXY','TURNSTILE_SECRET','NEXT_PUBLIC_TURNSTILE_SITE_KEY'].map(key => [key, process.env[key]]));
  try {
    for (const key of Object.keys(previous)) delete process.env[key];
    assert.equal(publicConfig().privacyEmail, 'profguilherme_254@hotmail.com');
    assert.equal(collectionReady(), false);
  } finally {
    for (const [key,value] of Object.entries(previous)) if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
