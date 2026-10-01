import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/client-presentation.json',import.meta.url),'utf8'));
test('client presentation preserves every supplied line in order, including numbers and punctuation',()=>{
 const source=readFileSync(new URL('../docs/cliente-original-2026-09-29.txt',import.meta.url),'utf8').split(/\r?\n/).filter(line=>line.trim());
 const stored=data.sections.flatMap(section=>[section.title,...section.lines]);
 assert.deepEqual(stored,source);
});
test('client comparative table has four columns and nine complete indicators',()=>{
 const rows=data.sections.find(section=>section.id==='viabilidade').lines.filter(line=>line.includes('\t'));
 assert.equal(rows.length,10);
 for(const row of rows) assert.equal(row.split('\t').length,4);
});
test('client menu retains all thirteen entries',()=>{
 assert.equal(data.sections.find(section=>section.id==='menu').lines.length,13);
});
