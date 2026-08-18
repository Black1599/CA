/* =====================================================================
   [REF JS-HEADER-INDEX-01] MAPA DE FUNCIONES COMPARTIDAS
   =====================================================================
     JS-HEADER-READY-01      espera a que el HTML esté preparado
     JS-HEADER-MENU-01       abre/cierra el menú
     JS-HEADER-CONTACT-01    ventana emergente de contacto
     JS-HEADER-TOP-01        vuelve al principio exacto
     JS-HEADER-PHONE-01      móvil llama; PC no ejecuta acción
     JS-HEADER-LANGUAGE-01   aviso provisional de idiomas
   ===================================================================== */

/* =====================================================================
   MINI GUÍA PARA ENTENDER ESTE JAVASCRIPT
   =====================================================================

   JavaScript añade COMPORTAMIENTO a elementos que ya existen en el HTML.

   Conceptos usados:
     var nombre = ...             guarda un valor o un elemento.
     function nombre() { ... }    agrupa instrucciones reutilizables.
     document.querySelector(...)  busca un elemento por selector CSS.
     addEventListener(...)        ejecuta código cuando ocurre un evento.
     classList.add/remove/toggle  añade o quita clases que CSS puede detectar.
     if (...) { ... }             ejecuta código solo si se cumple una condición.

   Este archivo controla la cabecera compartida: menú, idioma, enlaces internos
   y retorno exacto al inicio. No cambies nombres de clases sin actualizar HTML,
   CSS y JavaScript al mismo tiempo.
   ===================================================================== */

/* =====================================================================
   CABECERA COMÚN — MENÚ, IDIOMAS Y DESPLAZAMIENTOS
   =====================================================================

   Para añadir otra opción al menú no modifiques este archivo:
   añade un enlace dentro de <nav class="site-menu-panel">.
   ===================================================================== */

(function () {
  'use strict';

  /* [REF JS-HEADER-READY-01] Ejecuta callback cuando el DOM ya existe. */
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, false);
    } else {
      callback();
    }
  }


  ready(function () {
    var header = document.getElementById('siteHeader');
    var menuButton = document.querySelector('.site-menu-button');
    var menuPanel = document.querySelector('.site-menu-panel');
    var languageButton = document.querySelector('.site-language-button');
    var brand = document.querySelector('.shared-header-brand');

    /* [REF JS-HEADER-MENU-01] Cambia el estado visual y accesible del menú. */
    function setMenu(open) {
      if (!menuButton || !menuPanel) return;
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuPanel.classList.toggle('is-open', open);
      document.body.classList.toggle('site-menu-open', open);
      if (header && open) header.classList.remove('hidden-nav');
    }

    function closeMenu() {
      setMenu(false);
    }

    if (menuButton && menuPanel) {
      menuButton.addEventListener('click', function () {
        setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
      }, false);

      document.addEventListener('click', function (event) {
        if (!menuPanel.classList.contains('is-open')) return;
        if (menuPanel.contains(event.target) || menuButton.contains(event.target)) return;
        closeMenu();
      }, false);

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
      }, false);

      Array.prototype.forEach.call(menuPanel.querySelectorAll('a'), function (link) {
        link.addEventListener('click', closeMenu, false);
      });
    }

    /* ---------------------------------------------------------------
       [REF JS-HEADER-CONTACT-01] VENTANA EMERGENTE DE CONTACTO
       ---------------------------------------------------------------
       El enlace Contacto del menú, marcado con data-contact-popup, abre
       la misma tarjeta en portada, blog y artículos. No contiene formularios ni recoge datos personales.
       --------------------------------------------------------------- */
    var contactDialog = null;
    var lastContactFocus = null;

    function createContactDialog() {
      if (document.getElementById('siteContactDialog')) {
        contactDialog = document.getElementById('siteContactDialog');
        return;
      }

      var markup = '' +
        '<div class="site-contact-dialog" id="siteContactDialog" role="dialog" aria-modal="true" aria-labelledby="siteContactDialogTitle" hidden>' +
          '<div class="site-contact-dialog-backdrop" data-contact-close></div>' +
          '<section class="site-contact-dialog-panel" aria-label="Datos de contacto de Carandell Advocats">' +
            '<button class="site-contact-dialog-close" data-contact-close type="button" aria-label="Cerrar contacto">×</button>' +
            '<header class="site-contact-dialog-head">' +
              '<span class="site-contact-dialog-kicker">Contacto</span>' +
              '<h2 id="siteContactDialogTitle">Carandell Advocats</h2>' +
              '<p>Atención con cita previa.</p>' +
            '</header>' +
            '<div class="site-contact-dialog-list">' +
              '<div class="site-contact-dialog-item">' +
                '<span>Teléfono</span>' +
                '<strong>683 176 820</strong>' +
                '<a class="site-contact-dialog-action site-contact-dialog-phone-action" data-copy-phone="+34683176820" href="tel:+34683176820" aria-label="Llamar al 683 176 820" title="Llamar al 683 176 820">Llamar</a>' +
              '</div>' +
              '<div class="site-contact-dialog-item site-contact-dialog-email-item">' +
                '<span>Correo</span>' +
                '<strong class="site-contact-dialog-email">info@carandelladvocats.com</strong>' +
              '</div>' +
              '<div class="site-contact-dialog-item site-contact-dialog-schedule">' +
                '<span>Horario de oficina</span>' +
                '<div><strong>Lunes a jueves</strong><b>10:00–13:00 · 16:00–18:00</b></div>' +
                '<div><strong>Viernes</strong><b>10:00–13:00</b></div>' +
              '</div>' +
            '</div>' +
          '</section>' +
        '</div>';

      document.body.insertAdjacentHTML('beforeend', markup);
      contactDialog = document.getElementById('siteContactDialog');

      Array.prototype.forEach.call(
        contactDialog.querySelectorAll('[data-contact-close]'),
        function (control) {
          control.addEventListener('click', function () {
            closeContactDialog(true);
          }, false);
        }
      );

      contactDialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeContactDialog(true);
          return;
        }

        if (event.key !== 'Tab') return;

        var focusable = Array.prototype.slice.call(
          contactDialog.querySelectorAll('button:not([disabled]), a[href]:not([tabindex="-1"])')
        ).filter(function (element) {
          return element.offsetParent !== null;
        });

        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }, false);
    }

    function openContactDialog(event) {
      if (event) event.preventDefault();
      createContactDialog();
      if (!contactDialog) return;

      lastContactFocus = event && event.currentTarget
        ? event.currentTarget
        : document.activeElement;

      closeMenu();
      if (header) header.classList.remove('hidden-nav');
      contactDialog.hidden = false;
      document.body.classList.add('site-contact-dialog-open');

      var closeButton = contactDialog.querySelector('.site-contact-dialog-close');
      if (closeButton) {
        window.setTimeout(function () { closeButton.focus(); }, 0);
      }
    }

    function closeContactDialog(restoreFocus) {
      if (!contactDialog || contactDialog.hidden) return;
      contactDialog.hidden = true;
      document.body.classList.remove('site-contact-dialog-open');

      if (restoreFocus && lastContactFocus && lastContactFocus.focus) {
        lastContactFocus.focus();
      }
    }

    createContactDialog();

    Array.prototype.forEach.call(
      document.querySelectorAll('.site-menu-panel [data-contact-popup]'),
      function (link) {
        link.addEventListener('click', openContactDialog, false);
      }
    );

    /* [REF JS-HEADER-TOP-01] Evita quedarse unos píxeles por debajo del inicio. */
    function goToAbsoluteTop(event) {
      var href = event.currentTarget.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;

      event.preventDefault();
      if (header) header.classList.remove('hidden-nav');
      closeMenu();

      try {
        history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search
        );
      } catch (error) {
        /* Puede estar limitado al abrir un archivo local. */
      }

      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    }

    Array.prototype.forEach.call(
      document.querySelectorAll('[data-home-link]'),
      function (link) {
        link.addEventListener('click', goToAbsoluteTop, false);
      }
    );

    if (brand) brand.addEventListener('click', goToAbsoluteTop, false);


    /* ---------------------------------------------------------------
       [REF JS-HEADER-PHONE-01] TELÉFONO SEGÚN EL DISPOSITIVO
       ---------------------------------------------------------------
       Móvil: el enlace tel: abre una llamada.
       PC: el enlace queda visualmente presente pero se marca como desactivado.

       aria-disabled y tabindex permiten que lectores de pantalla y agentes
       como ChatGPT Atlas entiendan el estado real del control.
       --------------------------------------------------------------- */
    var phoneControls = Array.prototype.slice.call(
      document.querySelectorAll('[data-copy-phone]')
    );

    function isMobilePhoneLayout() {
      return window.matchMedia
        ? window.matchMedia('(max-width: 820px)').matches
        : window.innerWidth <= 820;
    }

    function updatePhoneAccessibilityState() {
      var mobile = isMobilePhoneLayout();

      phoneControls.forEach(function (phoneControl) {
        if (mobile) {
          phoneControl.removeAttribute('aria-disabled');
          phoneControl.removeAttribute('tabindex');
        } else {
          phoneControl.setAttribute('aria-disabled', 'true');
          phoneControl.setAttribute('tabindex', '-1');
        }
      });
    }

    phoneControls.forEach(function (phoneControl) {
      phoneControl.addEventListener('click', function (event) {
        if (isMobilePhoneLayout()) return;
        event.preventDefault();
      }, false);
    });

    updatePhoneAccessibilityState();
    window.addEventListener('resize', updatePhoneAccessibilityState, false);

    /* [REF JS-HEADER-LANGUAGE-01] Selector provisional: todavía no cambia idioma. */
    if (languageButton) {
      languageButton.addEventListener('click', function () {
        window.alert(
          'La versión completa en catalán se incorporará más adelante.'
        );
      }, false);
    }
  });
}());

/* =====================================================================
   [REF JS-HEADER-CONSENT-01] CARGA DEL GESTOR DE PRIVACIDAD
   =====================================================================
   Todas las páginas actuales cargan site-header.js. Desde aquí se añaden
   consent.css y consent.js usando la propia ruta del script como referencia,
   por lo que funciona tanto en GitHub Pages como en el futuro dominio/CDmon.
   ===================================================================== */
(function(){
  'use strict';

  var loader = document.currentScript;
  if (!loader || !loader.src) return;

  var consentScriptUrl;
  var consentStyleUrl;

  try {
    consentScriptUrl = new URL('consent.js?v=20260818-legal2', loader.src).href;
    consentStyleUrl = new URL('../css/consent.css?v=20260818-legal2', loader.src).href;
  } catch (error) {
    return;
  }

  if (!document.querySelector('link[data-ca-consent-style]')) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = consentStyleUrl;
    style.setAttribute('data-ca-consent-style', '');
    document.head.appendChild(style);
  }

  if (!document.querySelector('script[data-ca-consent-script]')) {
    var script = document.createElement('script');
    script.src = consentScriptUrl;
    script.async = false;
    script.setAttribute('data-ca-consent-script', '');
    document.head.appendChild(script);
  }
}());

