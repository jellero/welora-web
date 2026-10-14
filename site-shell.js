(() => {
  'use strict';

  const enhance = () => {
    // La home resta la landing commerciale: le pagine interne servono per approfondire, non per sostituirla.
    if (!document.querySelector('#piattaforma')) return;

    if (!document.querySelector('link[href="home-enhancements.css"]')) {
      const homeStyles = document.createElement('link');
      homeStyles.rel = 'stylesheet';
      homeStyles.href = 'home-enhancements.css';
      document.head.appendChild(homeStyles);
    }

    const nav = document.querySelector('[data-menu]');
    if (nav) {
      nav.innerHTML = [
        ['prodotto.html', 'Prodotto'],
        ['soluzioni.html', 'Soluzioni'],
        ['#automazioni', 'Automazioni'],
        ['integrazioni.html', 'Integrazioni'],
        ['sicurezza.html', 'Sicurezza'],
        ['#contatti', 'Contatti']
      ].map(([href, label]) => `<a href="${href}">${label}</a>`).join('');
    }

    const headerCta = document.querySelector('.header-cta');
    if (headerCta) {
      headerCta.href = '#demo';
      headerCta.textContent = 'Pre-lancio';
    }

    // Fascia compatta di approfondimento: aggiunge autorevolezza senza interrompere la landing.
    const hero = document.querySelector('#top');
    if (hero && !document.querySelector('.home-resource-bar')) {
      const resourceBar = document.createElement('div');
      resourceBar.className = 'home-resource-bar';
      resourceBar.innerHTML = `
        <div class="container home-resource-inner">
          <div class="home-resource-label">
            <strong>Welora, oltre la landing</strong>
            <span>Base da €29/mese + IVA · lancio previsto 15 febbraio 2027</span>
          </div>
          <nav class="home-resource-links" aria-label="Approfondimenti Welora">
            <a class="home-resource-link" href="prodotto.html">Prodotto</a>
            <a class="home-resource-link" href="soluzioni.html">Soluzioni</a>
            <a class="home-resource-link" href="integrazioni.html">Integrazioni</a>
            <a class="home-resource-link" href="sicurezza.html">Sicurezza</a>
            <a class="home-resource-link" href="azienda.html">Azienda</a>
          </nav>
        </div>`;
      hero.insertAdjacentElement('afterend', resourceBar);
    }

    // Contatti direttamente in home: il visitatore non deve uscire dalla landing per capire come raggiungerci.
    if (!document.querySelector('#contatti')) {
      const contact = document.createElement('section');
      contact.id = 'contatti';
      contact.className = 'section home-contact';
      contact.innerHTML = `
        <div class="container home-contact-grid">
          <div class="home-contact-intro reveal">
            <div class="eyebrow"><span></span>Parliamo della tua struttura</div>
            <h2>Una domanda concreta merita una risposta concreta.</h2>
            <p>Vuoi capire se Welora si adatta alla tua struttura, ai servizi che vendi o ai flussi che vuoi automatizzare? Scrivici: il contatto commerciale è diretto e il programma Founding è ancora in fase di pre-lancio.</p>
            <div class="home-contact-actions">
              <a class="button" href="mailto:lancio@welora.it">Scrivi a lancio@welora.it</a>
              <a class="button button-ghost" href="contatti.html" style="color:var(--text);border-color:var(--line)">Tutti i contatti</a>
            </div>
            <div class="home-contact-note">Nessun pagamento prima dell’attivazione del programma Founding.</div>
          </div>
          <div class="home-contact-cards reveal reveal-delay">
            <article class="home-contact-card">
              <small>Commerciale e pre-lancio</small>
              <strong><a href="mailto:lancio@welora.it">lancio@welora.it</a></strong>
              <p>Per demo, programma Founding, pricing e valutazione dei flussi della struttura.</p>
            </article>
            <article class="home-contact-card">
              <small>Supporto e privacy</small>
              <strong><a href="mailto:suppor@welora.it">suppor@welora.it</a></strong>
              <p>Per richieste di supporto sul sito e comunicazioni relative alla privacy.</p>
            </article>
            <article class="home-contact-card wide">
              <small>Welora</small>
              <strong>33028 Tolmezzo (UD), Italia</strong>
              <p>Welora è in pre-lancio. Le condizioni definitive, disponibilità dei provider e funzionalità soggette a collaudo vengono confermate prima della sottoscrizione.</p>
            </article>
          </div>
        </div>`;

      const demo = document.querySelector('#demo');
      const footer = document.querySelector('footer');
      if (demo) demo.insertAdjacentElement('afterend', contact);
      else if (footer) footer.insertAdjacentElement('beforebegin', contact);
    }

    const footerGrid = document.querySelector('.footer-grid');
    if (footerGrid) {
      footerGrid.innerHTML = `
        <div>
          <a class="logo" href="#top"><span class="logo-mark">W</span><span>Welora</span></a>
          <p>Ospitalità, servizi, pagamenti, operatività e automazioni nello stesso sistema, dalla singola struttura al multi-sede.</p>
        </div>
        <div>
          <strong>Landing</strong>
          <a href="#piattaforma">Cosa include</a>
          <a href="#automazioni">Automazioni</a>
          <a href="#prezzi">Prezzi e Founding</a>
          <a href="#contatti">Contatti</a>
        </div>
        <div>
          <strong>Approfondisci</strong>
          <a href="prodotto.html">Prodotto</a>
          <a href="soluzioni.html">Soluzioni</a>
          <a href="integrazioni.html">Integrazioni</a>
          <a href="sicurezza.html">Sicurezza</a>
          <a href="azienda.html">Azienda</a>
        </div>
        <div>
          <strong>Welora</strong>
          <a href="mailto:lancio@welora.it">lancio@welora.it</a>
          <a href="contatti.html">Pagina contatti</a>
          <a href="privacy.html">Privacy</a>
          <a href="cookies.html">Cookie</a>
          <a href="#" data-cookie-settings>Preferenze cookie</a>
        </div>`;
    }

    // La nuova nav viene inserita dopo che app.js ha registrato i listener originali.
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
