import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
const base=process.env.PRODUCTION_QA_URL||'https://bahia-do-sul.vercel.app';
const password=readFileSync('private/acesso-admin.txt','utf8').match(/^Senha: (.+)$/m)?.[1];
assert.ok(password);
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(page.url()+': '+e.message));
let signedIn=false;
try{
 for(const route of ['/','/territorio','/fontes','/privacidade','/participar','/admin']){
  const response=await page.goto(base+route,{waitUntil:'networkidle'});assert.equal(response.status(),200,route);
 }
 assert.equal((await context.request.post(base+'/api/admin/export',{headers:{Origin:base},data:{}})).status(),401);
 assert.equal((await context.request.post(base+'/api/admin/login',{headers:{Origin:'https://attacker.invalid'},data:{}})).status(),403);
 assert.equal((await context.request.post(base+'/api/participacao',{headers:{Origin:base},data:{}})).status(),503);
 await page.getByLabel('Senha de administrador').fill(password);
 await page.getByRole('button',{name:'Entrar no painel',exact:true}).click();
 await page.getByRole('heading',{name:'Gestão do Bahia do Sul'}).waitFor();signedIn=true;
 assert.ok(await page.getByText('Coleta ainda desativada',{exact:true}).isVisible());
 await page.reload({waitUntil:'networkidle'});
 assert.ok(await page.getByRole('heading',{name:'Gestão do Bahia do Sul'}).isVisible());
 await page.getByLabel('Finalidade da exportação').fill('Verificação técnica da publicação, sem dados de participantes.');
 await page.getByLabel('Usarei o arquivo somente').check();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Baixar CSV',exact:true}).click();
 assert.equal(await (await download).failure(),null);
 mkdirSync('.impeccable/review/production',{recursive:true});
 await page.screenshot({path:'.impeccable/review/production/admin.png',fullPage:true});
 assert.equal((await context.request.post(base+'/api/admin/logout',{headers:{Origin:base},data:{}})).status(),200);signedIn=false;
 assert.equal((await context.request.post(base+'/api/admin/export',{headers:{Origin:base},data:{}})).status(),401);
 await page.goto(base,{waitUntil:'networkidle'});
 await page.locator('.brand-v1 img').evaluate(img=>img.decode());
 await page.screenshot({path:'.impeccable/review/production/home-desktop.png',fullPage:true});
 for(const width of [375,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.impeccable/review/production/home-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS produção HTTPS: páginas, login, sessão persistente PostgreSQL, exportação CSV, CSRF, logout, coleta desativada e responsividade. Nenhum participante criado.');
}finally{
 if(signedIn)await context.request.post(base+'/api/admin/logout',{headers:{Origin:base},data:{}}).catch(()=>{});
 await browser.close();
}
