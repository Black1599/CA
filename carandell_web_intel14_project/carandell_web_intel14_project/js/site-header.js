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

    if (languageButton) {
      languageButton.addEventListener('click', function () {
        window.alert(
          'La versión completa en catalán e inglés se incorporará más adelante.'
        );
      }, false);
    }
  });
}());
