delete process.env.DATABASE_URL;
delete process.env.VERCEL;
import { test, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { POST } from '../app/api/participacao/route';
import { db, totals } from '../lib/store';
process.env.DATABASE_PATH = join(mkdtempSync(join(tmpdir(), 'bahia-api-tests-')), 'test.sqlite');
Object.assign(process.env, { DATA_ENCRYPTION_KEY: randomBytes(32).toString('hex'), SITE_URL: 'http://localhost:3000', DATA_CONTROLLER: 'Responsável de teste', PRIVACY_EMAIL: 'privacy@example.invalid', PRIVACY_REVIEWED: 'true', COLLECTION_ENABLED: 'true', TRUST_PROXY: 'true', SMTP_HOST: 'smtp.example.invalid', SMTP_USER: 'test', SMTP_PASSWORD: 'test', SMTP_FROM: 'test@example.invalid', TURNSTILE_SECRET: 'test', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test' });
let failMail = false, validCaptcha = true;
const sent: {
    to: string;
    text: string;
}[] = [];
mock.method(globalThis, 'fetch', async () => Response.json({ success: validCaptcha, hostname: 'localhost', action: 'petition' }));
mock.method(nodemailer, 'createTransport', () => ({ sendMail: async (message: {
        to: string;
        text: string;
    }) => { if (failMail)
        throw new Error('SMTP unavailable'); sent.push(message); return { accepted: [message.to] }; } }));
after(async () => { mock.restoreAll(); await db().close(); });
const payload = { name: 'Pessoa de teste', email: 'first@example.invalid', municipality: '2913606', consent: true, newsletter: false, website: '', captcha: 'test' };
const request = (data: unknown) => new Request('http://localhost:3000/api/participacao', { method: 'POST', headers: { Origin: 'http://localhost:3000', 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
test('API envia confirmação com dados para conferência, sem contabilizar apoio', async () => { const response = await POST(request(payload)); assert.equal(response.status, 200); assert.equal(sent.length, 1); assert.ok(sent[0].text.includes('Pessoa de teste')); assert.ok(sent[0].text.includes('Ilhéus')); assert.ok(sent[0].text.includes('/participar/confirmar?token=')); assert.equal((await totals()).verified, 0); });
test('falha no provedor SMTP é explícita e não conta registro', async () => { failMail = true; const response = await POST(request({ ...payload, email: 'failed@example.invalid' })); assert.equal(response.status, 503); assert.equal((await totals()).verified, 0); failMail = false; });
test('captcha inválido e campos inválidos não criam participação', async () => { const before = (await db().prepare('SELECT COUNT(*) AS n FROM participants').get())!.n; validCaptcha = false; assert.equal((await POST(request({ ...payload, email: 'blocked@example.invalid' }))).status, 400); validCaptcha = true; assert.equal((await POST(request({ ...payload, consent: false }))).status, 400); assert.equal((await db().prepare('SELECT COUNT(*) AS n FROM participants').get())!.n, before); });
test('coleta desabilitada recusa dados antes de persistir', async () => { process.env.COLLECTION_ENABLED = 'false'; assert.equal((await POST(request(payload))).status, 503); });
