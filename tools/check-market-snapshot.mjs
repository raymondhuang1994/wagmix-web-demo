import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const siteConfig=JSON.parse(read('src/data/site-config.json'));
const originalHistory=JSON.parse(read('src/data/7709-history.json'));
const payload={code:'HK.07709',last_price:14.63,open_price:15.37,high_price:16.32,low_price:13.91,prev_close:18.08,volume:564813447,update_time:'2026-11-06 16:08:26'};

function fixture({lang='zh-Hant',fetchImpl=async()=>({ok:true,status:200,json:async()=>payload})}={}) {
 const errors=[];
 const makeNode=()=>({dataset:{},isConnected:true,textContent:'',innerHTML:'',classList:{toggle(name,value){this[name]=value;}}});
 const nodes={
  'price-chart':makeNode(),'market-live-status':makeNode(),'market-live-time':makeNode(),
  'market-price':makeNode(),'market-change-value':makeNode(),'market-change':makeNode(),'market-change-label':makeNode(),
  'market-stat-open':makeNode(),'market-stat-high':makeNode(),'market-stat-low':makeNode(),'market-stat-volume':makeNode(),
 };
 const selectors={
  '[data-market-price]':nodes['market-price'],
  '[data-market-change-value]':nodes['market-change-value'],
  '[data-market-change]':nodes['market-change'],
  '[data-market-change-label]':nodes['market-change-label'],
  '.chart-switch button.selected':{dataset:{chart:'line'}},
 };
 for(const key of ['open','high','low','volume'])selectors[`[data-market-stat="${key}"]`]=nodes[`market-stat-${key}`];
 const document={
  body:{dataset:{page:'product'}},
  getElementById(id){return nodes[id]||null;},
  querySelector(selector){return selectors[selector]||null;},
 };
 const context=vm.createContext({
  CONTENT:{},HISTORY:originalHistory,SITE_CONFIG:structuredClone(siteConfig),SKHYNIX:{},LOGO:'',LOGO_LIGHT:'',ASSETS:{},INSTITUTION_LOGOS:{},
  document,URL,AbortController,setTimeout,clearTimeout,fetch:(...args)=>fetchImpl(...args),
  console:{error:(...args)=>errors.push(args)},L:lang==='en'?'en':'zh',t:(zh,en)=>lang==='en'?en:zh,
  esc:value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])),
 });
 vm.runInContext(read('src/scripts/product.js'),context);
 nodes['price-chart'].innerHTML=vm.runInContext("priceChart('line',null)",context);
 return {context,document,nodes,errors,run:code=>vm.runInContext(code,context)};
}

const requestOptions=[];
const good=fixture({fetchImpl:async(url,options)=>{requestOptions.push({url,options});return {ok:true,status:200,json:async()=>payload};}});
const historyBefore=JSON.stringify(originalHistory);
const initial=good.nodes['price-chart'].innerHTML;
assert.ok(!initial.includes('live-snapshot-candle'),'fallback chart starts with historical data only');
assert.equal(good.run('HISTORY.prices.length'),19,'historical observation count remains unchanged');
await good.run('loadMarketSnapshot()');
assert.equal(requestOptions.length,1,'one request is made per product render');
assert.equal(requestOptions[0].url,siteConfig.marketSnapshot.endpoint,'configured endpoint is used');
assert.equal(requestOptions[0].options.method,'GET','snapshot request is read-only');
assert.equal(requestOptions[0].options.cache,'no-store','snapshot bypasses stale cache');
assert.equal(requestOptions[0].options.headers.Accept,'application/json','JSON response requested');
assert.equal(good.nodes['market-live-status'].dataset.state,'live','valid response displays live state');
assert.match(good.nodes['market-live-time'].textContent,/2026\.11\.06 16:08:26 HKT · HKD/,'validated timestamp and currency are shown');
assert.equal(good.nodes['market-price'].textContent,'14.630','current quote updates');
assert.equal(good.nodes['market-change-value'].textContent,'-3.450 (-19.08%)','change is calculated from previous close');
assert.equal(good.nodes['market-stat-open'].textContent,'15.370','open updates');
assert.equal(good.nodes['market-stat-high'].textContent,'16.320','high updates');
assert.equal(good.nodes['market-stat-low'].textContent,'13.910','low updates');
assert.equal(good.nodes['market-stat-volume'].textContent,'5.648 億','volume is formatted in Chinese units');
assert.equal((good.nodes['price-chart'].innerHTML.match(/class="live-snapshot-candle"/g)||[]).length,1,'one separate live candle is drawn');
assert.ok(good.nodes['price-chart'].innerHTML.includes('即時快照 · 7709.HK'),'snapshot divider is labelled');
assert.equal((good.nodes['price-chart'].innerHTML.match(/class="historical-close-line"/g)||[]).length,1,'historical line remains separate');
const historicLine=good.nodes['price-chart'].innerHTML.match(/class="historical-close-line" d="([^"]+)"/)[1];
const liveX=good.nodes['price-chart'].innerHTML.match(/class="live-snapshot-candle"><title>[\s\S]*?<\/title><line x1="([^"]+)"/)[1];
assert.ok(!historicLine.includes(`${liveX},`),'live snapshot is not connected to the historical line');
assert.ok(good.run("priceChart('candle',liveMarketSnapshot)").includes('class="live-snapshot-candle"'),'candle mode retains live snapshot');
assert.ok(good.run("priceChart('line',liveMarketSnapshot)").includes('class="live-snapshot-candle"'),'line mode retains live snapshot');
assert.equal(JSON.stringify(originalHistory),historyBefore,'snapshot does not mutate historical data');

const extreme={...payload,low_price:.8,high_price:101};
const expanded=fixture({fetchImpl:async()=>({ok:true,status:200,json:async()=>extreme})});
await expanded.run('loadMarketSnapshot()');
assert.equal(expanded.nodes['market-live-status'].dataset.state,'live','out-of-range quote remains valid');
assert.ok(expanded.nodes['price-chart'].innerHTML.includes('>0.00</text>'),'axis expands below the historical minimum');
assert.ok(expanded.nodes['price-chart'].innerHTML.includes('>120.00</text>'),'axis expands above the historical maximum');

const invalidPayloads=[
 {...payload,code:'HK.00000'},
 {...payload,last_price:NaN},
 {...payload,low_price:20},
 {...payload,volume:-1},
 {...payload,update_time:'2026-02-31 16:08:26'},
];
for(const badPayload of invalidPayloads){
 const invalid=fixture({fetchImpl:async()=>({ok:true,status:200,json:async()=>badPayload})});
 const fallback=invalid.nodes['price-chart'].innerHTML;
 await invalid.run('loadMarketSnapshot()');
 assert.equal(invalid.nodes['market-live-status'].dataset.state,'error','invalid response is reported');
 assert.equal(invalid.nodes['price-chart'].innerHTML,fallback,'invalid response leaves historical chart intact');
 assert.equal(invalid.errors.length,1,'invalid response is logged');
}
for(const fetchImpl of [
 async()=>({ok:false,status:503,json:async()=>payload}),
 async()=>{throw new Error('network unavailable');},
 async()=>({ok:true,status:200,json:async()=>{throw new Error('invalid JSON');}}),
]){
 const failed=fixture({fetchImpl});
 const fallback=failed.nodes['price-chart'].innerHTML;
 await failed.run('loadMarketSnapshot()');
 assert.equal(failed.nodes['market-live-status'].dataset.state,'error','HTTP, network and JSON errors are reported');
 assert.equal(failed.nodes['price-chart'].innerHTML,fallback,'request failures leave history visible');
 assert.equal(failed.errors.length,1,'request failures are logged');
}

let resolveRequest;
const pending=fixture({fetchImpl:()=>new Promise(resolve=>{resolveRequest=resolve;})});
const staleRun=pending.run('loadMarketSnapshot()');
pending.run('cancelMarketSnapshot()');
pending.document.body.dataset.page='home';
pending.nodes['price-chart'].isConnected=false;
resolveRequest({ok:true,status:200,json:async()=>payload});
await staleRun;
assert.equal(pending.nodes['market-live-status'].dataset.state,'loading','stale response cannot update a departed page');
assert.ok(!pending.nodes['price-chart'].innerHTML.includes('live-snapshot-candle'),'stale response cannot change its chart');

const invalidConfig=fixture();
invalidConfig.run('marketSnapshotConfig.axisMax=marketSnapshotConfig.axisMin');
await invalidConfig.run('loadMarketSnapshot()');
assert.equal(invalidConfig.nodes['market-live-status'].dataset.state,'error','invalid chart configuration is reported');
assert.equal(invalidConfig.errors.length,1,'invalid chart configuration is logged');

console.log('PASS: live snapshot validation, bilingual quote summary, separated line/candle chart, dynamic axis, historical fallback, request errors and stale-route protection.');
