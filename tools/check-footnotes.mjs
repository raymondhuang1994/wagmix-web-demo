// Source-level route/DOM simulation. This does not claim browser visual validation.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const config = JSON.parse(read('src/data/site-config.json'));
const deepLink = '#/products/7709/SKHY2Lw/overview/footnote-3';
const noteId = 'product-source-note-3';
const constants = {
  CONTENT: JSON.parse(read('src/data/content-map.json')),
  HISTORY: JSON.parse(read('src/data/7709-history.json')),
  SITE_CONFIG: config,
  SKHYNIX: JSON.parse(read('src/data/skhynix-data.json')),
  LOGO: 'test-logo', LOGO_LIGHT: 'test-logo-light', ASSETS:{hero:'test-hero'},
  INSTITUTION_LOGOS:{csop:'test',fosun:'test',finloop:'test',beosin:'test'},
  WHITEPAPER_DOWNLOAD:'downloads/'+config.downloadFiles.whitepaper,
  FACTSHEET_ZH_DOWNLOAD:'downloads/'+config.downloadFiles.factsheetZh,
  FACTSHEET_EN_DOWNLOAD:'downloads/'+config.downloadFiles.factsheetEn,
};
const files = [...read('build.py').match(/SCRIPTS = \(([\s\S]*?)\n\)/)[1].matchAll(/'([^']+)'/g)].map(match=>match[1]);
const source = Object.entries(constants).map(([key,value])=>'const '+key+'='+JSON.stringify(value)+';').join('\n')+
  '\n'+files.map(file=>read('src/scripts/'+file)).join('\n');

function fixture(lang,width,initialHash='#/') {
  const stack=[initialHash], listeners={}, nodes=new Map(), scrolls=[], focusCalls=[];
  let cursor=0, pending=false, appHTML='';
  const switcher={href:''};
  const app={get innerHTML(){return appHTML;},set innerHTML(value){appHTML=value;nodes.clear();}};
  const position = id => ({[noteId]:640,'main':0,'product-market':1100,'adgm-market':1100,'product-theme':1700,'adgm-theme':1700,'product-features':2300,'adgm-features':2300,'product-terms':2900,'adgm-terms':2900,'product-whitepaper':3500,'adgm-documents':3500}[id]??1000);
  const location={
    get hash(){return stack[cursor];},
    set hash(value){stack.splice(cursor+1);stack.push(value);cursor++;pending=true;},
    replace(value){stack[cursor]=value;pending=true;},
    search:'?geoPreview=ALLOW',
  };
  const header={getBoundingClientRect(){return {top:12,bottom:width<=600?124:width<=900?82:94,height:width<=600?112:width<=900?70:82};}};
  const contextNav={getBoundingClientRect(){return {top:width<=600?130:94,bottom:width<=600?184:160,height:width<=600?54:66};}};
  const document={
    documentElement:{lang},activeElement:null,
    body:{dataset:{},classList:{toggle(){},remove(){},contains(){return false;}}},
    getElementById(id){
      if(id==='app')return app;
      if(id==='language-switch')return switcher;
      if(!appHTML.includes('id="'+id+'"'))return null;
      if(!nodes.has(id))nodes.set(id,{
        id,attrs:{},isConnected:true,setAttribute(key,value){this.attrs[key]=value;},
        focus(options){document.activeElement=this;focusCalls.push({id,options});},
        getBoundingClientRect(){return {top:position(id)-ctx.scrollY,bottom:position(id)-ctx.scrollY+60,height:60};},
        scrollIntoView(options){ctx.scrollY=position(id)-(width<=600?202:120);scrolls.push({id,options});},
      });
      return nodes.get(id);
    },
    querySelector(selector){
      if(selector==='.site-header')return header;
      if(selector==='[data-context="product"]'&&document.body.dataset.page==='product')return contextNav;
      return null;
    },querySelectorAll(){return [];},addEventListener(){},
  };
  const history={scrollRestoration:'auto',back(){if(cursor>0){cursor--;pending=true;}},forward(){if(cursor<stack.length-1){cursor++;pending=true;}}};
  const ctx=vm.createContext({document,location,history,innerWidth:width,console,scrollY:0,
    requestAnimationFrame(fn){fn();},scrollTo(options){ctx.scrollY=options.top;scrolls.push({id:'window',options});},
    addEventListener(type,fn){(listeners[type]??=[]).push(fn);},
  });
  ctx.window=ctx;
  const run=code=>vm.runInContext(code,ctx);
  function flush(){let count=0;while(pending){assert.ok(++count<5,'route canonicalization terminates');pending=false;for(const fn of listeners.hashchange??[])fn();}}
  run(source);flush();
  return {run,document,app,switcher,location,history,stack,scrolls,focusCalls,header,contextNav,
    navigate(hash){location.hash=hash;flush();},back(){history.back();flush();},forward(){history.forward();flush();},
  };
}

for(const lang of ['zh-Hant','en'])for(const width of [390,768,1280]){
  const f=fixture(lang,width);
  assert.ok(f.app.innerHTML.includes('href="'+deepLink+'"'),'homepage superscript points to exact note');
  f.navigate(deepLink);
  const note=f.document.getElementById(noteId);
  assert.ok(note,'existing V8 note is rendered');
  assert.equal(f.app.innerHTML.split('id="'+noteId+'"').length-1,1,'note target is unique');
  assert.equal(f.document.activeElement,note,'direct link moves keyboard focus to the explanation');
  assert.equal(note.attrs.tabindex,'-1','note is programmatically focusable without entering normal tab order');
  assert.equal(f.focusCalls.at(-1).options.preventScroll,true,'focus cannot override the explicit scroll offset');
  const boundary=Math.max(f.header.getBoundingClientRect().bottom,width<=900?f.contextNav.getBoundingClientRect().bottom:0);
  assert.ok(note.getBoundingClientRect().top>=boundary+18,'note clears the fixed header and mobile directory');
  assert.equal(f.run('lastNavKey'),'product-overview','overview remains selected');
  f.run('scrollSpy()');
  assert.equal(f.run('lastNavKey'),'product-overview','scroll tracking keeps overview selected at the note');
  assert.equal(f.run('productSections.length'),6,'no new navigation section');
  assert.equal(f.location.hash,deepLink,'deep route survives canonicalization');
  assert.equal(f.stack.length,2,'one click adds one history entry');

  const href=f.switcher.href;
  assert.ok(href.endsWith(deepLink),'language switch preserves precise target');
  assert.ok(href.startsWith((lang==='en'?'WAGMIx_繁體中文_':'WAGMIx_English_')+config.version+'.html'),'switch selects correct local bilingual file');
  const translated=fixture(lang==='en'?'zh-Hant':'en',width,href.slice(href.indexOf('#')));
  assert.equal(translated.document.activeElement?.id,noteId,'translated deep link targets the same source explanation');
  const refresh=fixture(lang,width,deepLink);
  assert.equal(refresh.document.activeElement?.id,noteId,'reloading the deep link restores target');
  assert.equal(refresh.stack.length,1,'refresh does not create another history entry');

  f.navigate('#/products/7709/SKHY2Lw/features');
  f.back();assert.equal(f.location.hash,deepLink);assert.equal(f.document.activeElement?.id,noteId,'back returns to the note');
  f.back();assert.equal(f.location.hash,'#/','back returns to homepage');
  f.forward();assert.equal(f.location.hash,deepLink);assert.equal(f.document.activeElement?.id,noteId,'forward returns to the note');
  f.forward();assert.equal(f.location.hash,'#/products/7709/SKHY2Lw/features','forward preserves subsequent section');

  for(const code of ['7709w','SKHY2Lw'])for(const section of ['overview','market','theme','features','terms','documents']){
    const hash='#/products/7709/'+code+'/'+section;f.navigate(hash);
    assert.equal(f.location.hash,hash,'existing section is stable');
    assert.equal(f.run('lastNavKey'),'product-'+section,'existing section selects correct directory item');
  }
  f.navigate('#/products/7709/bvi/overview/footnote-3');assert.equal(f.location.hash,deepLink,'legacy BVI product alias canonicalizes note route');
  for(const [hash,canonical] of [
    ['#/products/7709/7709w/overview/footnote-3','#/products/7709/7709w/overview'],
    ['#/products/7709/SKHY2Lw/features/footnote-3','#/products/7709/SKHY2Lw/features'],
    ['#/products/7709/SKHY2Lw/overview/footnote-4','#/products/7709/SKHY2Lw/overview'],
  ]){f.navigate(hash);assert.equal(f.location.hash,canonical,'unsupported note route does not imply another product has T0 terms');}
}
console.log('PASS: T0 note deep links in both languages at 390/768/1280px simulated widths; exact target, focus, navigation clearance, language switching, refresh/history and existing sections. Browser visual QA remains separate.');
