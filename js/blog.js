/* =====================================================================
   CARANDELL ADVOCATS — JAVASCRIPT DEL BLOG
   =====================================================================

   Solo controla la cabecera en móvil:
   - Se oculta al bajar.
   - Reaparece al subir.
   - El botón de llamada permanece siempre visible.
   ===================================================================== */

(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var lastScroll = window.pageYOffset || 0;
  var threshold = 14;

  if (!header) return;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset || 0;
    var isMobile = window.innerWidth <= 820;

    if (!isMobile || currentScroll < 18) {
      header.classList.remove('hidden-nav');
      lastScroll = currentScroll;
      return;
    }

    if (currentScroll > lastScroll + threshold) {
      header.classList.add('hidden-nav');
      lastScroll = currentScroll;
    } else if (currentScroll < lastScroll - threshold) {
      header.classList.remove('hidden-nav');
      lastScroll = currentScroll;
    }
  }, { passive: true });
}());
