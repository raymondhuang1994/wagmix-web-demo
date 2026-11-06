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
const codes = ['7709w','SKHY2Lw'];
const chapters = ['overview','market','theme','features','terms','documents'];
const slug = code => '#/products/7709/'+code+'/';
const pages = ['#/','#/products','#/ecosystem','#/ecosystem/directory','#/contact','#/home/home-team','#/docs',
 ...Array.from({length:5},(_,i)=>'#/home/capabilities/'+i),
 ...codes.flatMap(code=>chapters.map(chapter=>slug(code)+chapter)),slug('7709w')+'guide'];
const aliases = [
 ['#/home/contact','#/contact'],
 ['#product-7709-w',slug('7709w')+'overview'],
 ...chapters.map(chapter=>['#/products/7709/7709.W/'+chapter,slug('7709w')+chapter]),
 ['#/products/7709/adgm/overview',slug('7709w')+'overview'],['#/products/7709/bvi/terms',slug('SKHY2Lw')+'terms'],
 ['#/products/7709/adgm/guide',slug('7709w')+'guide'],['#/products/7709/whitepaper',slug('SKHY2Lw')+'documents'],
 ['#/products/7709/bvi/mechanics',slug('SKHY2Lw')+'terms'],['#/products/7709/overview',slug('SKHY2Lw')+'overview'],
 ['#/home/whitepaper',slug('SKHY2Lw')+'documents']
];
const results = [];
for (const lang of ['zh-Hant','en']) for (const width of [390,1280]) {
 const file = (lang==='en'?'WAGMIx_English_':'WAGMIx_繁體中文_')+config.version+'.html';
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
  assert.ok(switcher.href.endsWith(location.hash) && switcher.href.includes('_'+config.version+'.html'),route+' language switch');
  const ids=Array.from(app.innerHTML.matchAll(/ id="([^"]+)"/g),m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,route+' duplicate IDs');
  for (const href of app.innerHTML.matchAll(/href="(downloads\/[^"]+)"/g))
    assert.ok(fs.existsSync(path.join(root,href[1])),route+' download exists');
  if (['home','catalog','ecosystem'].includes(document.body.dataset.page))
    assert.ok(!legal.test(visible(app.innerHTML)),route+' architecture outside disclosure');
  const logo = app.innerHTML.match(/class="site-logo"[^>]*>[\s\S]*?<img[^>]* src="([^"]+)"/)?.[1];
  assert.equal(logo,run('LOGO'),route+' brand mark');
 }
 const home = run('home()');
 const slogan = lang==='en'?'Define The Next Wave On‑Chain':'引領鏈上新浪潮';
 assert.equal(home.match(/<h1[^>]*class="brand-slogan[^"]*"[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g,''),slogan,'home slogan');
 assert.ok(run("footer('home')").includes(slogan),'footer slogan');
 assert.ok(!home.includes('cap-disclaimer') && !home.includes('data-context="capabilities"'), 'capability navigation removed');
 assert.equal((home.match(/class="capability-column"/g)||[]).length,5, 'five visible capability titles');
 for (const title of run('CAPABILITIES.map(c=>pick(c.title))')) assert.ok(home.includes(title),'source-aligned capability title');
 for (const page of ['contact','catalog','product','ecosystem','docs','whitepaper','adgmguide']) {
  const closing=run("footer('"+page+"')");
  assert.ok(!closing.includes('contact-channels') && !closing.includes('closing-brand'),page+' compact footer');
 }
 const topHeader=run("header('catalog')");
 assert.ok(topHeader.indexOf('header-socials')>topHeader.indexOf('header-actions'),'socials in right header group');
 for(const code of codes) assert.ok(topHeader.includes(slug(code)+'overview'),'product dropdown direct link '+code);
 for(const expr of ['product()','adgmProduct()','catalog()','ecosystem()']) assert.ok(!run(expr).includes('breadcrumb'),'no repeated breadcrumbs');
 for(const expr of ['product()','adgmProduct()']){
  assert.ok(run(expr).includes('p-market-notes')&&!run(expr).includes('p-market-context'),'market notes are unboxed');
 }
 assert.ok(home.includes('launch-spark'),'coming soon visual mark');

 const approvedOrder = ['research','platform','liquidity','custody','structuring'];
 assert.equal(run('CAPABILITIES.map(c=>c.id).join(",")'),approvedOrder.join(','),'V8 capability order');
 for (const copy of run('CAPABILITIES.map(c=>pick(c.copy).join(" "))')) {
   assert.ok(visible(home).replace(/[\s³]/g,'').includes(copy.replace(/[\s³]/g,'')),'V8 capability body');
 }
 assert.ok(topHeader.includes('data-top-key="contact"') && topHeader.includes('href="#/contact"'),'Contact top-level route');
 assert.ok(topHeader.includes('Powered by WAGMIx') && !topHeader.includes('7709.HK'),'category menu content');
 for (const expr of ['productFeatures()','adgmFeatures()']) {
   const features = run(expr);
   assert.equal((features.match(/data-feature=/g)||[]).length,4,'four features remain');
   for(const feature of run('PRODUCT_FEATURES.map(s=>({title:pick(s.title),copy:pick(s.copy)}))')) {
     assert.ok(features.includes(feature.title) && features.includes(feature.copy),'V8 exact feature title/body');
   }
 }
 const disclaimer = run('esc(pick(CONTENT.productDisclaimer))');
 assert.ok(run('product()').includes(disclaimer),'exact V8 disclaimer on SKHY2Lw');
 assert.ok(!run('adgmProduct()').includes(disclaimer),'no SKHY disclaimer imported into certificate');
 assert.ok(run('productTheme()').includes('Bloomberg') && !run('productTheme()').includes('hkexnews.hk'),'V8 AUM and turnover source');
 assert.ok(!run("footer('product')").includes('Definitive transaction documents govern product terms.'),'generic footer removed');
 assert.ok(!run('adgmFeatures()').includes('seed initial inventory'),'internal market-maker details removed');
 assert.ok(run('productMarket()').includes(lang==='en'?'token execution prices may differ.':'代幣成交價可能與之不同。'),'bounded reference price claim');
 assert.ok(!run('ecosystem()').includes('eco-network-product'),'no product/network relationship hero');
 assert.ok(run('contactPage()').includes('mailto:info@wagmix.com'),'dedicated contact links');
 const factsheet = 'downloads/'+config.downloadFiles[lang==='en'?'factsheetEn':'factsheetZh'];
 assert.ok(factsheet.endsWith('_V8.pdf') && run('product()').includes('href="'+factsheet+'"'),'approved factsheet download language');
 assert.ok(run('docsDownloads()').includes('href="downloads/'+config.downloadFiles.whitepaper+'"'),'English whitepaper download');
 for (const [code,internal,expr,termsId] of [['7709w','adgm','adgmProduct()','adgm-terms'],['SKHY2Lw','bvi','product()','product-terms']]) {
  const body=run(expr);
  const pos=body.indexOf('id="'+termsId+'"');
  assert.ok(pos>0,code+' section 05');
  const marketing = visible(body.slice(0,body.lastIndexOf('<section',pos)));
  assert.ok(!legal.test(marketing),code+' architecture in sections 01–04: '+marketing.match(legal));
  const sidebar=run("contextNav('product','"+internal+"')");
  assert.ok(!legal.test(visible(sidebar)) && visible(sidebar).includes(code),code+' sidebar');
  if (code==='7709w') {
   const hero = run('adgmHero()');
   assert.ok(!hero.includes('<button') && hero.includes('BNB Smart Chain') && hero.includes(lang==='en'?'Planned deployment':'擬部署'));
  } else assert.ok(/<button[^>]*disabled[^>]*>[\s\S]*?Solana/.test(body));
  assert.ok(body.includes(lang==='en'?'Coming soon':'即將上線'));
  if(code==='7709w') assert.ok(!/DvP|\bT0\b|SKHY2Lw|2026 年 11 月 20 日|20 November 2026/.test(visible(body)));
  else assert.ok(!visible(body).includes('DvP') && visible(body).includes(lang==='en'?'20 November 2026':'2026 年 11 月 20 日'));
 }
 const catalog = run('catalog()');
 const rows=catalog.match(/<tr class="catalog-row[\s\S]*?<\/tr>/g);
 assert.equal(rows.length,2);
 rows.forEach((row,i)=>{assert.equal((row.match(/<td\b/g)||[]).length,4);assert.ok(row.includes(codes[i])&&row.includes(lang==='en'?'Coming soon':'即將上線'));});
 assert.equal(run('v9EcoFilters.map(f=>f.id).join(",")'),'product,chain');
 const matches = (code,chain) => run('v9EcoInstitutions.filter(e=>e.relations.some(r=>r.product==="'+code+'" && r.chain==="'+chain+'")).map(e=>e.id).join(",")').split(',').filter(Boolean);
 assert.ok(matches('7709w','bnb').includes('bnb'));
 assert.equal(run('v9EcoInstitutions.length'),6);
 assert.ok(!matches('SKHY2Lw','solana').includes('beosin') && !matches('7709w','bnb').includes('beosin'));
 assert.equal(matches('7709w','solana').length,0);
 for(const mark of ['adgm','bvi']) assert.ok(!legal.test(visible(run("productMark('"+mark+"')"))));
 results.push({language:lang,simulatedWidth:width,routes:pages.length+docs.length+1+aliases.length});
}
console.log('PASS. Bilingual routes, navigation, product-specific terms, logos, catalogue, filters, legacy links, slogan, layout structure and PDF downloads.');
console.log(results);
