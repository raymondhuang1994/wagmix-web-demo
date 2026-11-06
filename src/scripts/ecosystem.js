/* Each relation ties a specific product to its documented network. */
const v9EcoRelations = {
  bnb: {product:'7709w',chain:'bnb'},
  solana: {product:'SKHY2Lw',chain:'solana'},
  auditedEvm: {product:'SKHY2Lw',chain:'evm'}
};
const v9EcoInstitutions = [
  {id:'csop',name:'CSOP',legal:'CSOP Asset Management Limited',logo:'csop',relations:[v9EcoRelations.bnb,v9EcoRelations.solana],
    intro:{zh:'南方東英提供交易所買賣基金、槓桿及反向產品，以及共同基金，涵蓋多個市場及資產類別。',en:'CSOP offers exchange-traded funds, leveraged and inverse products, and mutual funds across markets and asset classes.'},
    source:'https://www.csopasset.com/en/about/overview'},
  {id:'fosun',name:'Fosun International Securities',legal:'Fosun International Securities Limited',logo:'fosun',relations:[v9EcoRelations.bnb,v9EcoRelations.solana],
    intro:{zh:'復星國際證券有限公司是復星財富控股旗下全資子公司，提供證券及虛擬資產交易服務。',en:'Fosun International Securities Limited is a wholly owned subsidiary of Fosun Wealth Holdings, providing securities and virtual-asset trading services.'},
    brandNote:{zh:'圖示為復星財富控股集團標誌。',en:'The logo represents Fosun Wealth Holdings.'},
    source:'https://www.fosunwealth.hk/us?index=1'},
  {id:'finloop',name:'Finloop',legal:'Finloop Finance Technology Holding Limited',logo:'finloop',relations:[v9EcoRelations.bnb,v9EcoRelations.solana],
    intro:{zh:'Finloop 為金融機構提供財富管理產品與科技方案，業務涵蓋傳統資產、數碼資產及 RWA 代幣化。Finloop Finance Limited 為旗下香港持牌子公司。',en:'Finloop provides wealth management products and technology solutions to financial institutions across traditional assets, digital assets and RWA tokenization. Finloop Finance Limited is its Hong Kong licensed subsidiary.'},
    source:'https://finloop.global/en/about'},
  {id:'beosin',name:'Beosin',legal:'Beosin',logo:'beosin',relations:[v9EcoRelations.auditedEvm],
    intro:{zh:'Beosin 提供區塊鏈安全與合規解決方案，業務涵蓋智能合約安全審計、反洗錢監控及加密資產追蹤。',en:'Beosin provides blockchain security and compliance solutions, including smart-contract security audits, anti-money-laundering monitoring and crypto-asset tracing.'},
    source:'https://www.beosin.com/'},
  {id:'bnb',name:'BNB Smart Chain',legal:'BNB Smart Chain',symbol:'bnb',relations:[v9EcoRelations.bnb],
    intro:{zh:'BNB Smart Chain 是兼容 EVM 的第一層區塊鏈，支援 DeFi、NFT 及其他 Web3 應用。',en:'BNB Smart Chain is an EVM-compatible Layer 1 blockchain supporting DeFi, NFTs and other Web3 applications.'},
    source:'https://www.bnbchain.org/en/bnb-smart-chain'},
  {id:'solana',name:'Solana',legal:'Solana',symbol:'solana',relations:[v9EcoRelations.solana],
    intro:{zh:'Solana 是支援資本市場、支付及加密應用的高效能區塊鏈網絡。',en:'Solana is a high-performance blockchain network for capital markets, payments and crypto applications.'},
    source:'https://solana.com/'}
];
const v9EcoFilters = [
  {id:'product',label:['產品','Product'],options:[['all','全部產品','All products'],['7709w','7709w','7709w'],['SKHY2Lw','SKHY2Lw','SKHY2Lw']]},
  {id:'chain',label:['網絡','Network'],options:[['all','全部網絡','All networks'],['bnb','BNB Smart Chain（擬部署）','BNB Smart Chain (planned)'],['solana','Solana','Solana']]}
];
function v9EcoMark(entry) {
  if (entry.logo && INSTITUTION_LOGOS[entry.logo]) return `<img class="eco-v9-logo eco-v9-logo-${entry.logo}" src="${INSTITUTION_LOGOS[entry.logo]}" alt="" loading="lazy">`;
  if (entry.symbol) return chainIcon(entry.symbol);
  return `<span class="eco-v9-logo-pending" aria-hidden="true">${esc(entry.name)}</span>`;
}
function v9EcoCard(entry, index) {
  return `<article class="eco-v9-card ${index % 2 ? 'eco-v9-at-right' : ''}" data-eco-v9-card="${entry.id}">
    <button type="button" class="eco-v9-card-front" data-eco-v9-toggle="${entry.id}" aria-expanded="false" aria-controls="eco-v9-info-${entry.id}">
      <span class="eco-v9-logo-space eco-v9-logo-space-${entry.id}">${v9EcoMark(entry)}</span><span class="eco-v9-name">${esc(entry.name)}</span><span class="eco-v9-info-icon" aria-hidden="true">i</span>
    </button>
    <div class="eco-v9-info" id="eco-v9-info-${entry.id}" role="region" aria-label="${esc(entry.name)} ${t('機構介紹','introduction')}">
      <button type="button" class="eco-v9-info-close" data-eco-v9-close aria-label="${t('關閉介紹','Close introduction')}">×</button>
      <h3>${esc(entry.name)}</h3>${entry.legal === entry.name ? '' : `<p class="eco-v9-legal">${esc(entry.legal)}</p>`}<p>${esc(pick(entry.intro))}</p>${entry.brandNote ? `<p class="eco-v9-brand-note">${esc(pick(entry.brandNote))}</p>` : ''}
      <a href="${entry.source}" target="_blank" rel="noopener noreferrer">${t('官方介紹','Official introduction')} <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}
function ecosystem() {
  const title=t('生態合作夥伴','Ecosystem Partners');
  return `<main id="main" class="eco-v9-page eco-v18-page">
    <section class="eco-v9-hero"><div class="wrap eco-v18-hero-grid">
      <div class="eco-v18-hero-copy"><h1 id="eco-v18-title">${title}</h1>
      </div>
      <div class="eco-brand-art" aria-hidden="true">${brandXScene()}</div>
    </div></section>
    <section id="ecosystem-directory" class="eco-v9-directory" aria-labelledby="eco-v18-title"><div class="wrap">
      <div class="eco-v9-heading"><label class="eco-v9-search"><span class="eco-v9-sr">${t('搜尋機構或網絡','Search institutions or networks')}</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"></circle><path d="m15 15 5 5"></path></svg><input data-eco-v9-search type="search" maxlength="100" placeholder="${t('搜尋機構或網絡','Search institutions or networks')}" aria-label="${t('搜尋機構或網絡','Search institutions or networks')}"></label></div>
      <div class="eco-v9-filter-bar">${v9EcoFilters.map(field=>`<label><span>${t(...field.label)}</span><select data-eco-v9-field="${field.id}" aria-label="${t(...field.label)}">${field.options.map(([id,zh,en])=>`<option value="${id}">${t(zh,en)}</option>`).join('')}</select></label>`).join('')}<button type="button" data-eco-v9-reset>${t('清除篩選','Clear filters')} <span aria-hidden="true">↺</span></button></div>
      <div class="eco-v9-directory-meta"><span data-eco-v9-results role="status" aria-live="polite">${t(`共 ${v9EcoInstitutions.length} 項`,`${v9EcoInstitutions.length} results`)}</span></div>
      <div class="eco-v9-grid">${v9EcoInstitutions.map(v9EcoCard).join('')}</div>
      <div class="eco-v9-empty" data-eco-v9-empty hidden><span aria-hidden="true">⌕</span><h3>${t('目前沒有符合條件的機構或網絡。','No institutions or networks match your selection.')}</h3><p>${t('請更換篩選條件，或查看全部生態。','Change the filters or return to the full ecosystem.')}</p><button class="btn secondary" type="button" data-eco-v9-reset>${t('查看全部','View all')} ↗</button></div>
    </div></section>
  </main>`;
}
function updateV9EcosystemDirectory() {
  const page = document.querySelector('.eco-v9-page');
  if (!page) return;
  const values = Object.fromEntries([...page.querySelectorAll('[data-eco-v9-field]')].map(field=>[field.dataset.ecoV9Field,field.value]));
  const terms = (page.querySelector('[data-eco-v9-search]').value || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  let count = 0;
  page.querySelectorAll('[data-eco-v9-card]').forEach(card=>{
    const entry = v9EcoInstitutions.find(item=>item.id===card.dataset.ecoV9Card);
    const related = entry.relations.some(relation=>Object.entries(values).every(([key,value])=>value==='all'||relation[key]===value));
    const searchable = `${entry.name} ${entry.legal} ${entry.intro.zh} ${entry.intro.en}`.toLocaleLowerCase();
    const visible = related && terms.every(term=>searchable.includes(term));
    card.hidden = !visible;
    card.classList.remove('is-open', 'is-dismissed');
    card.classList.toggle('eco-v9-at-right', visible && count % 2 === 1);
    card.querySelector('[data-eco-v9-toggle]').setAttribute('aria-expanded','false');
    if (visible) count++;
  });
  page.querySelector('[data-eco-v9-results]').textContent = t(`共 ${count} 項`, count === 1 ? '1 result' : `${count} results`);
  page.querySelector('[data-eco-v9-empty]').hidden = count > 0;
}
function handleEcosystemInput(event) {
  if (event.target.matches('[data-eco-v9-search],[data-eco-v9-field]')) updateV9EcosystemDirectory();
}
function handleEcosystemClick(event) {
  const reset = event.target.closest('[data-eco-v9-reset]');
  const toggle = event.target.closest('[data-eco-v9-toggle]');
  const close = event.target.closest('[data-eco-v9-close]');
  if (reset) {
    const page = reset.closest('.eco-v9-page');
    page.querySelectorAll('[data-eco-v9-field]').forEach(field=>{field.value='all';});
    page.querySelector('[data-eco-v9-search]').value='';
    updateV9EcosystemDirectory();
    return;
  }
  if (toggle || close) {
    const card = (toggle||close).closest('[data-eco-v9-card]');
    const opening = !close && !card.classList.contains('is-open');
    document.querySelectorAll('[data-eco-v9-card].is-open').forEach(other=>{
      other.classList.remove('is-open');
      other.classList.add('is-dismissed');
      other.querySelector('[data-eco-v9-toggle]').setAttribute('aria-expanded','false');
    });
    card.classList.toggle('is-open',opening);
    card.classList.toggle('is-dismissed',!opening);
    card.querySelector('[data-eco-v9-toggle]').setAttribute('aria-expanded',String(opening));
    if (close) card.querySelector('[data-eco-v9-toggle]').focus();
    return;
  }
  if (!event.target.closest('.eco-v9-card')) document.querySelectorAll('[data-eco-v9-card].is-open').forEach(card=>{
    card.classList.remove('is-open');
    card.classList.add('is-dismissed');
    card.querySelector('[data-eco-v9-toggle]').setAttribute('aria-expanded','false');
  });
}

/* Dismiss official introductions without leaving the current filter state. */
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape') return;
  const focused=document.activeElement?.closest?.('[data-eco-v9-card]');
  document.querySelectorAll('[data-eco-v9-card]').forEach(card=>{
    card.classList.remove('is-open');
    card.classList.add('is-dismissed');
    card.querySelector('[data-eco-v9-toggle]').setAttribute('aria-expanded','false');
  });
  focused?.querySelector('[data-eco-v9-toggle]')?.focus();
});
