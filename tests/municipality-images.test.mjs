import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const territory = JSON.parse(readFileSync(new URL('../data/territory.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(readFileSync(new URL('../data/municipality-images.json', import.meta.url), 'utf8'));

test('image manifest stays aligned with all territorial list entries', () => {
  assert.equal(manifest.results.length, territory.municipalities.length);
  assert.deepEqual(manifest.results.map(item => item.municipality), territory.municipalities.map(item => item.name));
});

test('every displayed Wikimedia image has alt text, attribution, license, and source page', () => {
  for (const item of manifest.results) {
    if (!item.image) continue;
    assert.ok(item.image.alt, `${item.municipality}: missing alt text`);
    assert.ok(item.image.credit, `${item.municipality}: missing credit`);
    assert.ok(item.image.license, `${item.municipality}: missing license`);
    assert.match(item.image.sourceUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\//, `${item.municipality}: invalid source URL`);
    assert.match(item.image.imageUrl, /^https:\/\/(?:thumb|upload)\.wikimedia\.org\//, `${item.municipality}: unexpected image host`);
    assert.equal(item.image.kind, 'photograph', `${item.municipality}: maps must never substitute for landscape photography`);
  }
});

test('territory entries awaiting validation do not receive guessed images', () => {
  const pending = manifest.results.filter(item => item.territoryStatus === 'NEEDS_TERRITORY_REVIEW');
  assert.equal(pending.length, 4);
  assert.ok(pending.every(item => item.image === null));
});

test('municipalities without a sourced photograph receive a named non-photographic visual', () => {
  const component = readFileSync(new URL('../components/MunicipalityVisual.tsx', import.meta.url), 'utf8');
  assert.match(component, /municipality-visual-silhouette/);
  assert.match(component, /Imagem territorial indisponível para \$\{municipality\.name\}/);
  assert.match(component, /<MapPin aria-hidden="true" \/>/);
  assert.doesNotMatch(component, /Conheça o território no mapa/);
  assert.ok(manifest.results.filter(item => item.image).length < territory.municipalities.length);
});
