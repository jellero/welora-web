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

  // Posizionamento: completo e scalabile, accessibile anche alle strutture più piccole.
  document.title = 'Welora — Gestionale completo per strutture ricettive';
  const metaDescription = $('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = 'Welora riunisce PMS, prenotazioni, canali, check-in digitale, pagamenti, POS da smartphone, fiscalità, servizi e automazioni: dalla singola struttura al multi-sede.';
  }
  const ogTitle = $('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = 'Welora — Tutto ciò che serve alla tua struttura';
  const ogDescription = $('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.content = 'Dalla singola struttura al multi-sede: una base completa per gestire soggiorni, incassi, adempimenti, servizi e automazioni.';
  }

  const heroTitle = $('.hero-copy h1');
  if (heroTitle) heroTitle.textContent = 'Tutto ciò che serve alla tua struttura. In un solo gestionale.';
  const heroLead = $('.hero-copy .hero-lead');
  if (heroLead) {
    heroLead.textContent = 'Dalla singola struttura al multi-sede, Welora unisce PMS, prenotazioni, canali, check-in, pagamenti, fiscalità, servizi e automazioni sugli stessi dati. Una base completa per crescere, accessibile anche alle strutture più piccole.';
  }

  const problemTitle = $('.problem-band h2');
  if (problemTitle) problemTitle.textContent = 'Il problema non è la dimensione della struttura. È dover comprare troppi software.';
  const verticalEyebrow = $('#soluzioni .eyebrow');
  if (verticalEyebrow) verticalEyebrow.innerHTML = '<span></span>Dalla singola struttura al multi-sede';
  const hotelTab = $('[data-tab="wellness"]');
  if (hotelTab) hotelTab.textContent = 'Hotel e residence';

  // I canali dipendono da integrazioni/provider esterni: il piano Base include un collegamento supportato.
  const channelModuleTitle = $$('#piattaforma .module-card h3').find(element => element.textContent.trim() === 'Booking engine e canali');
  if (channelModuleTitle) channelModuleTitle.textContent = 'Booking engine e canali*';
  const channelPriceItem = $$('#prezzi .price-card.price-featured li').find(element => element.textContent.trim() === 'Canali e prenotazione diretta');
  if (channelPriceItem) channelPriceItem.textContent = 'Canali* e prenotazione diretta';
  const pricingLegalNote = $('#prezzi .legal-note');
  if (pricingLegalNote) {
    pricingLegalNote.textContent = '* Welora Base include il collegamento a 1 canale supportato. Eventuali canali aggiuntivi e i relativi costi o commissioni del provider restano separati. Possono inoltre applicarsi costi a consumo o commissioni del provider per verifica identità/check-in, pagamenti e Tap to Pay, servizi fiscali e altri servizi terzi. Il check-in digitale non sostituisce gli obblighi di identificazione previsti dalla normativa: la verifica dell’ospite deve essere svolta con la modalità richiesta nel caso concreto. L’uso senza registratore telematico fisico dipende dalla soluzione fiscale adottata e dai requisiti normativi applicabili.';
  }

  const structuredData = $('script[type="application/ld+json"]');
  if (structuredData) {
    try {
      const data = JSON.parse(structuredData.textContent);
      data.description = 'Gestionale cloud per strutture ricettive, dalla singola sede al multi-sede: PMS, prenotazioni, check-in digitale, pagamenti, fiscalità, servizi e automazioni.';
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

  const verticalData = {
    hospitality: {
      kicker: 'B&B e affittacamere',
      title: 'Gestisci soggiorno, incasso e adempimenti senza cambiare software.',
      text: 'PMS, booking engine, canali, portale ospite, check-in digitale e automazioni condividono la stessa prenotazione.',
      list: [
        'Planning, tariffe, disponibilità e prenotazioni',
        'Check-in digitale e adempimenti con costi provider a consumo*',
        'Pagamenti online e Tap to Pay da smartphone compatibile*',
        'Servizi, extra e vendite anche non collegate a una camera'
      ],
      image: 'assets/mockup-planning.svg',
      alt: 'Planning Welora per B&B e affittacamere'
    },
    wellness: {
      kicker: 'Hotel e residence',
      title: 'Funzioni da struttura organizzata, senza una pila di software separati.',
      text: 'Camere, reparti, housekeeping, pagamenti, servizi e automazioni restano nello stesso flusso, con utenti e permessi dedicati.',
      list: [
        'Arrivi, partenze, housekeeping e attività operative',
        'Tariffe, restrizioni, booking diretto e canali supportati',
        'Incassi, preautorizzazioni e documenti commerciali*',
        'Ruoli, audit e automazioni per ridurre i passaggi manuali'
      ],
      image: 'assets/mockup-operations.svg',
      alt: 'Gestione operativa Welora per hotel e residence'
    },
    services: {
      kicker: 'Appartamenti e affitti brevi',
      title: 'Più unità, meno lavoro ripetitivo tra un ospite e l’altro.',
      text: 'Prenotazioni, accessi, messaggi, pulizie, pagamenti e adempimenti possono essere collegati a regole automatiche e task tracciati.',
      list: [
        'Disponibilità e prenotazioni per unità',
        'Task automatici per pulizia, manutenzione e accessi',
        'Portale ospite e check-in digitale*',
        'Gestione da una o più sedi con visione centralizzata'
      ],
      image: 'assets/mockup-automation.svg',
      alt: 'Automazioni Welora per appartamenti e affitti brevi'
    },
    hybrid: {
      kicker: 'Struttura ricettiva + servizi',
      title: 'La camera è solo una delle cose che puoi vendere.',
      text: 'Colazioni, transfer, parcheggi, prodotti, noleggi, trattamenti, esperienze o eventi possono avere conti e incassi propri senza forzare tutto dentro la prenotazione.',
      list: [
        'Conti generici per clienti, passanti, aziende ed eventi',
        'Servizi e beni venduti anche senza pernottamento',
        'Stesso flusso per incassi, documenti e storico cliente',
        'Più sedi e reparti con dati e permessi coerenti'
      ],
      image: 'assets/mockup-client-portal.svg',
      alt: 'Gestione Welora per strutture con servizi aggiuntivi'
    }
  };

  $$('[data-tab]').forEach(button => button.addEventListener('click', () => {
    const data = verticalData[button.dataset.tab];
    if (!data) return;
    $$('[data-tab]').forEach(item => {
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
    oldEmail.href = 'mailto:suppor@welora.it';
    oldEmail.textContent = 'suppor@welora.it';
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
      status.innerHTML = `${error.message || 'Invio non riuscito.'} Scrivi a <a href="mailto:suppor@welora.it">suppor@welora.it</a>.`;
    } finally {
      submit.disabled = false;
    }
  });

  const formResult = new URLSearchParams(location.search).get('form');
  const formStatus = $('[data-form-message]');
  if (formResult === 'success' && formStatus) formStatus.textContent = 'Richiesta inviata. Ti ricontatteremo all’indirizzo indicato.';
  if (formResult === 'error' && formStatus) formStatus.innerHTML = 'Invio non riuscito. Scrivi a <a href="mailto:suppor@welora.it">suppor@welora.it</a>.';

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