/**
 * It's A Malamute — Cookie Consent
 * GDPR + Garante Privacy italiano compliant
 * Categorie: tecnici (sempre attivi) | analitici | marketing
 */

(function() {
  'use strict';

  const COOKIE_NAME = 'itsalamute_consent';
  const COOKIE_DAYS = 365;

  // ── Helpers ──────────────────────────────────────────────
  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(JSON.stringify(value))
      + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match[1])); } catch(e) { return null; }
  }

  function loadGA(id) {
    if (!id || window.gaLoaded) return;
    window.gaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function applyConsent(prefs) {
    if (prefs.analytics && window.GA_ID) {
      loadGA(window.GA_ID);
    }
  }

  // ── Banner HTML ───────────────────────────────────────────
  var bannerHTML = {
    it: {
      title: 'Questo sito usa i cookie',
      body: 'Utilizziamo cookie tecnici (necessari al funzionamento) e, con il tuo consenso, cookie analitici per capire come viene usato il sito. Non usiamo cookie di profilazione o pubblicità.',
      accept: 'Accetta tutti',
      reject: 'Solo tecnici',
      manage: 'Gestisci preferenze',
      save: 'Salva preferenze',
      analytics_label: 'Cookie analitici',
      analytics_desc: 'Ci aiutano a capire come i visitatori interagiscono con il sito (es. Google Analytics). I dati sono anonimi.',
      privacy_link: '/it/privacy-policy/',
      cookie_link: '/it/cookie-policy/',
      privacy_text: 'Privacy Policy',
      cookie_text: 'Cookie Policy',
    },
    en: {
      title: 'This site uses cookies',
      body: 'We use essential cookies (required for the site to work) and, with your consent, analytics cookies to understand how the site is used. We don\'t use advertising or profiling cookies.',
      accept: 'Accept all',
      reject: 'Essential only',
      manage: 'Manage preferences',
      save: 'Save preferences',
      analytics_label: 'Analytics cookies',
      analytics_desc: 'Help us understand how visitors interact with the site (e.g. Google Analytics). Data is anonymous.',
      privacy_link: '/en/privacy-policy/',
      cookie_link: '/en/cookie-policy/',
      privacy_text: 'Privacy Policy',
      cookie_text: 'Cookie Policy',
    }
  };

  function getLang() {
    return window.location.pathname.startsWith('/en/') ? 'en' : 'it';
  }

  function createBanner() {
    var lang = getLang();
    var t = bannerHTML[lang];

    var overlay = document.createElement('div');
    overlay.id = 'cookie-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(14,26,43,0.5);z-index:9998;display:flex;align-items:flex-end;justify-content:center;padding:0 0 0 0;';

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.style.cssText = 'background:#faf8f4;border-top:3px solid #b87333;max-width:100%;width:100%;padding:28px 32px 24px;box-shadow:0 -4px 32px rgba(14,26,43,0.15);font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#1a1a1a;';

    banner.innerHTML =
      '<div style="max-width:1200px;margin:0 auto;">' +
        '<div style="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;justify-content:space-between;">' +
          '<div style="flex:1;min-width:280px;">' +
            '<strong style="font-size:17px;display:block;margin-bottom:8px;color:#0e1a2b;">' + t.title + '</strong>' +
            '<p style="margin:0 0 10px;color:#4a4a4a;">' + t.body + '</p>' +
            '<p style="margin:0;font-size:13px;color:#7a7a7a;">' +
              '<a href="' + t.privacy_link + '" style="color:#b87333;">' + t.privacy_text + '</a> · ' +
              '<a href="' + t.cookie_link + '" style="color:#b87333;">' + t.cookie_text + '</a>' +
            '</p>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:10px;min-width:200px;">' +
            '<button id="cookie-accept-all" style="background:#b87333;color:#faf8f4;border:none;padding:12px 24px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">' + t.accept + '</button>' +
            '<button id="cookie-reject" style="background:transparent;color:#b87333;border:1px solid #b87333;padding:12px 24px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">' + t.reject + '</button>' +
            '<button id="cookie-manage" style="background:transparent;color:#7a7a7a;border:none;padding:4px 0;cursor:pointer;font-size:13px;text-decoration:underline;text-align:left;">' + t.manage + '</button>' +
          '</div>' +
        '</div>' +
        // Preferences panel (hidden by default)
        '<div id="cookie-prefs" style="display:none;margin-top:20px;padding-top:20px;border-top:1px solid #e0d8cc;">' +
          '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
            '<label style="display:flex;align-items:center;gap:8px;cursor:not-allowed;opacity:.6;">' +
              '<input type="checkbox" checked disabled style="width:16px;height:16px;"> ' +
              '<span><strong>Cookie tecnici</strong> — sempre attivi</span>' +
            '</label>' +
          '</div>' +
          '<div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:20px;">' +
            '<label style="display:flex;align-items:flex-start;gap:8px;cursor:pointer;">' +
              '<input type="checkbox" id="pref-analytics" style="width:16px;height:16px;margin-top:3px;"> ' +
              '<span><strong>' + t.analytics_label + '</strong> — ' + t.analytics_desc + '</span>' +
            '</label>' +
          '</div>' +
          '<button id="cookie-save-prefs" style="background:#0e1a2b;color:#faf8f4;border:none;padding:10px 24px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:12px;letter-spacing:.1em;text-transform:uppercase;">' + t.save + '</button>' +
        '</div>' +
      '</div>';

    overlay.appendChild(banner);
    document.body.appendChild(overlay);

    // Events
    document.getElementById('cookie-accept-all').addEventListener('click', function() {
      saveAndClose({ analytics: true });
    });
    document.getElementById('cookie-reject').addEventListener('click', function() {
      saveAndClose({ analytics: false });
    });
    document.getElementById('cookie-manage').addEventListener('click', function() {
      var prefs = document.getElementById('cookie-prefs');
      prefs.style.display = prefs.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('cookie-save-prefs').addEventListener('click', function() {
      var analytics = document.getElementById('pref-analytics').checked;
      saveAndClose({ analytics: analytics });
    });
  }

  function saveAndClose(prefs) {
    setCookie(COOKIE_NAME, prefs, COOKIE_DAYS);
    var overlay = document.getElementById('cookie-overlay');
    if (overlay) overlay.remove();
    applyConsent(prefs);
  }

  // ── Init ─────────────────────────────────────────────────
  function init() {
    var existing = getCookie(COOKIE_NAME);
    if (existing) {
      applyConsent(existing);
      return;
    }
    createBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for "change preferences" link
  window.CookieConsent = {
    reset: function() {
      document.cookie = COOKIE_NAME + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      location.reload();
    }
  };

})();
