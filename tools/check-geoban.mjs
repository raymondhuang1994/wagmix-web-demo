// Behavioral checks for the region UI. These are not browser pixel tests or
// evidence of production enforcement; the HTML demo has no server boundary.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script = fs.readFileSync(path.join(root,'src/scripts/geoban.js'),'utf8');
const expectedEnglish = 'The products and services on this website are not intended for individuals in the United States. Nothing on this website is intended to be construed as a solicitation of any individual in the United States.';
const expectedChinese = '本網站所載產品及服務並非面向位於美國的人士。本網站的任何內容均不應被解讀為向任何位於美國的人士作出招攬。';
let assertions = 0;
function check(actual,expected,message) { assert.equal(actual,expected,message); assertions++; }

function fixture({lang='en',mode='preview',preview='',endpoint='/api/region',reply={country:'US'},fail=false,httpOk=true,protocol='https:',fetchImpl}={}) {
  const nodes = new Map(), listeners = {}, windowListeners = {};
  let document;
  class Element {
    constructor(id='',tag='DIV',parent=null,attrs={}) { this.id=id;this.tagName=tag;this.parent=parent;this.attrs=attrs;this.dataset={};this.children=[];this.inert=false;this.isConnected=true;this._html='';Object.entries(attrs).filter(([k])=>k.startsWith('data-')).forEach(([k,v])=>this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v); }
    set innerHTML(value) {
      this._html=value;
      this.children.forEach(el=>{el.isConnected=false;if(el.id)nodes.delete(el.id);}); this.children=[];
      for (const match of value.matchAll(/<(a|button|h2)\b([^>]*)>/g)) {
        const attrs={};for (const attr of match[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) attrs[attr[1]]=attr[2]??'';
        const el=new Element(attrs.id||'',match[1].toUpperCase(),this,attrs);this.children.push(el);if(el.id)nodes.set(el.id,el);
      }
    }
    get innerHTML(){return this._html;}
    contains(node){return node===this || this.children.includes(node);}
    focus(){document.activeElement=this;}
    setAttribute(key,value){this.attrs[key]=value;}
    removeAttribute(key){delete this.attrs[key];}
    getClientRects(){return [1];}
    closest(selector){
      if(selector==='[data-geo-preview]')return Object.hasOwn(this.attrs,'data-geo-preview')?this:null;
      if(selector==='[data-geo-retry]')return Object.hasOwn(this.attrs,'data-geo-retry')?this:null;
      return null;
    }
    querySelectorAll(selector){if(selector==='a[href],button:not([disabled])')return this.children.filter(el=>el.tagName==='A'&&Object.hasOwn(el.attrs,'href')||el.tagName==='BUTTON'&&!Object.hasOwn(el.attrs,'disabled'));return [];}
    querySelector(selector){if(selector==='[data-geo-preview="ALLOW"]')return this.children.find(el=>el.attrs['data-geo-preview']==='ALLOW')||null;return null;}
  }
  const app=new Element('app'),geo=new Element('geo-root'),switcher=new Element('language-switch','A',app);
  app.children.push(switcher);[app,geo,switcher].forEach(el=>nodes.set(el.id,el));
  const classes=new Set();
  document={activeElement:null,getElementById:id=>nodes.get(id)||null,body:{dataset:{},classList:{toggle(key,on){on?classes.add(key):classes.delete(key);}}},addEventListener(type,handler,capture){(listeners[type]??=[]).push({handler,capture});}};
  const location={hash:'#/products/7709/SKHY2Lw/documents',search:preview?'?geoPreview='+preview:'',origin:protocol==='https:'?'https://wagmix.example':'null',protocol,href:protocol==='https:'?'https://wagmix.example/index.html':'file:///example/index.html'};
  let fetchCalls=0;
  const context={document,location,SITE_CONFIG:{version:'V15',geoAccess:{mode,endpoint,restrictedCountries:['US'],timeoutMs:1000}},L:lang,LOGO_LIGHT:'data:image/png;base64,logo',t:(zh,en)=>lang==='en'?en:zh,URL,AbortController,setTimeout,clearTimeout,console,fetch:async(...args)=>{fetchCalls++;if(fetchImpl)return fetchImpl(...args);if(fail)throw new Error('offline');return {ok:httpOk,json:async()=>reply};},addEventListener(type,handler){(windowListeners[type]??=[]).push(handler);}};
  context.window=context;
  const ctx=vm.createContext(context);
  const run=code=>vm.runInContext(code,ctx);
  run(script);
  return {run,app,geo,switcher,document,listeners,windowListeners,classes,location,getFetchCalls:()=>fetchCalls,async settle(){await new Promise(resolve=>setImmediate(resolve));},event(target,extra={}){return {target,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extra};},dispatch(type,event){for(const {handler} of listeners[type]||[]){handler(event);if(event.stopped)break;}}};
}

for(const lang of ['zh','en']) {
  const f=fixture({lang});
  check(f.run('geoState.status'),'allowed','preview default allows design review');
  check(f.getFetchCalls(),0,'preview never requests actual IP');
  assert.ok(f.geo.innerHTML.includes(lang==='en'?'No live IP detection':'未檢測實際IP'));
  check(f.run("geoSetPreview('US')"),true,'US preview selectable');
  check(f.run('geoState.status'),'restricted');
  check(f.app.inert,true,'underlying app is inert');
  check(f.app.attrs['aria-hidden'],'true');
  check(f.classes.has('geo-access-blocked'),true,'scroll is locked');
  check(f.document.activeElement.id,'geo-title','dialog title receives focus');
  check(f.run('geoMessage()'),lang==='en'?expectedEnglish:expectedChinese,'exact approved wording');
  assert.ok(!f.geo.innerHTML.includes('Hong Kong')&&!f.geo.innerHTML.includes('香港'));
  assert.ok(f.run('geoLanguageHref()').includes('?geoPreview=US#'),'language preserves US scenario');
  const escape=f.event(f.document.activeElement,{key:'Escape'});f.dispatch('keydown',escape);check(escape.prevented,true);check(escape.stopped,true);check(f.app.inert,true,'Escape cannot dismiss');
  const outside=f.event(f.switcher);f.dispatch('click',outside);check(outside.prevented,true,'underlying links blocked');
  const backdrop=f.event(f.geo);f.dispatch('click',backdrop);check(f.app.inert,true,'backdrop cannot dismiss');
  const focusables=f.geo.querySelectorAll('a[href],button:not([disabled])');focusables.at(-1).focus();
  const tab=f.event(f.document.activeElement,{key:'Tab',shiftKey:false});f.dispatch('keydown',tab);check(f.document.activeElement,focusables[0],'Tab wraps within modal');
  const backTab=f.event(f.document.activeElement,{key:'Tab',shiftKey:true});f.dispatch('keydown',backTab);check(f.document.activeElement,focusables.at(-1),'Shift+Tab wraps within modal');
  f.location.hash='#/docs';f.windowListeners.hashchange.forEach(fn=>fn());check(f.app.inert,true,'hash route cannot release guard');
  check(f.run("geoSetPreview('UNKNOWN')"),true);check(f.run('geoState.country'),null);check(f.run('geoState.status'),'error');assert.ok(!f.run('geoMessage()').includes('United States'));
  f.run("geoSetPreview('ALLOW')");check(f.app.inert,false);check(f.app.attrs['aria-hidden'],undefined);check(f.classes.has('geo-access-blocked'),false);check(f.getFetchCalls(),0);
  check(f.run("geoSetPreview('INVALID')"),false,'invalid preview state rejected');
}

const usLink=fixture({preview:'US'});check(usLink.run('geoState.status'),'restricted','direct US demo link');
for(const country of ['US','GB','HK']) {
  const f=fixture({mode:'server',preview:'ALLOW',reply:{country}});await f.settle();
  check(f.getFetchCalls(),1,'server endpoint called once');
  check(f.run('geoState.status'),country==='US'?'restricted':'allowed','server country determines decision');
  check(f.run("geoSetPreview('ALLOW')"),false,'server ignores preview override');
  assert.ok(!f.geo.innerHTML.includes('data-geo-preview'));
  assert.ok(!f.run('geoLanguageHref()').includes('geoPreview'));
}
for(const country of ['us','ZZ','XX','',null,'<script>US</script>']) {
  const f=fixture({mode:'server',reply:{country}});await f.settle();
  check(f.run('geoState.status'),'error','invalid country fails closed');check(f.run('geoState.country'),null);check(f.app.inert,true);
}
for(const options of [{fail:true},{httpOk:false},{endpoint:''},{endpoint:'https://third-party.example/location'},{protocol:'file:'},{mode:'unexpected'}]) {
  const f=fixture({mode:'server',...options});await f.settle();check(f.run('geoState.status'),'error','network/config error fails closed');check(f.app.inert,true);
  if(options.endpoint!==undefined||options.protocol||options.mode)check(f.getFetchCalls(),0,'invalid endpoint/mode makes no request');
}
const timeout=fixture({mode:'server',fetchImpl:()=>new Promise(()=>{})});
await new Promise(resolve=>setTimeout(resolve,1050));check(timeout.run('geoState.status'),'error','request timeout fails closed');check(timeout.app.inert,true);
const jsonTimeout=fixture({mode:'server',fetchImpl:async()=>({ok:true,json:()=>new Promise(()=>{})})});
await new Promise(resolve=>setTimeout(resolve,1050));check(jsonTimeout.run('geoState.status'),'error','response body timeout fails closed');
const css=fs.readFileSync(path.join(root,'src/styles/geoban.css'),'utf8');
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('max-width:540px')&&css.includes(':focus-visible'));
console.log(`PASS: ${assertions} geoban assertions; bilingual approved text, explicit preview states, no demo IP requests, server validation, timeouts, language continuity, inert/focus/route behavior.`);
