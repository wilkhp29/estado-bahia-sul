import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const territoryPage = readFileSync(new URL('../app/territorio/page.tsx', import.meta.url), 'utf8');
const territoryComponent = readFileSync(new URL('../components/Territory.tsx', import.meta.url), 'utf8');
const sourcePage = readFileSync(new URL('../app/[section]/page.tsx', import.meta.url), 'utf8');

test('map page omits its standalone sources section and JSON download links', () => {
  assert.doesNotMatch(territoryPage, /id=["']fontes["']|Fontes e metodologia|validation\.json|download/i);
  assert.doesNotMatch(territoryComponent, /validation\.json|#fontes|Consulte a conferência|Conferir registro/i);
  assert.doesNotMatch(sourcePage, /validation\.json|Baixar relatório original de conferência/i);
  assert.equal(existsSync(new URL('../public/data/validation.json', import.meta.url)), false);
});
