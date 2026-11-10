/*
 * A dismissible jurisdiction notice, not an access-control or eligibility check.
 * Offline preview does not read an IP. Live detection requires a trusted,
 * same-origin HTTPS endpoint returning only { country: "US" }.
 */
const geoConfig = Object.freeze({mode:'preview',endpoint:'',restrictedCountries:['US'],noticeVersion:'2026-11-06-v1',timeoutMs:6000,...(SITE_CONFIG.geoAccess || {})});
const geoIsPreview = geoConfig.mode === 'preview';
const geoCountryCodes = new Set(('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' '));
const geoPreviewQuery = geoIsPreview ? ((location.search || '').match(/[?&]geoPreview=(NOTICE|US|ALLOW|UNKNOWN)(?:&|$)/)?.[1] || 'ALLOW') : null;
let geoPreviewState = geoPreviewQuery === 'US' ? 'NOTICE' : geoPreviewQuery;
let geoState = {status:geoIsPreview ? 'allowed' : 'checking',country:null};
let geoModalOpen = false;
let geoInlineOpen = false;
let geoRequest = 0;
let geoReturnFocus = null;
let geoAppliedModal = false;
const geoAcknowledgements = new Set();
const geoRoot = document.getElementById('geo-root');

function geoLanguageHref() {
  const file = (L === 'zh' ? 'WAGMIx_English_' : 'WAGMIx_繁體中文_') + SITE_CONFIG.version + '.html';
  const query = geoIsPreview ? '?geoPreview=' + geoPreviewState : '';
  return file + query + (location.hash || '#/');
}

function geoDecision(country) {
  if (typeof country !== 'string' || !geoCountryCodes.has(country)) return {status:'error',country:null};
  const restricted = Array.isArray(geoConfig.restrictedCountries) ? geoConfig.restrictedCountries : ['US'];
  return {status:restricted.includes(country) ? 'restricted' : 'allowed',country};
}

// Kept as a compatibility helper; this only describes an open ordinary modal.
function geoBlocked() { return geoModalOpen; }

function geoNoticeKey(country) {
  return 'wagmix:jurisdiction-notice:' + geoConfig.noticeVersion + ':' + country;
}
function geoHasAcknowledged(country) {
  if (!geoCountryCodes.has(country)) return false;
  const key = geoNoticeKey(country);
  if (geoAcknowledgements.has(key)) return true;
  try {
    if (globalThis.sessionStorage?.getItem(key) === '1') {
      geoAcknowledgements.add(key);
      return true;
    }
  } catch (_) { /* In-memory acknowledgement remains available. */ }
  return false;
}
function geoRememberNotice(country) {
  if (!geoCountryCodes.has(country)) return;
  const key = geoNoticeKey(country);
  geoAcknowledgements.add(key);
  try { globalThis.sessionStorage?.setItem(key,'1'); }
  catch (_) { /* Storage can be unavailable for offline files or private browsing. */ }
}

function geoPreviewControls(inDialog=false) {
  if (!geoIsPreview) return '';
  return `<aside class="geo-preview ${inDialog ? 'geo-preview-in-dialog' : 'geo-preview-floating'}" aria-label="${t('地區提示演示控制','Jurisdiction notice demo controls')}">
    <span class="geo-preview-label"><i aria-hidden="true"></i>${t('演示模式 · 未檢測實際IP','Demo mode · No live IP detection')}</span>
    <div class="geo-preview-options" role="group" aria-label="${t('切換模擬情境','Select a simulated scenario')}">
    ${[['ALLOW',t('正常瀏覽','Browse')],['NOTICE',t('地區提示','Notice')],['UNKNOWN',t('檢測失敗','Unavailable')]].map(([key,label]) => `<button type="button" data-geo-preview="${key}" aria-pressed="${geoPreviewState === key}">${label}</button>`).join('')}
    </div>
  </aside>`;
}

function geoTitle() { return t('地區提示','Jurisdiction Notice'); }
function geoMessage() {
  return t(
    '本網站所述產品及服務並非面向位於受限制司法管轄區的人士。本網站的任何內容均不應被解讀為向該等地區的任何人士作出要約或招攬。',
    'The products and services described on this website are not intended for persons located in restricted jurisdictions. Nothing on this website is intended to constitute an offer or solicitation to persons in those jurisdictions.'
  );
}
function geoEligibilityMessage() {
  return t('瀏覽本網站並不代表您符合任何產品或服務的參與資格。','Access to this website does not establish eligibility for any product or service.');
}
function geoErrorMarkup() {
  if (!geoInlineOpen) return '';
  return `<aside class="geo-inline-notice ${geoIsPreview ? 'geo-inline-preview' : ''}" aria-label="${t('地區檢測提示','Region detection notice')}">
    <button class="geo-inline-close" type="button" data-geo-dismiss-error aria-label="${t('關閉提示','Dismiss notice')}">×</button>
    <p role="status" aria-live="polite">${t('暫時無法確認您的連線地區，您仍可繼續瀏覽。','Your connection region could not be checked. You may continue browsing.')}</p>
    <button class="geo-inline-retry" type="button" data-geo-retry>${t('重新檢測','Retry')}</button>
  </aside>`;
}
function geoMarkup() {
  if (!geoModalOpen) return geoErrorMarkup() + geoPreviewControls();
  return `<div class="geo-overlay" data-geo-backdrop><section class="geo-dialog" role="dialog" aria-modal="true" aria-labelledby="geo-title" aria-describedby="geo-description geo-eligibility">
    <div class="geo-dialog-top"><img class="geo-logo" src="${LOGO}" alt="WAGMIx"><div class="geo-dialog-controls"><a class="geo-language" href="${geoLanguageHref()}" lang="${L === 'zh' ? 'en' : 'zh-Hant'}">${t('EN','繁中')}</a><button class="geo-close" type="button" data-geo-dismiss aria-label="${t('關閉提示','Dismiss notice')}">×</button></div></div>
    <div class="geo-warning" aria-hidden="true">!</div>
    <h2 id="geo-title" tabindex="-1">${geoTitle()}</h2>
    <p id="geo-description">${geoMessage()}</p>
    <p class="geo-eligibility" id="geo-eligibility">${geoEligibilityMessage()}</p>
    <div class="geo-actions"><button class="geo-primary" type="button" data-geo-dismiss>${t('我已了解','I Understand')}</button></div>
    <div class="geo-contact-links"><a href="https://x.com/WAGMIx_Official" target="_blank" rel="noopener noreferrer">X</a><span aria-hidden="true">·</span><a href="https://t.me/wagmix" target="_blank" rel="noopener noreferrer">Telegram</a><span aria-hidden="true">·</span><a href="mailto:info@wagmix.com">info@wagmix.com</a></div>
    ${geoPreviewControls(true)}
  </section></div>`;
}

function geoSyncPageState() {
  if (!geoRoot) return;
  const app = document.getElementById('app');
  if (app) {
    app.inert = geoModalOpen;
    if (geoModalOpen) app.setAttribute('aria-hidden','true'); else app.removeAttribute('aria-hidden');
  }
  document.body.classList.toggle('geo-modal-open',geoModalOpen);
  document.body.dataset.geoStatus = geoState.status;
  const switcher = document.getElementById('language-switch');
  if (switcher) switcher.href = geoLanguageHref();
  const dialogSwitcher = geoRoot.querySelector('.geo-language');
  if (dialogSwitcher) dialogSwitcher.href = geoLanguageHref();
}
function geoRestoreFocus() {
  if (geoReturnFocus?.isConnected && geoReturnFocus !== document.body && geoReturnFocus !== document.documentElement) geoReturnFocus.focus({preventScroll:true});
  else {
    const main = document.getElementById('main');
    if (main) { main.setAttribute('tabindex','-1'); main.focus({preventScroll:true}); }
  }
  geoReturnFocus = null;
}
function geoRender({focus=true}={}) {
  if (!geoRoot) return;
  const wasOpen = geoAppliedModal;
  if (geoModalOpen && !wasOpen) geoReturnFocus = document.activeElement === document.body || document.activeElement === document.documentElement ? null : document.activeElement;
  geoSyncPageState();
  geoRoot.innerHTML = geoMarkup();
  geoAppliedModal = geoModalOpen;
  if (geoModalOpen && (focus || !wasOpen)) document.getElementById('geo-title')?.focus({preventScroll:true});
  else if (!geoModalOpen && wasOpen) geoRestoreFocus();
}
function geoDismissNotice() {
  if (!geoModalOpen) return false;
  geoRememberNotice(geoState.country);
  geoModalOpen = false;
  geoRender();
  return true;
}
function geoDismissError() {
  if (!geoInlineOpen) return false;
  const focusedInside = geoRoot?.querySelector('.geo-inline-notice')?.contains(document.activeElement);
  geoInlineOpen = false;
  geoRender({focus:false});
  if (focusedInside) geoRestoreFocus();
  return true;
}
function geoApplyDecision(decision,{focus=true,forceNotice=false}={}) {
  geoState = decision;
  geoModalOpen = decision.status === 'restricted' && (forceNotice || !geoHasAcknowledged(decision.country));
  geoInlineOpen = decision.status === 'error';
  geoRender({focus});
}
function geoSetPreview(value,{focus=true,forceNotice=false}={}) {
  if (!geoIsPreview || !['US','NOTICE','ALLOW','UNKNOWN'].includes(value)) return false;
  geoPreviewState = value === 'US' ? 'NOTICE' : value;
  const decision = geoPreviewState === 'NOTICE' ? {status:'restricted',country:'US'} : geoPreviewState === 'UNKNOWN' ? {status:'error',country:null} : {status:'allowed',country:null};
  geoApplyDecision(decision,{focus,forceNotice});
  return true;
}

async function geoCheck() {
  if (geoIsPreview) { geoSetPreview(geoPreviewState); return; }
  const request = ++geoRequest;
  geoState = {status:'checking',country:null};
  geoModalOpen = false;
  geoInlineOpen = false;
  geoRender({focus:false});
  let timeout;
  try {
    if (geoConfig.mode !== 'server' || typeof geoConfig.endpoint !== 'string' || !geoConfig.endpoint) throw new Error('No region endpoint');
    const endpoint = new URL(geoConfig.endpoint,location.href);
    if (endpoint.origin !== location.origin || endpoint.protocol !== 'https:') throw new Error('Region endpoint must use same-origin HTTPS');
    const controller = new AbortController();
    const duration = Number.isFinite(geoConfig.timeoutMs) ? Math.min(15000,Math.max(1000,geoConfig.timeoutMs)) : 6000;
    const timedOut = new Promise((_,reject) => { timeout = setTimeout(() => { controller.abort(); reject(new Error('Region request timed out')); },duration); });
    const response = await Promise.race([fetch(endpoint.href,{credentials:'same-origin',cache:'no-store',redirect:'error',headers:{Accept:'application/json'},signal:controller.signal}),timedOut]);
    if (!response.ok) throw new Error('Region request failed');
    const data = await Promise.race([response.json(),timedOut]);
    if (request !== geoRequest) return;
    geoApplyDecision(geoDecision(data?.country));
  } catch (_) {
    if (request !== geoRequest) return;
    geoApplyDecision({status:'error',country:null},{focus:false});
  } finally { clearTimeout(timeout); }
}

function geoKeyboard(event) {
  if (!geoRoot || !geoModalOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); geoDismissNotice(); return; }
  if (event.key !== 'Tab') return;
  const items = [...geoRoot.querySelectorAll('a[href],button:not([disabled])')].filter(node => node.getClientRects().length);
  if (!items.length) { event.preventDefault(); document.getElementById('geo-title')?.focus(); return; }
  const first = items[0],last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

if (geoRoot) {
  document.addEventListener('click',event => {
    const target = event.target;
    if (target === geoRoot.querySelector('[data-geo-backdrop]') || target.closest('[data-geo-dismiss]')) {
      if (geoRoot.contains(target)) { event.preventDefault(); geoDismissNotice(); }
      return;
    }
    const preview = target.closest('[data-geo-preview]');
    if (preview && geoRoot.contains(preview)) { event.preventDefault(); geoSetPreview(preview.dataset.geoPreview,{forceNotice:preview.dataset.geoPreview === 'NOTICE'}); return; }
    if (target.closest('[data-geo-dismiss-error]') && geoRoot.contains(target)) { event.preventDefault(); geoDismissError(); return; }
    if (target.closest('[data-geo-retry]') && geoRoot.contains(target)) { event.preventDefault(); geoCheck(); }
  },true);
  document.addEventListener('keydown',geoKeyboard,true);
  document.addEventListener('focusin',event => {
    if (geoModalOpen && !geoRoot.contains(event.target)) document.getElementById('geo-title')?.focus({preventScroll:true});
  },true);
  // Routes may replace #app, while this separately mounted dialog keeps its focus.
  window.addEventListener('hashchange',geoSyncPageState);
  if (geoIsPreview) geoSetPreview(geoPreviewState,{focus:false}); else geoCheck();
}
