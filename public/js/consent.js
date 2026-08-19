/* =====================================================================
   CARANDELL ADVOCATS — GESTOR DE CONSENTIMIENTO
   =====================================================================
   Categorías opcionales independientes:
   - Google Analytics
   - Google Maps

   IMPORTANTE: sustituir GA4_MEASUREMENT_ID por el identificador real G-...
   cuando esté disponible. El script nunca carga Analytics antes del consentimiento.
   ===================================================================== */
(function(){
  'use strict';

  var STORAGE_KEY = 'ca_consent_preferences';
  var CONSENT_VERSION = 2;
  var GA4_MEASUREMENT_ID = ''; // Ejemplo: G-XXXXXXXXXX. No inventar este dato.

  var SERVICE_CONFIG = {
    googleAnalytics: { enabled: true, category: 'analytics' },
    googleMaps: { enabled: true, category: 'external' }
  };

  var state = {
    version: CONSENT_VERSION,
    external: false,
    analytics: false,
    decided: false,
    updatedAt: null
  };

  var banner = null;
  var settings = null;
  var analyticsToggle = null;
  var externalToggle = null;
  var lastFocusedElement = null;
  var currentScript = document.currentScript;
  var siteRoot = null;

  try {
    siteRoot = currentScript && currentScript.src
      ? new URL('../', currentScript.src)
      : new URL('./', window.location.href);
  } catch (error) {
    siteRoot = null;
  }

  function siteUrl(path){
    try { return new URL(path, siteRoot || window.location.href).href; }
    catch (error) { return path; }
  }

  function safeParse(value){
    try { return JSON.parse(value); }
    catch (error) { return null; }
  }

  function readStoredState(){
    var stored = null;
    try { stored = safeParse(window.localStorage.getItem(STORAGE_KEY)); }
    catch (error) { stored = null; }

    if (!stored || stored.version !== CONSENT_VERSION || stored.decided !== true) return null;

    return {
      version: CONSENT_VERSION,
      external: stored.external === true,
      analytics: stored.analytics === true,
      decided: true,
      updatedAt: stored.updatedAt || null
    };
  }

  function writeState(nextState){
    state = {
      version: CONSENT_VERSION,
      external: nextState.external === true,
      analytics: nextState.analytics === true,
      decided: true,
      updatedAt: new Date().toISOString()
    };

    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { /* La elección sigue funcionando durante la página actual. */ }

    applyConsent();
    hideBanner();
    closeSettings(false);

    try {
      window.dispatchEvent(new CustomEvent('ca:consentchange', { detail: getPublicState() }));
    } catch (error) {}
  }

  function getPublicState(){
    return {
      version: state.version,
      external: state.external,
      analytics: state.analytics,
      decided: state.decided,
      updatedAt: state.updatedAt
    };
  }

  function hasConsent(category){
    return state.decided === true && state[category] === true;
  }

  /* ------------------------------------------------------------------
     GOOGLE MAPS
     ------------------------------------------------------------------ */
  function updateGoogleMaps(){
    var frames = Array.prototype.slice.call(
      document.querySelectorAll('iframe[data-consent-service="google-maps"]')
    );

    frames.forEach(function(frame){
      var allowed = SERVICE_CONFIG.googleMaps.enabled && hasConsent('external');
      var source = frame.getAttribute('data-consent-src');
      var visual = frame.closest ? frame.closest('.location-map-visual') : frame.parentNode;

      if (allowed && source) {
        frame.classList.remove('is-consent-blocked');
        if (visual && visual.classList) visual.classList.remove('is-map-consent-blocked');
        if (frame.getAttribute('src') !== source) frame.setAttribute('src', source);
      } else {
        frame.classList.add('is-consent-blocked');
        if (visual && visual.classList) visual.classList.add('is-map-consent-blocked');
        if (frame.getAttribute('src')) frame.removeAttribute('src');
      }
    });
  }

  /* ------------------------------------------------------------------
     GOOGLE ANALYTICS 4
     ------------------------------------------------------------------ */
  function validGa4Id(){
    return /^G-[A-Z0-9]+$/i.test(GA4_MEASUREMENT_ID || '');
  }

  function removeAnalyticsCookies(){
    var names = document.cookie.split(';').map(function(part){
      return (part.split('=')[0] || '').trim();
    }).filter(function(name){ return name === '_ga' || name.indexOf('_ga_') === 0; });

    names.forEach(function(name){
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + window.location.hostname + '; SameSite=Lax';
    });
  }

  function ensureGtagBase(){
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function(){ window.dataLayer.push(arguments); };
    }
  }

  function enableGoogleAnalytics(){
    if (!SERVICE_CONFIG.googleAnalytics.enabled || !validGa4Id()) return;

    ensureGtagBase();
    window.gtag('consent', 'update', { analytics_storage: 'granted' });

    if (!document.querySelector('script[data-ca-ga4]')) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
      script.setAttribute('data-ca-ga4', '');
      document.head.appendChild(script);

      window.gtag('js', new Date());
      window.gtag('config', GA4_MEASUREMENT_ID, { send_page_view: true });
    }
  }

  function disableGoogleAnalytics(){
    if (window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    removeAnalyticsCookies();
  }

  function updateGoogleAnalytics(){
    if (hasConsent('analytics')) enableGoogleAnalytics();
    else disableGoogleAnalytics();
  }

  function applyConsent(){
    updateGoogleMaps();
    updateGoogleAnalytics();
  }

  /* ------------------------------------------------------------------
     INTERFAZ
     ------------------------------------------------------------------ */
  function createInterface(){
    if (document.getElementById('caConsentBanner')) return;

    var policyUrl = siteUrl('politica-cookies.html');

    var bannerMarkup = '' +
      '<section class="ca-consent-banner" id="caConsentBanner" aria-label="Cookies y privacidad" hidden>' +
        '<div class="ca-consent-banner-inner">' +
          '<div class="ca-consent-copy">' +
            '<span class="ca-consent-kicker">Cookies y privacidad</span>' +
            '<p>Utilizamos tecnologías necesarias para el funcionamiento de la web y, con tu consentimiento, tecnologías opcionales para obtener estadísticas de uso y cargar contenido externo.</p>' +
            '<p class="ca-consent-copy-secondary">Puedes <strong>aceptar</strong>, <strong>rechazar</strong> o <strong>configurar</strong> tus preferencias. Más información en nuestra <a class="ca-consent-policy-link" href="' + policyUrl + '"><strong>Política de Cookies</strong></a>.</p>' +
          '</div>' +
          '<div class="ca-consent-actions">' +
            '<button class="ca-consent-button" data-consent-accept type="button">Aceptar</button>' +
            '<button class="ca-consent-button" data-consent-reject type="button">Rechazar</button>' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-configure type="button">Configurar</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    var settingsMarkup = '' +
      '<div class="ca-consent-settings" id="caConsentSettings" role="dialog" aria-modal="true" aria-labelledby="caConsentSettingsTitle" hidden>' +
        '<div class="ca-consent-settings-panel">' +
          '<div class="ca-consent-settings-head">' +
            '<div><span class="ca-consent-kicker">Cookies y privacidad</span><h2 id="caConsentSettingsTitle">Configurar cookies</h2><p class="ca-consent-settings-subtitle">Elige tus preferencias</p></div>' +
            '<button class="ca-consent-close" data-consent-close type="button" aria-label="Cerrar configuración">×</button>' +
          '</div>' +
          '<div class="ca-consent-settings-intro">' +
            '<p>Puedes decidir qué tecnologías opcionales permites utilizar. Las tecnologías necesarias permanecen siempre activas porque permiten recordar tus preferencias de privacidad.</p>' +
            '<p>Puedes modificar o retirar tu consentimiento en cualquier momento. Para más información, consulta nuestra <a class="ca-consent-policy-link" href="' + policyUrl + '"><strong>Política de Cookies</strong></a>.</p>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Necesarias</h3><p>Permiten recordar tus preferencias de privacidad y garantizar las funciones básicas necesarias de la web. No se utilizan con fines publicitarios ni de análisis.</p></div>' +
            '<span class="ca-consent-always-on">Siempre activas</span>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Google Analytics</h3><p>Nos permite obtener estadísticas sobre el uso de la web y conocer, de forma agregada, cómo interactúan las personas usuarias con sus contenidos. Solo se activa si das tu consentimiento.</p></div>' +
            '<label class="ca-consent-switch" aria-label="Permitir Google Analytics">' +
              '<input id="caConsentAnalytics" type="checkbox"/>' +
              '<span aria-hidden="true"></span>' +
            '</label>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Google Maps</h3><p>Permite cargar el mapa interactivo de Google Maps disponible en la web. Si no lo autorizas, el mapa no se cargará y no se establecerá esa conexión con Google.</p></div>' +
            '<label class="ca-consent-switch" aria-label="Permitir Google Maps">' +
              '<input id="caConsentExternal" type="checkbox"/>' +
              '<span aria-hidden="true"></span>' +
            '</label>' +
          '</div>' +
          '<div class="ca-consent-settings-actions">' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-withdraw type="button">Retirar consentimiento</button>' +
            '<button class="ca-consent-button" data-consent-save type="button">Guardar preferencias</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', bannerMarkup + settingsMarkup);
    banner = document.getElementById('caConsentBanner');
    settings = document.getElementById('caConsentSettings');
    analyticsToggle = document.getElementById('caConsentAnalytics');
    externalToggle = document.getElementById('caConsentExternal');

    banner.querySelector('[data-consent-accept]').addEventListener('click', function(){
      writeState({ external:true, analytics:true });
    }, false);

    banner.querySelector('[data-consent-reject]').addEventListener('click', function(){
      writeState({ external:false, analytics:false });
    }, false);

    banner.querySelector('[data-consent-configure]').addEventListener('click', openSettings, false);
    settings.querySelector('[data-consent-close]').addEventListener('click', function(){ closeSettings(true); }, false);

    settings.querySelector('[data-consent-withdraw]').addEventListener('click', function(){
      if (analyticsToggle) analyticsToggle.checked = false;
      if (externalToggle) externalToggle.checked = false;
      writeState({ external:false, analytics:false });
    }, false);

    settings.querySelector('[data-consent-save]').addEventListener('click', function(){
      writeState({
        external: !!(externalToggle && externalToggle.checked),
        analytics: !!(analyticsToggle && analyticsToggle.checked)
      });
    }, false);

    settings.addEventListener('click', function(event){
      if (event.target === settings) closeSettings(true);
    }, false);

    document.addEventListener('keydown', function(event){
      if (event.key === 'Escape' && settings && !settings.hidden) closeSettings(true);
    }, false);
  }

  function showBanner(){
    if (!banner) return;
    banner.hidden = false;
    document.body.classList.add('ca-consent-open');
  }

  function hideBanner(){
    if (!banner) return;
    banner.hidden = true;
    document.body.classList.remove('ca-consent-open');
  }

  function openSettings(event){
    if (event && event.preventDefault) event.preventDefault();
    if (!settings) return;
    lastFocusedElement = event && event.currentTarget ? event.currentTarget : document.activeElement;
    if (analyticsToggle) analyticsToggle.checked = state.decided ? state.analytics : false;
    if (externalToggle) externalToggle.checked = state.decided ? state.external : false;
    settings.hidden = false;
    document.body.classList.add('ca-consent-settings-open');
    var close = settings.querySelector('[data-consent-close]');
    if (close) close.focus();
  }

  function closeSettings(restoreFocus){
    if (!settings) return;
    settings.hidden = true;
    document.body.classList.remove('ca-consent-settings-open');
    if (restoreFocus && lastFocusedElement && lastFocusedElement.focus) lastFocusedElement.focus();
  }

  function installFooterSettingsLinks(){
    var isBlog = window.location.pathname.indexOf('/blog/') !== -1;
    var prefix = isBlog ? '../' : '';
    var legalHref = prefix + 'aviso-legal.html';
    var privacyHref = prefix + 'privacidad.html';
    var cookiesHref = prefix + 'politica-cookies.html';

    Array.prototype.forEach.call(document.querySelectorAll('.footer-legal'), function(footer){
      var group = footer.querySelector('.footer-legal-links');

      if (!group) {
        Array.prototype.some.call(footer.querySelectorAll('span'), function(element){
          if ((element.textContent || '').trim() !== 'Aviso legal · Privacidad · Cookies') return false;
          group = element;
          group.classList.add('footer-legal-links');
          return true;
        });
      }

      if (group) {
        group.innerHTML =
          '<a class="footer-legal-link" href="' + legalHref + '">Aviso legal</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<a class="footer-legal-link" href="' + privacyHref + '">Privacidad</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<a class="footer-legal-link" href="' + cookiesHref + '">Cookies</a> ' +
          '<span aria-hidden="true">·</span> ' +
          '<button class="ca-cookie-settings-link" type="button" data-cookie-settings>Configurar cookies</button>';
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-cookie-settings]'), function(button){
      if (button.getAttribute('data-cookie-settings-bound') === 'true') return;
      button.setAttribute('data-cookie-settings-bound', 'true');
      button.addEventListener('click', openSettings, false);
    });
  }

  function init(){
    createInterface();
    installFooterSettingsLinks();

    var stored = readStoredState();
    if (stored) {
      state = stored;
      hideBanner();
    } else {
      showBanner();
    }

    applyConsent();
  }

  window.CAConsent = {
    getPreferences: getPublicState,
    hasConsent: hasConsent,
    openSettings: openSettings,
    services: SERVICE_CONFIG
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, false);
  else init();
}());
