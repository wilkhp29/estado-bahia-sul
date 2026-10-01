import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../data/featured-photography.json',import.meta.url),'utf8'));
test('galeria contém as treze cidades solicitadas na ordem enviada',()=>{
 assert.deepEqual(data.cities.map(p=>p.name),['Ilhéus','Itabuna','Porto Seguro','Teixeira de Freitas','Eunápolis','Vitória da Conquista','Brumado','Bom Jesus da Lapa','Jiquiriçá','Amargosa','Jequié','Valença','Cairu']);
 assert.equal(new Set(data.cities.map(p=>p.ibgeCode)).size,13);
});
test('cada fotografia tem arquivo real, texto alternativo, autoria e licença',()=>{
 for(const p of [...data.cities,...data.resources]){
  for(const key of ['imageUrl','sourceUrl','alt','author','license','licenseUrl']) assert.ok(p[key],`${p.title}: ${key}`);
  assert.match(p.imageUrl,/^https:\/\/(thumb|upload)\.wikimedia\.org\//);
  assert.doesNotMatch(p.imageUrl,/\.svg/);
 }
});
test('imagens minerais são amostras com procedência explícita',()=>{
 const minerals=data.resources.filter(p=>p.kind==='mineral');
 assert.equal(minerals.length,2);
 for(const p of minerals) assert.match(p.caption,/Amostra mineral.*Brumado/);
});
