import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tsImport} from 'tsx/esm/api';
const {selectedMunicipality,normalizeMunicipality}=await tsImport('../lib/map-state.ts',import.meta.url);
const items=[{id:null,name:'Água Quente'},{id:'2913606',name:'Ilhéus'}];
test('map does not select null-ID records on entry or when closing',()=>{
 assert.equal(selectedMunicipality(items,null,null),null);
 assert.equal(selectedMunicipality(items,'',null),null);
 assert.equal(selectedMunicipality(items,'unknown',null),null);
});
test('map selects valid municipalities and explicit pending entries',()=>{
 assert.equal(selectedMunicipality(items,'2913606',null)?.name,'Ilhéus');
 assert.equal(selectedMunicipality(items,null,'Água Quente')?.name,'Água Quente');
 assert.equal(selectedMunicipality(items,null,'Unknown'),null);
});
test('municipal search ignores accents, case and surrounding whitespace',()=>{
 assert.equal(normalizeMunicipality('  ILHÉUS '),normalizeMunicipality('Ilheus'));
});
