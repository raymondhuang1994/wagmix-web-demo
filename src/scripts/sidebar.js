function headerSocials() {
  const channels = [['x','X'], ['telegram','Telegram'], ['email',t('郵件','Email')]];
  return `<div class="header-socials" aria-label="${t('官方聯絡渠道','Official contact channels')}">${channels.map(([id,label]) => `<a href="${SITE_CONFIG.contacts[id]}" ${id === 'email' ? '' : 'target="_blank" rel="noopener noreferrer"'} aria-label="${label} ${id === 'email' ? 'info@wagmix.com' : 'WAGMIx'}" title="${label}">${contactIcon(id)}<span>${label}</span></a>`).join('')}</div>`;
}

/* The header selects pages; each contextual sidebar selects product sections. */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const productSections = [
  ['overview','產品總覽','Product overview'], ['market','底層行情','Underlying market'],
  ['theme','底層資產投資主題','Underlying asset investment theme'], ['features','核心賣點','Key features'],
  ['terms','產品資料與權利','Product details & rights'], ['documents','產品文件','Product documents']
];
const bviSectionIds = {market:'product-market',theme:'product-theme',features:'product-features',terms:'product-terms',documents:'product-whitepaper'};
const adgmSectionIds = {market:'adgm-market',theme:'adgm-theme',features:'adgm-features',terms:'adgm-terms',documents:'adgm-documents'};
let lastRoute = {page:'',chapter:'',variant:''};
let activeCapability = 0;
let spyPending = false;
let lastNavKey = '';

function sideLink(href,label,key,extra='') {
  return `<a href="${href}" data-nav-key="${key}" ${extra}><span>${label}</span><i aria-hidden="true">↗</i></a>`;
}

function productCode(variant) {
  return variant === 'adgm' ? '7709w' : 'SKHY2Lw';
}

function header(page, variant) {
  const inProduct = ['catalog','product','adgmguide','docs','whitepaper'].includes(page);
  return `<a class="skip" href="#main">${t('跳至內容','Skip to content')}</a>
    <header class="site-header">
      <a class="site-logo" href="#/" aria-label="WAGMIx ${t('首頁','home')}"><img src="${LOGO}" alt="WAGMIx"></a>
      <nav class="site-nav" id="site-nav" aria-label="${t('網站選單','Site navigation')}">
        <a data-top-key="home" href="#/" class="${page === 'home' ? 'active' : ''}" ${page === 'home' ? 'aria-current="page"' : ''}>${t('關於 WAGMIx','About WAGMIx')}</a>
        <details class="product-menu"><summary data-top-key="products" class="${inProduct ? 'active' : ''}">${t('產品','Products')} <span aria-hidden="true">⌄</span></summary>
          <div class="product-menu-panel">
            <a class="menu-category" href="#/products">
              <span class="menu-category-title">${t('代幣化股票／ETF','Tokenized Stocks / ETFs')}<span aria-hidden="true">↗</span></span>
              <span class="menu-powered" lang="en">Powered by WAGMIx</span>
            </a>
            <div class="menu-products" aria-label="${t('7709 產品','7709 products')}">
              ${['adgm','bvi'].map(v=>`<a class="menu-product" href="#/products/7709/${productCode(v)}/overview"><span class="menu-product-mark" aria-hidden="true">${productMark(v)}</span><span><strong>${productCode(v)}</strong><small>${chainIcon(v==='adgm'?'bnb':'solana')}${v==='adgm' ? 'BNB Smart Chain' : 'Solana'}</small></span><span aria-hidden="true">↗</span></a>`).join('')}
            </div>
          </div>
        </details>
        <a data-top-key="ecosystem" href="#/ecosystem" class="${page === 'ecosystem' ? 'active' : ''}" ${page === 'ecosystem' ? 'aria-current="page"' : ''}>${t('生態','Ecosystem')}</a>
        <a data-top-key="contact" href="#/contact" class="${page === 'contact' ? 'active' : ''}" ${page === 'contact' ? 'aria-current="page"' : ''}>${t('聯絡我們','Contact')}</a>
      </nav>
      <div class="header-actions">${headerSocials()}<button class="mobile-toggle" aria-label="${t('網站選單','Site menu')}" aria-controls="site-nav" aria-expanded="false"><span aria-hidden="true">☰</span></button><a id="language-switch" class="lang-switch" lang="${L === 'zh' ? 'en' : 'zh-Hant'}" href="${geoLanguageHref()}">${t('EN','繁中')}</a></div>
    </header>`;
}

function contextNav(kind,variant='bvi') {
  let title = '', subtitle = '', links = '', meta = '';
  if (kind === 'capabilities') {
    title = t('五項核心能力','Our capabilities');
    subtitle = t('點選定位，或向下閱讀','Jump to a capability or keep reading');
    links = CAPABILITIES.map((capability,index) => sideLink('#/home/capabilities/' + index,`<small>0${index + 1}</small>${esc(pick(capability.title))}`,'cap-' + index,`id="cap-tab-${index}" data-cap="${index}"`)).join('');
  } else if (kind === 'product') {
    title = productCode(variant);
    links = productSections.map(([key,zh,en],index) => sideLink('#/products/7709/' + title + '/' + key,`<small>0${index + 1}</small>${t(zh,en)}`,'product-' + key)).join('');
  } else {
    title = t('產品文件','Product documents');
    subtitle = 'SKHY2Lw';
    links = sideLink('#/docs',t('文件總覽','Document overview'),'docs') + WHITEPAPER.map((chapter,index) => sideLink('#/whitepaper/' + chapter.id,`<small>${shortRefs[index]}</small>${esc(chapterNames[chapter.id])}`,'wp-' + chapter.id)).join('');
    meta = `<a class="context-version-link" href="#/products/7709/SKHY2Lw/documents">← ${t('返回 SKHY2Lw','Back to SKHY2Lw')}</a>`;
  }
  const toggle = kind === 'capabilities' ? '' : `<button class="context-toggle" type="button" aria-expanded="false" aria-controls="${kind}-toc"><span>${kind === 'product' ? title : t('本頁目錄','On this page')}<b data-context-current></b></span><i aria-hidden="true">⌄</i></button>`;
  return `<aside class="context-nav" data-context="${kind}" aria-label="${title}"><div class="context-heading">${subtitle ? '<small>' + subtitle + '</small>' : ''}<strong>${title}</strong>${meta}</div>${toggle}<nav class="context-links" id="${kind}-toc" aria-label="${title}">${links}</nav></aside>`;
}

function capabilityNav() { return contextNav('capabilities'); }

function pageBody(page,chapter,variant) {
  if (page === 'home') return home();
  if (page === 'catalog') return catalog();
  if (page === 'ecosystem') return ecosystem();
  if (page === 'contact') return contactPage();
  if (page === 'docs') return docsHome();
  const isProduct = page === 'product' || page === 'adgmguide';
  const kind = isProduct ? 'product' : 'whitepaper';
  const content = page === 'product' ? (variant === 'adgm' ? adgmProduct() : product()) : page === 'adgmguide' ? adgmGuide() : whitepaper(chapter);
  return `<div class="context-layout ${kind}-layout ${variant === 'adgm' ? 'adgm-layout' : ''}">${contextNav(kind,variant)}<div class="context-content">${content}</div></div>`;
}

function setActiveNav(key) {
  const changed = lastNavKey !== key;
  lastNavKey = key;
  document.querySelectorAll('[data-nav-key]').forEach(link => {
    const active = link.dataset.navKey === key;
    link.classList.toggle('active',active);
    if (active) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
  const active = document.querySelector('[data-nav-key][aria-current="location"]');
  if (!active) return;
  const nav = active.closest('.context-nav');
  const current = nav?.querySelector('[data-context-current]');
  if (current) current.textContent = [...active.querySelector('span').childNodes].filter(node => node.nodeName !== 'SMALL').map(node => node.textContent).join('').trim();
  if (changed && innerWidth > 900) requestAnimationFrame(() => {
    const box = nav.getBoundingClientRect(), item = active.getBoundingClientRect();
    if (item.top < box.top || item.bottom > box.bottom) nav.scrollTop += item.top - box.top - 55;
  });
}
function selectCapability(index) {
  activeCapability = Math.max(0,Math.min(4,Number(index) || 0));
  setActiveNav('cap-' + activeCapability);
}
function capabilityOffset() {
  const nav = document.querySelector('[data-context="capabilities"]');
  return innerWidth <= 900 && nav ? 88 + nav.getBoundingClientRect().height + 18 : (innerWidth <= 600 ? 144 : 120);
}
function scrollToCapability(target) {
  window.scrollTo({top:Math.max(0,window.scrollY + target.getBoundingClientRect().top - capabilityOffset()),behavior:'instant'});
}
function scrollToProductFootnote(target) {
  // Keep the note below the fixed header and the mobile product directory.
  const selectors = innerWidth <= 900 ? ['.site-header','[data-context="product"]'] : ['.site-header'];
  const bottom = Math.max(0,...selectors.map(selector => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? (rect.bottom ?? rect.top + rect.height) : 0;
  }));
  const offset = Math.max(innerWidth <= 600 ? 202 : 120,bottom + 18);
  window.scrollTo({top:Math.max(0,window.scrollY + target.getBoundingClientRect().top - offset),behavior:'instant'});
}
function closeContext() {
  document.querySelectorAll('.context-nav.is-open').forEach(nav => {
    nav.classList.remove('is-open');
    nav.querySelector('.context-toggle').setAttribute('aria-expanded','false');
  });
}
function closeNavigation(returnFocus=false) {
  const productOpen = document.querySelector('.product-menu[open]');
  const topOpen = document.querySelector('.site-nav')?.classList.contains('open');
  const contextOpen = document.querySelector('.context-nav.is-open');
  document.querySelector('.site-nav')?.classList.remove('open');
  document.querySelector('.mobile-toggle')?.setAttribute('aria-expanded','false');
  document.querySelectorAll('.product-menu[open]').forEach(menu => menu.removeAttribute('open'));
  closeContext();
  if (!returnFocus) return;
  if (contextOpen) contextOpen.querySelector('.context-toggle').focus();
  else if (topOpen) document.querySelector('.mobile-toggle').focus();
  else if (productOpen) productOpen.querySelector('summary').focus();
}

function route() {
  const fromMenu = Boolean(document.querySelector('.site-nav.open,.context-nav.is-open'));
  const parts = location.hash.replace(/^#\/?/,'').split('/');
  if (parts[0] === 'product-7709-w') {
    location.replace('#/products/7709/7709w/overview');
    return;
  }
  if (parts[0] === 'home' && parts[1] === 'contact') {
    location.replace('#/contact');
    return;
  }
  if (parts[0] === 'home' && parts[1] === 'whitepaper') {
    location.replace('#/products/7709/SKHY2Lw/documents');
    return;
  }
  let page = 'home', variant = '', section = '', chapter = '', settlementFootnote = false;
  if (parts[0] === 'products') {
    page = parts[1] === '7709' ? 'product' : 'catalog';
    if (page === 'product') {
      const productKey = (parts[2] || '').toLowerCase();
      variant = ['7709w','7709.w','adgm'].includes(productKey) ? 'adgm' : 'bvi';
      const hasProduct = ['7709w','7709.w','skhy2lw','adgm','bvi'].includes(productKey);
      section = (hasProduct ? parts[3] : parts[2]) || 'overview';
      if (section === 'whitepaper') section = 'documents';
      if (section === 'mechanics') section = 'terms';
      if (variant === 'adgm' && section === 'guide') page = 'adgmguide';
      if (!productSections.some(entry => entry[0] === section) && page === 'product') section = 'overview';
      settlementFootnote = hasProduct && variant === 'bvi' && section === 'overview' && parts[3] === 'overview' && parts[4] === 'footnote-3' && parts.length === 5;
      const canonicalHash = '#/products/7709/' + productCode(variant) + '/' + section + (settlementFootnote ? '/footnote-3' : '');
      if (location.hash !== canonicalHash) {
        location.replace(canonicalHash);
        return;
      }
    }
  } else if (parts[0] === 'whitepaper') {
    page = 'whitepaper'; variant = 'bvi'; chapter = parts[1] || 'summary';
  } else if (parts[0] === 'docs') {
    page = 'docs'; variant = 'bvi';
  } else if (parts[0] === 'ecosystem') page = 'ecosystem';
  else if (parts[0] === 'contact') page = 'contact';
  const changed = page !== lastRoute.page || chapter !== lastRoute.chapter || variant !== lastRoute.variant;
  document.body.dataset.page = page;
  document.body.dataset.variant = variant;
  document.body.classList.toggle('en',L === 'en');
  if (changed) {
    lastNavKey = '';
    document.getElementById('app').innerHTML = header(page,variant) + pageBody(page,chapter,variant) + footer(page,variant);
    const title = page === 'home' ? 'WAGMIx' : page === 'catalog' ? t('代幣化股票／ETF | WAGMIx','Tokenized Stocks / ETFs | WAGMIx') : page === 'product' || page === 'adgmguide' ? productCode(variant) + ' | WAGMIx' : page === 'ecosystem' ? t('生態合作夥伴 | WAGMIx','Ecosystem Partners | WAGMIx') : page === 'contact' ? t('聯絡我們 | WAGMIx','Contact | WAGMIx') : page === 'docs' ? t('SKHY2Lw 產品文件 | WAGMIx','SKHY2Lw Product Documents | WAGMIx') : (chapterNames[chapter] || t('產品文件','Product documents')) + ' | WAGMIx';
    document.title = title + t('｜繁體中文',' | English');
  }
  lastRoute = {page,chapter,variant};
  document.getElementById('language-switch').href = geoLanguageHref();
  closeNavigation();
  if (page === 'home') selectCapability(parts[1] === 'capabilities' ? parts[2] || 0 : activeCapability);
  setActiveNav(page === 'product' ? 'product-' + section : page === 'adgmguide' ? 'product-documents' : page === 'whitepaper' ? 'wp-' + chapter : page === 'docs' ? 'docs' : 'cap-' + activeCapability);
  const capabilityRoute = page === 'home' && parts[1] === 'capabilities' && parts[2] !== undefined;
  const ids = variant === 'adgm' ? adgmSectionIds : bviSectionIds;
  const anchor = settlementFootnote ? 'product-source-note-3' : page === 'home' ? (capabilityRoute ? 'capability-' + activeCapability : parts[1]) : page === 'product' ? ids[section] : page === 'ecosystem' && parts[1] === 'directory' ? 'ecosystem-directory' : page === 'whitepaper' && parts[2] ? 'wp-' + parts[2] : null;
  requestAnimationFrame(() => {
    const target = (anchor && document.getElementById(anchor)) || document.getElementById('main');
    if (!target) return;
    if (fromMenu || settlementFootnote) { target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }
    if (settlementFootnote) scrollToProductFootnote(target);
    else if (capabilityRoute) scrollToCapability(target);
    else if (anchor && document.getElementById(anchor)) target.scrollIntoView({behavior:'instant',block:'start'});
    else window.scrollTo({top:0,behavior:'instant'});
  });
}
function scrollSpy() {
  if (spyPending) return;
  spyPending = true;
  requestAnimationFrame(() => {
    spyPending = false;
    const page = document.body.dataset.page;
    if (page === 'home') {
      let active = 0;
      const cut = capabilityOffset() + 40;
      document.querySelectorAll('[data-capability]').forEach((element,index) => { if (element.getBoundingClientRect().top <= cut) active = index; });
      selectCapability(active);
      return;
    }
    if (page !== 'product') return;
    const ids = document.body.dataset.variant === 'adgm' ? adgmSectionIds : bviSectionIds;
    const cut = innerWidth <= 900 ? 200 : 150;
    let key = 'product-overview';
    for (const [section,id] of Object.entries(ids)) {
      const element = document.getElementById(id);
      if (element && element.getBoundingClientRect().top <= cut) key = 'product-' + section;
    }
    setActiveNav(key);
  });
}
function trapTopMenu(event) {
  if (event.key !== 'Tab' || !document.querySelector('.site-nav.open')) return;
  const items = [...document.querySelectorAll('.site-header a,.site-header button,.site-header summary')].filter(node => node.getClientRects().length);
  const first = items[0], last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

document.addEventListener('click',event => {
  handleEcosystemClick(event); handleDocsClick(event);
  const menu = event.target.closest('.mobile-toggle');
  if (menu) {
    const open = !document.querySelector('.site-nav').classList.contains('open');
    closeNavigation(); document.querySelector('.site-nav').classList.toggle('open',open);
    menu.setAttribute('aria-expanded',String(open));
    if (open) document.querySelector('.site-nav a').focus();
    return;
  }
  const toggle = event.target.closest('.context-toggle');
  if (toggle) {
    const nav = toggle.closest('.context-nav'), open = !nav.classList.contains('is-open');
    closeNavigation(); nav.classList.toggle('is-open',open); toggle.setAttribute('aria-expanded',String(open)); return;
  }
  if (!event.target.closest('.site-header,.context-nav')) closeNavigation();
  if (event.target.closest('.skip')) {
    event.preventDefault(); const main = document.getElementById('main'); main.setAttribute('tabindex','-1'); main.focus(); main.scrollIntoView(); return;
  }
  if (event.target.closest('.back-top')) window.scrollTo({top:0,behavior:'smooth'});
  const chart = event.target.closest('[data-chart]');
  if (chart) {
    document.querySelectorAll('[data-chart]').forEach(button => { button.classList.toggle('selected',button === chart); button.setAttribute('aria-pressed',String(button === chart)); });
    document.getElementById('price-chart').innerHTML = priceChart(chart.dataset.chart);
  }
  const link = event.target.closest('a[href^="#/"]');
  if (link && link.getAttribute('href') === location.hash) { event.preventDefault(); route(); }
});
document.addEventListener('input',event => { handleDocsInput(event); handleEcosystemInput(event); });
document.addEventListener('keydown',event => { handleDocsKeydown(event); if (event.key === 'Escape') closeNavigation(true); trapTopMenu(event); });
window.addEventListener('scroll',scrollSpy,{passive:true});
window.addEventListener('resize',() => {
  scrollSpy();
  if (innerWidth > 900) closeContext();
  if (innerWidth > 1100) {
    const open = document.querySelector('.site-nav.open'); closeNavigation();
    if (open) document.querySelector('.site-logo').focus();
  }
});
window.addEventListener('hashchange',route);
route();
