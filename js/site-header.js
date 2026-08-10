/* =====================================================================
   [REF JS-HEADER-INDEX-01] MAPA DE FUNCIONES COMPARTIDAS
   =====================================================================
     JS-HEADER-READY-01      espera a que el HTML esté preparado
     JS-HEADER-MENU-01       abre/cierra el menú
     JS-HEADER-SCROLL-01     desplazamientos internos
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

    /* [REF JS-HEADER-SCROLL-01] Localiza una sección y se desplaza suavemente. */
    function scrollToElement(selector) {
      var target = document.querySelector(selector);
      if (!target) return false;
      if (header) header.classList.remove('hidden-nav');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    }

    /* Contacto en la portada:
       PC -> botón superior; móvil -> botón situado debajo del horario. */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-responsive-scroll]'),
      function (link) {
        link.addEventListener('click', function (event) {
          var selector = window.innerWidth <= 820
            ? link.getAttribute('data-mobile-target')
            : link.getAttribute('data-desktop-target');

          if (selector && scrollToElement(selector)) event.preventDefault();
        }, false);
      }
    );

    /* Contacto dentro del blog -> datos de contacto del pie. */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-scroll-target]'),
      function (link) {
        link.addEventListener('click', function (event) {
          var selector = link.getAttribute('data-scroll-target');
          if (selector && scrollToElement(selector)) event.preventDefault();
        }, false);
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
          'La versión completa en catalán e inglés se incorporará más adelante.'
        );
      }, false);
    }
  });
}());
