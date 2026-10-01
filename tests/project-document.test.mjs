import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../data/project-document.ts', import.meta.url), 'utf8');

test('document-derived project content keeps attribution and factual categories clear', () => {
  assert.match(source, /projectDocumentNotice/);
  assert.match(source, /ESTIMATIVA DO DOCUMENTO/);
  assert.match(source, /CONTEXTO HISTÓRICO/);
  assert.match(source, /PROCESSO CONSTITUCIONAL/);
  assert.match(source, /O Observatório apresentará população, eleitorado, PIB/);
});

test('document-derived content does not describe the 173 entries as official', () => {
  assert.match(source, /lista de estudo e não uma divisão administrativa oficial/);
  assert.doesNotMatch(source, /173 municípios oficiais/);
});
