import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

// Read-only production smoke. Never submits forms or writes personal data.
async function run() {
  const base = 'https://estadobahiadosul.com.br';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const width of [390, 1536]) {
      await page.setViewportSize({ width, height: 1024 });
      for (const path of ['/', '/historia/professor-guilherme', '/territorio', '/projeto', '/participar']) {
        const response = await page.goto(base + path, { waitUntil: 'networkidle' });
        assert.equal(response?.status(), 200, path);
        await expect(page.locator('h1')).toHaveCount(1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} overflow ${width}`);
        if (path === '/') {
          await expect(page.locator('.journey-candidate')).toHaveCount(0);
          await expect(page.locator('.municipality-carousel')).toBeVisible();
          await expect(page.locator('.r-history')).toContainText('Professor Guilherme');
          await expect(page.locator('.r-history a[href="/historia/professor-guilherme"]')).toBeVisible();
        }
        if (path === '/historia/professor-guilherme') {
          await expect(page.locator('.candidate-profile-number strong')).toHaveText('1026');
          await expect(page.locator('.candidate-timeline li')).toHaveCount(4);
          await expect(page.locator('.story-profile-portrait img')).toHaveAttribute('src', /professor-guilherme-source\.webp$/);
        }
        if (path === '/territorio') {
          await page.goto(base + '/territorio?municipio=2906907', { waitUntil: 'networkidle' });
          await expect(page.locator('.municipality-detail h3')).toHaveText('Caravelas');
          await expect.poll(() => page.locator('.municipality-detail .municipality-visual-photo img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        }
      }
    }
    assert.deepEqual(errors, []);
    console.log('PASS production smoke: project-focused home, municipality imagery, sourced participant history, biography references, no page errors or overflow. Read-only; no forms submitted.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
