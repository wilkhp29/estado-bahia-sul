import {test} from 'node:test';
import assert from 'node:assert/strict';
import {tsImport} from 'tsx/esm/api';
const {postJson,requestMessage}=await tsImport('../lib/client-request.ts', import.meta.url);
test('request: success, network, server and malformed responses have safe outcomes',async()=>{
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async()=>Response.json({message:'ok'});
  assert.deepEqual(await postJson('/test',{}),{message:'ok'});
  globalThis.fetch=async()=>{throw new TypeError('Failed to fetch: internal detail')};
  await assert.rejects(postJson('/test',{}),/Confira sua internet/);
  globalThis.fetch=async()=>new Response('<html>secret</html>',{status:503});
  await assert.rejects(postJson('/test',{}),/temporariamente indisponível/);
  globalThis.fetch=async()=>new Response('invalid-json',{status:200});
  await assert.rejects(postJson('/test',{}),/resposta inesperada/);
  globalThis.fetch=async()=>Response.json({error:'Link inválido ou expirado.'},{status:400});
  await assert.rejects(postJson('/test',{}),/Link inválido ou expirado/);
  assert.doesNotMatch(requestMessage(new Error('private internal error')),/private/);
 }finally{globalThis.fetch=original}
});
