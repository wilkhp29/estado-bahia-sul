import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

async function run() {
  const base = 'http://localhost:3102';
  const path = '/historia/professor-guilherme';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    mkdirSync('.impeccable/review/repositioning', { recursive: true });
    for (const route of ['/', path]) {
      assert.equal((await page.goto(base + route, { waitUntil: 'networkidle' }))?.status(), 200);
      for (const width of [320, 375, 390, 430, 768, 1024, 1292, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: overflow at ${width}`);
        if (route === path) {
          const main = await page.locator('main').boundingBox();
          assert.ok(main && main.x >= 0 && main.x + main.width <= width + 1, `candidate main clipped at ${width}`);
          assert.equal(await page.locator('.candidate-page').evaluate(element => getComputedStyle(element).display), 'block');
        }
        if ([390, 1292, 1440].includes(width)) {
          await page.screenshot({ path: `.impeccable/review/repositioning/${route === '/' ? 'home' : 'candidate'}-${width}.png`, fullPage: true });
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'História', exact: true }).click();
    await page.waitForURL(base + '/historia');
    await expect(page.locator('h1')).toHaveText('Da proposta ao debate público');
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('.r-history').getByRole('link', { name: 'página biográfica' }).click();
    await page.waitForURL(base + path);
    await page.waitForLoadState('networkidle');
    assert.match(await page.title(), /Professor Guilherme/);
    await page.getByRole('link', { name: 'Conhecer a proposta', exact: true }).click();
    assert.ok(page.url().endsWith('#proposta'));
    const question = page.locator('summary').filter({ hasText: 'Apoiar o projeto significa apoiar o candidato?' });
    await question.click();
    assert.ok(await page.getByText('Sua decisão de voto é pessoal.', { exact: false }).isVisible());
    const instagram = page.getByRole('link', { name: 'Instagram · @prof.guilhermesantos', exact: true });
    assert.equal(await instagram.getAttribute('href'), 'https://www.instagram.com/prof.guilhermesantos/');
    // Exercise unavailable and denied clipboard states without sharing to a third party.
    const fallback = await browser.newContext();
    await fallback.addInitScript(`
      Object.defineProperty(navigator, 'share', { value: undefined });
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: function () { return Promise.reject(new Error('denied')); } } });
    `);
    const fallbackPage = await fallback.newPage();
    fallbackPage.on('pageerror', error => errors.push(error.message));
    await fallbackPage.goto(base + path, { waitUntil: 'networkidle' });
    await fallbackPage.getByRole('button', { name: 'Compartilhar esta página' }).click();
    await expect(fallbackPage.getByLabel('Endereço da página')).toHaveValue('https://estadobahiadosul.com.br' + path);
    assert.ok(await fallbackPage.getByRole('status').isVisible());
    await fallback.close();
    await page.getByRole('link', { name: 'Conhecer o abaixo-assinado', exact: true }).click();
    await page.waitForURL(base + '/participar/abaixo-assinado');
    assert.deepEqual(errors, []);
    console.log('PASS: home/biografia em 9 larguras; navegação mobile, participante citado na história, âncoras, perguntas, Instagram, compartilhamento com fallback e acesso ao abaixo-assinado; sem erros de execução.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
