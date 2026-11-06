/* ADGM product presentation. Proposed arrangements are distinct from the BVI Note. */
const adgmRoute = section => `#/products/7709/7709w/${section}`;

function adgmFeaturesData() {
  // The four marketing features use the approved V8 factsheet wording.
  // Product-specific conditions remain separate from the SKHY2Lw Note terms.
  const conditions = {
    backing: t('每枚 7709w 擬代表一份憑證，對應一個由發行人透過託管人持有的 7709.HK 單位。持有人不直接擁有該單位。有限追索及受益權益安排，以最終產品文件為準。', 'Each 7709w token is intended to represent one Certificate linked to one 7709.HK unit held by the issuer through its custodian. Holders do not directly own the unit. Beneficial-interest and limited-recourse arrangements are subject to the final product documents.'),
    liquidity: t('報價安排須待最終委任。盤口、價差及報價取決於市場條件，流動性不獲保證。', 'Appointments remain to be finalised. Depth, spreads and quotations depend on market conditions, and liquidity is not guaranteed.'),
    funding: t('申贖費、託管費、平台費、點差及網絡費仍可能適用。策略結果取決於費率、對沖及成本。', 'Creation, redemption, custody, venue, spread and network costs may apply. Strategy outcomes depend on rates, hedging and costs.'),
    access: t('7709w 擬於 BNB Smart Chain 部署，採用 BEP-20 代幣標準。產品准入須符合適用的 KYC、適當性、銷售及地區限制。普通持有人不享有一級贖回權。', '7709w is planned for deployment on BNB Smart Chain using the BEP-20 token standard. Access is subject to applicable KYC, suitability, selling and jurisdictional requirements. Ordinary holders have no primary redemption right.')
  };
  return PRODUCT_FEATURES.map(feature=>({id:feature.id,symbol:productFeatureMeta[feature.id].symbol,title:pick(feature.title),copy:pick(feature.copy),condition:conditions[feature.id]}));
}

function adgmHero() {
  return `<section class="adgm-hero" id="adgm-overview">
    <div class="adgm-grid-light" aria-hidden="true"></div>
    <div class="wrap">

      <div class="adgm-hero-grid">
        <div class="adgm-hero-copy">
          <div class="adgm-eyeline"><span class="adgm-status"><i aria-hidden="true"></i>${t('即將上線', 'Coming soon')}</span></div>
          <h1>WAGMIx SK Hynix<br><em>Daily Max (2x)</em> <span class="adgm-token-word">Token</span></h1>
          <p class="adgm-lead">${t('7709w 以港交所上市的 7709.HK 為底層資產，擬於 BNB Smart Chain 部署。', '7709w references the Hong Kong-listed 7709.HK product and is planned for deployment on BNB Smart Chain.')}</p>
          <div class="adgm-channels"><span>${chainIcon('bnb')}<b>BNB Smart Chain</b><small>${t('擬部署', 'Planned deployment')}</small></span></div>
          <div class="adgm-actions"><a class="adgm-button primary" href="${adgmRoute('terms')}">${t('查看產品資料', 'View product details')} ${arrow}</a></div>
          <p class="adgm-prelaunch">${t('產品安排仍在籌備，最終權利、資格及限制以正式產品文件為準。', 'Product arrangements are in preparation. Final rights, eligibility and restrictions will be set out in the formal product documents.')}</p>
        </div>
        <div class="adgm-token-scene" aria-hidden="true"><div class="adgm-ring ring-one"></div><div class="adgm-ring ring-two"></div><div class="adgm-mark">${productMark('adgm')}</div><div class="adgm-visual-label"><span>7709w</span></div><div class="adgm-floor"></div></div>
      </div>
      <div class="adgm-hero-facts"><div><span>${t('底層上市產品', 'Underlying listed product')}</span><strong>${t('港交所', 'HKEX')} · 7709.HK</strong></div><div><span>${t('產品類型', 'Type')}</span><strong>${t('憑證', 'Certificate')}</strong></div><div><span>${t('二級市場', 'Secondary market')}</span><strong>${t('規劃全天候交易', '24/7 trading planned')}</strong></div></div>
    </div>
  </section>`;
}

function adgmFeatures() {
  const features = adgmFeaturesData();
  const transferNote = t(
    '按擬議產品安排，7709w 可在 DeFi 上自由轉讓，相關轉讓須符合適用的轉讓限制。',
    'Under the proposed product terms, 7709w is designed to be freely transferable on DeFi, subject to applicable transfer restrictions.'
  );
  return `<section class="adgm-section" id="adgm-features"><div class="wrap">
    <div class="adgm-section-head"><span class="adgm-kicker">04 · ${t('核心賣點', 'Key features')}</span><h2>${t('四大核心賣點', 'Four Core Selling Points')}</h2></div>
    <div class="adgm-feature-grid">${features.map((feature,index)=>`<article class="adgm-feature" data-feature="${feature.id}"><div class="adgm-feature-top"><span>0${index+1}</span><strong>${feature.symbol}</strong></div><h3>${esc(feature.title)}<sup class="feature-ref">${String.fromCharCode(97+index)}</sup></h3><p>${esc(feature.copy)}</p>${feature.id === 'access' ? `<p class="adgm-transfer-note">${esc(transferNote)}</p>` : ''}</article>`).join('')}</div>
    <ol class="product-feature-notes" type="a" aria-label="${t('賣點適用條件','Feature conditions')}">${features.map(feature=>`<li>${esc(feature.condition)}</li>`).join('')}</ol>
  </div></section>`;
}

function adgmFacts() {
  return [
    [t('產品名稱', 'Product name'), 'WAGMIx SK Hynix Daily Max (2x) Token'],
    [t('產品代碼', 'Ticker'), '7709w'],
    [t('發行人', 'Issuer'), 'Cocoa Issuer Limited'],
    [t('底層資產', 'Underlying asset'), t('南方東英 SK 海力士每日槓桿最多（2x）產品（7709.HK）', 'CSOP SK Hynix Daily Max (2x) Leveraged Product (7709.HK)')],
    [t('網絡', 'Network'), 'BNB Smart Chain'],
    [t('申購', 'Subscription'), t('合資格的認可參與者（AP）經 Finloop Finance Limited 辦理，可交付 7709.HK 單位、現金或獲准的法幣參考代幣。', 'Eligible Authorised Participants (APs) subscribe through Finloop Finance Limited in 7709.HK units, cash or an approved fiat-referenced token.')],
    [t('贖回', 'Redemption'), t('僅完成發行人 KYC 的認可參與者（AP）可經 Finloop Finance Limited 行使。', 'Only Authorised Participants (APs) that have completed issuer KYC may redeem through Finloop Finance Limited.')],
    [t('最低申贖規模', 'Minimum size'), t('跨支持網絡的每筆一級申贖為 100,000 份 7709w。', '100,000 units of 7709w per primary order across supported networks.')],
    [t('申贖時段', 'Request hours'), t('可全天候提交申贖請求，須具備可靠估值，並遵守適用產品條款。', 'Requests may be submitted around the clock, subject to reliable valuation and the applicable product terms.')],
    [t('申購及贖回費', 'Subscription and redemption fees'), t('各為相應交易額的 0.10%。', '0.10% of the corresponding transaction value for each.')],
    [t('底層資產託管費', 'Underlying custody fee'), t('每年 0.25%，按發行人隔離託管賬戶內 7709.HK 單位的價值計算。', '0.25% per annum, based on the value of 7709.HK units in the issuer’s segregated custody account.')],
    [t('其他交易成本', 'Other transaction costs'), t('二級市場點差、平台交易費及鏈上網絡費另計。', 'Secondary-market spreads, venue trading fees and blockchain network fees may also apply.')]
  ];
}

function adgmTerms() {
  return `<section class="adgm-section adgm-terms" id="adgm-terms"><div class="wrap">
    <div class="adgm-section-head"><span class="adgm-kicker">05 · ${t('產品資料與權利', 'Product details & rights')}</span><h2>${t('一級申購及贖回僅限合資格的認可參與者（AP）。', 'Primary market subscriptions and redemptions are limited to eligible Authorised Participants (APs).')}</h2></div>
    <div class="adgm-terms-layout"><div class="adgm-facts"><dl>${adgmFacts().map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div>
    <aside class="adgm-rights"><span class="adgm-kicker">${t('持有人權利', 'Holder rights')}</span><div class="adgm-rights-ratio"><strong>1</strong><span>${t('憑證', 'Certificate')}</span><i>↔</i><strong>1</strong><span>${t('底層單位的受益權益', 'beneficial interest in an underlying unit')}</span></div><p>${t('每份憑證擬對應一個 7709.HK 單位的受益權益。持有人不直接擁有該單位，亦不享有對 SK 海力士或底層產品管理人的投票及管理權。', 'Each Certificate is intended to represent a beneficial interest in one 7709.HK unit. Holders do not directly own that unit or acquire voting or management rights over SK hynix or the underlying product manager.')}</p><div class="adgm-rights-note"><b>${t('普通持有人沒有一級贖回權。', 'Ordinary holders have no primary redemption right.')}</b><p>${t('合資格 AP 完成發行人 KYC 後，方可經指定代理行使贖回權。普通持有人可按平台規則在二級市場買賣。', 'Eligible APs may redeem through the appointed agent after completing issuer KYC. Ordinary holders may buy or sell in the secondary market under the venue rules.')}</p></div><p>${t('持有人權益擬僅由對應的隔離託管資產或其淨出售所得履行。經允許的待交收儲備可包含現金或獲准的法幣參考代幣。', 'Holder entitlements are intended to be met only from the corresponding segregated custody assets or their net sale proceeds. Permitted pending-settlement reserves may include cash or approved fiat-referenced tokens.')}</p></aside></div>
  </div></section>`;
}

function adgmDocuments() {
  return `<section class="adgm-section adgm-documents adgm-documents-compact" id="adgm-documents"><div class="wrap">
    <div class="adgm-section-head"><span class="adgm-kicker" aria-hidden="true">06</span><h2>${t('產品文件', 'Product documents')}</h2></div>
    <button class="adgm-button muted adgm-prospectus-pending" type="button" disabled aria-disabled="true">${t('Prospectus — 待提供', 'Prospectus — To be provided')}</button>
  </div></section>`;
}

function adgmDisclaimer() {
  const paragraphs = [
    t('免責聲明：WAGMIx 為 7709w 提供代幣化技術及相關營運服務，並非產品發行人，亦不營運任何交易場所或提供投資建議。7709w 擬由第三方發行人 Cocoa Issuer Limited 發行。本頁所述為擬議產品安排，僅供資訊參考，不構成出售產品的要約、購買產品的要約招攬、投資建議或收益保證。', 'Disclaimer: WAGMIx provides tokenization technology and related operational services for 7709w. It is not the product issuer and does not operate any trading venue or provide investment advice. 7709w is proposed to be issued by Cocoa Issuer Limited, a third-party issuer. This page describes proposed product arrangements for information only and does not constitute an offer to sell, a solicitation of an offer to buy, investment advice or a guarantee of returns.'),
    t('每枚 7709w 擬代表一份憑證，對應一個 7709.HK 單位的受益權益；持有人並非直接持有該單位或 SK 海力士股票。相關受益權益及有限追索安排，以正式產品文件為準。產品發行、參與資格、持有人權利及適用限制，均須遵守正式產品文件及適用法律。', 'Each 7709w token is intended to represent one Certificate corresponding to a beneficial interest in one 7709.HK unit. Holders do not directly own that unit or SK hynix shares. The beneficial-interest and limited-recourse arrangements are subject to the definitive product documents. Product issuance, eligibility, holder rights and applicable restrictions are governed by the definitive product documents and applicable law.')
  ];
  return `<section class="p-disclaimer adgm-disclaimer" aria-label="${t('免責聲明', 'Disclaimer')}"><div class="wrap">${paragraphs.map(copy=>`<p>${esc(copy)}</p>`).join('')}</div></section>`;
}

function adgmProduct() {
  const market = productMarket().replaceAll('product-market', 'adgm-market').replaceAll('SKHY2Lw', '7709w');
  // Shared underlying-market references retain the V8 factsheet numbering.
  const theme = productTheme().replaceAll('product-theme', 'adgm-theme');
  return `<main id="main" class="p-page adgm-page">${adgmHero()}${market}${theme}${adgmFeatures()}${adgmTerms()}${adgmDocuments()}${adgmDisclaimer()}</main>`;
}

function adgmGuide() {
  const chapters = [
    [t('憑證擬提供一對一的底層受益權益。', 'Certificates are intended to provide a one-to-one beneficial interest.'), t('7709w 擬由 Cocoa Issuer Limited 發行，每枚代幣代表一份憑證。每份憑證對應一個 7709.HK 單位的受益權益，並按最終文件採有限追索安排。正式產品文件仍在準備中。', '7709w is proposed to be issued by Cocoa Issuer Limited, with each token representing one Certificate. Each Certificate is intended to correspond to a beneficial interest in one 7709.HK unit under final limited-recourse terms. The formal product documents are in preparation.')],
    [t('二級成交價由市場形成，可偏離指示價值。', 'Secondary prices are market-determined and may differ from indicative value.'), t('參與二級交易須符合適用的 KYC、適當性及地區限制。底層 7709.HK 的 NAV、指示性淨值及市場價格可供估值參考，並非 7709w 的保證成交價。', 'Secondary trading is subject to applicable KYC, suitability and jurisdictional requirements. NAV, indicative NAV and market prices of 7709.HK may inform valuation and are not guaranteed executable prices for 7709w.')],
    [t('全天候提交一級請求，須遵守適用產品條款。', 'Around-the-clock primary requests remain subject to the applicable product terms.'), t('合資格的認可參與者（AP）可經 Finloop Finance Limited 提交一級申贖請求。可全天候提交申贖請求，須具備可靠估值，並遵守適用產品條款。普通持有人沒有一級贖回權，僅完成發行人 KYC 的 AP 可行使該權利。', 'Eligible Authorised Participants (APs) may submit primary requests through Finloop Finance Limited. Requests may be submitted around the clock, subject to reliable valuation and the applicable product terms. Ordinary holders have no primary redemption right. Only APs that have completed issuer KYC may exercise that right.')],
    [t('費用及最低規模適用於一級申贖。', 'Fees and minimum order sizes apply to primary access.'), t('最低一級訂單為 100,000 份 7709w。申購費及贖回費各為相應交易額的 0.10%。底層託管費為隔離託管賬戶內 7709.HK 單位價值的每年 0.25%。二級點差、平台費及網絡費另計。', 'The minimum primary order is 100,000 units of 7709w. Subscription and redemption fees are each 0.10% of the corresponding transaction value. Underlying custody is 0.25% per annum on the value of 7709.HK units in the segregated custody account. Secondary spreads, venue fees and network fees may also apply.')],
    [t('底層每日槓桿與市場中斷可影響憑證價值。', 'Daily leverage and market disruptions may affect Certificate value.'), t('底層產品 7709.HK 旨在扣除費用及支出前，追蹤 SK 海力士股票的每日目標槓桿表現，目標為每日槓桿最多 2 倍。每日再平衡、路徑依賴、波動、價格偏離及市場流動性均可影響價值。無法可靠估值或交收、託管或持倉核對受阻時，申贖或報價可能受限或暫停。', '7709.HK seeks to track SK hynix’s targeted daily leveraged performance before fees and expenses, with leverage of up to 2x daily. Daily rebalancing, path dependency, volatility, price deviations and liquidity may affect value. Valuation, settlement, custody or reconciliation disruptions may restrict or suspend primary access or quotations.')]
  ];
  return `<main id="main" class="adgm-page adgm-guide"><div class="wrap"><a class="adgm-back" href="${adgmRoute('documents')}">← ${t('返回產品文件', 'Back to product documents')}</a><span class="adgm-kicker">7709w</span><h1>${t('憑證權利、交易與申贖，依各自適用條件辦理。', 'Certificate rights, trading and primary access have distinct conditions.')}</h1><p class="adgm-guide-summary">${t('7709w 是籌備中的 ADGM 憑證產品，擬於 BNB Smart Chain 部署。按擬議條款，普通持有人可在二級市場買賣。一級申購及贖回僅限合資格的認可參與者（AP），贖回須完成發行人 KYC。', '7709w is a proposed ADGM Certificate planned for deployment on BNB Smart Chain. Under the proposed terms, ordinary holders may buy and sell in the secondary market. Primary market subscriptions and redemptions are limited to eligible Authorised Participants (APs); redemption requires completion of issuer KYC.')}</p><div class="adgm-guide-body">${chapters.map(([title,copy],index)=>`<section><span>0${index+1}</span><h2>${title}</h2><p>${copy}</p></section>`).join('')}</div><p class="adgm-document-note">${t('本導讀概述擬議產品安排。正式條款、持有人權利及文件適用順序，以最終產品文件為準。', 'This guide summarises the proposed arrangements. Final product documents will determine the terms, holder rights and document precedence.')}</p><a class="adgm-button secondary" href="${adgmRoute('overview')}">${t('返回產品總覽', 'Return to product overview')} ${arrow}</a></div></main>`;
}
