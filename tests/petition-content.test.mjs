import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../app/participar/abaixo-assinado/page.tsx',import.meta.url),'utf8');
test('manifesto states the project position and distinguishes it from an official plebiscite',()=>{
 assert.match(source,/manifestação voluntária/i);
 assert.match(source,/Não é plebiscito/i);
 assert.match(source,/posição do projeto/i);
 assert.match(source,/Compromisso com dados e fontes/i);
 assert.match(source,/o projeto Bahia do Sul defende a criação de um novo estado/i);
});
test('portal indicators retain sources without repeating unverified manifesto figures',()=>{
 assert.match(source,/fonte, ano e metodologia/i);
 assert.doesNotMatch(source,/5\.074\.306.*habitantes/);
 assert.doesNotMatch(source,/98,5 bilhões de PIB/);
});
test('form keeps minimum-data boundary explicit',()=>{
 assert.match(source,/nome, e-mail e município/i);
 assert.match(source,/Não solicitamos CPF, RG, data de nascimento ou WhatsApp/i);
 assert.match(source,/Nenhum dado será recebido/i);
});
