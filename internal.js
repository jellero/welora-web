(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const header = $('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuToggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  menuToggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  $$('[data-menu] a').forEach(link => link.addEventListener('click', () => {
    menu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }));

  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const current = location.pathname.split('/').pop() || 'index.html';
  $$('[data-page-link]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === current) link.setAttribute('aria-current', 'page');
  });
})();
