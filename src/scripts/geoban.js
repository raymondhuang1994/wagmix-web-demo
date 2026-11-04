/*
 * The offline design defaults to explicitly labelled preview states.
 * Server mode requires a same-origin HTTPS endpoint returning { country: "US" }.
 * This UI is not an authorization boundary. The deployment must restrict the
 * HTML, APIs and downloads at the edge/origin before sending protected data.
 */
const geoConfig = Object.freeze({mode:'preview',endpoint:'',restrictedCountries:['US'],timeoutMs:6000,...(SITE_CONFIG.geoAccess || {})});
const geoIsPreview = geoConfig.mode === 'preview';
const geoCountryCodes = new Set(('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' '));
let geoPreviewState = geoIsPreview ? ((location.search || '').match(/[?&]geoPreview=(US|ALLOW|UNKNOWN)(?:&|$)/)?.[1] || 'ALLOW') : null;
let geoState = {status:geoIsPreview ? 'allowed' : 'checking',country:null};
let geoRequest = 0;
let geoReturnFocus = null;
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

function geoBlocked() { return geoState.status !== 'allowed'; }

function geoPreviewControls(inDialog=false) {
  if (!geoIsPreview) return '';
  return `<aside class="geo-preview ${inDialog ? 'geo-preview-in-dialog' : 'geo-preview-floating'}" aria-label="${t('地區限制演示控制','Region restriction demo controls')}">
    <span class="geo-preview-label"><i aria-hidden="true"></i>${t('演示模式 · 未檢測實際IP','Demo mode · No live IP detection')}</span>
    <div class="geo-preview-options" role="group" aria-label="${t('切換模擬情境','Select a simulated scenario')}">
    ${[['ALLOW',t('正常瀏覽','Allowed')],['US',t('美國限制','US restricted')],['UNKNOWN',t('檢測失敗','Unavailable')]].map(([key,label]) => `<button type="button" data-geo-preview="${key}" aria-pressed="${geoPreviewState === key}">${label}</button>`).join('')}
    </div>
  </aside>`;
}

function geoMessage() {
  if (geoState.status === 'checking') return t('正在確認您的連線地區，請稍候。','Checking your connection region. Please wait.');
  if (geoState.status === 'error') return t('暫時無法驗證您的連線地區。請重新檢測，或聯絡我們以獲取協助。','We are temporarily unable to verify your connection region. Please retry or contact us for assistance.');
  // Preserve the user-approved wording; IP location is not a declaration of nationality.
  if (geoState.country === 'US') return t(
    '本網站所載產品及服務並非面向位於美國的人士。本網站的任何內容均不應被解讀為向任何位於美國的人士作出招攬。',
    'The products and services on this website are not intended for individuals in the United States. Nothing on this website is intended to be construed as a solicitation of any individual in the United States.'
  );
  return t('本網站所載產品及服務並非面向您連線所在地區的人士。本網站的任何內容均不應被解讀為向該地區的任何人士作出招攬。','The products and services on this website are not intended for individuals in your connection region. Nothing on this website is intended to be construed as a solicitation of any individual in that region.');
}

function geoTitle() {
  return geoState.status === 'checking' ? t('正在確認連線地區','Checking your region') : geoState.status === 'error' ? t('暫時無法驗證地區','Unable to verify your region') : t('地區存取限制','Regional access restriction');
}

function geoMarkup() {
  if (!geoBlocked()) return geoPreviewControls();
  return `<div class="geo-overlay"><section class="geo-dialog" role="dialog" aria-modal="true" aria-labelledby="geo-title" aria-describedby="geo-description" aria-busy="${geoState.status === 'checking'}">
    <div class="geo-dialog-top"><img class="geo-logo" src="${LOGO_LIGHT}" alt="WAGMIx"><a class="geo-language" href="${geoLanguageHref()}" lang="${L === 'zh' ? 'en' : 'zh-Hant'}">${t('EN','繁中')}</a></div>
    <div class="geo-warning ${geoState.status === 'checking' ? 'is-checking' : ''}" aria-hidden="true">${geoState.status === 'checking' ? '·' : '!'}</div>
    <h2 id="geo-title" tabindex="-1">${geoTitle()}</h2>
    <p id="geo-description" aria-live="polite">${geoMessage()}</p>
    <div class="geo-actions"><a class="geo-primary" href="mailto:info@wagmix.com">${t('聯絡我們','Contact us')} <span aria-hidden="true">↗</span></a><button class="geo-secondary" type="button" data-geo-retry ${geoState.status === 'checking' ? 'disabled' : ''}>${t('重新檢測','Retry')}</button></div>
    <div class="geo-contact-links"><a href="https://x.com/WAGMIx_Official" target="_blank" rel="noopener noreferrer">X</a><span aria-hidden="true">·</span><a href="https://t.me/wagmix" target="_blank" rel="noopener noreferrer">Telegram</a><span aria-hidden="true">·</span><a href="mailto:info@wagmix.com">info@wagmix.com</a></div>
    ${geoPreviewControls(true)}
  </section></div>`;
}

function geoRender({focus=true}={}) {
  if (!geoRoot) return;
  const app = document.getElementById('app');
  const blocked = geoBlocked();
  if (blocked && !app.inert && document.activeElement && app.contains(document.activeElement)) geoReturnFocus = document.activeElement;
  app.inert = blocked;
  if (blocked) app.setAttribute('aria-hidden','true'); else app.removeAttribute('aria-hidden');
  document.body.classList.toggle('geo-access-blocked',blocked);
  document.body.dataset.geoStatus = geoState.status;
  geoRoot.innerHTML = geoMarkup();
  const switcher = document.getElementById('language-switch');
  if (switcher) switcher.href = geoLanguageHref();
  if (!focus) return;
  if (blocked) document.getElementById('geo-title')?.focus({preventScroll:true});
  else if (geoReturnFocus?.isConnected) { geoReturnFocus.focus({preventScroll:true}); geoReturnFocus = null; }
  else geoRoot.querySelector('[data-geo-preview="ALLOW"]')?.focus({preventScroll:true});
}

function geoSetPreview(value,{focus=true}={}) {
  if (!geoIsPreview || !['US','ALLOW','UNKNOWN'].includes(value)) return false;
  geoPreviewState = value;
  geoState = value === 'US' ? {status:'restricted',country:'US'} : value === 'UNKNOWN' ? {status:'error',country:null} : {status:'allowed',country:null};
  geoRender({focus});
  return true;
}

async function geoCheck() {
  if (geoIsPreview) { geoSetPreview(geoPreviewState); return; }
  const request = ++geoRequest;
  geoState = {status:'checking',country:null};
  geoRender();
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
    geoState = geoDecision(data?.country);
  } catch (_) {
    if (request !== geoRequest) return;
    geoState = {status:'error',country:null};
  } finally { clearTimeout(timeout); }
  geoRender();
}

function geoKeyboard(event) {
  if (!geoRoot || !geoBlocked()) return;
  if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); return; }
  if (event.key !== 'Tab') return;
  const items = [...geoRoot.querySelectorAll('a[href],button:not([disabled])')].filter(node => node.getClientRects().length);
  if (!items.length) { event.preventDefault(); document.getElementById('geo-title')?.focus(); return; }
  const first = items[0],last = items[items.length - 1];
  if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

if (geoRoot) {
  document.addEventListener('click',event => {
    if (geoBlocked() && !geoRoot.contains(event.target)) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    const preview = event.target.closest('[data-geo-preview]');
    if (preview && geoRoot.contains(preview)) { event.preventDefault(); geoSetPreview(preview.dataset.geoPreview); }
    if (event.target.closest('[data-geo-retry]')) { event.preventDefault(); geoCheck(); }
  },true);
  document.addEventListener('keydown',geoKeyboard,true);
  document.addEventListener('focusin',event => {
    if (geoBlocked() && !geoRoot.contains(event.target)) document.getElementById('geo-title')?.focus({preventScroll:true});
  },true);
  // The overlay lives outside #app and survives all product/document hash routes.
  window.addEventListener('hashchange',() => { if (geoBlocked()) geoRender({focus:false}); });
  if (geoIsPreview) geoSetPreview(geoPreviewState,{focus:geoPreviewState !== 'ALLOW'}); else geoCheck();
}
