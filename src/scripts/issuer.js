function selectIssuerSection() {
  const section = location.hash === '#contact' ? 'contact' : 'documentation';
  document.querySelectorAll('.issuer-content').forEach(panel => {
    panel.hidden = panel.id !== section;
  });
  document.querySelectorAll('.issuer-nav a[href^="#"]').forEach(link => {
    if (link.hash === '#' + section) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

selectIssuerSection();
window.addEventListener('hashchange', selectIssuerSection);
