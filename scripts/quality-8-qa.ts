import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

async function run() {
  const base = 'http://localhost:3102';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const root = '.impeccable/review/quality-8';
  mkdirSync(root, { recursive: true });
  try {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const routes = ['/', '/entenda', '/projeto', '/historia/professor-guilherme', '/territorio', '/economia', '/historia', '/mineracao', '/fontes', '/documentos', '/estudos', '/noticias', '/ajuda', '/privacidade', '/participar', '/participar/abaixo-assinado', '/buscar', '/admin'];
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response?.status(), 200, route);
      assert.equal(await page.locator('h1').count(), 1, `${route}: one heading`);
      assert.equal(await page.locator('#conteudo').count(), 1, `${route}: unique skip destination`);
      for (const width of [320, 390, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: overflow at ${width}`);
        const main = await page.locator('main').boundingBox();
        assert.ok(main && main.x >= -1 && main.x + main.width <= width + 1, `${route}: main clipped at ${width}`);
        if ([390, 1440].includes(width) && ['/', '/entenda', '/projeto', '/historia/professor-guilherme', '/territorio'].includes(route)) {
          await page.screenshot({ path: `${root}/${route === '/' ? 'home' : route.replaceAll('/', '-')}-${width}.png`, fullPage: true });
          await page.screenshot({ path: `${root}/${route === '/' ? 'home' : route.replaceAll('/', '-')}-${width}-viewport.png` });
        }
      }
      if (route === '/projeto') {
        assert.equal(await page.locator('.project-status-badge').count(), 0);
        await expect(page.locator('.project-table-wrap')).toHaveAttribute('tabindex', '0');
      }
      if (route === '/territorio') assert.equal(await page.locator('#highlights-title').count(), 1);
      if (route === '/admin' || route === '/buscar') assert.match(await page.locator('meta[name="robots"]').getAttribute('content') || '', /noindex/);
      if (route === '/entenda') assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://estadobahiadosul.com.br/entenda');
    }
    await page.goto(base + '/buscar');
    await page.getByRole('searchbox', { name: 'Buscar no portal', exact: true }).fill('ilheus');
    await page.getByRole('button', { name: 'Buscar', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Ilhéus', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Ilhéus', exact: true }).click();
    await expect(page).toHaveURL(/territorio\?municipio=/);
    await page.goto(base + '/buscar?q=Guilherme');
    await expect(page.locator('.portal-search-results').getByRole('link', { name: 'Professor Guilherme e o Bahia do Sul' })).toBeVisible();
    await page.goto(base + '/buscar?q=zzzzzzzzzzzzzzzzzz');
    await expect(page.getByText('Nenhum resultado encontrado.', { exact: false })).toBeVisible();
    await page.goto(base + '/entenda', { waitUntil: 'networkidle' });
    await page.keyboard.press('Control+k');
    await expect(page).toHaveURL(base + '/buscar');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('#site-navigation').getByRole('link', { name: 'Buscar no portal', exact: true }).click();
    await expect(page).toHaveURL(base + '/buscar');
    assert.deepEqual(errors, []);
    console.log('PASS: 18 rotas, 6 larguras, limites de conteúdo, H1/IDs, labels removidas, SEO privado, busca por página/município/sem acento/vazia, Ctrl+K e navegação mobile.');
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
