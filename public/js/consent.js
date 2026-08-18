/* =====================================================================
   CARANDELL ADVOCATS — GESTOR DE CONSENTIMIENTO
   =====================================================================

   ESTADO ACTUAL (agosto 2026)
   - Google Maps: opcional. El iframe no se carga hasta que el usuario acepta
     la categoría "Contenido externo".
   - Google Analytics / GA4: NO instalado todavía. La estructura de
     consentimiento queda preparada para incorporarlo más adelante.

   IMPORTANTE PARA EL FUTURO
   Si se añade un nuevo servicio o cambia una finalidad, incrementa
   CONSENT_VERSION para volver a solicitar una decisión al usuario.
   ===================================================================== */
(function(){
  'use strict';

  var STORAGE_KEY = 'ca_consent_preferences';
  var CONSENT_VERSION = 1;

  /* Servicios actualmente integrados. Google Analytics se añadirá cuando
     se disponga del identificador de medición y de los textos legales definitivos. */
  var SERVICE_CONFIG = {
    googleMaps: {
      enabled: true,
      category: 'external'
    }
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
  var externalToggle = null;
  var lastFocusedElement = null;

  function safeParse(value){
    try { return JSON.parse(value); }
    catch (error) { return null; }
  }

  function readStoredState(){
    var stored = null;
    try { stored = safeParse(window.localStorage.getItem(STORAGE_KEY)); }
    catch (error) { stored = null; }

    if (!stored || stored.version !== CONSENT_VERSION || stored.decided !== true) {
      return null;
    }

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

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* Si el navegador bloquea storage, la elección funciona durante esta página. */
    }

    applyConsent();
    hideBanner();
    closeSettings(false);

    try {
      window.dispatchEvent(new CustomEvent('ca:consentchange', {
        detail: getPublicState()
      }));
    } catch (error) {
      /* CustomEvent no está disponible en navegadores muy antiguos. */
    }
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
    if (!state.decided) return false;
    return state[category] === true;
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

  function applyConsent(){
    updateGoogleMaps();
  }

  /* ------------------------------------------------------------------
     INTERFAZ
     ------------------------------------------------------------------ */
  function createInterface(){
    if (document.getElementById('caConsentBanner')) return;

    var bannerMarkup = '' +
      '<section class="ca-consent-banner" id="caConsentBanner" aria-label="Preferencias de privacidad" hidden>' +
        '<div class="ca-consent-banner-inner">' +
          '<div class="ca-consent-copy">' +
            '<span class="ca-consent-kicker">Cookies</span>' +
            '<p>Utilizamos cookies propias y de terceros para analizar el uso de la web y ofrecer determinados servicios. Puedes aceptar, rechazar o configurar su uso.</p>' +
          '</div>' +
          '<div class="ca-consent-actions">' +
            '<button class="ca-consent-button" data-consent-reject type="button">Rechazar</button>' +
            '<button class="ca-consent-button" data-consent-accept type="button">Aceptar</button>' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-configure type="button">Configurar</button>' +
          '</div>' +
        '</div>' +
      '</section>';

    var settingsMarkup = '' +
      '<div class="ca-consent-settings" id="caConsentSettings" role="dialog" aria-modal="true" aria-labelledby="caConsentSettingsTitle" hidden>' +
        '<div class="ca-consent-settings-panel">' +
          '<div class="ca-consent-settings-head">' +
            '<div><span class="ca-consent-kicker">Privacidad</span><h2 id="caConsentSettingsTitle">Configurar preferencias</h2></div>' +
            '<button class="ca-consent-close" data-consent-close type="button" aria-label="Cerrar configuración">×</button>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Funciones necesarias</h3><p>Permiten el funcionamiento básico del sitio y recordar tu elección de privacidad.</p></div>' +
            '<span class="ca-consent-always-on">Siempre activas</span>' +
          '</div>' +
          '<div class="ca-consent-category">' +
            '<div><h3>Contenido externo · Google Maps</h3><p>Permite cargar el mapa interactivo de Google en la página principal. Si lo rechazas, verás la representación estática de ubicación y podrás abrir Google Maps mediante el enlace externo.</p></div>' +
            '<label class="ca-consent-switch" aria-label="Permitir Google Maps">' +
              '<input id="caConsentExternal" type="checkbox"/>' +
              '<span aria-hidden="true"></span>' +
            '</label>' +
          '</div>' +
          '<p class="ca-consent-settings-note">Google Analytics no está activo actualmente. Cuando se incorpore, se actualizará esta configuración y se solicitará de nuevo el consentimiento cuando corresponda.</p>' +
          '<div class="ca-consent-settings-actions">' +
            '<button class="ca-consent-button ca-consent-configure" data-consent-settings-reject type="button">Rechazar opcionales</button>' +
            '<button class="ca-consent-button" data-consent-save type="button">Guardar preferencias</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', bannerMarkup + settingsMarkup);
    banner = document.getElementById('caConsentBanner');
    settings = document.getElementById('caConsentSettings');
    externalToggle = document.getElementById('caConsentExternal');

    var accept = banner.querySelector('[data-consent-accept]');
    var reject = banner.querySelector('[data-consent-reject]');
    var configure = banner.querySelector('[data-consent-configure]');
    var close = settings.querySelector('[data-consent-close]');
    var save = settings.querySelector('[data-consent-save]');
    var rejectSettings = settings.querySelector('[data-consent-settings-reject]');

    accept.addEventListener('click', function(){
      writeState({ external:true, analytics:false });
    }, false);

    reject.addEventListener('click', function(){
      writeState({ external:false, analytics:false });
    }, false);

    configure.addEventListener('click', openSettings, false);
    close.addEventListener('click', function(){ closeSettings(true); }, false);

    rejectSettings.addEventListener('click', function(){
      if (externalToggle) externalToggle.checked = false;
      writeState({ external:false, analytics:false });
    }, false);

    save.addEventListener('click', function(){
      writeState({
        external: !!(externalToggle && externalToggle.checked),
        analytics:false
      });
    }, false);

    settings.addEventListener('click', function(event){
      if (event.target === settings) closeSettings(true);
    }, false);

    document.addEventListener('keydown', function(event){
      if (event.key === 'Escape' && settings && !settings.hidden) {
        closeSettings(true);
      }
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

  function openSettings(){
    if (!settings) return;
    lastFocusedElement = document.activeElement;
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
    if (restoreFocus && lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  /* Los enlaces legales se incluyen directamente en el HTML.
     Aquí solo se conecta el botón permanente «Cookies» con el configurador. */
  function installFooterSettingsLinks(){
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-cookie-settings]'),
      function(button){ button.addEventListener('click', openSettings, false); }
    );
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

  /* API preparada para la futura integración de Google Analytics 4. */
  window.CAConsent = {
    getPreferences: getPublicState,
    hasConsent: hasConsent,
    openSettings: openSettings,
    services: SERVICE_CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }
}());
