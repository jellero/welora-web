(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // I testi della pagina stanno nell'HTML, così motori di ricerca e assistenti AI li leggono: qui solo comportamento.
  const tabs = $$('[data-tab]');
  const verticalData = {
    hospitality: {
      kicker: 'Hospitality',
      title: 'Prenotazioni, soggiorni, incassi e adempimenti nello stesso flusso.',
      text: 'Hotel, residence, B&B e altre strutture ricettive condividono planning, disponibilità, clienti, conti, pagamenti e operatività.',
      list: [
        'Planning, tariffe, disponibilità e oltre 100 canali OTA',
        'Giornata operativa, reception, chiavi e checkout guidato',
        'Pulizie dal telefono per gli addetti e stato camere',
        'Check-in, pagamenti, fatture e cassa sullo stesso conto*'
      ],
      image: 'assets/screens/gestionale-planning.webp?v=fhd1',
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
      image: 'assets/screens/gestionale-incassa.webp?v=fhd2',
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
      image: 'assets/screens/gestionale-clima.webp?v=fhd1',
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
      image: 'assets/screens/gestionale-planning.webp?v=fhd1',
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
    const welora = 44;
    $('[data-savings-now]').textContent = formatCurrency(current);
    $('[data-savings-welora]').textContent = formatCurrency(welora);
    $('[data-savings-year]').textContent = formatCurrency(Math.max(0, current - welora) * 12);
  };
  if (savings) {
    $$('input', savings).forEach(input => input.addEventListener('input', calculateSavings));
    calculateSavings();
  }

  const leadForm = $('[data-lead-form]');

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
        window.gtag('event', 'generate_lead', { form_name: 'demo_request' });
      }
    } catch (error) {
      status.innerHTML = `${error.message || 'Invio non riuscito.'} Scrivi a <a href="mailto:commerciale@welora.it">commerciale@welora.it</a>.`;
    } finally {
      submit.disabled = false;
    }
  });

  const formResult = new URLSearchParams(location.search).get('form');
  const formStatus = $('[data-form-message]');
  if (formResult === 'success' && formStatus) formStatus.textContent = 'Richiesta inviata. Controlla la tua email: ti abbiamo inviato una conferma Welora.';
  if (formResult === 'error' && formStatus) formStatus.innerHTML = 'Invio non riuscito. Scrivi a <a href="mailto:commerciale@welora.it">commerciale@welora.it</a>.';

  $('[data-year]').textContent = String(new Date().getFullYear());

  const landingLinks = $$('[data-landing-link]');
  const setActive = id => landingLinks.forEach(link => link.classList.toggle('active', link.dataset.landingLink === id));
  setActive('top');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .1, .35, .6] });
    landingLinks.map(link => document.getElementById(link.dataset.landingLink)).filter(Boolean).forEach(section => sectionObserver.observe(section));
  }

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