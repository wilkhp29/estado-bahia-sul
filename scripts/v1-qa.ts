delete process.env.DATABASE_URL;
delete process.env.VERCEL;
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';
import { db } from '../lib/store';
import { prepareParticipation } from '../lib/participation';
const run = async () => {
    const directory = mkdtempSync(join(tmpdir(), 'bahia-v1-qa-'));
    const base = 'http://localhost:3099';
    const password = randomBytes(24).toString('hex');
    const salt = randomBytes(16).toString('hex');
    Object.assign(process.env, { DATABASE_PATH: join(directory, 'qa.sqlite'), DATA_ENCRYPTION_KEY: randomBytes(32).toString('hex'), ADMIN_PASSWORD_HASH: salt + ':' + scryptSync(password, salt, 64).toString('hex'), SITE_URL: base, COLLECTION_ENABLED: 'false' });
    const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3099', '--hostname', '127.0.0.1'], { env: process.env, stdio: 'pipe' });
    let serverError = '';
    server.stderr.on('data', d => { serverError += d.toString(); });
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        for (let i = 0; i < 60; i++) {
            try {
                if ((await fetch(base)).ok)
                    break;
            }
            catch { }
            await new Promise(r => setTimeout(r, 500));
        }
        assert.equal((await fetch(base)).status, 200, serverError);
        mkdirSync('.impeccable/review/v1', { recursive: true });
        const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
        const page = await context.newPage();
        const errors: string[] = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(base, { waitUntil: 'networkidle' });
        assert.equal(await page.getByText('12.482', { exact: false }).count(), 0);
        await page.locator('.brand-v1 img').evaluate((img: HTMLImageElement) => img.decode());
        await page.screenshot({ path: '.impeccable/review/v1/home-desktop.png', fullPage: true });
        for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Home overflow ${width}`);
            if (width === 390)
                await page.screenshot({ path: '.impeccable/review/v1/home-mobile.png', fullPage: true });
        }
        await page.goto(base + '/participar', { waitUntil: 'networkidle' });
        assert.ok(await page.getByLabel('Nome completo', { exact: true }).isDisabled());
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: '.impeccable/review/v1/form-desktop.png', fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '.impeccable/review/v1/form-mobile.png', fullPage: true });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const blocked = await context.request.post(base + '/api/participacao', { headers: { Origin: base }, data: {} });
        assert.equal(blocked.status(), 503);
        const forbidden = await context.request.post(base + '/api/admin/export', { headers: { Origin: 'https://invalid.example' }, data: {} });
        assert.equal(forbidden.status(), 403);
        const unauthorized = await context.request.post(base + '/api/admin/export', { headers: { Origin: base }, data: {} });
        assert.equal(unauthorized.status(), 401);
        await page.goto(base + '/admin');
        await page.getByLabel('Senha de administrador').fill(password);
        await page.getByRole('button', { name: 'Entrar no painel' }).click();
        await page.getByRole('heading', { name: 'Gestão do Bahia do Sul' }).waitFor();
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: '.impeccable/review/v1/admin-desktop.png', fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '.impeccable/review/v1/admin-mobile.png', fullPage: true });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const sample = { name: '=Teste isolado', email: 'qa@example.invalid', municipality: '2913606', consent: true as const, newsletter: false, website: '', captcha: 'fixture' };
        const prepared = (await prepareParticipation(sample))!;
        const participantContext = await browser.newContext();
        const participantPage = await participantContext.newPage();
        await participantPage.goto(base + '/participar/confirmar?token=' + prepared.token);
        assert.equal(((await db().prepare("SELECT COUNT(*) AS n FROM participants WHERE status='verified'").get())!).n, 0, 'GET não confirma');
        await participantPage.getByRole('button', { name: 'Confirmar minha participação', exact: true }).click();
        await participantPage.getByRole('heading', { name: 'Participação confirmada.' }).waitFor();
        const manage = await participantPage.locator('.private-key').innerText();
        const certHref = await participantPage.getByRole('link', { name: 'Abrir meu certificado' }).getAttribute('href');
        await participantPage.getByRole('link', { name: 'Abrir meu certificado' }).click();
        await participantPage.getByRole('heading', { name: sample.name, exact: true }).waitFor();
        const anonymous = await browser.newContext();
        const anon = await anonymous.newPage();
        await anon.goto(base + certHref);
        await anon.waitForLoadState('networkidle');
        assert.equal(await anon.getByText(sample.name, { exact: true }).count(), 0);
        assert.ok(await anon.getByRole('heading', { name: 'Registro confirmado' }).isVisible());
        const exported = await context.request.post(base + '/api/admin/export', { headers: { Origin: base }, data: { mode: 'personal', purpose: 'Teste automatizado em banco isolado', acknowledged: true } });
        assert.equal(exported.status(), 200);
        const csv = await exported.text();
        assert.ok(csv.includes("'=Teste isolado"));
        assert.ok(csv.includes(sample.email));
        const badExport = await context.request.post(base + '/api/admin/export', { headers: { Origin: base }, data: { mode: 'personal', purpose: '', acknowledged: false } });
        assert.equal(badExport.status(), 400);
        const aggregate = await context.request.post(base + '/api/admin/export', { headers: { Origin: base }, data: { mode: 'aggregate', purpose: 'Teste de totalização municipal', acknowledged: true } });
        assert.equal(aggregate.status(), 200);
        const aggregateText = await aggregate.text();
        assert.ok(!aggregateText.includes(sample.email));
        assert.ok(aggregateText.includes('Ilhéus'));
        const downloadPromise = page.waitForEvent('download');
        await page.getByLabel('Finalidade da exportação').fill('Verificar exportação pela interface');
        await page.getByLabel('Usarei o arquivo', { exact: false }).check();
        await page.getByRole('button', { name: 'Baixar CSV' }).click();
        const download = await downloadPromise;
        assert.equal(await download.failure(), null);
        const publish = await context.request.post(base + '/api/admin/content', { headers: { Origin: base }, data: { kind: 'estudos', title: 'Estudo exclusivo do teste', body: 'Conteúdo de teste isolado, não publicado no banco real.', source: 'https://www.ibge.gov.br', published: true } });
        assert.equal(publish.status(), 200);
        await anon.goto(base + '/estudos');
        assert.ok(await anon.getByRole('heading', { name: 'Estudo exclusivo do teste' }).isVisible());
        for (const route of ['/projeto', '/economia', '/mineracao', '/historia', '/estudos', '/documentos', '/noticias', '/fontes', '/privacidade', '/territorio']) {
            await page.goto(base + route, { waitUntil: 'networkidle' });
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${route}`);
        }
        const deletion = await participantContext.request.post(base + '/api/participacao/excluir', { headers: { Origin: base }, data: { token: manage } });
        assert.equal(deletion.status(), 200);
        const postDelete = await anonymous.request.get(base + certHref + '?qa=after-delete');
        const postDeleteBody = await postDelete.text();
        assert.ok(postDelete.status() === 404 || (!postDeleteBody.includes('Registro confirmado') && postDeleteBody.includes('404')), 'certificado excluído deve ser inacessível');
        assert.equal(((await db().prepare('SELECT COUNT(*) AS n FROM participants').get())!).n, 0);
        const auditCount = ((await db().prepare("SELECT COUNT(*) AS n FROM audit WHERE action='admin.export'").get())!).n;
        assert.ok(Number(auditCount) >= 3);
        await context.request.post(base + '/api/admin/logout', { headers: { Origin: base }, data: {} });
        assert.equal((await context.request.post(base + '/api/admin/export', { headers: { Origin: base }, data: {} })).status(), 401);
        assert.deepEqual(errors, []);
        console.log('PASS V1: logo, números reais, responsividade, coleta fechada, login, CSRF, exportação UI/API, auditoria, publicação, confirmação explícita, certificado privado, exclusão e logout. Banco real não utilizado.');
    }
    finally {
        await browser.close();
        await db().close();
        server.kill('SIGTERM');
    }
};
run().catch(e => { console.error(e); process.exitCode = 1; });
