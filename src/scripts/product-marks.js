/* Product emblems share the 7709 typography and the WAGMIx blue family. */
let productMarkInstance = 0;
function productMark(variant = 'bvi') {
  const square = variant === 'adgm';
  const shape = square ? 'square' : 'round';
  const id = `wm7709-${shape}-${++productMarkInstance}`;
  const title = square ? '7709.W' : 'SKHY2Lw';
  const shell = square
    ? `<rect x="13" y="13" width="230" height="230" rx="56" fill="#080e20" stroke="#395ae7" stroke-width="2"/><rect x="27" y="27" width="202" height="202" rx="44" fill="url(#${id}-bg)"/><path d="M58 61h45M58 61v21M198 195h-45M198 195v-21" fill="none" stroke="#76cfff" stroke-width="3"/><path d="M31 171c45-97 143-126 199-96" fill="none" stroke="#3d6bff" stroke-width="1.3" opacity=".7"/>`
    : `<circle cx="128" cy="128" r="116" fill="url(#${id}-silver)" stroke="#c3d7ef" stroke-width="2"/><circle cx="128" cy="128" r="102" fill="url(#${id}-bg)"/><circle cx="128" cy="128" r="91" fill="none" stroke="#8ec2f9" stroke-width="1" opacity=".65"/><path d="M46 174a98 98 0 0 0 163-82" fill="none" stroke="#fbfdff" stroke-width="4" opacity=".7"/>`;
  return `<svg class="product-emblem product-emblem-${shape}" viewBox="0 0 256 256" role="img" aria-label="${title}"><title>${title}</title><defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${square?'#223c96':'#2a74c4'}"/><stop offset="1" stop-color="${square?'#080d20':'#102c59'}"/></linearGradient><linearGradient id="${id}-silver" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".45" stop-color="#ccdff2"/><stop offset="1" stop-color="#94aec9"/></linearGradient></defs>${shell}<text x="128" y="149" text-anchor="middle" fill="#fff" font-family="Arial,Helvetica,sans-serif" font-size="69" font-weight="700" letter-spacing="-4">7709</text><path d="m112 169 8 8 8-8 8 8 8-8" fill="none" stroke="${square?'#69c9ff':'#b9d9ff'}" stroke-width="3" stroke-linecap="round"/></svg>`;
}
