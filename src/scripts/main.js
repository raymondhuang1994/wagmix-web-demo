// Approved brand copy is shared by the homepage and footer in each language.
function brandSlogan(){return pick(SITE_CONFIG.brand.slogan);}
function brandHeroCopy(){
 const slogan = L === 'en'
  ? '<span class="brand-slogan-lead">Define The <span>Next Wave</span></span> <em>On‑Chain</em>'
  : '<span class="brand-slogan-zh-lead">引領鏈上</span><em>新浪潮</em>';
 const lines = pick(SITE_CONFIG.brand.introduction);
 return `<h1 class="brand-slogan ${L === 'zh' ? 'brand-slogan-zh' : ''}" lang="${L === 'zh' ? 'zh-Hant' : 'en'}">${slogan}</h1><div class="brand-introduction"><p class="brand-description" lang="${L === 'zh' ? 'zh-Hant' : 'en'}">${lines.map(line=>`<span class="brand-description-line">${esc(line)}</span>`).join('')}</p></div>`;
}
function clearHomeIntro(){document.getElementById('home-intro')?.remove();}
function showHomeIntro(){
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 const overlay=document.createElement('div');
 overlay.id='home-intro';
 overlay.className='home-intro';
 overlay.setAttribute('aria-hidden','true');
 overlay.innerHTML=`<svg viewBox="0 0 793 763" preserveAspectRatio="xMidYMid slice" focusable="false"><defs><mask id="home-intro-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="793" height="763"><rect width="793" height="763" fill="white"/><path class="home-intro-mask-x" d="M528.667 381.49L786.612 127.589L793 5.00794L646.155 0L396.5 248.274L146.845 0L0 5.00794L6.38816 127.589L264.333 381.49L6.38816 635.411L0 757.992L146.845 763L396.5 514.726L646.155 763L793 757.992L786.612 635.411Z" fill="black"/></mask></defs><rect width="793" height="763" fill="#ebf4f9" mask="url(#home-intro-mask)"/></svg>`;
 const x=overlay.querySelector('.home-intro-mask-x');
 x.addEventListener('animationend',()=>overlay.remove(),{once:true});
 document.body.append(overlay);
}
function contactIcon(kind){const paths={email:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',x:'<path d="M5 4h4l10 16h-4L5 4zM19 4 5 20"/>',telegram:'<path d="m3 11 18-7-4 16-6-6-4 3v-6l11-5-8 8"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]}</svg>`;}
function contactChannels(){const channels=[{id:'email',title:t('電子郵件','Email'),copy:t('商務合作與機構諮詢','Business and institutional enquiries'),address:'info@wagmix.com'},{id:'x',title:'X',copy:t('品牌與產品動態','Brand and product updates'),address:'@WAGMIx_Official'},{id:'telegram',title:'Telegram',copy:t('社群與公告','Community and announcements'),address:'t.me/wagmix'}];return `<div class="contact-channels">${channels.map(c=>`<a class="contact-channel is-linked" href="${SITE_CONFIG.contacts[c.id]}" ${c.id==='email'?'':'target="_blank" rel="noopener noreferrer"'} aria-label="${esc(c.title+' · '+c.address)}"><span class="contact-channel-icon">${contactIcon(c.id)}</span><div><h3>${c.title}</h3><p>${c.copy}</p><span class="contact-channel-address">${c.address}</span></div><span class="contact-channel-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>`;}
function footer(page,variant){
 const homeFooter = page === 'home';
 const brand = homeFooter ? `<section class="home-closing" id="contact"><div class="wrap home-closing-grid"><div class="closing-brand"><a href="#/" aria-label="WAGMIx"><img src="${LOGO}" alt="WAGMIx" width="842" height="203"></a><p class="closing-slogan" lang="${L === 'zh' ? 'zh-Hant' : 'en'}">${esc(brandSlogan())}</p><p class="closing-introduction">${pick(SITE_CONFIG.brand.introduction).map(line=>`<span>${esc(line)}</span>`).join('')}</p></div><div class="closing-contact"><h2>${t('聯絡我們','Contact us')}</h2>${contactChannels()}</div></div></section>` : '';
 return `${brand}<footer class="footer footer-compact"><div class="wrap"><div class="footer-bottom"><span>© 2026 WAGMIx Company Limited. ${t('保留所有權利。','All rights reserved.')}</span></div></div></footer><button class="back-top" type="button" aria-label="${t('回到頁首','Back to top')}">↑</button>`;
}
/* Capability illustrations are decorative: the approved titles carry the meaning. */
function capabilityArt(id){
 const fill=`url(#cap-glass-${id})`,edge=`url(#cap-edge-${id})`;
 const shapes={
  platform:`<circle cx="80" cy="80" r="51" fill="${fill}" stroke="${edge}" stroke-width="7"/><circle cx="80" cy="80" r="35" fill="#f2fbff"/><path d="M80 55v27l18 11M17 72c4-31 31-55 63-55M143 88c-4 31-31 55-63 55" fill="none" stroke="#116cc8" stroke-width="6" stroke-linecap="round"/><path d="m69 10 13 7-12 9m21 108-13 9 13 7" fill="none" stroke="#4aa1e6" stroke-width="4" stroke-linejoin="round"/>`,
  custody:`<path d="m80 15 49 19v40c0 36-49 69-49 69S31 110 31 74V34z" fill="${fill}" stroke="${edge}" stroke-width="4"/><path d="m80 31 35 14v29c0 24-35 50-35 50S45 98 45 74V45z" fill="#eefaff88" stroke="#d5f4ff" stroke-width="2"/><path d="m58 78 16 17 30-36" fill="none" stroke="#0868c7" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,
  liquidity:`<rect x="18" y="32" width="124" height="98" rx="17" fill="${fill}" stroke="${edge}" stroke-width="3"/><path d="M35 55h27m-27 22h20m-20 22h35M96 55h26m-19 22h19m-35 22h35" stroke="#f1fbff" stroke-width="8" stroke-linecap="round"/><path d="M78 39v79" stroke="#176ac8" stroke-width="3"/><path d="m58 140 22 9 22-9" fill="none" stroke="#459de4" stroke-width="3"/>`,
  structuring:`<path d="m19 105 61-29 61 29-61 30z" fill="${fill}" stroke="${edge}" stroke-width="3"/><path d="m19 78 61-29 61 29-61 30z" fill="#116dcc" stroke="#a2d4ff" stroke-width="3"/><path d="m19 51 61-29 61 29-61 30z" fill="${fill}" stroke="${edge}" stroke-width="3"/><path d="m80 11 0 13m0 111v14" stroke="#3892dc" stroke-width="3"/>`,
  research:`<rect x="33" y="20" width="93" height="115" rx="13" fill="${fill}" stroke="${edge}" stroke-width="3"/><path d="M51 44h52M51 58h37M51 107l16-19 15 6 25-25" fill="none" stroke="#0d63bf" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="114" cy="114" r="24" fill="#e6f7ffdd" stroke="#3289db" stroke-width="5"/><path d="m132 132 15 15" stroke="#1265c0" stroke-width="8" stroke-linecap="round"/>`
 };
 return `<svg class="capability-glass-icon" viewBox="0 0 160 160" aria-hidden="true" focusable="false"><defs><linearGradient id="cap-glass-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f0fdff"/><stop offset=".38" stop-color="#9bd3ff"/><stop offset="1" stop-color="#1c64d4"/></linearGradient><linearGradient id="cap-edge-${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e7faff"/><stop offset=".5" stop-color="#82c2fa"/><stop offset="1" stop-color="#2973cf"/></linearGradient></defs>${shapes[id]}</svg>`;
}
function capPanel(i=0){const c=CAPABILITIES[i];return `<div class="capability-icon">${capabilityArt(c.id)}</div><h3 id="cap-heading-${i}">${esc(pick(c.title))}</h3><p class="capability-copy">${pick(c.copy).map(line=>esc(line).replace("³",'<a href="#/products/7709/SKHY2Lw/overview/footnote-3" aria-label="'+t("查看 SKHY2Lw T0 交收條件","Read SKHY2Lw T0 settlement conditions")+'">³</a>')).join(" ")}</p>`;}
function teamSection(){const groups=[{title:t('技術專長','Technical expertise'),items:[t('雲端原生架構','Cloud-native architecture'),t('低延遲系統','Low-latency systems'),t('企業級系統','Enterprise systems'),t('微服務架構','Microservices')]},{title:t('資本市場經驗','Capital markets'),items:[t('智能合約','Smart contracts'),t('ETF 與固定收益','ETFs & fixed income'),t('風險管理','Risk management'),t('機構顧問服務','Institutional advisory')]}];return `<section class="section team-section" id="home-team"><div class="wrap"><div class="section-head"><div><h2>${t('團隊與專業能力','Team & expertise')}</h2><p class="section-introduction">${t('團隊成員在科技與資本市場領域平均擁有 16 年專業經驗，專長涵蓋軟體工程、金融科技及機構交易。','Our team members average 16 years of experience across technology and capital markets, with expertise in software engineering, fintech and institutional trading.')}</p></div></div><div class="team-expertise-layout"><div class="team-experience"><span class="team-stat-label">${t('平均專業經驗','Average professional experience')}</span><p class="team-stat-number"><strong data-source-locked="true">16</strong><span>${t('年','years')}</span></p><p class="team-stat-caption">${t('技術與資本市場的跨領域經驗','Experience across technology and capital markets')}</p></div><div class="team-expertise-groups">${groups.map((g,i)=>`<article class="team-expertise-group"><span class="team-group-number" aria-hidden="true">0${i+1}</span><h3>${g.title}</h3><ul>${g.items.map(x=>`<li>${x}</li>`).join('')}</ul></article>`).join('')}</div></div></div></section>`;}
function brandXScene(){
 return `<svg class="brand-x-scene" viewBox="600 60 900 840" focusable="false"><image href="${ASSETS.hero}" x="0" y="0" width="1536" height="1024"/></svg>`;
}
function home(){return `<main id="main"><section class="brand-hero"><div class="wrap brand-hero-inner"><div class="brand-copy">${brandHeroCopy()}<div class="brand-actions"><a class="btn primary" href="#/home/capabilities">${t('探索 WAGMIx','Explore WAGMIx')} ${arrow}</a><a class="btn secondary" href="#/products">${t('探索產品','Explore products')} ${arrow}</a></div></div><div class="brand-hero-visual" aria-hidden="true">${brandXScene()}</div></div></section><section class="section cap-section" id="capabilities"><div class="wrap"><div class="section-head capability-heading"><div><h2>${t('探索 WAGMIx','Explore WAGMIx')}</h2><p>${t('WAGMIx 透過代幣化技術與營運協調，串聯發行人、託管機構、流動性提供者及<span class="keep-term">交易平台。</span>','WAGMIx connects issuers, custodians, liquidity providers and trading venues through tokenization technology and operational coordination.')}</p></div></div><div class="capability-showcase">${CAPABILITIES.map((c,i)=>`<article class="capability-column" id="capability-${i}" data-capability="${i}" data-capability-id="${c.id}" aria-labelledby="cap-heading-${i}">${capPanel(i)}</article>`).join('')}</div></div></section>${homeProducts()}${teamSection()}<section class="section home-ecosystem" id="home-ecosystem"><div class="wrap"><div class="section-head"><div><h2>${t('WAGMIx 生態協作','The WAGMIx ecosystem')}</h2><p class="section-introduction">${t('WAGMIx 協調各方分工，讓產品運營有序銜接。','WAGMIx coordinates participants through a consistent operating model.')}</p></div></div><div class="home-eco-flow"><div class="eco-terminal"><div>${t('底層資產管理人','Underlying Product Asset Manager')}</div><div>${t('持牌券商託管','Licensed broker custody')}</div></div><div class="eco-arrow" aria-hidden="true">→</div><div class="eco-hub"><img class="brand-plate" src="${LOGO}" alt="WAGMIx"><h3>${t('代幣化與運營協調','Tokenization & coordination')}</h3><p>${t('流程治理 · 跨機構協作<br>計算與登記 · 持倉核對','Process governance · Counterparty coordination<br>Calculation & registry · Reconciliation')}</p></div><div class="eco-arrow" aria-hidden="true">→</div><div class="eco-terminal"><div>${t('支持的公鏈與交易平台','Supported networks & venues')}</div><div>${t('合資格市場參與者','Eligible market participants')}</div></div></div><div class="eco-cta"><p>${t('具體參與角色、可用平台及交易限制，以適用產品文件為準。','Participant roles, available venues and restrictions are defined in the applicable product documents.')}</p><a class="btn home-ecosystem-link" href="#/ecosystem">${t('了解 WAGMIx 生態','Explore the WAGMIx Ecosystem')} ${arrow}</a></div></div></section></main>`;}

function homeProductBanner(product) {
 return `<a class="v14-product-banner v14-product-banner-${product.tone}" href="#/products/7709/${product.code}/overview" aria-labelledby="home-product-${product.code}">
  <div class="v14-product-copy">
   <span class="v14-product-status"><span class="launch-spark" aria-hidden="true">✦</span>${t('即將上線','Coming soon')}</span>
   <h3 id="home-product-${product.code}">${product.code}</h3>
   <p class="v14-product-name">${esc(product.name)}</p>
   <div class="v14-product-network">${chainIcon(product.chain)}<span>${product.network}</span></div>
   <strong class="v14-product-link">${t('查看產品','View product')} <span aria-hidden="true">↗</span></strong>
  </div>
  <div class="v14-product-art" aria-hidden="true">${productMark(product.mark)}</div>
 </a>`;
}
function homeProducts() {
 const products = [
  {code:'7709w',name:'WAGMIx SK Hynix Daily Max (2x) Token',tone:'dark',chain:'bnb',mark:'adgm',network:'BNB Smart Chain'},
  {code:'SKHY2Lw',name:'WAGMIx SK Hynix Daily Max (2x)',tone:'light',chain:'solana',mark:'bvi',network:'Solana'}
 ];
 return `<section class="product-spotlight v9-home-products" id="home-product"><div class="wrap">
  <div class="section-head">
   <div><h2>${t('旗艦產品','Flagship Product')}</h2><p class="spotlight-introduction">${t('捕捉 AI 算力浪潮：以 7709.HK 為底層支撐，鏈上參與 SK 海力士每日最多 2 倍槓桿策略','Capture the AI Compute Opportunity: On-Chain Access to a Daily Leveraged Strategy Linked to SK Hynix, Targeting Up to 2x Exposure via 7709.HK')}</p>
    <div class="spotlight-highlights"><h3>${t('核心優勢：','Key Highlights:')}</h3><ul>
     <li><strong>${t('HBM 市場龍頭：','A Global HBM Market Leader:')}</strong> ${t('SK 海力士於 2026 年第二季度佔全球 HBM 營收約 50%，位居市場第一','SK hynix captured approximately 50% of global HBM revenue in Q2 2026, ranking first worldwide')}<sup>1</sup>${t('；','; ')}${t('同期公司整體毛利率達 83.2%','Its company-wide gross margin reached 83.2% during the same quarter')}<sup>2</sup>${t('，',', ')}${t('是 AI 記憶體供應鏈的重要供應商。','underscoring its position as a major supplier in the AI memory supply chain.')}</li>
     <li><strong>${t('全球熱門槓桿產品支持：','Backed by a Globally Popular Leveraged Product:')}</strong> ${t('代幣以全球最熱門的個股槓桿產品之一 7709.HK 作為底層資產。該產品曾按資產管理規模位居全球個股槓桿及反向產品首位','The token is backed by 7709.HK, one of the world’s most popular single-stock leveraged products. Previously reported as the world’s largest single-stock leveraged and inverse product by assets under management')}<sup>3</sup>${t('，','; ')}${t('讓投資者透過鏈上代幣參與 SK 海力士每日 2 倍槓桿','7709.HK provides access to a daily leveraged strategy linked to SK hynix, with a targeted leverage factor of 2x')}</li>
    </ul><ol class="spotlight-footnotes">
     <li>${t('Counterpoint Research：2026 年第二季度全球 HBM 營收市佔，2026 年 9 月 2 日發布。','Counterpoint Research, global HBM revenue market share in Q2 2026, published September 2, 2026.')}</li>
     <li>${t('SK hynix 官方投資者關係網站：2026 年第二季度財務數據。','SK hynix official Investor Relations website, Q2 2026 financial results.')}</li>
     <li>${t('Bloomberg。','Bloomberg.')}</li>
    </ol></div>
   </div>
   <a class="text-link" href="#/products">${t('查看全部產品','View all products')} ${arrow}</a>
  </div>
  <div class="v14-product-banners">${products.map(homeProductBanner).join('')}</div>
 </div></section>`;
}
