// Behavioral checks for the jurisdiction notice. This offline demo is not an
// IP service or a server authorization boundary. No browser pixel claims here.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script = fs.readFileSync(path.join(root,'src/scripts/geoban.js'),'utf8');
const config = JSON.parse(fs.readFileSync(path.join(root,'src/data/site-config.json'),'utf8'));
const eea = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO'.split(' ');
const additional = 'AE VG HK BH MO MY CN QA SA SG TW TH GB US'.split(' ');
const expectedCountries = [...eea,...additional].sort();
const approvedCopy = {
  en:'The products and services described on this website are not intended for persons located in restricted jurisdictions. Nothing on this website is intended to constitute an offer or solicitation to persons in those jurisdictions.',
  zh:'本網站所述產品及服務並非面向位於受限制司法管轄區的人士。本網站的任何內容均不應被解讀為向該等地區的任何人士作出要約或招攬。'
};
const eligibilityCopy = {
  en:'Access to this website does not establish eligibility for any product or service.',
  zh:'瀏覽本網站並不代表您符合任何產品或服務的參與資格。'
};
let assertions=0;
function check(actual,expected,message){assert.equal(actual,expected,message);assertions++;}
function ok(value,message){assert.ok(value,message);assertions++;}
function same(actual,expected,message){assert.deepEqual(actual,expected,message);assertions++;}

function fixture({lang='en',mode='preview',preview='',endpoint='/api/region',reply={country:'US'},fail=false,httpOk=true,protocol='https:',fetchImpl,storage=new Map(),storageFails=false,noticeVersion=config.geoAccess.noticeVersion,timeoutMs=1000}={}){
  const nodes=new Map(),listeners={},windowListeners={};
  let document;
  class Element {
    constructor(id='',tag='DIV',parent=null,attrs={}){this.id=id;this.tagName=tag;this.parent=parent;this.attrs={...attrs};this.dataset={};this.children=[];this.inert=false;this.isConnected=true;this._html='';for(const [key,value]of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=value;}
    set innerHTML(value){
      const remove=node=>{node.isConnected=false;if(node.id)nodes.delete(node.id);node.children.forEach(remove);};
      this.children.forEach(remove);this.children=[];this._html=value;
      const stack=[this],voids=new Set(['IMG','INPUT','BR','HR','META','LINK','AREA','SOURCE']);
      for(const match of value.matchAll(/<(\/?)\s*([a-z][a-z\d-]*)\b([^>]*)>/gi)){
        if(match[1]){if(stack.length>1)stack.pop();continue;}
        const attrs={};for(const a of match[3].matchAll(/([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';
        const parent=stack.at(-1),element=new Element(attrs.id||'',match[2].toUpperCase(),parent,attrs);parent.children.push(element);if(element.id)nodes.set(element.id,element);if(!voids.has(element.tagName)&&!match[3].endsWith('/'))stack.push(element);
      }
    }
    get innerHTML(){return this._html;}
    contains(node){for(let cursor=node;cursor;cursor=cursor.parent)if(cursor===this)return true;return false;}
    focus(){document.activeElement=this;}
    setAttribute(key,value){this.attrs[key]=String(value);}
    removeAttribute(key){delete this.attrs[key];}
    getAttribute(key){return this.attrs[key]??null;}
    getClientRects(){return this.isConnected?[1]:[];}
    matches(selector){
      if(selector.includes(':not([disabled])')){if(Object.hasOwn(this.attrs,'disabled'))return false;selector=selector.replace(':not([disabled])','');}
      const attr=selector.match(/\[([\w-]+)(?:="([^"]*)")?\]/);
      if(attr){if(!Object.hasOwn(this.attrs,attr[1])||(attr[2]!==undefined&&this.attrs[attr[1]]!==attr[2]))return false;selector=selector.replace(attr[0],'');}
      if(selector.startsWith('#'))return this.id===selector.slice(1);
      if(selector.startsWith('.'))return (this.attrs.class||'').split(/\s+/).includes(selector.slice(1));
      return !selector||this.tagName===selector.toUpperCase();
    }
    closest(selector){for(let cursor=this;cursor;cursor=cursor.parent)if(cursor.matches(selector))return cursor;return null;}
    querySelectorAll(selector){const matches=[],selectors=selector.split(',').map(s=>s.trim());const visit=node=>{for(const child of node.children){if(selectors.some(s=>child.matches(s)))matches.push(child);visit(child);}};visit(this);return matches;}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  }
  const app=new Element('app'),geo=new Element('geo-root'),main=new Element('main','MAIN',app),switcher=new Element('language-switch','A',app,{href:'#/'});
  app.children.push(main,switcher);[app,geo,main,switcher].forEach(el=>nodes.set(el.id,el));
  const classes=new Set();
  document={activeElement:switcher,getElementById:id=>nodes.get(id)||null,body:{dataset:{},classList:{toggle(key,on){on?classes.add(key):classes.delete(key);}}},addEventListener(type,handler,capture){(listeners[type]??=[]).push({handler,capture});}};
  const location={hash:'#/products/7709/SKHY2Lw/documents',search:preview?'?geoPreview='+preview:'',origin:protocol==='https:'?'https://wagmix.example':protocol==='http:'?'http://wagmix.example':'null',protocol,href:protocol==='file:'?'file:///example/index.html':protocol+'//wagmix.example/index.html'};
  const sessionStorage={getItem(key){if(storageFails)throw new Error('Storage disabled');return storage.get(key)??null;},setItem(key,value){if(storageFails)throw new Error('Storage disabled');storage.set(key,String(value));},removeItem(key){if(storageFails)throw new Error('Storage disabled');storage.delete(key);}};
  let fetchCalls=0;const requests=[];
  const context={document,location,SITE_CONFIG:{...config,geoAccess:{...config.geoAccess,mode,endpoint,timeoutMs,noticeVersion}},L:lang,LOGO:'data:image/png;base64,logo',t:(zh,en)=>lang==='en'?en:zh,URL,AbortController,setTimeout,clearTimeout,console,sessionStorage,fetch:async(...args)=>{fetchCalls++;requests.push(args);if(fetchImpl)return fetchImpl(...args);if(fail)throw new Error('offline');return{ok:httpOk,json:async()=>reply};},addEventListener(type,handler){(windowListeners[type]??=[]).push(handler);}};
  context.window=context;const ctx=vm.createContext(context);const run=code=>vm.runInContext(code,ctx);run(script);
  return {run,app,geo,main,switcher,document,listeners,windowListeners,classes,location,storage,requests,getFetchCalls:()=>fetchCalls,async settle(){await new Promise(resolve=>setImmediate(resolve));},event(target,extra={}){return{target,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};},dispatch(type,event){for(const {handler}of listeners[type]||[]){handler(event);if(event.stopped)break;}},click(selector){const target=geo.querySelector(selector);ok(target,'Test target exists: '+selector);const event=this.event(target);this.dispatch('click',event);return event;}};
}
function browsable(f,label){check(f.app.inert,false,label+' app is interactive');check(f.app.attrs['aria-hidden'],undefined,label+' app is exposed to assistive technology');check(f.classes.has('geo-modal-open'),false,label+' page scroll is available');check(f.run('geoBlocked()'),false,label+' no modal focus guard');}
function noCountryList(f,label){ok(!/United States|Hong Kong|美國|香港|<details\b|data-country|restrictedCountries|Restricted jurisdictions list|受限制地區名單/i.test(f.geo.innerHTML),label+' generic notice without country/list display');}

same([...config.geoAccess.restrictedCountries].sort(),expectedCountries,'configured notice set is exactly EEA 30 plus the approved 14');
check(new Set(config.geoAccess.restrictedCountries).size,44,'44 distinct ISO country codes');
check(config.geoAccess.mode,'preview','offline delivery stays in explicit demo mode');
ok(typeof config.geoAccess.noticeVersion==='string'&&config.geoAccess.noticeVersion.length>0,'notice version supports session acknowledgement invalidation');

for(const lang of ['zh','en']){
  const f=fixture({lang});browsable(f,lang+' initial preview');check(f.getFetchCalls(),0,'preview never requests live IP');
  ok(f.geo.innerHTML.includes(lang==='en'?'No live IP detection':'未檢測實際IP'),'preview labelled as a demo');
  check(f.run("geoSetPreview('NOTICE')"),true,'generic notice scenario accepted');check(f.run('geoState.status'),'restricted','restricted detection retained as informational state');
  check(f.app.inert,true,'modal temporarily hides background interaction');check(f.app.attrs['aria-hidden'],'true','temporary modal background hidden');
  check(f.document.activeElement.id,'geo-title','dialog title receives focus');check(f.run('geoMessage()'),approvedCopy[lang],'approved generic notice wording');
  ok(f.geo.innerHTML.includes(eligibilityCopy[lang]),'browsing does not establish product eligibility');noCountryList(f,lang);
  ok(f.geo.innerHTML.includes('role="dialog"')&&f.geo.innerHTML.includes('aria-modal="true"'),'modal has accessible semantics');
  ok(f.run('geoLanguageHref()').includes('?geoPreview=NOTICE#'),'language link preserves generic preview scenario');
  ok(f.run('geoLanguageHref()').endsWith(f.location.hash),'language link preserves product section');
  const focusables=f.geo.querySelectorAll('a[href],button:not([disabled])');focusables.at(-1).focus();
  const tab=f.event(f.document.activeElement,{key:'Tab',shiftKey:false});f.dispatch('keydown',tab);check(f.document.activeElement,focusables[0],'Tab wraps while notice open');
  const backTab=f.event(f.document.activeElement,{key:'Tab',shiftKey:true});f.dispatch('keydown',backTab);check(f.document.activeElement,focusables.at(-1),'Shift+Tab wraps while notice open');
  check(f.classes.has('geo-modal-open'),true,'scroll lock is temporary while notice is visible');
  f.switcher.focus();f.dispatch('focusin',f.event(f.switcher));check(f.document.activeElement.id,'geo-title','external focus returns inside visible modal');
  const focusedControl=f.geo.querySelector('[data-geo-dismiss]');focusedControl.focus();
  f.location.hash='#/docs';for(const fn of f.windowListeners.hashchange||[])fn();check(f.app.inert,true,'route rerender preserves visible notice');check(f.document.activeElement,focusedControl,'hash change preserves focused modal control');
  const ack=f.geo.querySelectorAll('[data-geo-dismiss]').find(el=>el.attrs.class?.includes('primary'))||f.geo.querySelector('[data-geo-dismiss]');
  f.dispatch('click',f.event(ack));browsable(f,lang+' acknowledgement');check(f.document.activeElement,f.switcher,'dismissal restores previous app focus');
  check(f.run('geoState.status'),'restricted','dismissal does not relabel location as eligible');
  ok(!f.geo.innerHTML.includes('role="dialog"'),'acknowledgement removes modal');
  const routeClick=f.event(f.switcher);f.dispatch('click',routeClick);check(routeClick.prevented,false,'page links work after dismissal');
  const freeTab=f.event(f.switcher,{key:'Tab'});f.dispatch('keydown',freeTab);check(freeTab.prevented,false,'keyboard no longer trapped after dismissal');
  f.run("geoSetPreview('UNKNOWN')");check(f.run('geoState.status'),'error','unknown scenario identified');browsable(f,'unknown preview');
  ok(!f.geo.innerHTML.includes('role="dialog"'),'detection failure is not a modal');ok(f.geo.innerHTML.includes('data-geo-retry'),'failure offers retry');noCountryList(f,'failure');
  f.run("geoSetPreview('ALLOW')");browsable(f,'allowed preview');check(f.getFetchCalls(),0,'all preview scenarios avoid network calls');
  check(f.run("geoSetPreview('INVALID')"),false,'invalid preview scenario rejected');
}

for(const method of ['close','escape','backdrop']){
  const f=fixture({preview:'NOTICE'});check(f.app.inert,true,method+' starts with notice');
  if(method==='close')f.click('[data-geo-dismiss]');
  if(method==='escape'){const event=f.event(f.document.activeElement,{key:'Escape'});f.dispatch('keydown',event);check(event.prevented,true,'Escape handled by dismissable notice');}
  if(method==='backdrop'){const overlay=f.geo.querySelector('.geo-overlay');ok(overlay,'overlay exists');f.dispatch('click',f.event(overlay));}
  browsable(f,method+' dismissal');check(f.run('geoState.status'),'restricted',method+' does not change eligibility');ok(f.storage.size>0,method+' stores session acknowledgement');
}
const inside=fixture({preview:'NOTICE'});inside.dispatch('click',inside.event(inside.geo.querySelector('.geo-dialog')));check(inside.app.inert,true,'click inside dialog does not dismiss as backdrop');inside.run('geoDismissNotice()');
const legacy=fixture({preview:'US'});check(legacy.run('geoState.status'),'restricted','legacy demo URL still opens generic notice');ok(legacy.run('geoLanguageHref()').includes('geoPreview=NOTICE'),'legacy URL canonicalizes to generic scenario');noCountryList(legacy,'legacy URL');legacy.run('geoDismissNotice()');

// The country decision stays factual even after the user closes the notice.
const decision=fixture();for(const country of expectedCountries)check(decision.run(`geoDecision('${country}').status`),'restricted',country+' in approved notice set');
for(const country of ['VI','CH','AU','CA','JP','KR','NZ'])check(decision.run(`geoDecision('${country}').status`),'allowed',country+' is not implicitly included');
for(const country of ['UK','ADGM','DIFC'])check(decision.run(`geoDecision('${country}').status`),'error',country+' is not an ISO country response');
for(const country of ['GB','AE','VG','CN','HK','MO','TW'])check(decision.run(`geoDecision('${country}').status`),'restricted',country+' geography maps to intended ISO code');

for(const country of ['US','GB','HK','AE','VG','VI','JP']){
  const f=fixture({mode:'server',preview:'ALLOW',reply:{country}});browsable(f,'server checking');check(f.document.activeElement,f.switcher,'background checking does not steal focus');await f.settle();
  check(f.getFetchCalls(),1,'server requests same-origin country once');check(f.run('geoState.status'),expectedCountries.includes(country)?'restricted':'allowed','server response determines notice');
  check(f.run("geoSetPreview('ALLOW')"),false,'server ignores manual demo override');ok(!f.geo.innerHTML.includes('data-geo-preview'),'server has no demo controls');ok(!f.run('geoLanguageHref()').includes('geoPreview'),'server language switch drops preview parameter');
  noCountryList(f,'server '+country);
  if(expectedCountries.includes(country)){check(f.app.inert,true,'matching country shows closable modal');f.run('geoDismissNotice()');}
  browsable(f,'server '+country+' accessible');
  const [,options]=f.requests[0];check(options.credentials,'same-origin','request credential boundary');check(options.cache,'no-store','country request not cached');check(options.redirect,'error','country request rejects redirects');check(options.headers.Accept,'application/json','country request expects JSON');
}

// Automatic notices can open while body has focus; removed route elements cannot regain it.
const bodyFocus=fixture();bodyFocus.document.body.isConnected=true;bodyFocus.document.body.focus=()=>{throw new Error('Body should not receive restored focus');};bodyFocus.document.activeElement=bodyFocus.document.body;
bodyFocus.run("geoSetPreview('NOTICE')");bodyFocus.run('geoDismissNotice()');browsable(bodyFocus,'body focus dismissal');check(bodyFocus.document.activeElement,bodyFocus.main,'auto-open notice returns focus to main');
const removedFocus=fixture({preview:'NOTICE'});removedFocus.switcher.isConnected=false;removedFocus.run('geoDismissNotice()');browsable(removedFocus,'removed focus dismissal');check(removedFocus.document.activeElement,removedFocus.main,'removed original control falls back to main');

const session=new Map();const first=fixture({mode:'server',reply:{country:'US'},storage:session});await first.settle();first.run('geoDismissNotice()');
const key=[...session.keys()][0];ok(key.includes(config.geoAccess.noticeVersion)&&key.endsWith(':US'),'session key separates version and country');check(session.get(key),'1','session records acknowledgement only');
const reload=fixture({mode:'server',reply:{country:'US'},storage:session});await reload.settle();check(reload.run('geoState.status'),'restricted','reload still knows notice classification');browsable(reload,'same-session reload');
const translated=fixture({lang:'zh',mode:'server',reply:{country:'US'},storage:session});await translated.settle();browsable(translated,'cross-language acknowledgement');
const cachedPreview=fixture({preview:'NOTICE',storage:session});browsable(cachedPreview,'cached preview notice');cachedPreview.click('[data-geo-preview="NOTICE"]');check(cachedPreview.app.inert,true,'explicit demo control can reopen the notice for review');cachedPreview.run('geoDismissNotice()');
const changedCountry=fixture({mode:'server',reply:{country:'GB'},storage:session});await changedCountry.settle();check(changedCountry.app.inert,true,'different country needs acknowledgement');changedCountry.run('geoDismissNotice()');
const changedVersion=fixture({mode:'server',reply:{country:'US'},storage:session,noticeVersion:'next-notice'});await changedVersion.settle();check(changedVersion.app.inert,true,'new wording version needs acknowledgement');changedVersion.run('geoDismissNotice()');
const newSession=fixture({mode:'server',reply:{country:'US'}});await newSession.settle();check(newSession.app.inert,true,'new browser session does not reuse acknowledgement');newSession.run('geoDismissNotice()');
const noStorage=fixture({mode:'server',reply:{country:'US'},storageFails:true});await noStorage.settle();noStorage.run('geoDismissNotice()');browsable(noStorage,'storage unavailable');await noStorage.run('geoCheck()');browsable(noStorage,'in-memory acknowledgement fallback');

for(const reply of [{country:'us'},{country:'ZZ'},{country:'XX'},{country:''},{country:null},{country:'<script>US</script>'},{},null]){
  const f=fixture({mode:'server',reply});await f.settle();check(f.run('geoState.status'),'error','invalid/missing country gives informational error');check(f.run('geoState.country'),null,'invalid code is not retained');browsable(f,'invalid response');check(f.document.activeElement,f.switcher,'invalid response does not steal focus');ok(!f.geo.innerHTML.includes('role="dialog"'),'invalid response is a nonmodal warning');ok(!f.geo.innerHTML.includes('<script>'),'invalid country cannot inject markup');
}
for(const options of [{fail:true},{httpOk:false},{endpoint:''},{endpoint:'https://third-party.example/location'},{endpoint:'http://wagmix.example/region'},{protocol:'file:'},{protocol:'http:'},{mode:'unexpected'},{fetchImpl:async()=>({ok:true,json:async()=>{throw new Error('Invalid JSON');}})}]){
  const f=fixture({mode:'server',...options});await f.settle();check(f.run('geoState.status'),'error','network/config/JSON failure reports warning');browsable(f,'detection failure');ok(f.geo.innerHTML.includes('data-geo-retry'),'detection failure offers retry');
  if(options.endpoint!==undefined||options.protocol||options.mode)check(f.getFetchCalls(),0,'invalid endpoint/mode never requests a third party');
}
const retry=fixture({mode:'server',fetchImpl:async()=>({ok:true,json:async()=>retry.getFetchCalls()===1?{}:{country:'US'}})});await retry.settle();check(retry.run('geoState.status'),'error','retry fixture begins with error');retry.click('[data-geo-retry]');browsable(retry,'retry checking');await retry.settle();check(retry.run('geoState.status'),'restricted','retry accepts valid subsequent result');retry.run('geoDismissNotice()');
const errorClose=fixture({mode:'server',fail:true});await errorClose.settle();errorClose.click('[data-geo-dismiss-error]');browsable(errorClose,'inline error dismissed');ok(!errorClose.geo.innerHTML.includes('data-geo-retry'),'inline error disappears when dismissed');

for(const bodyStalls of [false,true]){
  let signal;const f=fixture({mode:'server',fetchImpl:async(_url,options)=>{signal=options.signal;return bodyStalls?{ok:true,json:()=>new Promise(()=>{})}:new Promise(()=>{});}});
  browsable(f,bodyStalls?'JSON loading':'request loading');await new Promise(resolve=>setTimeout(resolve,1050));check(f.run('geoState.status'),'error',bodyStalls?'response body timeout reported':'request timeout reported');check(signal.aborted,true,'timed-out request aborted');browsable(f,'timeout');
}
const pending=[];const race=fixture({mode:'server',fetchImpl:()=>new Promise(resolve=>pending.push(resolve))});race.run('geoCheck()');check(pending.length,2,'two overlapping requests exist');pending[1]({ok:true,json:async()=>({country:'JP'})});await race.settle();check(race.run('geoState.country'),'JP','new response accepted');pending[0]({ok:true,json:async()=>({country:'US'})});await race.settle();check(race.run('geoState.country'),'JP','stale response cannot reopen an outdated modal');browsable(race,'stale request ignored');

const css=fs.readFileSync(path.join(root,'src/styles/geoban.css'),'utf8');ok(css.includes('prefers-reduced-motion')&&css.includes(':focus-visible'),'reduced motion and visible keyboard focus styles retained');
console.log(`PASS: ${assertions} jurisdiction-notice assertions; 44-country mapping, generic bilingual copy, four dismissal paths, session acknowledgement, accessible focus restoration, nonblocking failures, retry, safe requests, timeouts and stale-response handling.`);
