import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../app/design-system.css',import.meta.url),'utf8');
const tokens=Object.fromEntries([...css.matchAll(/(--[\w-]+):(#\w{6})/g)].map(m=>[m[1],m[2]]));
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('header uses the new vector brand mark and Portuguese wordmark',()=>{
 const component=readFileSync(new URL('../components/Brand.tsx',import.meta.url),'utf8');
 assert.match(component, /<svg className="brand-symbol"/);
 assert.ok(component.includes('BAHIA DO SUL'));
 assert.ok(component.includes('MOVIMENTO PRÓ-CRIAÇÃO'));
 assert.ok(component.includes('Fruto do cacau, grão de café e ondas'));
 assert.match(component,/brand-cacao-pod/);
 assert.match(component,/brand-coffee-bean/);
 assert.ok(!component.includes('/images/logo-bahia-horizontal.webp'));
});
test('brand action, links and text pairs meet AA text contrast',()=>{
 for(const [fg,bg] of [['#ffffff',tokens['--brand-forest']],['#ffffff',tokens['--brand-forest-hover']],[tokens['--brand-ocean'],'#ffffff'],[tokens['--brand-deep'],tokens['--surface-blue']],[tokens['--brand-navy'],tokens['--brand-gold']],[tokens['--ink-muted'],tokens['--surface-blue']],[tokens['--brand-forest'],tokens['--surface-green']]]){
  assert.ok(contrast(fg,bg)>=4.5,`${fg}/${bg}: ${contrast(fg,bg).toFixed(2)}`);
 }
});
test('interactive map shares the homepage regional color source',()=>{
 const source=readFileSync(new URL('../components/Territory.tsx',import.meta.url),'utf8');
  assert.match(source, /import \{\s*regionColors as colors\s*\} from '\.\.\/data\/highlights'/);
});
