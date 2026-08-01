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

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, false);
    } else {
      callback();
    }
  }

  /* ------------------------------------------------------------------
     TELÉFONO COPIABLE
     Clipboard API copia el número; el método alternativo cubre navegadores
     antiguos o archivos abiertos localmente.
     ------------------------------------------------------------------ */
  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var temporaryInput = document.createElement('textarea');
      temporaryInput.value = text;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      try {
        var copied = document.execCommand('copy');
        document.body.removeChild(temporaryInput);
        copied ? resolve() : reject(new Error('No se pudo copiar'));
      } catch (error) {
        document.body.removeChild(temporaryInput);
        reject(error);
      }
    });
  }

  function showPhoneCopiedMessage(message) {
    var toast = document.querySelector('.copy-phone-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'copy-phone-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showPhoneCopiedMessage.timer);
    showPhoneCopiedMessage.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  ready(function () {
    var header = document.getElementById('siteHeader');
    var menuButton = document.querySelector('.site-menu-button');
    var menuPanel = document.querySelector('.site-menu-panel');
    var languageButton = document.querySelector('.site-language-button');
    var brand = document.querySelector('.shared-header-brand');

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
       TELÉFONO SEGÚN EL DISPOSITIVO
       ---------------------------------------------------------------

       - Móvil (hasta 820 px): no se cancela el enlace tel:, por lo que el
         sistema abre la pantalla de llamada.
       - PC (más de 820 px): se cancela el enlace y se copia el número.

       El texto visible del botón no cambia: siempre muestra 683 176 820.
       --------------------------------------------------------------- */
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-copy-phone]'),
      function (phoneControl) {
        phoneControl.addEventListener('click', function (event) {
          var isMobileLayout = window.matchMedia
            ? window.matchMedia('(max-width: 820px)').matches
            : window.innerWidth <= 820;

          /* En móvil dejamos actuar al href="tel:+34683176820". */
          if (isMobileLayout) return;

          /* En PC evitamos la llamada y copiamos el número. */
          event.preventDefault();

          var phone =
            phoneControl.getAttribute('data-copy-phone') ||
            '+34683176820';

          copyTextToClipboard(phone).then(function () {
            showPhoneCopiedMessage('Teléfono copiado: 683 176 820');
          }).catch(function () {
            showPhoneCopiedMessage('Copia manualmente: 683 176 820');
          });
        }, false);
      }
    );

    if (languageButton) {
      languageButton.addEventListener('click', function () {
        window.alert(
          'La versión completa en catalán e inglés se incorporará más adelante.'
        );
      }, false);
    }
  });
}());
