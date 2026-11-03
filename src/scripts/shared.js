const L = document.documentElement.lang === 'en' ? 'en' : 'zh';
const t = (zh,en) => L==='zh'?zh:en;
const pick = x => x[L];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span class="arrow" aria-hidden="true">↗</span>';
const localLink=(path)=>'#/'+path;
const chapterNames={information:t('閱讀前須知','Before you read'),summary:t('產品總覽','Product summary'),issuer:t('發行人與服務機構','Issuer & service providers'),token:t('代幣與參考資產','Token & reference asset'),offer:t('申贖、交易與定價','Creation, trading & pricing'),rights:t('持有人權利','Holder rights'),technology:t('技術、控制與費用','Technology, controls & fees'),risks:t('投資及營運風險','Investment & operational risks'),roadmap:t('發展規劃','Roadmap'),disclaimer:t('免責聲明','Disclaimer')};
const shortRefs=['01','02','A','B','C','D','E','F','G','10'];
const primarySettlementTerms = t(
  '合資格專業投資者的一級申購及贖回須經獲批參與交易商（PD）辦理。T0 交收僅適用於香港交易時段內的貨銀對付（DvP）安排。休市或無法可靠估值或交收時，交收順延。',
  'Eligible professional investors subscribe and redeem through approved participating dealers (PDs). T0 settlement applies only during Hong Kong trading hours under delivery versus payment (DvP). Settlement is deferred when the market is closed or reliable valuation or settlement is unavailable.'
);
const t0 = '³ ' + t(
  '二級市場支援全天候交易，須遵守交易平台規則。',
  'Secondary trading is available around the clock, subject to venue rules. '
) + primarySettlementTerms + t(
  '香港交易時段以外的參考價格僅供參考。',
  ' Prices outside Hong Kong trading hours are indicative.'
);
function icon(i){const paths=[`<path d="M5 27V6m0 21h24M10 20l6-7 6 3 7-10"/><path d="M23 6h6v6"/>`,`<rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="23" width="8" height="8" rx="1"/><rect x="23" y="23" width="8" height="8" rx="1"/><path d="M17 11v6M7 23v-6h20v6"/>`,`<path d="M4 9h18M4 17h26M4 25h14"/><path d="M26 5v8M14 21v8"/>`,`<path d="M17 3l12 5v9c0 7-12 14-12 14S5 24 5 17V8z"/><path d="M11 17l4 4 8-9"/>`,`<circle cx="17" cy="17" r="13"/><path d="M17 8v10l7 4M3 5l3 5M28 25l3 5"/>`];return `<svg viewBox="0 0 34 34" aria-hidden="true">${paths[i]}</svg>`;}

function displayChapterRef(chapter){const zh={information:'資訊及必要聲明',summary:'摘要',issuer:'A 部分',token:'B 部分',offer:'C 部分',rights:'D 部分',technology:'E 部分',risks:'F 部分',roadmap:'G 部分',disclaimer:'免責聲明'};return L==='zh'?(zh[chapter.id]||chapter.ref):chapter.ref;}

// Source values remain in content-map.json; only these semantic orders control display.
const CAPABILITIES=SITE_CONFIG.capabilityOrder.map(id=>CONTENT.capabilities.find(c=>c.id===id));
const PRODUCT_FEATURES=SITE_CONFIG.featureOrder.map(id=>CONTENT.sellingPoints.find(c=>c.id===id));
SITE_CONFIG.downloads={whitepaper:{href:WHITEPAPER_DOWNLOAD,filename:SITE_CONFIG.downloadFiles.whitepaper},factsheet:{zh:{href:FACTSHEET_ZH_DOWNLOAD,filename:SITE_CONFIG.downloadFiles.factsheetZh},en:{href:FACTSHEET_EN_DOWNLOAD,filename:SITE_CONFIG.downloadFiles.factsheetEn}}};
function downloadLink(kind,label,className='btn secondary'){const file=kind==='factsheet'?SITE_CONFIG.downloads.factsheet[L]:SITE_CONFIG.downloads.whitepaper;const base=document.querySelector('meta[name="wagmix-download-base"]')?.content;const href=base?base+file.filename:file.href;return `<a class="${esc(className)}" href="${esc(href)}" download="${esc(file.filename)}" data-download="${esc(kind)}">↓ ${label}</a>`;}

// Marketing launch labels share one configuration. Formal white-paper dates are locked separately.
function launchDateLabel(format='long'){const [year,month,day]=SITE_CONFIG.launchDate.split('-').map(Number);if(format==='numeric')return SITE_CONFIG.launchDate.replaceAll('-','.');if(L==='zh')return `${year} 年 ${month} 月 ${day} 日`;const months=format==='short'?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']:['January','February','March','April','May','June','July','August','September','October','November','December'];return `${day} ${months[month-1]} ${year}`;}
