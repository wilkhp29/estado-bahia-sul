import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
const base=process.env.BRAND_QA_URL||'http://localhost:3000';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
mkdirSync('.impeccable/review/brand-v2',{recursive:true});
try{
 for(const [name,route] of [['home','/'],['map','/territorio'],['form','/participar'],['admin','/admin']]){
  await page.goto(base+route,{waitUntil:'networkidle'});
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow');
   if(name!=='map'){
    const logo=page.locator('.brand-v1 img');
    assert.ok((await logo.getAttribute('src')).includes('logo-bahia-do-sul-v2.png'));
    await logo.evaluate(img=>img.decode());
   }
   if(name==='home'){
    assert.equal(await page.locator('.r-button.lime').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(20, 117, 43)');
    assert.equal(await page.locator('.highlight-regions button[aria-pressed=true]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 92, 140)');
   }
   await page.screenshot({path:`.impeccable/review/brand-v2/${name}-${width}.png`,fullPage:true});
  }
  if(name==='map'){
   const filter=page.locator('.region-list').getByRole('button',{name:'Sul',exact:true});
   await filter.click();
   assert.equal(await filter.getAttribute('aria-pressed'),'true');
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS brand V2: logo, action/filter colors, map selection and 4 pages desktop/mobile.');
}finally{await browser.close();}
