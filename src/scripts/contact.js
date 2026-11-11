/* Direct official channels; no form data is collected or transmitted. */
function contactPage() {
  return `<main id="main" class="contact-page">
    <div class="wrap contact-page-layout">
      <div class="contact-page-intro">
        <h1>${t('聯絡我們','Contact')}</h1>
        <p>${t('商務合作與機構諮詢','Business and institutional enquiries')}</p>
      </div>
      <section class="contact-page-channels" aria-label="${t('官方聯絡渠道','Official contact channels')}">${contactChannels()}</section>
    </div>
  </main>`;
}
