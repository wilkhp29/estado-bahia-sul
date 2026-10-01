import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
fs.mkdirSync('.impeccable/review',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:3000/territorio',{waitUntil:'networkidle'});
for(const image of await page.locator('img').all()){
 await image.scrollIntoViewIfNeeded();
 await image.evaluate(async img=>{if(!img.complete)await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;});if(!img.naturalWidth)throw new Error('Imagem não carregou: '+img.src);});
}
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
await page.screenshot({path:'.impeccable/review/desktop.png',fullPage:true});
await page.getByRole('textbox',{name:'Buscar município'}).fill('Ilheus');
await page.getByRole('button',{name:'Ilhéus',exact:true}).click();
await page.getByRole('heading',{name:'Ilhéus',exact:true}).waitFor();
assert.ok(await page.getByText('2913606',{exact:true}).isVisible());
await page.getByRole('button',{name:'Restaurar mapa'}).click();
await page.locator('.map-sidebar').getByRole('button',{name:'Extremo Sul',exact:true}).click();
assert.equal(await page.locator('.map-sidebar').getByRole('button',{name:'Extremo Sul',exact:true}).getAttribute('aria-pressed'),'true');
await page.getByRole('button',{name:'Ver todas'}).click();
await page.getByRole('button',{name:'Ampliar mapa'}).click();
await page.getByRole('button',{name:'Restaurar mapa'}).click();
await page.getByRole('textbox',{name:'Buscar município'}).fill('zzzzz');
assert.ok(await page.getByText(/Nenhum município encontrado/).isVisible());
await page.getByRole('button',{name:'Limpar busca'}).click();
for(const width of [320,375,390,430,768,1024,1440,1920]){
 await page.setViewportSize({width,height:900});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`Overflow ${width}`);
 if(width===390){await page.evaluate(()=>{document.activeElement?.blur?.();window.scrollTo({top:0,behavior:'instant'});});await page.screenshot({path:'.impeccable/review/mobile.png',fullPage:true});}
}
assert.deepEqual(errors,[]);console.log('PASS: busca sem acento, seleção, código IBGE, filtros, zoom, estado vazio, 8 larguras, sem erros JS');
await browser.close();
