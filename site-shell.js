(() => {
  'use strict';

  const enhance = () => {
    // La landing resta la pagina di conversione, ma espone l'architettura completa del sito.
    if (!document.querySelector('#piattaforma')) return;

    const nav = document.querySelector('[data-menu]');
    if (nav) {
      nav.innerHTML = [
        ['prodotto.html', 'Prodotto'],
        ['soluzioni.html', 'Soluzioni'],
        ['integrazioni.html', 'Integrazioni'],
        ['sicurezza.html', 'Sicurezza'],
        ['azienda.html', 'Azienda']
      ].map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
    }

    const headerCta = document.querySelector('.header-cta');
    if (headerCta) {
      headerCta.href = '#demo';
      headerCta.textContent = 'Pre-lancio';
    }

    const footerGrid = document.querySelector('.footer-grid');
    if (footerGrid) {
      footerGrid.innerHTML = `
        <div>
          <a class="logo" href="#top"><span class="logo-mark">W</span><span>Welora</span></a>
          <p>Gestionale operativo per hospitality, servizi, pagamenti, fiscalità e automazioni, dalla singola struttura al multi-sede.</p>
        </div>
        <div>
          <strong>Prodotto</strong>
          <a href="prodotto.html">Panoramica</a>
          <a href="soluzioni.html">Soluzioni</a>
          <a href="integrazioni.html">Integrazioni</a>
          <a href="#prezzi">Prezzi e Founding</a>
        </div>
        <div>
          <strong>Approfondisci</strong>
          <a href="sicurezza.html">Sicurezza</a>
          <a href="azienda.html">Azienda</a>
          <a href="contatti.html">Contatti</a>
          <a href="#receptionist">Digital Receptionist</a>
        </div>
        <div>
          <strong>Legale e contatti</strong>
          <a href="mailto:lancio@welora.it">lancio@welora.it</a>
          <a href="privacy.html">Privacy</a>
          <a href="cookies.html">Cookie</a>
          <a href="#" data-cookie-settings>Preferenze cookie</a>
        </div>`;
    }

    // La nuova nav viene inserita dopo che app.js ha registrato i listener originali.
    // Agganciamo quindi la chiusura del menu mobile anche ai link appena creati.
    document.querySelectorAll('[data-menu] a').forEach(link => link.addEventListener('click', () => {
      const menu = document.querySelector('[data-menu]');
      const toggle = document.querySelector('[data-menu-toggle]');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }));
  };

  const schedule = () => setTimeout(enhance, 0);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
})();
