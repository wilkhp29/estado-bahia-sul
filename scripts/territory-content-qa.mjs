import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('.impeccable/review/territory-content',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1024,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const base=process.env.PREVIEW_URL||'http://localhost:3000';
await page.goto(base,{waitUntil:'networkidle'});
const portrait=page.locator('.professor-portrait img');
await portrait.scrollIntoViewIfNeeded();
await portrait.evaluate(img=>img.decode());
assert.ok(await portrait.evaluate(img=>img.naturalWidth>0),'Retrato real deve carregar');
assert.equal(await page.locator('.live-home-map svg a').count(),171);
for(const name of ['Extremo Sul','Sul','Sudoeste','Médio São Francisco','Baixo Sul','Centro Sul']){
 await page.getByRole('button',{name,exact:true}).click();
 assert.equal(await page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');
 assert.ok(await page.locator('.highlight-results article').count()>0);
 assert.ok(await page.locator('.highlight-results a[target="_blank"]').count()>0);
}
await page.getByRole('button',{name:'Extremo Sul',exact:true}).click();
await page.screenshot({path:'.impeccable/review/territory-content/desktop.png',fullPage:true});
await page.locator('.verified-professor').screenshot({path:'.impeccable/review/territory-content/professor.png'});
await page.locator('.r-territory').screenshot({path:'.impeccable/review/territory-content/map.png'});
for(const width of [320,375,390,430,768,1024,1440,1920]){
 await page.setViewportSize({width,height:900});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow: ${width}`);
 if(width===390)await page.screenshot({path:'.impeccable/review/territory-content/mobile.png',fullPage:true});
}
await page.goto(`${base}/territorio?municipio=2913606`,{waitUntil:'networkidle'});
assert.ok(await page.locator('.municipality-detail').getByRole('heading',{name:'Ilhéus',exact:true}).isVisible());
assert.ok(await page.getByRole('heading',{name:'Sabores e histórias do cacau',exact:true}).isVisible());
await page.setViewportSize({width:390,height:844});
assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
await page.screenshot({path:'.impeccable/review/territory-content/detail-mobile.png',fullPage:true});
await page.getByRole('button',{name:'Fechar detalhes',exact:true}).click();
await page.getByRole('textbox',{name:'Buscar município'}).fill('Abaíra');
await page.locator('.municipality-list').getByRole('button',{name:'Abaíra',exact:true}).click();
assert.ok(await page.getByText('Os destaques deste município ainda estão em pesquisa.',{exact:false}).isVisible());
await page.goto(`${base}/territorio?municipio=invalid`,{waitUntil:'networkidle'});
assert.equal(await page.locator('.municipality-detail').count(),0);
assert.deepEqual(errors,[]);
console.log('PASS: foto real, 171 links municipais, seis filtros, fontes, seleção por URL, estado sem pesquisa, 8 larguras e nenhum erro JS.');
await browser.close();
