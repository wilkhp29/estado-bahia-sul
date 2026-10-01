delete process.env.DATABASE_URL;
delete process.env.VERCEL;
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import { db, totals, cleanup } from '../lib/store';
import { hash, decrypt, encrypt, csv, limited, passwordMatches, sameOrigin, clientKey } from '../lib/security';
import { participantSchema, prepareParticipation, confirmParticipation, withdraw, managedParticipant } from '../lib/participation';
import { collectionReady } from '../lib/config';
process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'bahia-sql-tests-')), 'test.sqlite');
process.env.DATA_ENCRYPTION_KEY = randomBytes(32).toString('hex');
process.env.SITE_URL = 'http://localhost:3000';
const sample = { name: 'Pessoa de Teste', email: 'test@example.invalid', municipality: '2913606', consent: true as const, newsletter: false, website: '', captcha: 'test-token' };
after(async () => await db().close());
test('validação recusa município desconhecido, honeypot e consentimento ausente', () => { assert.equal(participantSchema.safeParse({ ...sample, municipality: '0' }).success, false); assert.equal(participantSchema.safeParse({ ...sample, consent: false }).success, false); assert.equal(participantSchema.safeParse({ ...sample, website: 'spam' }).success, false); assert.equal(participantSchema.safeParse(sample).success, true); });
test('banco vazio não conta dados ilustrativos', async () => { assert.deepEqual({ ...await totals() }, { verified: 0, municipalities: 0 }); });
test('criptografia autenticada impede leitura e alteração silenciosa', () => { const value = encrypt('dados pessoais'); assert.notEqual(value, 'dados pessoais'); assert.equal(decrypt(value), 'dados pessoais'); const [iv, tag, data] = value.split('.'); const bytes = Buffer.from(data, 'base64url'); bytes[0] ^= 1; assert.throws(() => decrypt([iv, tag, bytes.toString('base64url')].join('.'))); });
test('pending não conta, confirmação única conta, token não é salvo em claro', async () => { const prepared = (await prepareParticipation(sample))!; assert.equal((await totals()).verified, 0); const row = (await db().prepare('SELECT * FROM participants').get())!; assert.notEqual(row.email, sample.email); assert.notEqual(row.name, sample.name); assert.equal((await db().prepare('SELECT hash FROM tokens').get())!.hash, hash(prepared.token)); const result = (await confirmParticipation(prepared.token))!; assert.ok(result.certificate); assert.equal((await totals()).verified, 1); assert.equal(await confirmParticipation(prepared.token), null); assert.equal(await prepareParticipation({ ...sample, name: 'Tentativa de alteração' }), null); assert.equal(decrypt((await managedParticipant(result.manage))!.name), sample.name); assert.equal(await withdraw(result.manage), true); assert.equal((await totals()).verified, 0); assert.equal(await managedParticipant(result.manage), undefined); assert.equal(await withdraw(result.manage), false); });
test('reenvio não duplica e substitui token anterior', async () => { const first = (await prepareParticipation(sample))!; const second = (await prepareParticipation(sample))!; assert.equal(((await db().prepare('SELECT COUNT(*) AS n FROM participants').get())!).n, 1); assert.equal(await confirmParticipation(first.token), null); const result = (await confirmParticipation(second.token))!; assert.ok(result); await withdraw(result.manage); });
test('tokens expirados são recusados e registros pendentes antigos são removidos', async () => { const prepared = (await prepareParticipation(sample))!; await db().prepare('UPDATE tokens SET expires_at=?').run(Date.now() - 1); assert.equal(await confirmParticipation(prepared.token), null); await db().prepare('UPDATE participants SET created_at=?').run(Date.now() - 8 * 86400000); await cleanup(); assert.equal((await db().prepare('SELECT COUNT(*) AS n FROM participants').get())!.n, 0); });
test('CSV protege fórmulas e aspas mantendo UTF-8', () => { const output = csv([['=1+1', ' +cmd', '@x', 'normal', '"texto"', 'Ilhéus']]); assert.ok(output.includes("'=1+1")); assert.ok(output.includes("' +cmd")); assert.ok(output.includes("'@x")); assert.ok(output.includes('""texto""')); assert.ok(output.startsWith('\uFEFF')); });
test('limite persistente e origem obrigatória', async () => { assert.equal(await limited('unit', 1, 10000), false); assert.equal(await limited('unit', 1, 10000), true); assert.equal(sameOrigin(new Request('http://localhost:3000/api', { headers: { origin: 'https://attacker.invalid' } })), false); assert.equal(sameOrigin(new Request('http://localhost:3000/api')), false); assert.equal(sameOrigin(new Request('http://localhost:3000/api', { headers: { origin: 'http://localhost:3000' } })), true); });
test('rate limit distinguishes clients only behind explicitly trusted proxy', () => {
  const previous = process.env.TRUST_PROXY;
  try {
    process.env.TRUST_PROXY = 'false';
    assert.equal(clientKey(new Request('https://site.test', { headers: { 'x-forwarded-for': '198.51.100.10' } })), 'shared');
    process.env.TRUST_PROXY = 'true';
    const first = clientKey(new Request('https://site.test', { headers: { 'x-forwarded-for': '198.51.100.10' } }));
    const second = clientKey(new Request('https://site.test', { headers: { 'x-forwarded-for': '198.51.100.11' } }));
    assert.notEqual(first, second);
    assert.equal(first, clientKey(new Request('https://site.test', { headers: { 'x-forwarded-for': '198.51.100.10' } })));
  } finally {
    if (previous === undefined) delete process.env.TRUST_PROXY;
    else process.env.TRUST_PROXY = previous;
  }
});
test('senha scrypt e coleta fail-closed', () => { const salt = randomBytes(16).toString('hex'); process.env.ADMIN_PASSWORD_HASH = salt + ':' + scryptSync('teste-seguro', salt, 64).toString('hex'); assert.equal(passwordMatches('teste-seguro'), true); assert.equal(passwordMatches('errada'), false); delete process.env.COLLECTION_ENABLED; assert.equal(collectionReady(), false); process.env.COLLECTION_ENABLED = 'true'; assert.equal(collectionReady(), false); });
