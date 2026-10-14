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
      kicker: 'Piccoli hotel e residence',
      title: 'Funzioni da struttura organizzata, senza una pila di software separati.',
      text: 'Camere, reparti, housekeeping, pagamenti, servizi e automazioni restano nello stesso flusso, con utenti e permessi dedicati.',
      list: [
        'Arrivi, partenze, housekeeping e attività operative',
        'Tariffe, restrizioni, booking diretto e canali supportati',
        'Incassi, preautorizzazioni e documenti commerciali*',
        'Ruoli, audit e automazioni per ridurre i passaggi manuali'
      ],
      image: 'assets/mockup-operations.svg',
      alt: 'Gestione operativa Welora per piccoli hotel'
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
  leadForm?.addEventListener('submit', event => {
    event.preventDefault();
    const message = $('[data-form-message]', leadForm);
    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      message.textContent = 'Controlla i campi obbligatori.';
      return;
    }

    const data = new FormData(leadForm);
    const needs = data.getAll('needs').join(', ') || 'Non specificato';
    const body = [
      'Richiesta adesione Welora Founding',
      '',
      `Nome: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Telefono: ${data.get('phone') || ''}`,
      `Tipo struttura: ${data.get('business_type') || ''}`,
      `Sedi: ${data.get('locations') || ''}`,
      `Camere/unità: ${data.get('resources') || ''}`,
      `Esigenze: ${needs}`,
      '',
      'Flusso prioritario:',
      data.get('message') || ''
    ].join('\n');

    message.textContent = 'Sto aprendo il tuo programma email con la richiesta già compilata.';
    window.location.href = `mailto:commerciale@welora.it?subject=${encodeURIComponent('Adesione pre-lancio Welora Founding')}&body=${encodeURIComponent(body)}`;
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