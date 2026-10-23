(() => {
  'use strict';

  const enhance = () => {
    if (!document.querySelector('#piattaforma')) return;

    if (!document.querySelector('link[href^="home-enhancements.css"]')) {
      const homeStyles = document.createElement('link');
      homeStyles.rel = 'stylesheet';
      homeStyles.href = 'home-enhancements.css?v=20261014-9';
      document.head.appendChild(homeStyles);
    }
    if (!document.querySelector('link[href^="nav-flat.css"]')) {
      const navStyles = document.createElement('link');
      navStyles.rel = 'stylesheet';
      navStyles.href = 'nav-flat.css?v=20261014-2';
      document.head.appendChild(navStyles);
    }

    document.body.classList.add('home-has-landing-nav');

    const mainNav = document.querySelector('[data-menu]');
    if (mainNav) {
      mainNav.setAttribute('aria-label', 'Navigazione principale');
      mainNav.innerHTML = `
        <a href="prodotto.html">Prodotto</a>
        <a href="soluzioni.html">Soluzioni</a>
        <a href="digital-receptionist.html">Digital Receptionist</a>
        <a href="integrazioni.html">Integrazioni</a>
        <a href="sicurezza.html">Sicurezza</a>
        <a href="azienda.html">Azienda</a>
        <a href="contatti.html">Contatti</a>`;
    }

    const headerCta = document.querySelector('.header-cta');
    if (headerCta) {
      headerCta.href = '#demo';
      headerCta.textContent = 'Sconto lancio −50%';
    }

    document.querySelector('.home-resource-bar')?.remove();

    const header = document.querySelector('.site-header');
    if (header && !document.querySelector('.landing-subnav')) {
      const landingNav = document.createElement('div');
      landingNav.className = 'landing-subnav';
      landingNav.innerHTML = `
        <div class="container landing-subnav-inner">
          <nav class="landing-subnav-links" aria-label="Navigazione della pagina">
            <a href="#top" data-landing-link="top">Panoramica</a>
            <a href="#confronto" data-landing-link="confronto">Quanto risparmi</a>
            <a href="#piattaforma" data-landing-link="piattaforma">Cosa include</a>
            <a href="#automazioni" data-landing-link="automazioni">Automazioni</a>
            <a href="#prezzi" data-landing-link="prezzi">Prezzi</a>
          </nav>
        </div>`;
      header.insertAdjacentElement('afterend', landingNav);
    }

    if (!document.querySelector('#contatti')) {
      const contact = document.createElement('section');
      contact.id = 'contatti';
      contact.className = 'section home-contact';
      contact.setAttribute('aria-labelledby', 'home-contact-title');
      contact.innerHTML = `
        <div class="container home-contact-grid">
          <div class="home-contact-intro">
            <div class="eyebrow"><span></span>Parliamo della tua struttura</div>
            <h2 id="home-contact-title">Una domanda concreta merita una risposta concreta.</h2>
            <p>Vuoi capire se Welora si adatta alla tua struttura, ai servizi che vendi o ai flussi che vuoi automatizzare? Scrivici: il contatto commerciale è diretto e lo sconto lancio è disponibile per le adesioni idonee.</p>
            <div class="home-contact-actions">
              <a class="button" href="mailto:lancio@welora.it">Scrivi a lancio@welora.it</a>
              <a class="button button-ghost home-contact-secondary" href="contatti.html">Vai alla pagina Contatti</a>
            </div>
            <div class="home-contact-note">Nessun pagamento prima dell’attivazione.</div>
          </div>
          <div class="home-contact-cards">
            <article class="home-contact-card">
              <small>Commerciale e lancio</small>
              <strong><a href="mailto:lancio@welora.it">lancio@welora.it</a></strong>
              <p>Per demo, sconto lancio, pricing e valutazione dei flussi della struttura.</p>
            </article>
            <article class="home-contact-card">
              <small>Supporto e privacy</small>
              <strong><a href="mailto:support@welora.it">support@welora.it</a></strong>
              <p>Per richieste di supporto sul sito e comunicazioni relative alla privacy.</p>
            </article>
            <article class="home-contact-card wide">
              <small>Welora</small>
              <strong>33028 Tolmezzo (UD), Italia</strong>
              <p>Lancio il 15 febbraio 2027. Condizioni definitive confermate prima della sottoscrizione.</p>
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
          <strong>Per tipo di struttura</strong>
          <a href="gestionale-bb.html">Gestionale per B&amp;B</a>
          <a href="software-affitti-brevi.html">Software per affitti brevi</a>
          <a href="gestionale-hotel.html">Gestionale per piccoli hotel</a>
          <a href="#prezzi">Prezzi</a>
        </div>
        <div>
          <strong>Welora</strong>
          <a href="prodotto.html">Prodotto</a>
          <a href="soluzioni.html">Soluzioni</a>
          <a href="digital-receptionist.html">Digital Receptionist</a>
          <a href="integrazioni.html">Integrazioni</a>
          <a href="sicurezza.html">Sicurezza</a>
          <a href="azienda.html">Azienda</a>
        </div>
        <div>
          <strong>Contatti e legale</strong>
          <a href="contatti.html">Contatti</a>
          <a href="mailto:lancio@welora.it">lancio@welora.it</a>
          <a href="https://www.facebook.com/welorahospitality" target="_blank" rel="noopener">Facebook</a>
          <a href="privacy.html">Privacy</a>
          <a href="cookies.html">Cookie</a>
          <a href="#" data-cookie-settings>Preferenze cookie</a>
        </div>`;
    }

    document.querySelectorAll('[data-menu] a').forEach(link => link.addEventListener('click', () => {
      const menu = document.querySelector('[data-menu]');
      const toggle = document.querySelector('[data-menu-toggle]');
      menu?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }));

    const sectionIds = ['top', 'confronto', 'piattaforma', 'automazioni', 'prezzi'];
    const links = [...document.querySelectorAll('[data-landing-link]')];
    const setActive = id => links.forEach(link => link.classList.toggle('active', link.dataset.landingLink === id));
    setActive('top');

    if ('IntersectionObserver' in window) {
      const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
      const observer = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .35, .6] });
      sections.forEach(section => observer.observe(section));
    }
  };

  const schedule = () => setTimeout(enhance, 0);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();
