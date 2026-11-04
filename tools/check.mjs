// Exercise the generated site with lightweight document stubs. Visual QA is separate.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = root;
const config = JSON.parse(fs.readFileSync(path.join(root,'src/data/site-config.json'),'utf8'));
for (const name of Object.values(config.downloadFiles)) {
 const bytes = fs.readFileSync(path.join(root,'downloads',name));
 assert.equal(bytes.subarray(0,5).toString(),'%PDF-',name+' PDF format');
}
const legal = /\b(?:ADGM|BVI)\b|阿布[扎達紮]比|英[屬属][維维英]|Abu Dhabi|British Virgin Islands/i;
const retired = /7709\s*·\s*SK hynix|同一底層資產，|選擇接入渠道|代幣 7709|仲裁|HKIAC|arbitrat/i;
const visible = html => [
  html.replace(/<[^>]+>/g,' '),
  ...Array.from(html.matchAll(/\s(?:aria-label|title|alt|placeholder|href|download)="([^"]*)"/g),match=>match[1])
].join(' ');
const codes = ['7709.W','SKHY2Lw'];
const chapters = ['overview','market','theme','features','terms','documents'];
const slug = code => '#/products/7709/'+code+'/';
const pages = ['#/','#/products','#/ecosystem','#/ecosystem/directory','#/home/contact','#/home/home-team','#/docs',
 ...Array.from({length:5},(_,i)=>'#/home/capabilities/'+i),
 ...codes.flatMap(code=>chapters.map(chapter=>slug(code)+chapter)),slug('7709.W')+'guide'];
const aliases = [
 ['#/products/7709/adgm/overview',slug('7709.W')+'overview'],['#/products/7709/bvi/terms',slug('SKHY2Lw')+'terms'],
 ['#/products/7709/adgm/guide',slug('7709.W')+'guide'],['#/products/7709/whitepaper',slug('SKHY2Lw')+'documents'],
 ['#/products/7709/bvi/mechanics',slug('SKHY2Lw')+'terms'],['#/products/7709/overview',slug('SKHY2Lw')+'overview'],
 ['#/home/whitepaper',slug('SKHY2Lw')+'documents']
];
const results = [];
for (const lang of ['zh-Hant','en']) for (const width of [390,1280]) {
 const file = lang==='en'?'WAGMIx_English_V13.html':'WAGMIx_繁體中文_V13.html';
 const html = fs.readFileSync(path.join(site,file),'utf8');
 const app = {innerHTML:''}, switcher = {};
 const location = {hash:'#/',replace(hash){this.hash=hash;}};
 const node = {setAttribute(){},focus(){},scrollIntoView(){},getBoundingClientRect(){return {top:120,height:50};}};
 const document = {documentElement:{lang}, body:{dataset:{},classList:{toggle(){},remove(){},contains(){return false;}}},
  getElementById(id) {
   if(id==='app') return app;
   if(id==='language-switch') return switcher;
   return app.innerHTML.includes('id="'+id+'"')?node:null;
  }, querySelector(){return null;},querySelectorAll(){return [];},addEventListener(){}};
 const ctx = vm.createContext({document,location,history:{},innerWidth:width,console,
  addEventListener(){},requestAnimationFrame(fn){fn();},scrollY:0,scrollTo(){}});
 ctx.window=ctx;
 const run = expr => vm.runInContext(expr,ctx);
 run(html.match(/<script>([\s\S]+)<\/script>/)[1]);
 const docs = run("WHITEPAPER.map(c=>'#/whitepaper/'+c.id)");
 for (const route of [...pages,...docs,'#/whitepaper/token/B-7',...aliases.map(([old])=>old)]) {
  location.hash=route; run('route()');
  if(location.hash!==route) run('route()');
  assert.equal(location.hash,aliases.find(([old])=>old===route)?.[1]??route);
  assert.ok(app.innerHTML.includes('<main'),route);
  assert.ok(!retired.test(visible(app.innerHTML)),route+' retired wording');
  assert.ok(switcher.href.endsWith(location.hash) && switcher.href.includes('_V13.html'),route+' language switch');
  const ids=Array.from(app.innerHTML.matchAll(/ id="([^"]+)"/g),m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
  for (const href of app.innerHTML.matchAll(/href="(downloads\/[^"]+)"/g))
    assert.ok(fs.existsSync(path.join(root,href[1])),route+' download exists');
  if (['home','catalog','ecosystem'].includes(document.body.dataset.page))
    assert.ok(!legal.test(visible(app.innerHTML)),route+' architecture outside disclosure');
  const logo = app.innerHTML.match(/class="site-logo"[^>]*>[\s\S]*?<img[^>]* src="([^"]+)"/)?.[1];
  assert.equal(logo,run(document.body.dataset.variant==='adgm'?'LOGO_LIGHT':'LOGO'),route+' brand mark');
 }
 const home = run('home()');
 const slogan = 'Define The Next Wave On‑Chain';
 assert.equal(home.match(/<h1[^>]*lang="en"[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g,''),slogan,'home slogan');
 assert.ok(run("footer('home')").includes(slogan),'footer slogan');
 const homeSettlement = home.match(/class="cap-disclaimer">([\s\S]*?)<\/p>/)?.[1];
 assert.ok(homeSettlement?.includes('SKHY2Lw') && homeSettlement.includes(lang==='en'?'Other products':'其他產品'),'home T0 scope');
 const factsheet = 'downloads/'+config.downloadFiles[lang==='en'?'factsheetEn':'factsheetZh'];
 assert.ok(factsheet.endsWith('_R2_Brand.pdf') && run('product()').includes('href="'+factsheet+'"'),'R2 download language');
 assert.ok(run('docsDownloads()').includes('href="downloads/'+config.downloadFiles.whitepaper+'"'),'English whitepaper download');
 for (const [code,internal,expr,termsId] of [['7709.W','adgm','adgmProduct()','adgm-terms'],['SKHY2Lw','bvi','product()','product-terms']]) {
  const body=run(expr);
  const pos=body.indexOf('id="'+termsId+'"');
  assert.ok(pos>0,code+' section 05');
  const marketing = visible(body.slice(0,body.lastIndexOf('<section',pos)));
  assert.ok(!legal.test(marketing),code+' architecture in sections 01–04: '+marketing.match(legal));
  const sidebar=run("contextNav('product','"+internal+"')");
  assert.ok(!legal.test(visible(sidebar)) && visible(sidebar).includes(code),code+' sidebar');
  if (code==='7709.W') {
   const hero = run('adgmHero()');
   assert.ok(!hero.includes('<button') && hero.includes('BNB Smart Chain') && hero.includes(lang==='en'?'Planned deployment':'擬部署'));
  } else assert.ok(/<button[^>]*disabled[^>]*>[\s\S]*?Solana/.test(body));
  assert.ok(body.includes(lang==='en'?'Coming soon':'即將上線'));
  if(code==='7709.W') assert.ok(!/DvP|\bT0\b|SKHY2Lw|2026 年 11 月 20 日|20 November 2026/.test(visible(body)));
  else assert.ok(visible(body).includes('DvP') && visible(body).includes(lang==='en'?'20 November 2026':'2026 年 11 月 20 日'));
 }
 const catalog = run('catalog()');
 const rows=catalog.match(/<tr class="catalog-row[\s\S]*?<\/tr>/g);
 assert.equal(rows.length,2);
 rows.forEach((row,i)=>{assert.equal((row.match(/<td\b/g)||[]).length,4);assert.ok(row.includes(codes[i])&&row.includes(lang==='en'?'Coming soon':'即將上線'));});
 assert.equal(run('v9EcoFilters.map(f=>f.id).join(",")'),'product,chain');
 const matches = (code,chain) => run('v9EcoInstitutions.filter(e=>e.relations.some(r=>r.product==="'+code+'" && r.chain==="'+chain+'")).map(e=>e.id).join(",")').split(',').filter(Boolean);
 assert.ok(matches('7709.W','bnb').includes('bnb'));
 assert.equal(run('v9EcoInstitutions.length'),6);
 assert.ok(!matches('SKHY2Lw','solana').includes('beosin') && !matches('7709.W','bnb').includes('beosin'));
 assert.equal(matches('7709.W','solana').length,0);
 for(const mark of ['adgm','bvi']) assert.ok(!legal.test(visible(run("productMark('"+mark+"')"))));
 results.push({language:lang,simulatedWidth:width,routes:pages.length+docs.length+1+aliases.length});
}
console.log('PASS. Bilingual routes, navigation, product-specific terms, logos, catalogue, filters, legacy links, slogan, T0 scope and PDF downloads.');
console.log(results);
