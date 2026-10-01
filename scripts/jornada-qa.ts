import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

async function run() {
  const base = process.env.QA_BASE_URL || 'http://localhost:3102';
  assert.ok(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base), 'QA local only');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const root = '.impeccable/review/jornada';
  mkdirSync(root, { recursive: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [320, 375, 390, 430, 768, 1024, 1280, 1440, 1536, 1920]) {
      await page.setViewportSize({ width, height: width === 1536 ? 1024 : 900 });
      await page.goto(base, { waitUntil: 'networkidle' });
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('#conteudo')).toHaveCount(1);
      await expect(page.locator('.journey-hero')).toBeVisible();
      await expect(page.locator('.journey-candidate')).toHaveCount(0);
      await expect(page.locator('.municipality-carousel')).toBeVisible();
      await expect(page.locator('#municipality-carousel-title')).toHaveText('Conheça os municípios');
      await expect(page.locator('.municipality-carousel-copy h3')).toBeVisible();
      await expect(page.locator('.brand-horizontal img')).toHaveAttribute('src', '/images/logo-bahia-horizontal.webp');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow ${width}`);
      const broken = await page.locator('img').evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0).map(image => image.getAttribute('src')));
      assert.deepEqual(broken, [], `Broken images at ${width}`);
      await page.screenshot({ path: `${root}/home-${width}.png`, fullPage: true });
      if (width === 1536) await page.screenshot({ path: `${root}/first-viewport.png` });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await expect(page.locator('.municipality-carousel-copy h3')).toHaveText('Abaíra');
    await page.getByRole('button', { name: 'Próximo município' }).click();
    await expect(page.locator('.municipality-carousel-copy h3')).toHaveText('Água Quente');
    await page.getByRole('button', { name: 'Iniciar rotação automática' }).click();
    await expect(page.locator('.municipality-carousel-copy h3')).toHaveText('Aiquara', { timeout: 9000 });
    await page.getByRole('button', { name: 'Pausar rotação automática' }).click();
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toBeFocused();
    await page.locator('.r-history').getByRole('link', { name: 'página biográfica' }).click();
    await expect(page).toHaveURL(/\/historia\/professor-guilherme$/);
    await expect(page.locator('.candidate-profile-number strong')).toHaveText('1026');
    await expect(page.locator('.candidate-timeline li')).toHaveCount(4);
    await expect(page.locator('.story-profile-portrait img')).toHaveAttribute('src', /\/images\/professor-guilherme-source\.webp$/);
    await expect(page.getByRole('link', { name: 'Acompanhar no Instagram', exact: true })).toBeVisible();
    await page.goto(base, { waitUntil: 'networkidle' });
    for (const href of await page.locator('.journey-chapters a').evaluateAll(links => links.map(a => a.getAttribute('href')))) {
      assert.ok(href && href.startsWith('#') && await page.locator(href).count() === 1, `Chapter target ${href}`);
    }
    await page.goto(base + '/participar', { waitUntil: 'networkidle' });
    await expect(page.getByLabel('Nome completo', { exact: true })).toBeDisabled();
    await expect(page.getByText('Assinaturas temporariamente indisponíveis')).toBeVisible();
    await page.goto(base + '/territorio?municipio=2906907', { waitUntil: 'networkidle' });
    await expect(page.locator('.municipality-detail h3')).toHaveText('Caravelas');
    await expect(page.locator('.municipality-detail .municipality-visual-photo img')).toHaveAttribute('alt', /Caravelas/);
    assert.deepEqual(errors, []);
    console.log('PASS Jornada: ten widths, image credits, municipality carousel, selected-map image, sourced project-history mention, mobile menu focus, collection remains closed, no page errors.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
