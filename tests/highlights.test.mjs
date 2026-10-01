import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dataset=JSON.parse(readFileSync(new URL('../data/territory.json',import.meta.url)));
const source=readFileSync(new URL('../data/highlights.ts',import.meta.url),'utf8');
const entries=[...source.matchAll(/\{id:'([^']+)',name:'([^']+)',region:'([^']+)'/g)];
test('destaques correspondem a municípios e regiões reais do dataset',()=>{
 assert.equal(entries.length,11);
 assert.equal(new Set(entries.map(e=>e[1])).size,11);
 assert.equal(new Set(entries.map(e=>e[3])).size,6);
 for(const [,id,name,region] of entries){
  const m=dataset.municipalities.find(m=>m.id===id);
  assert.ok(m,`Código desconhecido: ${id}`);
  assert.equal(m.name,name);
  assert.equal(m.region,region);
 }
});
test('cada destaque tem fonte governamental identificada',()=>{
 const urls=[...source.matchAll(/url:'([^']+)'/g)];
 assert.equal(urls.length,entries.length);
 for(const [,url]of urls){const u=new URL(url);assert.equal(u.protocol,'https:');assert.ok(u.hostname==='www.gov.br'||u.hostname==='www.ba.gov.br');}
});
