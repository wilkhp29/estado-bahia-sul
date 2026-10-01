#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const candidatesFile = resolve(root, process.argv[2] || '.superpowers/sdd/2026-09-22-home-territorio-participacao/photo-candidates.json');
const categoryFile = resolve(root, process.argv[3] || '.superpowers/sdd/2026-09-22-home-territorio-participacao/category-candidates.json');
const territoryFile = resolve(root, 'data/territory.json');
const outputFile = resolve(root, 'data/municipality-images.json');
const [catalog, categories, territory] = await Promise.all([
  readFile(candidatesFile, 'utf8').then(JSON.parse),
  readFile(categoryFile, 'utf8').then(JSON.parse).catch(() => ({ results: [] })),
  readFile(territoryFile, 'utf8').then(JSON.parse),
]);

const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const excluded = /\b(flag|bandeira|coat of arms|brasao|escudo|map locator|bahia municip|mapa|population|crescimento populacional|airport|aeroporto|cobra|snake|serpente|logo|logotipo|granite|mineral|sodalite|syenite|students|alunos|discursando|politician|politico|candidato|ativista|jogador|portrait|river|rio brumado|birthplace|casa natal|death valley|junction|california|nevada|van|bus|onibus|vehicle|veiculo)\b/;
const curatedPhotographs = {
  '2900108': {
    title: 'Serra da Tromba',
    description: 'Vista da Serra da Tromba em Abaíra, Bahia, próximo ao povoado de Curralinho.',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Serra_da_Tromba.jpg/1280px-Serra_da_Tromba.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
    originalUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Serra_da_Tromba.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=original',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Serra_da_Tromba.jpg',
    author: 'Lucs1994',
    credit: 'Lucs1994',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    mime: 'image/jpeg',
  },
};
const imageFor = entry => {
  if (!entry.id || entry.review) return null;
  const curated = curatedPhotographs[entry.id];
  if (curated) return {
    ibgeCode: entry.id,
    municipality: entry.name,
    kind: 'photograph',
    ...curated,
    alt: curated.description,
    reviewStatus: 'SOURCE_AND_LICENSE_LINKED',
  };
  const result = catalog.results.find(item => item.ibgeCode === entry.id);
  if (!result?.candidates?.length) return null;
  const name = normalize(entry.name);

  const category = categories.results.find(item => item.ibgeCode === entry.id);
  const relevantPhoto = candidate => {
    const title = normalize(candidate.title);
    const description = normalize(candidate.description);
    const all = normalize(`${candidate.title} ${candidate.description}`);
    const mentionsPlace = description.includes(name);
    const conflictsWithPlace = /(?:city of|cidade de)\s+([^.;,]+)/.exec(description)?.[1];
    const namedLocation = /\b(?:in|at|em|no|na)\s+([^,.;]+)/g;
    const otherNamedPlace = [...description.matchAll(namedLocation)].map(match => match[1]).find(location =>
      !location.includes(name) && !/\b(bahia|brazil|brasil|state of)\b/.test(location),
    );
    return mentionsPlace && !excluded.test(all) &&
      (!conflictsWithPlace || conflictsWithPlace.includes(name)) &&
      !otherNamedPlace &&
      candidate.mime?.startsWith('image/') && (description.includes('bahia') || title.includes(name));
  };
  const categoryPhoto = category?.candidates?.find(relevantPhoto);
  // Prefer actual place photography with an explicit city/Bahia reference in its
  // description. Ambiguous image search results are never treated as photographs.
  const searchPhoto = result.candidates.find(candidate => {
    const description = normalize(candidate.description);
    const localImageDescription = /aerial|imagem aerea|mostrando parte da cidade|vista de|foto de|photo of/.test(description);
    return relevantPhoto(candidate) && description.includes(name) && (description.includes('bahia') || localImageDescription);
  });
  const photograph = categoryPhoto || searchPhoto;
  const selected = photograph;
  if (!selected) return null;
  return {
    ibgeCode: entry.id,
    municipality: entry.name,
    kind: 'photograph',
    imageUrl: selected.thumbnailUrl,
    originalUrl: selected.fileUrl,
    sourceUrl: selected.sourceUrl,
    title: selected.title,
    description: selected.description,
    author: selected.author || 'Autoria não informada pelo Commons',
    credit: selected.creditLine || selected.author || 'Autoria não informada pelo Commons',
    license: selected.license || 'Licença a conferir na página de origem',
    licenseUrl: selected.licenseUrl,
    alt: `${selected.description || selected.title} — ${entry.name}, Bahia`,
    reviewStatus: 'SOURCE_AND_LICENSE_LINKED',
  };
};

const images = territory.municipalities.map(municipality => ({
  ibgeCode: municipality.id || null,
  municipality: municipality.name,
  territoryStatus: municipality.review ? 'NEEDS_TERRITORY_REVIEW' : 'VALIDATED_NAME',
  image: imageFor(municipality),
}));
await writeFile(outputFile, `${JSON.stringify({
  generatedAt: catalog.generatedAt,
  source: 'Wikimedia Commons category membership and API; individual file pages contain the controlling attribution and license terms',
  results: images,
}, null, 2)}\n`);
const withImage = images.filter(item => item.image).length;
console.log(`Fotografias com fonte/licença vinculadas: ${withImage}/${images.length}; municípios sem fotografia identificada permanecem sem imagem, sem mapa substituto.`);
console.log(`Manifesto gerado: ${outputFile}`);
