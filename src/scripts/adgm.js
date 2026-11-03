/* ADGM product presentation. Proposed arrangements are distinct from the BVI Note. */
const adgmRoute = section => `#/products/7709/7709.W/${section}`;

function adgmFeaturesData() {
  return [
    {
      symbol: '1:1',
      title: t('每份憑證擬對應一個底層單位的受益權益。', 'Each Certificate is intended to represent a beneficial interest in one underlying unit.'),
      copy: t('每枚 7709.W 擬代表一份憑證，對應一個由發行人透過托管人持有的 7709.HK 單位。', 'Each 7709.W token is intended to represent one Certificate linked to one 7709.HK unit held by the issuer through its custodian.'),
      condition: t('持有人不直接擁有該單位。有限追索及受益權益安排，以最終產品文件為準。', 'Holders do not directly own the unit. Beneficial-interest and limited-recourse arrangements are subject to the final product documents.')
    },
    {
      symbol: '0',
      title: t('已付資金的敞口毋須支付週期性永續資金費。', 'Funded exposure carries no periodic perpetual funding payments.'),
      copy: t('7709.W 的擬議結構提供已付資金的每日槓桿敞口，可用於跨市場價格發現及套利策略。', 'The proposed 7709.W structure provides funded daily leveraged exposure and may be used in cross-market price discovery and arbitrage strategies.'),
      condition: t('申贖費、托管費、平台費、點差及網絡費仍可能適用。策略結果取決於費率、對沖及成本。', 'Creation, redemption, custody, venue, spread and network costs may apply. Strategy outcomes depend on rates, hedging and costs.')
    },
    {
      symbol: '24/7',
      title: t('全天候雙向報價，支持擬議的二級市場交易。', 'Round-the-clock two-way quotations are planned for secondary trading.'),
      copy: t('規劃由做市商提供初始庫存及全天候雙向報價，並透過一級申贖機制調節庫存。', 'Market makers are expected to seed initial inventory, provide two-way quotations and adjust inventory through the primary market.'),
      condition: t('報價安排須待最終委任。盤口、價差及報價取決於市場條件，流動性不獲保證。', 'Appointments remain to be finalised. Depth, spreads and quotations depend on market conditions, and liquidity is not guaranteed.')
    },
    {
      symbol: 'BSC',
      title: t('7709.W 擬於 BNB Smart Chain 部署。', 'BNB Smart Chain is the planned initial network for 7709.W.'),
      copy: t('7709.W 計劃採用 BEP-20 代幣標準。', 'The token is expected to use the BEP-20 standard.'),
      condition: t('產品准入須符合適用的 KYC、適當性、銷售及地區限制。普通持有人不享有一級贖回權。', 'Access is subject to applicable KYC, suitability, selling and jurisdictional requirements. Ordinary holders have no primary redemption right.')
    }
  ];
}

function adgmHero() {
  return `<section class="adgm-hero" id="adgm-overview">
    <div class="adgm-grid-light" aria-hidden="true"></div>
    <div class="wrap">
      <div class="adgm-breadcrumb"><a href="#/products">${t('代幣化股票／ETF', 'Tokenized Stocks / ETFs')}</a><span>/</span><span>7709.W</span></div>
      <div class="adgm-hero-grid">
        <div class="adgm-hero-copy">
          <div class="adgm-eyeline"><span class="adgm-status"><i aria-hidden="true"></i>${t('即將上線', 'Coming soon')}</span></div>
          <h1>WAGMIx SK Hynix<br><em>Daily Max (2x)</em><span>Token</span></h1>
          <p class="adgm-lead">${t('7709.W 以港交所上市的 7709.HK 為底層資產，擬於 BNB Smart Chain 部署。', '7709.W references the Hong Kong-listed 7709.HK product and is planned for deployment on BNB Smart Chain.')}</p>
          <div class="adgm-channels"><span>${chainIcon('bnb')}<b>BNB Smart Chain</b><small>${t('擬部署', 'Planned deployment')}</small></span></div>
          <div class="adgm-actions"><a class="adgm-button primary" href="${adgmRoute('terms')}">${t('查看產品資料', 'View product details')} ${arrow}</a></div>
          <p class="adgm-prelaunch">${t('發行人及產品安排仍在籌備，最終權利、資格及限制以正式產品文件為準。', 'The issuer and product arrangements are in preparation. Final rights, eligibility and restrictions will be set out in the formal product documents.')}</p>
        </div>
        <div class="adgm-token-scene" aria-hidden="true"><div class="adgm-ring ring-one"></div><div class="adgm-ring ring-two"></div><div class="adgm-mark">${productMark('adgm')}</div><div class="adgm-visual-label"><span>7709.W</span></div><div class="adgm-floor"></div></div>
      </div>
      <div class="adgm-hero-facts"><div><span>${t('底層上市產品', 'Underlying listed product')}</span><strong>${t('港交所', 'HKEX')} · 7709.HK</strong></div><div><span>${t('擬議產品形式', 'Proposed instrument')}</span><strong>${t('受益權益憑證', 'Beneficial-interest Certificate')}</strong></div><div><span>${t('二級市場', 'Secondary market')}</span><strong>${t('規劃全天候交易', '24/7 trading planned')}</strong></div></div>
    </div>
  </section>`;
}

function adgmFeatures() {
  return `<section class="adgm-section" id="adgm-features"><div class="wrap">
    <div class="adgm-section-head"><span class="adgm-kicker">04 · ${t('核心賣點', 'Key features')}</span><h2>${t('7709.W 擬提供由底層資產支持的每日槓桿敞口。', '7709.W is designed to provide asset-backed daily leveraged exposure.')}</h2></div>
    <div class="adgm-feature-grid">${adgmFeaturesData().map((feature,index)=>`<article class="adgm-feature"><div class="adgm-feature-top"><span>0${index+1}</span><strong>${feature.symbol}</strong></div><h3>${feature.title}</h3><p>${feature.copy}</p><div class="adgm-feature-condition"><span>${t('適用條件', 'Conditions')}</span><p>${feature.condition}</p></div></article>`).join('')}</div>
  </div></section>`;
}

function adgmFacts() {
  return [
    [t('正式產品名稱', 'Product name'), 'WAGMIx SK Hynix Daily Max (2x) Token'],
    [t('產品代碼', 'Ticker'), '7709.W'],
    [t('擬議法律工具', 'Proposed instrument'), t('ADGM 發行人擬發行有限追索憑證。', 'A Certificate issued by an ADGM issuer under a proposed limited-recourse arrangement.')],
    [t('發行人', 'Issuer'), t('擬設立的 ADGM 特殊目的公司，法定名稱待定。', 'An ADGM special-purpose vehicle is being established. Its legal name is pending.')],
    [t('底層參考資產', 'Underlying reference asset'), t('南方東英 SK 海力士每日槓桿最多（2x）產品（7709.HK）', 'CSOP SK Hynix Daily Max (2x) Leveraged Product (7709.HK)')],
    [t('預期首發網絡', 'Expected initial network'), 'BNB Smart Chain · BEP-20'],
    [t('一級申購', 'Primary subscription'), t('獲准參與者經 Finloop Finance Limited 辦理，可交付 7709.HK 單位、現金或獲准的法幣參考代幣。', 'Approved participants subscribe through Finloop Finance Limited in 7709.HK units, cash or an approved fiat-referenced token.')],
    [t('一級贖回', 'Primary redemption'), t('僅完成發行人 KYC 的認可參與者（AP）可經 Finloop Finance Limited 行使。', 'Only Authorised Participants (APs) that have completed issuer KYC may redeem through Finloop Finance Limited.')],
    [t('最低一級規模', 'Primary minimum'), t('跨支持網絡的每筆一級申贖為 100,000 份 7709.W。', '100,000 units of 7709.W per primary order across supported networks.')],
    [t('一級申贖時段', 'Primary request hours'), t('可全天候提交申贖請求，須具備可靠估值、儲備核對及可用區塊鏈。', 'Requests may be submitted around the clock, subject to reliable valuation, reserve verification and blockchain availability.')],
    [t('申購及贖回費', 'Subscription and redemption fees'), t('各為相應交易額的 0.10%。', '0.10% of the corresponding transaction value for each.')],
    [t('底層資產托管費', 'Underlying custody fee'), t('每年 0.25%，按發行人隔離托管賬戶內 7709.HK 單位的價值計算。', '0.25% per annum, based on the value of 7709.HK units in the issuer’s segregated custody account.')],
    [t('其他交易成本', 'Other transaction costs'), t('二級市場點差、平台交易費及鏈上網絡費另計。', 'Secondary-market spreads, venue trading fees and blockchain network fees may also apply.')]
  ];
}

function adgmTerms() {
  return `<section class="adgm-section adgm-terms" id="adgm-terms"><div class="wrap">
    <div class="adgm-section-head"><span class="adgm-kicker">05 · ${t('產品資料與權利', 'Product details & rights')}</span><h2>${t('普通持有人參與二級交易，一級贖回限符合資格的 AP。', 'Ordinary holders trade in the secondary market; primary redemption is limited to eligible APs.')}</h2></div>
    <div class="adgm-terms-layout"><div class="adgm-facts"><h3>${t('產品安排按正式文件確定。', 'Formal documents will determine the product arrangements.')}</h3><dl>${adgmFacts().map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div>
    <aside class="adgm-rights"><span class="adgm-kicker">${t('持有人權利', 'Holder rights')}</span><div class="adgm-rights-ratio"><strong>1</strong><span>${t('憑證', 'Certificate')}</span><i>↔</i><strong>1</strong><span>${t('底層單位的受益權益', 'beneficial interest in an underlying unit')}</span></div><h3>${t('受益權益與有限追索，依最終條款生效。', 'Beneficial interest and limited recourse depend on the final terms.')}</h3><p>${t('每份憑證擬對應一個 7709.HK 單位的受益權益。持有人不直接擁有該單位，亦不享有對 SK 海力士或底層產品管理人的投票及管理權。', 'Each Certificate is intended to represent a beneficial interest in one 7709.HK unit. Holders do not directly own that unit or acquire voting or management rights over SK hynix or the underlying product manager.')}</p><div class="adgm-rights-note"><b>${t('普通持有人沒有一級贖回權。', 'Ordinary holders have no primary redemption right.')}</b><p>${t('合資格 AP 完成發行人 KYC 後，方可經指定代理行使贖回權。普通持有人可按平台規則在二級市場買賣。', 'Eligible APs may redeem through the appointed agent after completing issuer KYC. Ordinary holders may buy or sell in the secondary market under the venue rules.')}</p></div><p>${t('持有人權益擬僅由對應的隔離托管資產或其淨出售所得履行。經允許的待交收儲備可包含現金或獲准的法幣參考代幣。最終有限追索及托管安排以正式產品文件為準。', 'Holder entitlements are intended to be met only from the corresponding segregated custody assets or their net sale proceeds. Permitted pending-settlement reserves may include cash or approved fiat-referenced tokens. Final custody and limited-recourse arrangements will be set out in the formal product documents.')}</p></aside></div>
  </div></section>`;
}

function adgmDocuments() {
  return `<section class="adgm-section adgm-documents" id="adgm-documents"><div class="wrap"><div class="adgm-document-layout"><div><span class="adgm-kicker">06 · ${t('產品文件', 'Product documents')}</span><h2>${t('7709.W 的完整條款將於正式產品文件中公布。', 'The formal product documents will set out the full terms for 7709.W.')}</h2><p>${t('產品導讀按目前籌備中的 ADGM 架構，說明憑證權益、二級交易、AP 申贖及費用。', 'The reading guide explains the proposed ADGM Certificate, secondary trading, AP access and fees.')}</p><div class="adgm-actions"><a class="adgm-button primary" href="${adgmRoute('guide')}">${t('閱讀 7709.W 產品導讀', 'Read the 7709.W product guide')} ${arrow}</a><button class="adgm-button muted" disabled>${t('正式產品文件準備中', 'Formal product documents in preparation')}</button></div></div><div class="adgm-document-visual" aria-hidden="true"><span>WAGMIx</span><b>7709.W</b><i></i><small>${t('產品導讀', 'PRODUCT GUIDE')}</small></div></div><p class="adgm-document-note">${t('本頁反映產品籌備中的擬議安排。正式發行、准入交易及最終產品條款，須完成相關文件和適用程序。', 'This page describes arrangements proposed during product preparation. Issuance, admission to trading and final terms remain subject to the relevant documentation and applicable processes.')}</p></div></section>`;
}

function adgmProduct() {
  const market = productMarket().replaceAll('product-market', 'adgm-market').replaceAll('SKHY2Lw', '7709.W');
  const theme = productTheme().replaceAll('product-theme', 'adgm-theme');
  return `<main id="main" class="p-page adgm-page">${adgmHero()}${market}${theme}${adgmFeatures()}${adgmTerms()}${adgmDocuments()}</main>`;
}

function adgmGuide() {
  const chapters = [
    [t('憑證擬提供一對一的底層受益權益。', 'Certificates are intended to provide a one-to-one beneficial interest.'), t('7709.W 擬由 ADGM 發行人發行，每枚代幣代表一份 Certificate。每份憑證對應一個 7709.HK 單位的受益權益，並按最終文件採有限追索安排。發行人仍在設立，法定名稱及最終文件待完成。', '7709.W is proposed to be issued by an ADGM issuer, with each token representing one Certificate. Each Certificate is intended to correspond to a beneficial interest in one 7709.HK unit under final limited-recourse terms. The issuer is being established, and its statutory name and final documents remain to be completed.')],
    [t('二級成交價由市場形成，可偏離指示價值。', 'Secondary prices are market-determined and may differ from indicative value.'), t('參與二級交易須符合適用的 KYC、適當性及地區限制。底層 7709.HK 的 NAV、指示性淨值及市場價格可供估值參考，並非 7709.W 的保證成交價。', 'Secondary trading is subject to applicable KYC, suitability and jurisdictional requirements. NAV, indicative NAV and market prices of 7709.HK may inform valuation and are not guaranteed executable prices for 7709.W.')],
    [t('全天候提交一級請求，仍須滿足估值和交收條件。', 'Around-the-clock primary requests remain subject to valuation and settlement conditions.'), t('合資格參與者可全天候提交一級申贖請求，經 Finloop Finance Limited 辦理。訂單須具備可靠估值、儲備核對及可用區塊鏈。普通持有人沒有一級贖回權，僅完成發行人 KYC 的 AP 可行使該權利。', 'Eligible participants may submit primary requests around the clock through Finloop Finance Limited, subject to reliable valuation, reserve verification and blockchain availability. Ordinary holders have no primary redemption right. Only APs that have completed issuer KYC may exercise that right.')],
    [t('費用及最低規模適用於一級申贖。', 'Fees and minimum order sizes apply to primary access.'), t('最低一級訂單為 100,000 份 7709.W。申購費及贖回費各為相應交易額的 0.10%。底層托管費為隔離托管賬戶內 7709.HK 單位價值的每年 0.25%。二級點差、平台費及網絡費另計。', 'The minimum primary order is 100,000 units of 7709.W. Subscription and redemption fees are each 0.10% of the corresponding transaction value. Underlying custody is 0.25% per annum on the value of 7709.HK units in the segregated custody account. Secondary spreads, venue fees and network fees may also apply.')],
    [t('底層每日槓桿與市場中斷可影響憑證價值。', 'Daily leverage and market disruptions may affect Certificate value.'), t('7709.HK 追求每日最多兩倍的槓桿表現。每日再平衡、路徑依賴、波動、價格偏離及市場流動性均可影響價值。無法可靠估值或交收、托管或持倉核對受阻時，申贖或報價可能受限或暫停。', '7709.HK seeks daily leveraged performance of up to two times. Daily rebalancing, path dependency, volatility, price deviations and liquidity may affect value. Valuation, settlement, custody or reconciliation disruptions may restrict or suspend primary access or quotations.')]
  ];
  return `<main id="main" class="adgm-page adgm-guide"><div class="wrap"><a class="adgm-back" href="${adgmRoute('documents')}">← ${t('返回產品文件', 'Back to product documents')}</a><span class="adgm-kicker">7709.W</span><h1>${t('憑證權利、交易與申贖，依各自適用條件辦理。', 'Certificate rights, trading and primary access have distinct conditions.')}</h1><p class="adgm-guide-summary">${t('7709.W 是籌備中的 ADGM 憑證產品，擬於 BNB Smart Chain 部署。按擬議條款，普通持有人可在二級市場買賣。一級贖回僅限已完成發行人 KYC 的認可參與者（AP）。', '7709.W is a proposed ADGM Certificate planned for deployment on BNB Smart Chain. Under the proposed terms, ordinary holders may buy and sell in the secondary market. Only Authorised Participants (APs) that have completed issuer KYC may exercise primary redemption rights.')}</p><div class="adgm-guide-body">${chapters.map(([title,copy],index)=>`<section><span>0${index+1}</span><h2>${title}</h2><p>${copy}</p></section>`).join('')}</div><p class="adgm-document-note">${t('本導讀概述擬議產品安排。正式條款、持有人權利及文件適用順序，以最終產品文件為準。', 'This guide summarises the proposed arrangements. Final product documents will determine the terms, holder rights and document precedence.')}</p><a class="adgm-button secondary" href="${adgmRoute('overview')}">${t('返回產品總覽', 'Return to product overview')} ${arrow}</a></div></main>`;
}
