(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  if (!document.querySelector('link[href^="nav-flat.css"]')) {
    const navStyles = document.createElement('link');
    navStyles.rel = 'stylesheet';
    navStyles.href = 'nav-flat.css?v=20261014-2';
    document.head.appendChild(navStyles);
  }

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

  const copyReplacements = new Map([
    ['Partecipa al pre-lancio', 'Scopri lo sconto lancio'],
    ['Compila la richiesta Founding', 'Richiedi lo sconto lancio'],
    ['Pre-lancio e commerciale', 'Commerciale e lancio'],
    ['Apri il form Founding →', 'Apri il form →'],
    ['Programma Founding', 'Sconto lancio'],
    ['Se vuoi partecipare al pre-lancio, usa il form dedicato.', 'Se vuoi accedere allo sconto lancio, usa il form dedicato.'],
    ['Founding 2027', 'Sconto lancio 2027'],
    ['Per il pre-lancio: lancio@welora.it', 'Per il lancio: lancio@welora.it'],
    ['Pre-lancio · disponibilità e condizioni soggette a collaudo e conferma.', 'Lancio previsto 15 febbraio 2027 · disponibilità e condizioni soggette a collaudo e conferma.']
  ]);

  $$('a, span, h2, h3, h4, p').forEach(element => {
    const replacement = copyReplacements.get(element.textContent.trim());
    if (replacement) element.textContent = replacement;
  });

  const header = $('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = menu?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  const contactForm = $('[data-contact-form]');
  if (contactForm) {
    const status = $('[data-contact-status]', contactForm);
    const submitButton = $('button[type="submit"]', contactForm);
    const query = new URLSearchParams(location.search);
    const formResult = query.get('form');

    if (formResult === 'success' && status) {
      status.textContent = 'Richiesta inviata. Controlla la tua email per la conferma.';
      status.classList.add('success');
    } else if (formResult === 'error' && status) {
      status.textContent = 'Invio non riuscito. Usa uno dei contatti diretti indicati nella pagina.';
      status.classList.add('error');
    }

    contactForm.addEventListener('submit', async event => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.dataset.originalText = submitButton.textContent || 'Invia richiesta';
        submitButton.textContent = 'Invio in corso…';
      }
      if (status) {
        status.textContent = '';
        status.classList.remove('success', 'error');
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
          }
        });

        let payload = null;
        try {
          payload = await response.json();
        } catch (_) {
          throw new Error('Il server non ha restituito una risposta valida.');
        }

        if (!response.ok || !payload?.ok) {
          throw new Error(payload?.message || 'Invio non riuscito.');
        }

        contactForm.reset();
        if (status) {
          status.textContent = payload.message || 'Richiesta inviata.';
          status.classList.add('success');
        }
      } catch (error) {
        if (status) {
          status.textContent = `${error.message || 'Invio non riuscito.'} In alternativa usa uno dei contatti diretti indicati nella pagina.`;
          status.classList.add('error');
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Invia richiesta';
        }
      }
    });
  }
})();
