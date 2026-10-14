(() => {
  'use strict';

  const STORAGE_KEY = 'welora_cookie_consent_v1';
  const CONSENT_TTL = 180 * 24 * 60 * 60 * 1000;
  const GA_ID = 'G-PD8W376DFH';
  let analyticsLoaded = false;

  if (!document.querySelector('link[rel~="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = 'favicon.svg?v=20261014';
    document.head.appendChild(favicon);
  }

  if (!document.querySelector('script[src^="site-shell.js"]')) {
    const siteShell = document.createElement('script');
    siteShell.src = 'site-shell.js?v=20261014-9';
    document.head.appendChild(siteShell);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  const readConsent = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved.savedAt !== 'number') return null;
      if (Date.now() - saved.savedAt > CONSENT_TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return saved;
    } catch (_) {
      return null;
    }
  };

  const saveConsent = analytics => {
    const choice = { analytics: Boolean(analytics), savedAt: Date.now() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choice)); } catch (_) {}
    return choice;
  };

  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 34128000
    });
  };

  const clearAnalyticsCookies = () => {
    const host = location.hostname;
    document.cookie.split(';').forEach(item => {
      const name = item.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
      document.cookie = `${name}=;${expiry}`;
      if (host) {
        document.cookie = `${name}=;${expiry};domain=${host}`;
        document.cookie = `${name}=;${expiry};domain=.${host}`;
      }
    });
  };

  const applyConsent = choice => {
    if (choice?.analytics) {
      loadAnalytics();
      return;
    }
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied'
    });
  };

  const markup = `
    <div class="cookie-banner" data-cookie-banner hidden role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <button class="cookie-close" type="button" data-cookie-reject aria-label="Continua senza cookie analytics">×</button>
      <div class="cookie-copy">
        <strong id="cookie-title">Privacy e cookie</strong>
        <p>Usiamo strumenti tecnici necessari al sito e, solo con il tuo consenso, Google Analytics per misurare l'utilizzo del sito. Puoi accettare, rifiutare o personalizzare la scelta.</p>
        <p class="cookie-links"><a href="cookies.html">Cookie Policy</a> · <a href="privacy.html">Privacy Policy</a></p>
      </div>
      <div class="cookie-actions">
        <button class="cookie-button" type="button" data-cookie-reject>Rifiuta</button>
        <button class="cookie-button cookie-secondary" type="button" data-cookie-customize>Personalizza</button>
        <button class="cookie-button" type="button" data-cookie-accept>Accetta analytics</button>
      </div>
    </div>
    <div class="cookie-modal" data-cookie-modal hidden role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
      <div class="cookie-modal-card">
        <button class="cookie-close cookie-modal-close" type="button" data-cookie-modal-close aria-label="Chiudi preferenze">×</button>
        <h2 id="cookie-settings-title">Preferenze cookie</h2>
        <div class="cookie-setting-row">
          <div><strong>Necessari</strong><p>Servono per il funzionamento del sito e per ricordare le tue preferenze privacy. Non possono essere disattivati.</p></div>
          <input type="checkbox" checked disabled aria-label="Cookie necessari sempre attivi">
        </div>
        <div class="cookie-setting-row">
          <div><strong>Analytics</strong><p>Google Analytics (ID ${GA_ID}) ci aiuta a capire come viene usato il sito. Viene caricato solo se lo autorizzi.</p></div>
          <input type="checkbox" data-cookie-analytics aria-label="Consenti cookie analytics">
        </div>
        <div class="cookie-modal-actions">
          <button class="cookie-button cookie-secondary" type="button" data-cookie-modal-close>Annulla</button>
          <button class="cookie-button" type="button" data-cookie-save>Salva preferenze</button>
        </div>
      </div>
    </div>`;

  const ensureUi = () => {
    if (document.querySelector('[data-cookie-banner]')) return;
    document.body.insertAdjacentHTML('beforeend', markup);

    const banner = document.querySelector('[data-cookie-banner]');
    const modal = document.querySelector('[data-cookie-modal]');
    const analyticsToggle = document.querySelector('[data-cookie-analytics]');

    const closeBannerWith = analytics => {
      const previous = readConsent();
      const next = saveConsent(analytics);
      applyConsent(next);
      banner.hidden = true;
      modal.hidden = true;
      document.documentElement.classList.remove('cookie-modal-open');
      if (previous?.analytics && !next.analytics) {
        clearAnalyticsCookies();
        location.reload();
      }
    };

    document.querySelectorAll('[data-cookie-reject]').forEach(el => el.addEventListener('click', () => closeBannerWith(false)));
    document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => closeBannerWith(true));
    document.querySelector('[data-cookie-customize]')?.addEventListener('click', () => {
      const current = readConsent();
      analyticsToggle.checked = Boolean(current?.analytics);
      modal.hidden = false;
      document.documentElement.classList.add('cookie-modal-open');
    });
    document.querySelectorAll('[data-cookie-modal-close]').forEach(el => el.addEventListener('click', () => {
      modal.hidden = true;
      document.documentElement.classList.remove('cookie-modal-open');
    }));
    document.querySelector('[data-cookie-save]')?.addEventListener('click', () => closeBannerWith(analyticsToggle.checked));

    document.addEventListener('click', event => {
      const trigger = event.target.closest('[data-cookie-settings]');
      if (!trigger) return;
      event.preventDefault();
      const current = readConsent();
      analyticsToggle.checked = Boolean(current?.analytics);
      modal.hidden = false;
      document.documentElement.classList.add('cookie-modal-open');
    });

    const current = readConsent();
    if (current) {
      applyConsent(current);
    } else {
      banner.hidden = false;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureUi, { once: true });
  } else {
    ensureUi();
  }
})();
