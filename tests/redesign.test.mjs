import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('homepage uses the clean photographic hero, not an illustrated computer mockup', () => {
  const page = read('../app/page.tsx');
  const styles = read('../app/client-redesign.css');
  assert.match(page, /hero-youth-bahia\.webp/);
  assert.match(page, /Quero participar/);
  assert.match(styles, /\.bs-hero-image/);
  assert.doesNotMatch(page, /browser-frame|computer-mockup|mockup-computador/i);
});

test('participation redesign preserves the real privacy-first verified form', () => {
  const page = read('../app/participar/page.tsx');
  const form = read('../components/ParticipationForm.tsx');
  assert.match(page, /ParticipationForm enabled=\{collectionReady\(\)\}/);
  assert.match(page, /assinatura registra apoio à proposta/i);
  assert.match(page, /\/privacidade/);
  assert.match(form, /name="email"/);
  assert.match(form, /name="municipality"/);
  assert.match(form, /name="consent"/);
  assert.match(form, /newsletter/);
  assert.match(form, /captcha/);
  assert.match(form, /só entra no contador depois/i);
  assert.doesNotMatch(form, /WhatsApp/);
});

test('interior routes use the refreshed shell and navigation at desktop and mobile', () => {
  const header = read('../components/SiteHeader.tsx');
  const footer = read('../components/SiteFooter.tsx');
  const styles = read('../app/portal-brand.css');
  assert.match(header, /\['\/territorio', 'Território'\]/);
  assert.match(header, /site-header-cta/);
  assert.match(styles, /@media\(min-width:901px\)/);
  assert.match(styles, /@media\(max-width:600px\)/);
  assert.match(footer, /Criação do site/);
  assert.match(styles, /creator-credit-inline/);
  assert.match(footer, /https:\/\/www\.instagram\.com\/wilkhp29\//);
});

test('loading and news use the current brand and preserve the honest empty state', () => {
  const loading = read('../app/loading.tsx');
  const news = read('../app/noticias/page.tsx');
  assert.match(loading, /portal-loading/);
  assert.doesNotMatch(loading, /Carregando a página/);
  assert.match(news, /news-page/);
  assert.match(news, /news-empty/);
  assert.match(news, /revisão da equipe/);
});
