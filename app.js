(() => {
  const theme = document.createElement('link');
  theme.rel = 'stylesheet';
  theme.href = 'blue-theme.css';
  document.head.appendChild(theme);

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

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
      kicker: 'Hotel, B&B, residence e appartamenti',
      title: 'Più controllo sulla struttura, meno attività ripetitive.',
      text: 'Planning, PMS, booking engine, channel manager, Alloggiati Web, ISTAT, portale ospite e automazioni di camera lavorano sulla stessa prenotazione.',
      list: ['Disponibilità, tariffe e restrizioni sincronizzate', 'Check-in digitale, accessi e servizi dal portale cliente', 'Housekeeping, manutenzione e task assegnati automaticamente', 'Digital Receptionist per richieste, preventivi e upselling'],
      image: 'assets/mockup-planning.svg',
      alt: 'Esempio di planning Welora per strutture ricettive'
    },
    wellness: {
      kicker: 'Spa, centri wellness, estetica e saloni',
      title: 'Agenda piena, tempi sotto controllo, clienti che ritornano.',
      text: 'Trattamenti, professionisti, cabine, attrezzature, pacchetti e prodotti sono collegati alla stessa anagrafica cliente e allo stesso conto.',
      list: ['Agenda per professionisti, risorse, buffer e capacità', 'Prenotazione online, caparra, lista attesa e no-show protection', 'Schede cliente, consensi, pacchetti, membership e loyalty', 'Magazzino prodotti, consumi per trattamento e marginalità'],
      image: 'assets/mockup-agenda.svg',
      alt: 'Esempio di agenda Welora per beauty e wellness'
    },
    services: {
      kicker: 'Studi, consulenti, esperienze e noleggi',
      title: 'Ogni appuntamento porta con sé dati, documenti e prossime azioni.',
      text: 'Welora gestisce disponibilità, intake, preventivi, documenti, pagamenti, follow-up e risorse necessarie al servizio.',
      list: ['Prenotazione per sede, professionista, servizio o attrezzatura', 'Moduli, documenti, consensi e firma nel percorso cliente', 'Preventivi, pagamenti, ricorrenze e pacchetti', 'Reminder, richiami e follow-up gestiti dal Digital Receptionist'],
      image: 'assets/mockup-operations.svg',
      alt: 'Esempio di gestione operativa Welora per servizi professionali'
    },
    hybrid: {
      kicker: 'Resort, club, poliambulatori e attività multi-servizio',
      title: 'Un cliente, più servizi, un unico percorso.',
      text: 'Pernottamento, trattamento, ristorante, evento, ricarica e noleggio possono convivere nello stesso account, con regole e reparti distinti.',
      list: ['Conto unico o separato per reparto, servizio e centro di ricavo', 'Portale cliente trasversale a tutte le esperienze', 'Automazioni coordinate tra accessi, staff, spazi ed energia', 'Report consolidati per sede, canale, reparto e cliente'],
      image: 'assets/mockup-client-portal.svg',
      alt: 'Esempio di portale cliente Welora per attività multi-servizio'
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

  $$('[data-billing]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.billing;
    $$('[data-billing]').forEach(item => item.classList.toggle('active', item === button));
    $$('[data-monthly]').forEach(price => {
      price.textContent = price.dataset[mode] || price.dataset.monthly;
    });
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
  leadForm?.addEventListener('submit', event => {
    event.preventDefault();
    const message = $('[data-form-message]', leadForm);
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      message.textContent = 'Controlla i campi obbligatori.';
      return;
    }
    message.textContent = 'Richiesta pronta. Collegare il form all’endpoint CRM prima della pubblicazione.';
  });

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