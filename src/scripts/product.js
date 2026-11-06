/* BVI SKHY2Lw product: V8 factsheet marketing and formal product terms. */
const productMarketingNotes = {
 funding:
 t('0 資金費不代表所有費用為零，申贖費及託管費仍適用。每日再平衡、路徑依賴及跟蹤偏差可影響對沖結果；套利收益並不獲保證。','Zero funding fees do not mean zero total costs; subscription, redemption and custody fees still apply. Daily rebalancing, path dependency and tracking difference may affect hedging results. Arbitrage income is not guaranteed.'),
 backing:t('營運資產可包括 7709.HK 單位、現金或現金等價物。每枚代幣代表一份無抵押票據，持有人依交易文件取得對 7709.HK 的合約經濟敞口，並不擁有底層資產。這些營運資產屬於發行人，不構成票據抵押品，亦不為持有人設置信託。','Operational assets may include 7709.HK units, cash or cash equivalents. Each token represents one unsecured Note and gives holders contractual economic exposure to 7709.HK under the transaction documents, without ownership of the underlying assets. These operational assets belong to the issuer, do not secure the Notes and are not held on trust for holders.'),
 liquidity:t('做市商可支持二級流動性，但不保證市場持續活躍或具流動性；報價及交易可能受限制或暫停。','Market makers may support secondary liquidity, but an active or liquid market is not guaranteed. Quotations and trading may be restricted or suspended.'),
 access:t('錢包接入不豁免投資者資格、交易平台及轉讓限制。申贖須符合 KYC／AML／KYT 等要求；稅務待遇取決於持有人情況及司法管轄區，應取得獨立稅務意見。','Wallet access does not waive eligibility, venue or transfer restrictions. Creation and redemption remain subject to KYC/AML/KYT and other requirements. Tax treatment depends on the holder and jurisdiction; independent tax advice should be obtained.')
};
const productFeatureMeta = {funding:{symbol:'0%',chapter:'technology'},backing:{symbol:'1:1',chapter:'token'},liquidity:{symbol:'24/7',chapter:'offer'},access:{symbol:'↗',chapter:'disclaimer'}};
const marketSnapshotConfig = SITE_CONFIG.marketSnapshot;
let liveMarketSnapshot = null;
let marketSnapshotRequestId = 0;
let activeMarketSnapshotController = null;
function productCoin() {
 return `<div class="p-coin-scene bvi-product-art" aria-hidden="true">
  <div class="bvi-product-mark">${productMark('bvi')}</div>
  <div class="bvi-mark-caption"><span>SKHY2Lw</span><strong>Solana</strong></div>
 </div>`;
}

function product() {
 return `<main id="main" class="p-page">
  <section class="p-hero"><div class="wrap">

   <div class="p-hero-layout">
    <div class="p-hero-copy">
     <span class="pill">${t('即將上線','Coming soon')}</span>
     <h1>WAGMIx SK Hynix<br><em>Daily Max (2x)</em></h1>
     <p class="p-hero-slogan">${t('全球首個支持一級申贖 T0 交收³及二級市場 24/7 交易的代幣化產品','The world’s first tokenized product to combine T0 settlement³ for primary subscriptions and redemptions with 24/7 secondary trading')}</p>
     <div class="p-hero-meta">
      <span>${t('底層資產','Underlying asset')} <b>7709.HK</b></span>
      <span>${t('計劃首發','Planned launch')} <b>${launchDateLabel('long')}</b></span>
     </div>
     <div class="p-hero-actions">
      <a class="btn" href="#/products/7709/SKHY2Lw/terms">${t('查看產品資料','View product details')} ${arrow}</a>
      <button class="p-trading-pending" type="button" disabled>${chainIcon('solana')}${t('Solana · 即將開放','Solana · Coming soon')}</button>
     </div>
     <div class="p-hero-download">${downloadLink('factsheet',t('產品單頁下載','Download factsheet'),'p-factsheet-link')}<span>${t('繁體中文 · PDF','English · PDF')}</span></div>
    </div>
    ${productCoin()}
   </div>
   <p class="p-t0" id="product-source-note-3">${t0}</p>
  </div></section>
  <div class="p-tab-content" id="product-content">${productMarket()}${productTheme()}${productFeatures()}${productTerms()}${productWhitepaper()}${productDisclaimer()}</div>
 </main>`;
}
function productFeatures(){
 return `<section class="p-section" id="product-features"><div class="wrap">
  <div class="p-section-heading"><div><div class="eyebrow">${t('核心賣點','Key features')}</div><h2>${t('四大核心賣點','Four Core Selling Points')}</h2></div></div>
  <div class="p-feature-grid">${PRODUCT_FEATURES.map((s,i)=>`<article class="p-feature p-feature-${i}" data-feature="${s.id}"><div class="p-feature-top"><span>0${i+1}</span><div class="p-feature-symbol" aria-hidden="true">${productFeatureMeta[s.id].symbol}</div></div><h3>${esc(pick(s.title))}<sup class="feature-ref">${String.fromCharCode(97+i)}</sup></h3><p class="p-feature-copy">${esc(pick(s.copy))}</p></article>`).join('')}</div>
  <ol class="product-feature-notes" type="a" aria-label="${t('賣點適用條件','Feature conditions')}">${PRODUCT_FEATURES.map(s=>`<li>${productMarketingNotes[s.id]} <a href="#/whitepaper/${productFeatureMeta[s.id].chapter}">${t('相關條款','Related terms')} ↗</a></li>`).join('')}</ol>
 </div></section>`;
}

function productDisclaimer(){
 return `<section class="p-disclaimer" aria-label="${t('免責聲明','Disclaimer')}"><div class="wrap"><p>${esc(pick(CONTENT.productDisclaimer))}</p></div></section>`;
}

function productTheme() {
 const theme = CONTENT.investmentTheme;
 const aum = CONTENT.marketMetrics[2];
 const aumThreshold = L === 'zh' ? (aum.value * 10).toLocaleString('en-US') : aum.value;
 return `<section class="p-section p-theme-section" id="product-theme">
  <div class="wrap">
   <div class="p-section-heading">
    <div><div class="eyebrow">${t('底層資產投資主題與市場數據','Underlying asset investment theme and market data')}</div>
     <h2>${esc(pick(theme.hbmTitle))}<sup>¹</sup></h2>
    </div>
   </div>
   <div class="p-metrics p-metrics-four">
    <article class="p-metric p-metric-objective">
     <div class="p-metric-label">${t('每日槓桿最多','Maximum daily leverage')}</div>
     <div class="p-metric-value">2<span class="p-metric-times">×</span></div>
     <p>${esc(pick(theme.dailyObjective))}</p>
    </article>
    <article class="p-metric">
     <div class="p-metric-label">${t('單月成交額峰值','Peak monthly turnover')}</div>
     <div class="p-metric-value"><small>${t('約','Approx.')}</small>${t('3,078','307.8')}</div>
     <div class="p-metric-unit">${t('億港元²','HK$ billion²')}</div>
     <p>${t('2026 年 7 月 · 22 個交易日','July 2026 · 22 trading days')}</p>
    </article>
    <article class="p-metric">
     <div class="p-metric-label">${t('峰值月份日均成交額','Average daily turnover in the peak month')}</div>
     <div class="p-metric-value"><small>${t('約','Approx.')}</small>${t('140','14.0')}</div>
     <div class="p-metric-unit">${t('億港元／日²','HK$ billion / day²')}</div>
     <p>${t('2026 年 7 月','July 2026')}</p>
    </article>
    <article class="p-metric">
     <div class="p-metric-label">${t('7709.HK 資產管理規模','7709.HK assets under management')}</div>
     <div class="p-metric-value"><small>${t('超過','Over')}</small>${aumThreshold}</div>
     <div class="p-metric-unit">${t('億港元²','HK$ billion²')}</div>
     <p>${t('2026 年 6 月','June 2026')}</p>
    </article>
   </div>
   <div class="p-metric-equation"><span>${t('月成交額','Monthly turnover')} <b>${t('3,078 億港元','HK$307.8bn')}</b></span><i>÷</i><span><b>22</b> ${t('個交易日','trading days')}</span><i>≈</i><span>${t('日均成交','Daily average')} <b>${t('140 億港元','HK$14.0bn')}</b></span></div>
   <div class="p-source-notes">
    <p>¹ <a href="${esc(theme.hbmSource)}" target="_blank" rel="noopener noreferrer">${esc(pick(CONTENT.productFootnotes.hbm))} ↗</a></p>
    <p>² ${esc(pick(CONTENT.productFootnotes.market))}</p>
    <p>${t('歷史數據不代表未來表現、流動性或需求。每日槓桿不等於長期累計兩倍回報。','Historical figures do not indicate future performance, liquidity or demand. Daily leverage does not imply twice the cumulative return over longer periods.')}</p>
   </div>
   ${skHynixProfile()}
  </div>
 </section>`;
}
// Company data are separate from 7709 trading statistics and token performance.
function skHynixProfile(){
 const latest=SKHYNIX.quarters.at(-1),billionsToTrillions=x=>x/1000;
 const metrics=[{key:'revenueBillionKrw',label:t('營收','Revenue'),growth:t('按季增長 32%','32% quarter-on-quarter')},{key:'operatingProfitBillionKrw',label:t('營業利潤','Operating profit'),growth:t('按季增長 38%','38% quarter-on-quarter')}];
 return `<div class="sk-company skhynix-profile" id="skhynix-company"><div class="sk-company-intro"><div><span class="sk-company-tag">SK hynix</span><h3>${t('從記憶體製造到 HBM，SK 海力士服務 AI 運算的關鍵需求。','From memory manufacturing to HBM, SK hynix serves critical AI computing needs.')}</h3><p>${t('SK 海力士前身於 1983 年成立，主要產品涵蓋 DRAM、NAND 快閃記憶體及 SSD。HBM 將多層 DRAM 堆疊，提供 AI 系統所需的高頻寬。','Founded in 1983 as Hyundai Electronics, SK hynix supplies DRAM, NAND flash and SSDs. HBM stacks multiple DRAM layers to provide the high bandwidth needed by AI systems.')}</p></div><div class="sk-milestones"><article><span>2013</span><h4>${t('率先開發 TSV 型 HBM。','Pioneered TSV-based HBM.')}</h4><p>${t('公司開發全球首款基於矽通孔技術的 HBM。','The company developed the world’s first HBM based on through-silicon via technology.')}</p></article><article><span>2026 Q2</span><h4>${t('HBM4 開始批量出貨。','HBM4 volume shipments began.')}</h4><p>${t('新一代 HBM 進入量產交付，第三季出貨進一步擴大。','The next HBM generation entered volume delivery, with shipments expanding in the third quarter.')}</p></article></div></div><div class="sk-performance"><div class="sk-performance-top"><div><span class="eyebrow">${t('2026 年第三季 · 公司披露','Q3 2026 · Company disclosure')}</span><h3>${t('受 AI 記憶體需求及高附加值產品銷售帶動，營收與營業利潤均創季度新高。','AI memory demand and sales of high-value products drove SK hynix revenue and operating profit to quarterly records.')}</h3></div><span class="sk-unit">${t('萬億韓元','KRW trillion')}</span></div><div class="sk-kpis">${metrics.map(m=>`<article><span>${m.label}</span><strong data-source-locked="true">${billionsToTrillions(latest[m.key]).toFixed(2)}</strong><p data-source-locked="true">${m.growth}</p></article>`).join('')}</div><figure class="sk-chart" aria-labelledby="sk-chart-title"><figcaption id="sk-chart-title">${t('最近四季的營收與營業利潤持續上升。','Revenue and operating profit rose over the latest four quarters.')}</figcaption><div class="sk-chart-legend"><span><i class="sk-revenue"></i>${t('營收','Revenue')}</span><span><i class="sk-profit"></i>${t('營業利潤','Operating profit')}</span><small>${t('相同刻度 · 從零起算','Shared scale · zero baseline')}</small></div><div class="sk-chart-axis" aria-hidden="true"><span></span><div><b>0</b><b>40</b><b>80</b><b>120</b></div></div><div class="sk-chart-rows" data-source-locked="true" role="img" aria-label="${t('2025 年第四季至 2026 年第三季，營收由 32.83 增至 104.62 萬億韓元，營業利潤由 19.17 增至 83.33 萬億韓元。下方提供完整數據表。','From Q4 2025 to Q3 2026, revenue rose from KRW32.83tn to KRW104.62tn and operating profit from KRW19.17tn to KRW83.33tn. A full data table follows.')}">${SKHYNIX.quarters.map(q=>`<div class="sk-chart-row" aria-hidden="true"><span class="sk-chart-period">${esc(q.period)}</span><div class="sk-chart-tracks">${metrics.map((m,i)=>`<div class="sk-chart-track"><i class="${i?'sk-profit':'sk-revenue'}" style="width:${billionsToTrillions(q[m.key])/120*100}%"></i><b style="left:${billionsToTrillions(q[m.key])/120*100}%">${billionsToTrillions(q[m.key]).toFixed(2)}</b></div>`).join('')}</div></div>`).join('')}</div></figure><details class="chart-data sk-chart-data"><summary>${t('查看公司業績數據','View company results data')} <span>↓</span></summary><div class="chart-table-scroll"><table><caption>${t('SK 海力士合併業績；單位：萬億韓元','SK hynix consolidated results; unit: KRW trillion')}</caption><thead><tr><th scope="col">${t('季度','Quarter')}</th><th scope="col">${t('營收','Revenue')}</th><th scope="col">${t('營業利潤','Operating profit')}</th></tr></thead><tbody>${SKHYNIX.quarters.map(q=>`<tr><th scope="row">${esc(q.period)}</th><td data-source-locked="true">${billionsToTrillions(q.revenueBillionKrw).toFixed(4)}</td><td data-source-locked="true">${billionsToTrillions(q.operatingProfitBillionKrw).toFixed(4)}</td></tr>`).join('')}</tbody></table></div></details><div class="sk-source-note"><p>${t('資料截至 2026 年 10 月 28 日。業績按公司披露的 K-IFRS 合併初步數據列示；圖表保留兩位小數。公司業績不等於 7709.HK 或代幣的投資回報。','Information as of 28 October 2026. Results use the company’s preliminary consolidated K-IFRS disclosures; chart values are rounded to two decimals. Company earnings are not investment returns on 7709.HK or the token.')}</p><div>${t('來源：SK 海力士官方披露','Sources: SK hynix official disclosures')} · ${SKHYNIX.sources.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(pick(x.label))} ↗</a>`).join(' · ')}</div></div></div></div>`;
}
// Kept as a compatibility helper for callers that render an overview excerpt.
function productOverview(){return productFeatures()+productTheme();}
function marketNumber(value){return Number.isFinite(value)?value.toFixed(marketSnapshotConfig.priceDecimals):'—';}
function marketVolume(value){return L==='zh'?`${(value/100000000).toFixed(3)} 億`:`${(value/1000000).toFixed(2)}M`;}
function marketChange(value,base){const change=value-base,percent=change/base*100;return `${change>=0?'+':''}${marketNumber(change)} (${percent>=0?'+':''}${percent.toFixed(2)}%)`;}
function niceChartStep(value){const power=10**Math.floor(Math.log10(value)),scaled=value/power;return power*(scaled<1.5?1:scaled<3.5?2:scaled<7.5?5:10);}
function priceChart(mode='line',snapshot=liveMarketSnapshot){
 const rows=HISTORY.prices,W=1180,H=350,left=10,right=70,top=28,bottom=44;
 const minValue=Math.min(marketSnapshotConfig.axisMin,snapshot?.low??marketSnapshotConfig.axisMin);
 const maxValue=Math.max(marketSnapshotConfig.axisMax,snapshot?.high??marketSnapshotConfig.axisMax);
 const step=minValue>=marketSnapshotConfig.axisMin&&maxValue<=marketSnapshotConfig.axisMax?marketSnapshotConfig.axisStep:niceChartStep((maxValue-minValue)/4);
 const lo=minValue<marketSnapshotConfig.axisMin?Math.floor(minValue/step)*step:marketSnapshotConfig.axisMin;
 const hi=maxValue>marketSnapshotConfig.axisMax?Math.ceil(maxValue/step)*step:marketSnapshotConfig.axisMax;
 const plotH=H-top-bottom,plotW=W-left-right,liveX=W-right-92,historicalEnd=snapshot?liveX-80:W-right;
 const d0=Date.parse(rows[0].date),d1=Date.parse(rows.at(-1).date);
 const x=d=>left+(Date.parse(d)-d0)/(d1-d0)*(historicalEnd-left),y=v=>top+(hi-v)/(hi-lo)*plotH;
 const path=rows.map((p,i)=>`${i?'L':'M'}${x(p.date).toFixed(1)},${y(p.close).toFixed(1)}`).join(' '),last=rows.at(-1);
 const grid=Array.from({length:Math.round((hi-lo)/step)+1},(_,i)=>lo+i*step).map(v=>`<line x1="${left}" y1="${y(v)}" x2="${W-right}" y2="${y(v)}" stroke="#dfe8f3" stroke-dasharray="3 5"/><text x="${W-right+9}" y="${y(v)+4}" fill="#7890ac" font-size="16">${v.toFixed(2)}</text>`).join('');
 const ticks=[rows[0],rows[4],rows[9],rows[14],last].map((r,i)=>`<text x="${x(r.date)}" y="${H-12}" fill="#7890ac" font-size="16" text-anchor="${i===0?'start':i===4?'end':'middle'}">${r.date.slice(5).replace('-','/')}</text>`).join('');
 const points=rows.map(p=>`<circle class="chart-point" cx="${x(p.date)}" cy="${y(p.close)}" r="3.4" fill="#1678ed"><title>${p.date} · ${t('港元','HKD')} ${p.close.toFixed(3)}</title></circle>`).join('');
 const candle=rows.map(p=>{const color=p.close>=p.open?'#009a85':'#e16c77';return `<g><title>${p.date} · ${t('開市','O')} ${p.open} ${t('最高','H')} ${p.high} ${t('最低','L')} ${p.low} ${t('收市','C')} ${p.close}</title><line x1="${x(p.date)}" x2="${x(p.date)}" y1="${y(p.high)}" y2="${y(p.low)}" stroke="${color}" stroke-width="1.4"/><rect x="${x(p.date)-7}" y="${Math.min(y(p.open),y(p.close))}" width="14" height="${Math.max(2,Math.abs(y(p.open)-y(p.close)))}" rx="1" fill="${color}"/></g>`;}).join('');
 const liveCandle=snapshot?(()=>{const color=snapshot.last>=snapshot.open?'#009a85':'#e16c77';return `<g class="live-snapshot-candle"><title>${marketSnapshotConfig.symbol} · ${snapshot.updateTime} · ${t('開市','Open')} ${marketNumber(snapshot.open)} ${t('最高','High')} ${marketNumber(snapshot.high)} ${t('最低','Low')} ${marketNumber(snapshot.low)} ${t('現價','Last')} ${marketNumber(snapshot.last)} ${marketSnapshotConfig.currency}</title><line x1="${liveX}" x2="${liveX}" y1="${y(snapshot.high)}" y2="${y(snapshot.low)}" stroke="${color}" stroke-width="2.5"/><rect x="${liveX-9}" y="${Math.min(y(snapshot.open),y(snapshot.last))}" width="18" height="${Math.max(3,Math.abs(y(snapshot.open)-y(snapshot.last)))}" rx="2" fill="${color}"/><text x="${liveX}" y="${H-12}" fill="#13785f" font-size="15" font-weight="700" text-anchor="middle">${t('即時','Live')}</text></g>`;})():'';
 const line=mode==='line'?`<path class="historical-area" d="${path} L${x(last.date)},${y(lo)} L${left},${y(lo)} Z" fill="url(#chart-fill)"/><path class="historical-close-line" d="${path}" fill="none" stroke="#1678ed" stroke-width="3" stroke-linejoin="round"/>${points}`:candle;
 const liveDivider=snapshot?`<line x1="${liveX-42}" x2="${liveX-42}" y1="${top}" y2="${H-bottom+3}" stroke="#92a8be" stroke-width="1.5" stroke-dasharray="5 5"/><text x="${liveX}" y="${top-8}" fill="#13785f" font-size="14" font-weight="700" text-anchor="middle">${t('即時快照','LIVE SNAPSHOT')} · ${marketSnapshotConfig.symbol}</text>`:'';
 const aria=t(snapshot?`7709.HK 歷史價格及獨立即時快照；即時快照時間 ${snapshot.updateTime}，幣別 ${marketSnapshotConfig.currency}。`:'7709.HK 歷史價格；即時行情載入中。',snapshot?`7709.HK historical prices and a separate live snapshot at ${snapshot.updateTime}, in ${marketSnapshotConfig.currency}.`:'7709.HK historical prices; live snapshot loading.');
 return `<svg class="p-price-chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria}"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#1688ee" stop-opacity=".22"/><stop offset="1" stop-color="#1688ee" stop-opacity=".01"/></linearGradient></defs>${grid}${line}${ticks}${liveDivider}${liveCandle}</svg>`;
}
function marketPanel(){
 const last=HISTORY.prices.at(-1),prev=HISTORY.prices.at(-2),change=last.close-prev.close;
 const from=HISTORY.prices[0].date,to=last.date;
 const formatDate=date=>date.slice(0,4)+'.'+date.slice(5,7)+'.'+date.slice(8,10);
 return `<div class="market-panel"><div class="market-head"><div><div class="market-security"><span>7709</span><div><b>${t('港交所','HKEX')} · ${marketSnapshotConfig.symbol}</b><small>${t('南方東英 SK 海力士每日槓桿最多（2x）產品','CSOP SK Hynix Daily Max (2x) Leveraged Product')}</small></div></div><div class="market-price"><b data-market-price>${marketNumber(last.close)}</b><span>${t('港元',marketSnapshotConfig.currency)}</span></div><div class="market-change${change<0?' is-negative':''}" data-market-change><span data-market-change-value>${marketChange(last.close,prev.close)}</span> <span data-market-change-label>${t('較前一筆收市價','vs. prior available close')}</span></div></div><div class="market-status"><span id="market-live-status" role="status" aria-live="polite">◷ ${t('載入即時行情中','Loading live snapshot')}</span><p id="market-live-time">${t(`歷史收市快照：${to}。載入即時資料中。`,`Historical close: ${to}. Loading live data.`)}</p></div></div><div class="chart-tools"><div class="chart-period">${t('已取得交易日','Available trading days')} <b>${formatDate(from)} — ${formatDate(to).slice(5)}</b></div><div class="chart-switch" role="group" aria-label="${t('圖表類型','Chart type')}"><button data-chart="line" class="selected" aria-pressed="true">${t('走勢','Line')}</button><button data-chart="candle" aria-pressed="false">${t('K 線','Candles')}</button></div></div><div class="chart-area" id="price-chart">${priceChart()}</div><div class="market-stats">${[[t('開市','Open'),marketNumber(last.open),'open'],[t('最高','High'),marketNumber(last.high),'high'],[t('最低','Low'),marketNumber(last.low),'low'],[t('成交量','Volume'),marketVolume(last.volume),'volume']].map(r=>`<div><small>${r[0]}</small><strong data-market-stat="${r[2]}">${r[1]}</strong></div>`).join('')}</div><div class="chart-source">${t('來源：','Source: ')}<a href="https://finance.yahoo.com/quote/7709.HK/history/" target="_blank" rel="noopener">${t('Yahoo 財經','Yahoo Finance')}</a> · ${t('底層上市產品價格，並非 SKHY2Lw 代幣成交價。線段連接已取得的歷史報價，不補算缺失日期。','Underlying listed-product prices, not SKHY2Lw token execution prices. Lines connect available historical observations; missing dates are not imputed.')}</div><details class="chart-data"><summary>${t('查看圖表數據','View chart data')} <span>↓</span></summary><div class="chart-table-scroll"><table><thead><tr><th>${t('日期','Date')}</th><th>${t('收市價（港元）','Close (HKD)')}</th><th>${t('成交量','Volume')}</th></tr></thead><tbody>${HISTORY.prices.map(p=>`<tr><td>${p.date}</td><td>${p.close.toFixed(3)}</td><td>${p.volume.toLocaleString('en-US')}</td></tr>`).join('')}</tbody></table></div></details></div>`;
}
function validateMarketSnapshot(data){
 const config=marketSnapshotConfig;
 if(!config||typeof config.endpoint!=='string'||new URL(config.endpoint).protocol!=='https:'||typeof config.code!=='string'||!config.symbol||!config.currency||!Number.isInteger(config.priceDecimals)||config.priceDecimals<0||config.priceDecimals>6||!Number.isFinite(config.axisMin)||!Number.isFinite(config.axisMax)||config.axisMax<=config.axisMin||!Number.isFinite(config.axisStep)||config.axisStep<=0||!Number.isFinite(config.timeoutMs)||config.timeoutMs<=0)throw new Error('Invalid market snapshot configuration');
 if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Snapshot payload must be an object');
 if(data.code!==config.code)throw new Error(`Unexpected market code: ${String(data.code)}`);
 const fields=['last_price','open_price','high_price','low_price','prev_close','volume'];
 if(fields.some(field=>typeof data[field]!=='number'||!Number.isFinite(data[field])))throw new Error('Snapshot contains a non-finite numeric field');
 if(data.last_price<=0||data.open_price<=0||data.high_price<=0||data.low_price<=0||data.prev_close<=0||data.volume<0||data.low_price>Math.min(data.open_price,data.last_price)||data.high_price<Math.max(data.open_price,data.last_price)||data.low_price>data.high_price)throw new Error('Snapshot OHLC or volume relationship is invalid');
 const match=/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(data.update_time||'');
 if(!match)throw new Error('Snapshot update time has an invalid format');
 const [,year,month,day,hour,minute,second]=match.map(Number);
 const date=new Date(Date.UTC(year,month-1,day,hour,minute,second));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day||date.getUTCHours()!==hour||date.getUTCMinutes()!==minute||date.getUTCSeconds()!==second)throw new Error('Snapshot update time is invalid');
 return {last:data.last_price,open:data.open_price,high:data.high_price,low:data.low_price,prevClose:data.prev_close,volume:data.volume,updateTime:`${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')} ${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:${String(second).padStart(2,'0')} HKT`};
}
function isCurrentMarketSnapshot(requestId,chart){return requestId===marketSnapshotRequestId&&document.body.dataset.page==='product'&&chart.isConnected&&document.getElementById('price-chart')===chart;}
function setMarketSnapshotStatus(state,label,message){const status=document.getElementById('market-live-status'),time=document.getElementById('market-live-time');if(status){status.dataset.state=state;status.textContent=label;}if(time)time.textContent=message;}
function cancelMarketSnapshot(){marketSnapshotRequestId++;liveMarketSnapshot=null;activeMarketSnapshotController?.abort();activeMarketSnapshotController=null;}
async function loadMarketSnapshot(){
 const requestId=++marketSnapshotRequestId;
 liveMarketSnapshot=null;
 const chart=document.getElementById('price-chart');
 if(document.body.dataset.page!=='product'||!chart)return;
 setMarketSnapshotStatus('loading',`◷ ${t('載入即時行情中','Loading live snapshot')}`,t('歷史圖表可用；正在讀取 7709.HK 即時快照。','Historical data remains available while the 7709.HK snapshot loads.'));
 const controller=new AbortController();
 activeMarketSnapshotController=controller;
 const timeout=setTimeout(()=>controller.abort(),marketSnapshotConfig?.timeoutMs||6000);
 try{
  const response=await fetch(marketSnapshotConfig.endpoint,{method:'GET',headers:{Accept:'application/json'},cache:'no-store',credentials:'omit',redirect:'error',signal:controller.signal});
  if(!response.ok)throw new Error(`Market snapshot HTTP ${response.status}`);
  let payload;
  try{payload=await response.json();}catch(error){throw new Error('Market snapshot response is not valid JSON',{cause:error});}
  const snapshot=validateMarketSnapshot(payload);
  if(!isCurrentMarketSnapshot(requestId,chart))return;
  liveMarketSnapshot=snapshot;
  const price=document.querySelector('[data-market-price]'),change=document.querySelector('[data-market-change-value]'),changeContainer=document.querySelector('[data-market-change]'),changeLabel=document.querySelector('[data-market-change-label]');
  if(price)price.textContent=marketNumber(snapshot.last);
  if(change)change.textContent=marketChange(snapshot.last,snapshot.prevClose);
  if(changeContainer)changeContainer.classList.toggle('is-negative',snapshot.last<snapshot.prevClose);
  if(changeLabel)changeLabel.textContent=t('較前收市價','vs. previous close');
  for(const [key,value]of Object.entries({open:snapshot.open,high:snapshot.high,low:snapshot.low,volume:snapshot.volume})){const node=document.querySelector(`[data-market-stat="${key}"]`);if(node)node.textContent=key==='volume'?marketVolume(value):marketNumber(value);}
  setMarketSnapshotStatus('live',`◷ ${t('即時快照','LIVE SNAPSHOT')}`,`${t('更新時間','Updated')}: ${snapshot.updateTime} · ${marketSnapshotConfig.currency}`);
  chart.innerHTML=priceChart(document.querySelector('.chart-switch button.selected')?.dataset.chart||'line',snapshot);
 }catch(error){
  if(!isCurrentMarketSnapshot(requestId,chart))return;
  console.error('Unable to load 7709.HK market snapshot',error);
  setMarketSnapshotStatus('error',`⚠ ${t('即時行情暫不可用','LIVE SNAPSHOT UNAVAILABLE')}`,t('目前顯示歷史資料；即時快照載入失敗。','Showing historical data only; the live snapshot could not be loaded.'));
 }finally{clearTimeout(timeout);if(activeMarketSnapshotController===controller)activeMarketSnapshotController=null;}
}
function productMarket(){return `<section class="p-section" id="product-market"><div class="wrap"><div class="p-section-heading"><div><div class="eyebrow">${t('底層行情','Underlying market')}</div><h2>${t('底層市場價格可作為代幣估值參考，<br>代幣成交價可能與之不同。','Underlying market prices provide a reference for token valuation;<br>token execution prices may differ.')}</h2></div></div>${marketPanel()}<div class="p-market-notes" role="note"><p><span class="market-note-number" aria-hidden="true">1.</span><strong>${t('底層產品按港股市場時段交易。','The underlying product follows Hong Kong market hours.')}</strong> ${t('圖表為 7709.HK 歷史行情，並非 SKHY2Lw 的二級市場報價。','The chart shows 7709.HK historical prices, not SKHY2Lw secondary-market quotations.')}</p><p><span class="market-note-number" aria-hidden="true">2.</span><strong>${t('代幣成交價可偏離指示價值。','Token execution prices may differ from indicative value.')}</strong> ${t('非底層交易時段的估值僅供指示；報價、交易及申贖可受限制或暫停。','Values outside underlying trading hours are indicative. Quotations, trading and creation or redemption may be limited or suspended.')}</p></div></div></section>`;}
function productMarket(){return `<section class="p-section" id="product-market"><div class="wrap"><div class="p-section-heading"><div><div class="eyebrow">${t('底層行情','Underlying market')}</div><h2>${t('底層市場價格可作為代幣估值參考，<br>代幣成交價可能與之不同。','Underlying market prices provide a reference for token valuation;<br>token execution prices may differ.')}</h2></div></div>${marketPanel()}<div class="p-market-notes" role="note"><p><span class="market-note-number" aria-hidden="true">1.</span><strong>${t('底層產品按港股市場時段交易。','The underlying product follows Hong Kong market hours.')}</strong> ${t('圖表為 7709.HK 歷史行情，並非 SKHY2Lw 的二級市場報價。','The chart shows 7709.HK historical prices, not SKHY2Lw secondary-market quotations.')}</p><p><span class="market-note-number" aria-hidden="true">2.</span><strong>${t('代幣成交價可偏離指示價值。','Token execution prices may differ from indicative value.')}</strong> ${t('非底層交易時段的估值僅供指示；報價、交易及申贖可受限制或暫停。','Values outside underlying trading hours are indicative. Quotations, trading and creation or redemption may be limited or suspended.')}</p></div></div></section>`;}
function productTerms() {
 const facts = [
  [t('代幣代碼','Ticker'), 'SKHY2Lw'],
  [t('發行架構／網絡','Structure / network'), 'BVI / Solana'],
  [t('完整產品名稱','Product name'), 'WAGMIx SK Hynix Daily Max (2x)'],
  [t('底層參考資產','Underlying reference asset'), t('南方東英 SK 海力士每日槓桿最多（2x）產品（7709.HK）','CSOP SK Hynix Daily Max (2x) Leveraged Product (7709.HK)')],
  [t('票據性質','Instrument'), t('永續、無抵押、非後償票據','Perpetual, unsecured, unsubordinated Notes')],
  [t('計價貨幣','Denomination'), 'USDT / USDC'],
  [t('計劃交易對','Planned trading pairs'), t(
   'SKHY2Lw/USDT、SKHY2Lw/USDC；實際上線時間及交易對以交易場所支持及公告為準。',
   'SKHY2Lw/USDT and SKHY2Lw/USDC; availability and launch timing are subject to venue support and announcements.'
  )],
  [t('交收與交易時段','Settlement and trading hours'), t(
   '一級申贖於港股交易時段內外均可進行 T0 交收³。二級市場全天候交易。',
   'Primary subscriptions and redemptions are eligible for T0 settlement³ both during and outside of Hong Kong market hours. Secondary trading is available 24/7.'
  )],
  [t('一級申購','Primary subscriptions'), t(
   '獲發行人批准的投資者可透過參與交易商（PD），以現金、支持的穩定幣或合資格資產實物申購。',
   'Issuer-approved investors may subscribe in cash, supported stablecoins or in kind with eligible assets via a Participating Dealer (“PD”).'
  )],
  [t('受控鑄造','Controlled minting'), t(
   '全額收到已結清款項或適用的合資格資產，並滿足發行及交收條件後，方受控鑄造及交付代幣。每枚代幣代表一份票據。',
   'Tokens are minted under controlled permissions and delivered only after receipt in full of cleared funds or applicable eligible assets and satisfaction of issuance and settlement conditions. Each token represents one Note.'
  )],
  [t('一級贖回','Primary redemptions'), t(
   '獲發行人批准的投資者可透過 PD，以現金、支持的穩定幣或合資格資產實物贖回。',
   'Issuer-approved investors may redeem in cash, supported stablecoins or in kind with eligible assets via a PD.'
  )],
  [t('一級申贖門檻','Primary minimum'), t(
   '一級市場每筆申購或贖回最低為 100,000 份票據；此門檻不適用於二級市場交易。最終交易文件另有指定或議定最低數量或倍數者除外。',
   'The minimum is 100,000 Notes per primary subscription or redemption (this minimum does not apply to secondary-market trades), unless another minimum or multiple is specified or agreed under the definitive transaction documents.'
  )],
  [t('資金費與一級申贖費','Funding and primary dealing fees'), t(
   '產品不收取資金費。獲發行人批准的投資者每次申購及贖回各支付 0.10% 的費用。',
   'The product charges no funding fee. Issuer-approved investors pay 0.10% on each subscription and 0.10% on each redemption.'
  )],
  [t('託管費','Custody fee'), t(
   '按託管底層資產計收每年 0.25% 的託管費。較低費率須逐案獲批。',
   'A 0.25% per annum custody fee is based on the Underlying Asset under Custody. Lower fees are subject to approval on a case-by-case basis.'
  )],
  [t('發行人','Issuer'), t('Cocoa Issuer Limited · 英屬維爾京群島特殊目的公司','Cocoa Issuer Limited · BVI SPV')],
  [t('底層資產託管','Underlying asset custody'), t(
   '復星國際證券有限公司作為持牌券商承擔託管職責，持有底層 7709.HK 單位，以實際持倉提供 1:1 支持。',
   'Fosun International Securities Limited, a licensed broker acting as custodian, holds the underlying 7709.HK units, with actual holdings providing 1:1 backing.'
  )],
  [t('代幣化平台','Tokenization platform'), t(
   'WAGMIx 全天候代幣化平台負責全流程代幣化架構及營運。',
   'WAGMIx, the 24/7 tokenization platform, handles the end-to-end tokenization structuring and operations.'
  )],
  [t('技術支持','Technology support'), t(
   'Finloop Finance Limited 提供技術支持。',
   'Finloop Finance Limited provides technology support.'
  )],
  [t('適用法律','Governing law'), t('英格蘭法律','English law')]
 ];
 return `<section class="p-section" id="product-terms">
  <div class="wrap">
   <div class="p-section-heading"><div>
    <div class="eyebrow">${t('產品資料與權利','Product details & rights')}</div>
    <h2>${t('產品條款界定代幣參數與持有人權利。','The product terms define token parameters and holder rights.')}</h2>
   </div><p>${t('下列產品摘要已按最新版產品單頁更新。白皮書原文保持原版本；如文件版本存在差異，須核對最終交易文件。','This product summary reflects the latest factsheet. The white paper is retained in its original version; any differences between versions should be checked against the definitive transaction documents.')}</p></div>
   <div class="p-terms-grid">
    <div class="p-facts"><h3>${t('產品參數以最終交易文件為準。','Definitive transaction documents govern the product terms.')}</h3>
     <dl>${facts.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>
    </div>
    <div class="p-rights"><span class="p-small-label">${t('持有人權利','HOLDER RIGHTS')}</span>
     <h3>${t('每枚代幣代表一份無抵押票據。','Each token represents one unsecured Note.')}</h3>
     <div class="p-rights-count"><span>1 <small>${t('代幣','Token')}</small></span><i>=</i><span>1 <small>${t('票據','Note')}</small></span></div>
     <p>${t('持有人享有與 7709.HK 掛鈎的合約經濟利益，可透過獲批參與交易商申請贖回，亦可在適用轉讓限制下全天候轉讓代幣。','Holders receive contractual economic benefits linked to 7709.HK. They may request redemption through an approved PD and transfer their tokens around the clock, subject to applicable transfer restrictions.')}</p>
     <p>${t('持有人並不取得底層 7709.HK 單位的所有權或實益權益。發行人可持有 7709.HK 單位、現金或現金等價物作對沖及營運用途。該等資產不構成票據抵押，亦不為持有人設置信託。權利、贖回及交收均須遵守最終交易文件。','Holders do not acquire ownership or a beneficial interest in the underlying 7709.HK units. The issuer may hold 7709.HK units, cash or cash equivalents for hedging and operations. These assets do not secure the Notes and are not held on trust for holders. Rights, redemption and settlement remain subject to the definitive transaction documents.')}</p>
     <a class="text-link" href="#/whitepaper/rights">${t('閱讀持有人權利','Read holder rights')} ↗</a>
    </div>
   </div>
  </div>
 </section>`;
}

function productWhitepaper(prefix='product'){return `<section class="p-section" id="${prefix}-whitepaper"><div class="wrap"><div class="p-paper-intro"><div><span class="eyebrow">${t('產品文件','Product documents')}</span><h2>${t('按章閱讀白皮書，了解完整條款。','Read the white paper by chapter to understand the full terms.')}</h2><p>${t('白皮書按章節說明產品、交易安排、持有人權利、技術及風險，網頁提供導讀及中英節選，完整條款見英文 PDF。','The white paper covers the product, trading, rights, technology and risks by chapter. Read chapter guides and selected excerpts; download the English white paper for the complete terms.')}</p><div class="p-document-actions"><a class="btn" href="#/whitepaper/summary">${t('閱讀產品白皮書','Read the Product White Paper')} ${arrow}</a>${downloadLink('whitepaper',t('下載白皮書','Download White Paper'))}</div><span class="p-download-language">${t('白皮書下載：英文原文 · PDF','White paper download: English original · PDF')}</span></div><div class="p-paper-cover"><img class="paper-logo brand-plate" src="${LOGO}" alt="WAGMIx"><b>SKHY2Lw</b><strong>${t('產品<br>白皮書','Product<br>White Paper')}</strong><div>${t('產品白皮書','PRODUCT WHITE PAPER')} <i>↗</i></div></div></div><div class="p-paper-tiles">${[['token',t('代幣與參考資產','Token & reference asset'),t('每枚代幣代表一份票據，並不賦予 7709 的所有權。','Each Token represents one Note and does not confer ownership of 7709.')],['offer',t('申贖、交易與定價','Creation, trading & pricing'),t('一級申贖須經獲批 PD，二級成交價可偏離指示價值。','Primary access requires approved PDs; secondary prices may differ from indicative value.')],['rights',t('持有人權利','Holder rights'),t('權利及贖回程序由最終交易文件界定。','Definitive transaction documents govern rights and redemption procedures.')],['risks',t('投資及營運風險','Investment & operational risks'),t('槓桿、發行人信用及交易中斷均可能導致損失。','Leverage, issuer credit and trading disruptions may cause loss.')]].map((r,i)=>`<a href="#/whitepaper/${r[0]}"><span>0${i+1} <i>↗</i></span><h3>${r[1]}</h3><p>${r[2]}</p></a>`).join('')}</div><p class="p-source-notes">${t('中文譯文僅供參考；如與英文原文存在任何歧義或不一致，概以英文原文為準。產品權利義務及文件適用順序，依最終交易文件的約定確定。','The Chinese translation is for reference only. In the event of ambiguity or inconsistency, the English original prevails. Product rights, obligations and document precedence are governed by the definitive transaction documents.')}</p></div></section>`;}
