(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const current = location.pathname.split('/').pop() || 'index.html';
  const menu = $('[data-menu]');
  const menuToggle = $('[data-menu-toggle]');

  if (menu) {
    menu.setAttribute('aria-label', 'Navigazione principale');
    menu.innerHTML = `
      <a href="prodotto.html">Prodotto</a>
      <a href="soluzioni.html">Soluzioni</a>
      <a href="digital-receptionist.html">Digital Receptionist</a>
      <a href="integrazioni.html">Integrazioni</a>
      <a href="sicurezza.html">Sicurezza</a>
      <a href="azienda.html">Azienda</a>
      <a href="contatti.html">Contatti</a>`;

    $$('a', menu).forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === current) link.setAttribute('aria-current', 'page');
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const headerCta = $('.header-cta');
  if (headerCta) {
    headerCta.href = 'index.html#demo';
    headerCta.textContent = 'Sconto lancio −50%';
  }

  const header = $('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });
})();
