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
  document.title = 'Welora — Gestionale completo per strutture ricettive';
  const metaDescription = $('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = 'Welora unisce ospitalità, servizi ed extra, pagamenti e POS, fiscalità, automazioni e gestione multi-sede in un unico sistema operativo.';
  }
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = 'Welora — Tutto ciò che serve alla tua struttura';
  const ogDescription = $('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.content = 'Dalla singola struttura al multi-sede: prenotazioni, servizi, pagamenti, fiscalità e operatività sugli stessi dati.';
  }

  const heroTitle = $('.hero-copy h1');
  if (heroTitle) heroTitle.textContent = 'Tutto ciò che serve alla tua struttura. In un solo gestionale.';
  const heroLead = $('.hero-copy .hero-lead');
  if (heroLead) {
    heroLead.textContent = 'Dalla singola struttura al multi-sede, Welora collega prenotazioni, servizi ed extra, pagamenti e POS, fiscalità e automazioni sugli stessi dati. Una base completa che cresce con la struttura e con i suoi reparti operativi.';
  }
  const heroProof = $$('.hero-proof span');
  if (heroProof[0]) heroProof[0].textContent = 'Hospitality, servizi e multi-sede';
  if (heroProof[1]) heroProof[1].textContent = 'Pagamenti e POS integrati*';
  if (heroProof[2]) heroProof[2].textContent = 'Automazioni e operatività';

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
        'Planning, tariffe, disponibilità e prenotazioni',
        'Booking diretto, canali supportati e portale ospite',
        'Check-in digitale e adempimenti con i vincoli applicabili*',
        'Pagamenti, fiscalità, servizi ed extra collegati allo stesso cliente'
      ],
      image: 'assets/mockup-planning.svg',
      alt: 'Planning Welora per strutture ricettive'
    },
    wellness: {
      kicker: 'Servizi, wellness ed esperienze',
      title: 'La camera non è l’unica cosa che puoi vendere e gestire.',
      text: 'Catalogo, conti e incassi permettono di gestire servizi ed extra anche senza soggiorno; il modello è pensato per estendersi a trattamenti, risorse e flussi wellness più articolati.',
      list: [
        'Servizi, trattamenti, prodotti, noleggi ed esperienze',
        'Vendite autonome anche per clienti passanti',
        'Stessi pagamenti, documenti fiscali e storico cliente',
        'Evoluzione verso agenda, risorse e professionisti dedicati'
      ],
      image: 'assets/mockup-client-portal.svg',
      alt: 'Servizi ed extra gestiti con Welora'
    },
    services: {
      kicker: 'Appartamenti e affitti brevi',
      title: 'Più unità, meno passaggi manuali tra ospiti e operatività.',
      text: 'Prenotazioni, accessi, messaggi, pagamenti e attività operative possono essere collegate a regole e task, con una visione unica delle unità.',
      list: [
        'Disponibilità e prenotazioni per unità',
        'Attività operative, pulizie e riassetto nel flusso di lavoro',
        'Portale ospite, pagamenti e check-in digitale*',
        'Gestione da una o più sedi con controllo centralizzato'
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

  // Sezione di sintesi: mostra le potenzialità senza confondere ciò che è core con ciò che è ancora in evoluzione.
  const platformSection = $('#piattaforma');
  if (platformSection && !$('#potenzialita')) {
    const capabilities = document.createElement('section');
    capabilities.id = 'potenzialita';
    capabilities.className = 'section';
    capabilities.innerHTML = `
      <div class="container">
        <div class="section-heading centered reveal">
          <div class="eyebrow"><span></span>Un solo sistema, molti flussi</div>
          <h2>Non solo camere. Welora può diventare il sistema operativo della struttura.</h2>
          <p>Dall’ospitalità ai servizi, dagli incassi alle attività operative: la stessa base dati segue il cliente e il lavoro tra reparti diversi.</p>
        </div>
        <div class="module-grid">
          <article class="module-card reveal"><div class="module-icon">H</div><h3>Hospitality</h3><p>PMS, planning, prenotazioni, canali, check-in, conti e fiscalità per la gestione del soggiorno.</p><span>Core Welora</span></article>
          <article class="module-card reveal"><div class="module-icon">S</div><h3>Servizi & extra</h3><p>Colazioni, transfer, parcheggi, noleggi, trattamenti, prodotti ed esperienze, anche per clienti senza camera.</p><span>Core Welora</span></article>
          <article class="module-card reveal"><div class="module-icon">€</div><h3>Pagamenti & POS*</h3><p>Incassi online, preautorizzazioni, rimborsi e Tap to Pay collegati ai conti e alle vendite Welora.</p><span>Integrato · provider esterno*</span></article>
          <article class="module-card reveal"><div class="module-icon">O</div><h3>Housekeeping & operatività</h3><p>Task, reparti, pulizie, riassetto e automazioni operative per ridurre i passaggi manuali tra reception e staff.</p><span>Area in evoluzione</span></article>
          <article class="module-card reveal"><div class="module-icon">W</div><h3>Wellness & trattamenti</h3><p>Servizi e trattamenti condividono clienti, conti e pagamenti; agenda avanzata, risorse e professionisti sono parte dell’evoluzione del prodotto.</p><span>Base servizi attiva · estensione in evoluzione</span></article>
          <article class="module-card reveal"><div class="module-icon">M</div><h3>Multi-sede</h3><p>Più strutture, utenti, ruoli e servizi con operatività locale e una visione centrale quando serve.</p><span>Scalabilità organizzativa</span></article>
        </div>
      </div>`;
    platformSection.insertAdjacentElement('afterend', capabilities);
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
  const channelPriceItem = $$('#prezzi .price-card.price-featured li').find(element => element.textContent.trim() === 'Canali e prenotazione diretta');
  if (channelPriceItem) channelPriceItem.textContent = 'Canali e prenotazione diretta*';
  const pricingLegalNote = $('#prezzi .legal-note');
  if (pricingLegalNote) {
    pricingLegalNote.textContent = '* Welora Base include il collegamento a 1 canale supportato. Eventuali canali aggiuntivi e i relativi costi o commissioni del provider restano separati. Possono inoltre applicarsi costi a consumo o commissioni del provider per verifica identità/check-in, pagamenti e Tap to Pay, servizi fiscali e altri servizi terzi. Il check-in digitale non sostituisce gli obblighi di identificazione previsti dalla normativa: la verifica dell’ospite deve essere svolta con la modalità richiesta nel caso concreto. L’uso senza registratore telematico fisico dipende dalla soluzione fiscale adottata e dai requisiti normativi applicabili.';
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
      data.description = 'Gestionale cloud per strutture ricettive e servizi: PMS, prenotazioni, pagamenti, fiscalità, extra, operatività e automazioni, dalla singola sede al multi-sede.';
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
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(value);

  const calculateRoi = () => {
    const value = key => Math.max(0, Number($(`[data-roi="${key}"]`)?.value || 0));
    const requests = value('requests');
    const ticket = value('ticket');
    const lostRate = Math.min(100, value('lost')) / 100;
    const weeklyHours = value('hours');
    const recoveredBookings = Math.round(requests * lostRate * 0.5);
    const recoveredRevenue = recoveredBookings * ticket;
    const savedHours = Math.round(weeklyHours * 4.33 * 0.6);
    const laborValue = savedHours * 20;
    const total = recoveredRevenue + laborValue;
    $('[data-roi-result]').textContent = formatCurrency(total);
    $('[data-roi-bookings]').textContent = recoveredBookings;
    $('[data-roi-time]').textContent = `${savedHours} h`;
    $('[data-roi-labor]').textContent = formatCurrency(laborValue);
  };
  $$('[data-roi]').forEach(input => input.addEventListener('input', calculateRoi));
  calculateRoi();

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
    oldEmail.href = 'mailto:supprot@welora.it';
    oldEmail.textContent = 'supprot@welora.it';
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