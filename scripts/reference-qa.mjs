import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('.impeccable/review/reference',{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});
const p=await b.newPage({viewport:{width:1024,height:900}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(process.env.PREVIEW_URL||'http://localhost:3000',{waitUntil:'networkidle'});
await p.screenshot({path:'.impeccable/review/reference/desktop.png',fullPage:true});
for(const width of [320,375,390,430,768,1024,1440,1920]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow em ${width}`);if(width===390)await p.screenshot({path:'.impeccable/review/reference/mobile.png',fullPage:true});}
assert.equal(await p.getByText('12.482',{exact:false}).count(),0);
await p.getByRole('link',{name:'Conhecer o formulário',exact:true}).click();await p.waitForURL('**/participar');assert.ok(await p.getByLabel('Nome completo',{exact:true}).isVisible());await p.goto(process.env.PREVIEW_URL||'http://localhost:3000',{waitUntil:'networkidle'});
await p.getByRole('link',{name:'Consultar fontes e metodologia',exact:true}).click();await p.waitForURL('**/fontes');await p.goto(process.env.PREVIEW_URL||'http://localhost:3000',{waitUntil:'networkidle'});
await p.getByRole('button',{name:'Conheça sua trajetória',exact:true}).click();assert.ok(await p.getByRole('dialog').isVisible());await p.keyboard.press('Escape');
await p.getByRole('link',{name:'Acessar mapa interativo',exact:true}).click();await p.waitForURL('**/territorio');assert.ok(await p.getByRole('textbox',{name:'Buscar município'}).isVisible());
assert.deepEqual(errors,[]);console.log('PASS: 8 larguras, diálogos, fechar com Escape, mapa real, sem erros JS.');await b.close();
