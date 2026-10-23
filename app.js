(() => {
  const theme = document.createElement('link');
  theme.rel = 'stylesheet';
  theme.href = 'blue-theme.css';
  document.head.appendChild(theme);

  const consentStyles = document.createElement('link');
  consentStyles.rel = 'stylesheet';
  consentStyles.href = 'consent.css';
  document.head.appendChild(consentStyles);

  if (!document.querySelector('script[src="consent.js"]')) {
    const consentScript = document.createElement('script');
    consentScript.src = 'consent.js';
    consentScript.async = false;
    document.head.appendChild(consentScript);
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Posizionamento: prodotto completo e scalabile; accessibile ai piccoli senza escludere strutture più articolate.
  document.title = 'Welora — Il gestionale completo per strutture ricettive a €29/mese';
  const metaDescription = $('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = 'Welora: PMS, channel manager, check-in, pagamenti e POS, fatture, pulizie, cassa e automazioni in un solo gestionale a €29/mese, tutto incluso. Lancio 15 febbraio 2027.';
  }
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = 'Welora — Tutto il gestionale della tua struttura a €29/mese';
  const ogDescription = $('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.content = 'PMS, canali OTA, check-in, pagamenti, fatture, pulizie, cassa e automazioni in un solo canone. Paghi in più solo ciò che ha un costo reale.';
  }

  const heroTitle = $('.hero-copy h1');
  if (heroTitle) heroTitle.textContent = 'Tutto il gestionale della tua struttura. €29 al mese, tutto incluso.';
  const heroLead = $('.hero-copy .hero-lead');
  if (heroLead) {
    heroLead.textContent = 'PMS, canali OTA, check-in, pagamenti e POS, fatture, pulizie, cassa e automazioni sugli stessi dati. Non paghi moduli né piani superiori: paghi in più solo ciò che ha un costo reale, come i canali OTA aggiuntivi.';
  }
  const heroProof = $$('.hero-proof span');
  if (heroProof[0]) heroProof[0].textContent = 'Tutte le funzioni incluse';
  if (heroProof[1]) heroProof[1].textContent = 'Passi da altri gestionali senza perdere dati';
  if (heroProof[2]) heroProof[2].textContent = 'Nessuna commissione sulle prenotazioni dirette';

  const problemTitle = $('.problem-band h2');
  if (problemTitle) problemTitle.textContent = 'Il problema non è la dimensione della struttura. È dover gestire reparti e flussi con software separati.';
  const problemItems = $$('.problem-list article');
  if (problemItems[2]) {
    const title = $('h3', problemItems[2]);
    const text = $('p', problemItems[2]);
    if (title) title.textContent = 'Ogni reparto crea un altro strumento';
    if (text) text.textContent = 'Reception, servizi, pulizie, pagamenti, fiscalità e attività operative finiscono spesso in sistemi diversi che non condividono contesto.';
  }

  const solutionsHeading = $('#soluzioni .section-heading');
  if (solutionsHeading) {
    const eyebrow = $('.eyebrow', solutionsHeading);
    const heading = $('h2', solutionsHeading);
    const text = $('p', solutionsHeading);
    if (eyebrow) eyebrow.innerHTML = '<span></span>Dalla singola struttura al multi-sede';
    if (heading) heading.textContent = 'Strutture diverse, un unico sistema operativo.';
    if (text) text.textContent = 'Welora non si ferma alla camera: collega soggiorni, servizi, vendite, incassi e attività operative mantenendo gli stessi clienti, conti e regole.';
  }

  const tabs = $$('[data-tab]');
  const tabLabels = {
    hospitality: 'Hospitality',
    wellness: 'Servizi & wellness',
    services: 'Appartamenti',
    hybrid: 'Multi-sede'
  };
  tabs.forEach(button => {
    if (tabLabels[button.dataset.tab]) button.textContent = tabLabels[button.dataset.tab];
  });

  const verticalData = {
    hospitality: {
      kicker: 'Hospitality',
      title: 'Prenotazioni, soggiorni, incassi e adempimenti nello stesso flusso.',
      text: 'Hotel, residence, B&B e altre strutture ricettive condividono planning, disponibilità, clienti, conti, pagamenti e operatività.',
      list: [
        'Planning, tariffe, disponibilità e oltre 100 canali OTA',
        'Giornata operativa, reception, chiavi e checkout guidato',
        'Pulizie con app per gli addetti e stato camere',
        'Check-in, pagamenti, fatture e cassa sullo stesso conto*'
      ],
      image: 'assets/mockup-planning.svg',
      alt: 'Planning Welora per strutture ricettive'
    },
    wellness: {
      kicker: 'Servizi, wellness ed esperienze',
      title: 'La camera non è l’unica cosa che puoi vendere e gestire.',
      text: 'Catalogo, agenda, conti e incassi gestiscono servizi, trattamenti ed esperienze anche senza soggiorno, con professionisti, turni e risorse.',
      list: [
        'Servizi, trattamenti, prodotti, noleggi ed esperienze',
        'Vendite autonome anche per clienti passanti',
        'Stessi pagamenti, documenti fiscali e storico cliente',
        'Agenda con professionisti, competenze, turni, cabine e buffer'
      ],
      image: 'assets/mockup-client-portal.svg',
      alt: 'Servizi ed extra gestiti con Welora'
    },
    services: {
      kicker: 'Appartamenti e affitti brevi',
      title: 'Affitti brevi senza nessuno in struttura.',
      text: 'Dalla prenotazione al checkout ogni passaggio parte dalla prenotazione stessa: canali, check-in, adempimenti, accessi, clima e pulizie.',
      list: [
        'Prenotazioni da OTA e sito diretto sullo stesso calendario',
        'Check-in online, Alloggiati e tassa di soggiorno*',
        'Codice serratura e clima pronti all’arrivo*',
        'Pulizie assegnate al checkout, accessi revocati alla partenza'
      ],
      image: 'assets/mockup-automation.svg',
      alt: 'Operatività Welora per appartamenti e affitti brevi'
    },
    hybrid: {
      kicker: 'Gruppi e multi-sede',
      title: 'Più strutture e reparti, senza perdere controllo centrale.',
      text: 'Sedi, utenti, ruoli, servizi e processi restano separati dove serve e coordinati dove conviene, con una base dati e regole coerenti.',
      list: [
        'Operatività distinta per sede',
        'Ruoli, permessi e audit',
        'Servizi e flussi condivisi o locali',
        'Visione centrale per controllo e crescita'
      ],
      image: 'assets/mockup-operations.svg',
      alt: 'Gestione multi-sede Welora'
    }
  };

  tabs.forEach(button => button.addEventListener('click', () => {
    const data = verticalData[button.dataset.tab];
    if (!data) return;
    tabs.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    $('[data-vertical-kicker]').textContent = data.kicker;
    $('[data-vertical-title]').textContent = data.title;
    $('[data-vertical-text]').textContent = data.text;
    $('[data-vertical-list]').innerHTML = data.list.map(item => `<li>${item}</li>`).join('');
    const image = $('[data-vertical-visual] img');
    image.src = data.image;
    image.alt = data.alt;
  }));

  // Moduli: rendere visibile la profondità del prodotto, non solo il PMS.
  const platformCards = $$('#piattaforma .module-card');
  if (platformCards[3]) {
    $('h3', platformCards[3]).textContent = 'Pagamenti, preautorizzazioni e POS*';
    $('p', platformCards[3]).textContent = 'Checkout, preautorizzazioni, incassi, rimborsi e Tap to Pay tramite provider compatibile, collegati direttamente ai conti Welora.';
    $('span', platformCards[3]).textContent = 'Checkout · preauth · rimborsi · Tap to Pay';
  }
  if (platformCards[4]) {
    $('h3', platformCards[4]).textContent = 'Servizi, wellness, extra e vendite';
    $('p', platformCards[4]).textContent = 'Gestisci servizi, trattamenti, prodotti, transfer, parcheggi, noleggi ed esperienze anche senza collegarli a una camera.';
    $('span', platformCards[4]).textContent = 'Servizi · trattamenti · extra · vendite autonome';
  }
  if (platformCards[6]) {
    $('h3', platformCards[6]).textContent = 'Operatività, pulizie e automazioni';
    $('p', platformCards[6]).textContent = 'Eventi e regole collegano task, reparti, pulizie e riassetto, messaggi, accessi, pagamenti e sistemi esterni con tracciamento.';
    $('span', platformCards[6]).textContent = 'Task · housekeeping · accessi · automazioni';
  }

  // Ordine narrativo: prima automazioni, poi Digital Receptionist futuro.
  const automationsSection = $('#automazioni');
  const receptionistSection = $('#receptionist');
  if (automationsSection && receptionistSection && receptionistSection.parentNode) {
    receptionistSection.parentNode.insertBefore(automationsSection, receptionistSection);
  }

  // Canali e costi provider.
  const channelModuleTitle = $$('#piattaforma .module-card h3').find(element => element.textContent.trim() === 'Booking engine e canali');
  if (channelModuleTitle) channelModuleTitle.textContent = 'Booking engine e canali*';
  const channelPriceItem = $$('#prezzi .price-card.price-featured li').find(element => element.textContent.trim() === 'Prenotazione diretta e 1 canale OTA incluso');
  if (channelPriceItem) channelPriceItem.textContent = 'Prenotazione diretta e 1 canale OTA incluso*';
  const pricingLegalNote = $('#prezzi .legal-note');
  if (pricingLegalNote) {
    pricingLegalNote.textContent = '* Welora Base include il collegamento a 1 canale OTA; ogni canale aggiuntivo costa €10/mese + IVA. Lo sconto Founding si applica al canone Base, non ai canali aggiuntivi. Le commissioni delle OTA restano a carico della struttura. Possono inoltre applicarsi costi a consumo o commissioni del provider per verifica identità/check-in, pagamenti e Tap to Pay, servizi fiscali e altri servizi terzi. Il check-in digitale non sostituisce gli obblighi di identificazione previsti dalla normativa: la verifica dell’ospite deve essere svolta con la modalità richiesta nel caso concreto. L’uso senza registratore telematico fisico dipende dalla soluzione fiscale adottata e dai requisiti normativi applicabili.';
  }

  const featuredPriceCopy = $('#prezzi .price-card.price-featured > div:first-of-type p');
  if (featuredPriceCopy) {
    featuredPriceCopy.textContent = 'Per strutture che vogliono sostituire più strumenti con un unico sistema operativo, dalla singola sede ai gruppi più articolati.';
  }

  // Form: categorie ampie, senza etichettare il prodotto come "solo per piccoli".
  const businessOptions = $$('select[name="business_type"] option');
  businessOptions.forEach(option => {
    if (option.textContent === 'Piccolo hotel / Residence') option.textContent = 'Hotel / Residence / Resort';
    if (option.textContent === 'Struttura con servizi aggiuntivi') option.textContent = 'Struttura con wellness / servizi';
  });

  // Footer: sintesi dell'ampiezza reale/potenziale.
  const footerBrandCopy = $('.footer-grid > div:first-child p');
  if (footerBrandCopy) {
    footerBrandCopy.textContent = 'Welora connette ospitalità, servizi, pagamenti, operatività e automazioni in un unico sistema, dalla singola struttura al multi-sede.';
  }
  const footerScope = $$('.footer-grid > div').find(column => column.querySelector('strong')?.textContent.trim() === 'Per chi');
  if (footerScope) {
    footerScope.innerHTML = '<strong>Ambiti</strong>'
      + '<a href="#soluzioni">Hospitality e multi-sede</a>'
      + '<a href="#potenzialita">Servizi, wellness ed extra</a>'
      + '<a href="#automazioni">Housekeeping e operatività</a>'
      + '<a href="#potenzialita">Pagamenti e POS integrati</a>';
  }

  const structuredData = $('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const data = JSON.parse(structuredData.textContent);
      data.description = 'Gestionale cloud per strutture ricettive a €29/mese tutto incluso: PMS, channel manager, check-in, pagamenti e POS, fatture, pulizie, cassa, contabilità e automazioni.';
      structuredData.textContent = JSON.stringify(data);
    } catch (_) {
      // Mantiene il markup esistente se il JSON-LD non è modificabile.
    }
  }

  const header = $('[data-header]');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
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

  const formatCurrency = value => new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always'
  }).format(value);

  const savings = $('[data-savings]');
  const calculateSavings = () => {
    let current = 0;
    $$('.cost-row', savings).forEach(row => {
      const toggle = $('[data-cost-toggle]', row);
      const cost = $('[data-cost]', row);
      if (!toggle || !cost) return;
      row.classList.toggle('off', !toggle.checked);
      cost.disabled = !toggle.checked;
      if (toggle.checked) current += Math.max(0, Number(cost.value || 0));
    });
    const channels = Math.min(20, Math.max(1, Math.round(Number($('[data-channels]', savings)?.value || 1))));
    const welora = 29 + (channels - 1) * 10;
    $('[data-savings-now]').textContent = formatCurrency(current);
    $('[data-savings-welora]').textContent = formatCurrency(welora);
    $('[data-savings-year]').textContent = formatCurrency(Math.max(0, current - welora) * 12);
  };
  if (savings) {
    $$('input', savings).forEach(input => input.addEventListener('input', calculateSavings));
    calculateSavings();
  }

  const leadForm = $('[data-lead-form]');
  if (leadForm) {
    leadForm.action = 'contact.php';
    leadForm.method = 'post';

    $$('input[name="needs"]', leadForm).forEach(input => { input.name = 'needs[]'; });

    if (!$('input[name="website"]', leadForm)) {
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'website';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.setAttribute('aria-hidden', 'true');
      honeypot.className = 'sr-only';
      leadForm.prepend(honeypot);
    }

    const privacyInput = $('input[name="privacy"]', leadForm);
    const privacyLabel = privacyInput?.closest('label');
    if (privacyInput && privacyLabel) {
      privacyLabel.innerHTML = '';
      privacyLabel.append(privacyInput, document.createTextNode(' Ho letto l’'));
      const privacyLink = document.createElement('a');
      privacyLink.href = 'privacy.html';
      privacyLink.target = '_blank';
      privacyLink.rel = 'noopener';
      privacyLink.textContent = 'informativa privacy';
      privacyLabel.append(privacyLink, document.createTextNode(' e autorizzo il contatto relativo alla richiesta inviata.'));
    }
  }

  const footerContact = document.querySelector('.footer-grid > div:last-child');
  const oldEmail = document.querySelector('a[href="mailto:commerciale@welora.it"]');
  if (oldEmail) {
    oldEmail.href = 'mailto:support@welora.it';
    oldEmail.textContent = 'support@welora.it';
  }
  if (footerContact && !footerContact.querySelector('a[href="cookies.html"]')) {
    const cookiePolicy = document.createElement('a');
    cookiePolicy.href = 'cookies.html';
    cookiePolicy.textContent = 'Cookie';
    const settings = document.createElement('a');
    settings.href = '#';
    settings.dataset.cookieSettings = '';
    settings.textContent = 'Rivedi scelte cookie';
    footerContact.append(cookiePolicy, settings);
  }

  leadForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const status = $('[data-form-message]', leadForm);
    const submit = $('button[type="submit"]', leadForm);

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      status.textContent = 'Controlla i campi obbligatori.';
      return;
    }

    submit.disabled = true;
    status.textContent = 'Invio in corso…';

    try {
      const response = await fetch(leadForm.action, {
        method: 'POST',
        body: new FormData(leadForm),
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.message || 'Invio non riuscito.');
      }

      status.textContent = payload.message;
      leadForm.reset();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', { form_name: 'founding_prelaunch' });
      }
    } catch (error) {
      status.innerHTML = `${error.message || 'Invio non riuscito.'} Scrivi a <a href="mailto:lancio@welora.it">lancio@welora.it</a>.`;
    } finally {
      submit.disabled = false;
    }
  });

  const formResult = new URLSearchParams(location.search).get('form');
  const formStatus = $('[data-form-message]');
  if (formResult === 'success' && formStatus) formStatus.textContent = 'Richiesta inviata. Controlla la tua email: ti abbiamo inviato una conferma Welora.';
  if (formResult === 'error' && formStatus) formStatus.innerHTML = 'Invio non riuscito. Scrivi a <a href="mailto:lancio@welora.it">lancio@welora.it</a>.';

  $('[data-year]').textContent = String(new Date().getFullYear());

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 }) : null;

  $$('.reveal').forEach(element => observer ? observer.observe(element) : element.classList.add('visible'));
})();