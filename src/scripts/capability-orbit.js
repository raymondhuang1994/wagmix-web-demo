function capabilityOrbit(items, logo, {label}) {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const icon = (markup, scope) => markup
    .replace(/\bid="([^"]+)"/g, (_, id) => `id="${scope}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${scope}-${id})`);
  const nodes = items.map(({icon: artwork}, index) => `<span class="orbit-node">${icon(artwork, `ring-${index}`)}</span>`).join('');
  const rows = items.map(({title, icon: artwork, description}, index) => `<li class="orbit-item" id="capability-${index}" data-orbit-item="${index}">
    <span class="orbit-item-icon" aria-hidden="true">${icon(artwork, `row-${index}`)}</span>
    <div><h3>${escape(title)}</h3><p>${description}</p></div>
  </li>`).join('');
  return `<div class="capability-orbit" data-capability-orbit>
    <div class="orbit-diagram" aria-hidden="true">
      <svg class="orbit-lines" viewBox="0 0 520 520" focusable="false">
        <circle class="orbit-outer-line" cx="260" cy="260" r="188"/><circle class="orbit-main-line" cx="260" cy="260" r="164"/><circle class="orbit-inner-line" cx="260" cy="260" r="116"/>
      </svg>
      <div class="orbit-wordmark"><img src="${logo}" alt="" width="540" height="100"></div>
      <div class="orbit-nodes">${nodes}</div>
    </div>
    <ul class="orbit-list" role="list" aria-label="${escape(label)}">${rows}</ul>
  </div>`;
}
