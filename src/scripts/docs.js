/* WAGMIx product documents. Reference translation and English white paper are paired by clause. */
function docsIcon(kind){const p={structure:'<rect x="4" y="3" width="16" height="6" rx="2"/><rect x="4" y="15" width="16" height="6" rx="2"/><path d="M12 9v6m-3-3 3 3 3-3"/>',access:'<path d="M5 5h14v14H5zM1 12h9m-3-3 3 3-3 3M14 12h9m-3-3 3 3-3 3"/>',fees:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3"/>',risk:'<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6zM12 7v6m0 3v1"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'};return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p[kind]||p.structure}</svg>`;}
function docsSearch(){return `<div class="docs-search-wrap"><div class="docs-search-field">${docsIcon('search')}<input data-docs-search type="search" maxlength="100" autocomplete="off" spellcheck="false" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="docs-search-results" aria-label="${t('搜尋白皮書章節及條款','Search white paper chapters and clauses')}" placeholder="${t('搜尋章節、費用或條款…','Search chapters, fees or clauses…')}"><span class="docs-search-hint">↵</span></div><div id="docs-search-results" class="docs-search-results" role="listbox" aria-label="${t('搜尋結果','Search results')}" hidden></div></div>`;}
function docsHome() {
  const cover = WHITEPAPER_COVER;
  return `<main id="main" class="docs-home docs-source-home">
    <section class="docs-cover wrap" id="whitepaper-cover" aria-labelledby="whitepaper-title">
      <img class="docs-cover-logo" src="${LOGO}" alt="WAGMIx">
      <h1 id="whitepaper-title" lang="en">${esc(cover.title)}</h1>
      <p class="docs-cover-subtitle" lang="en">${esc(cover.subtitle)}</p>
      <div class="docs-cover-parties" lang="en">${cover.parties.map(party => `<div>
        <span>${esc(party.role)}</span>
        <h2>${esc(party.name)}</h2>
        <p>${esc(party.description)}</p>
      </div>`).join('')}</div>
      <p class="docs-cover-date" lang="en">${esc(cover.date)}</p>
      <div class="docs-hero-actions">
        <a class="btn" href="#/whitepaper/information">${t('閱讀白皮書','Read White Paper')} ${arrow}</a>
        ${docsDownloads()}
      </div>
      ${L === 'zh' ? `<p class="docs-reference-note" role="note">${whitepaperLanguageNotice()}</p>` : ''}
    </section>
    <section class="docs-contents wrap" id="whitepaper-contents" aria-labelledby="whitepaper-contents-title">
      <div class="docs-contents-heading">
        <h2 id="whitepaper-contents-title" lang="en">Table of Contents</h2>
        ${docsSearch()}
      </div>
      <nav class="docs-source-toc" aria-labelledby="whitepaper-contents-title">
        ${WHITEPAPER.map(chapter => `<a href="#/whitepaper/${chapter.id}">
          <span><span lang="en">${esc(chapter.sourceTitle.en)}</span>${L === 'zh' ? `<small lang="zh-Hant">${esc(chapter.sourceTitle.zh)}</small>` : ''}</span>
          <span aria-hidden="true">↗</span>
        </a>`).join('')}
      </nav>
    </section>
  </main>`;
}
function whitepaperLanguageNotice() {
  return t('中文譯文僅供參考；如與英文原文存在任何歧義或不一致，概以英文原文為準。','The Chinese translation is for reference only. In the event of any ambiguity or inconsistency, the English original shall prevail.');
}
function docsDownloads() {
  return `<div class="wp-download-actions">${downloadLink('whitepaper',t('下載白皮書','Download White Paper'),'btn secondary')}<span class="wp-download-format">${t('英文原文 · PDF','English original · PDF')}</span></div>`;
}
function wpParagraphs(text,lang) {
  return String(text || '').split('\n\n').filter(Boolean).map(p => `<p lang="${lang}">${esc(p)}</p>`).join('');
}
function displayClauseRef(ref) {
  return ref === 'Disclaimer' ? t('免責聲明','Disclaimer') : ref;
}
function clauseLead(s) {
  return L === 'zh' ? (s.fieldZh || s.field) : s.field;
}
function wpEntry(s, showHeading = true) {
  return `<section class="wp-entry" id="wp-${s.ref.replaceAll('.','-')}" data-clause="${esc(s.ref)}">
    ${showHeading ? `<div class="wp-entry-ref">${esc(s.ref)}</div><h2 lang="en">${esc(s.field)}</h2>` : ''}
    <div class="wp-clause-content wp-english-original">${wpParagraphs(s.content,'en')}</div>
    ${L === 'zh' && s.contentZh ? `<details class="wp-source-toggle wp-reference-translation">
      <summary><span>繁體中文參考譯文</span><span class="wp-source-toggle-icon" aria-hidden="true">+</span></summary>
      <div class="wp-source-text" lang="zh-Hant">
        <h3>${esc(s.fieldZh || s.field)}</h3>
        ${wpParagraphs(s.contentZh,'zh-Hant')}
      </div>
    </details>` : ''}
  </section>`;
}
function whitepaper(id = 'information') {
  const found = WHITEPAPER.findIndex(chapter => chapter.id === id);
  const index = found < 0 ? 0 : found;
  const chapter = WHITEPAPER[index];
  return `<main id="main" class="wp-world wp-source-reader">
    <div class="wrap wp-page-wrap">
      <div class="wp-document-mark"><img class="brand-plate" src="${LOGO}" alt="WAGMIx"><span>SKHY2Lw / ${t('產品白皮書','PRODUCT WHITE PAPER')}</span></div>
      <div class="wp-slab"><div class="wp-body">
        <div class="wp-toolbar"><span>${t('章節','CHAPTER')} ${String(index + 1).padStart(2,'0')} <b>/ ${WHITEPAPER.length}</b></span>${docsSearch()}</div>
        <article class="wp-article">
          <h1 lang="en">${esc(chapter.sourceTitle.en)}</h1>
          ${L === 'zh' ? `<p class="wp-reference-note" role="note">${whitepaperLanguageNotice()}</p>` : ''}
          ${chapter.sections.map(section => wpEntry(section, chapter.id !== 'disclaimer')).join('')}
        </article>
      </div></div>
    </div>
  </main>`;
}
function docsSearchRecords(query) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const results = [];
  for (const chapter of WHITEPAPER) {
    for (const section of chapter.sections) {
      const dateAliases = section.ref === 'B.7' ? '2026 年 11 月 20 日 20 November 2026 2026.11.20' : '';
      const fields = [section.ref, section.field, section.fieldZh || '', section.content, section.contentZh || '', dateAliases];
      const clauseText = fields.join(' ').toLocaleLowerCase();
      const clauseHits = words.filter(word => clauseText.includes(word)).length;
      const searchable = [...fields, chapter.sourceTitle.en, chapter.sourceTitle.zh].join(' ').toLocaleLowerCase();
      if (!words.every(word => searchable.includes(word))) continue;
      const preferred = L === 'zh'
        ? [section.contentZh, section.content, section.fieldZh, section.field]
        : [section.content, section.field, section.contentZh, section.fieldZh];
      const body = preferred.find(text => text && words.some(word => text.toLocaleLowerCase().includes(word))) || section.content;
      const position = Math.max(0, body.toLocaleLowerCase().indexOf(words[0]));
      const start = Math.max(0, position - 54);
      const end = Math.min(body.length, start + 205);
      const snippet = (start ? '…' : '') + body.slice(start,end).replace(/\s+/g,' ') + (end < body.length ? '…' : '');
      results.push({clauseHits, record:{chapter, id:section.ref.replaceAll('.','-'), ref:section.ref, title:clauseLead(section), snippet}});
    }
  }
  return results.sort((a,b) => b.clauseHits - a.clauseHits).map(result => result.record);
}
function docsMark(text,query){const words=query.trim().split(/\s+/).filter(Boolean).sort((a,b)=>b.length-a.length);if(!words.length)return esc(text);const pattern=words.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');const re=new RegExp(`(${pattern})`,'gi');return String(text).split(re).map((p,i)=>i%2?`<mark>${esc(p)}</mark>`:esc(p)).join('');}
function closeDocsSearch(){document.querySelectorAll('[data-docs-search]').forEach(x=>x.setAttribute('aria-expanded','false'));document.querySelectorAll('.docs-search-results').forEach(x=>x.hidden=true);}
function handleDocsInput(e){if(!e.target.matches('[data-docs-search]'))return;const input=e.target,wrap=input.closest('.docs-search-wrap'),box=wrap.querySelector('.docs-search-results'),query=input.value.trim();if(!query){box.hidden=true;input.setAttribute('aria-expanded','false');return;}const results=docsSearchRecords(query);box.innerHTML=`<div class="docs-result-count">${results.length} ${t('項相關條款','matching entries')}<button type="button" data-docs-close aria-label="${t('關閉搜尋結果','Close search results')}">×</button></div>${results.length?results.slice(0,15).map((r,i)=>`<a role="option" aria-selected="false" class="docs-search-result" id="docs-result-${i}" href="#/whitepaper/${r.chapter.id}/${r.id}"><span>${esc(pick(r.chapter.sourceTitle))} <b>${esc(displayClauseRef(r.ref))}</b></span><strong>${docsMark(r.title,query)}</strong><p>${docsMark(r.snippet,query)}</p></a>`).join(''):`<div class="docs-no-results"><strong>${t('未找到相關內容','No matching content')}</strong><p>${t('可嘗試「費用」「贖回」「風險」或英文關鍵字。','Try “fees”, “redemption”, “risk” or a clause reference.')}</p></div>`}${results.length>15?`<div class="docs-result-more">${t('顯示前 15 項；加入關鍵字可縮小搜尋範圍。','Showing the first 15 entries. Add keywords to narrow your search.')}</div>`:''}`;box.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');}
function handleDocsClick(e){if(e.target.closest('[data-docs-close]')){closeDocsSearch();return;}if(e.target.closest('.docs-search-result')){closeDocsSearch();return;}if(!e.target.closest('.docs-search-wrap'))closeDocsSearch();if(e.target.matches('[data-docs-search]')&&e.target.value.trim())handleDocsInput(e);}
function handleDocsKeydown(e){if(e.key==='Escape'){closeDocsSearch();return;}if(!e.target.matches('[data-docs-search]'))return;const box=e.target.closest('.docs-search-wrap').querySelector('.docs-search-results');if(box.hidden)return;const links=[...box.querySelectorAll('.docs-search-result')];if(!links.length)return;const current=links.findIndex(a=>a.getAttribute('aria-selected')==='true');if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const i=e.key==='ArrowDown'?(current+1)%links.length:(current<=0?links.length-1:current-1);links.forEach((a,j)=>a.setAttribute('aria-selected',j===i?'true':'false'));e.target.setAttribute('aria-activedescendant',links[i].id);links[i].scrollIntoView({block:'nearest'});}else if(e.key==='Enter'){e.preventDefault();const chosen=links[Math.max(0,current)];location.hash=chosen.getAttribute('href').slice(1);closeDocsSearch();}}
