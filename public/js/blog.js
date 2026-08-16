/* =====================================================================
   [REF JS-BLOG-INDEX-01] MAPA DEL JAVASCRIPT DEL BLOG
   =====================================================================
     JS-BLOG-HEADER-01   cabecera móvil según la dirección del scroll
     JS-BLOG-CALL-01     evita dos llamadas visibles a la vez
   ===================================================================== */

/* =====================================================================
   MINI GUÍA DEL JAVASCRIPT DEL BLOG
   =====================================================================

   Este archivo controla únicamente comportamientos de móvil del blog:
     - la cabecera se esconde al bajar y vuelve al subir;
     - la barra flotante de llamada se oculta si ya hay otro teléfono visible.

   IntersectionObserver detecta cuándo un elemento entra en la pantalla.
   updateWithRectangles() es una alternativa para navegadores antiguos.
   ===================================================================== */

/* =====================================================================
   CARANDELL ADVOCATS — JAVASCRIPT DEL BLOG
   =====================================================================

   FUNCIONES EN MÓVIL
   1. Ocultar la cabecera al bajar y recuperarla al subir.
   2. Mantener visible la llamada flotante mientras no haya otra llamada
      fija visible en pantalla.
   3. Ocultar la llamada flotante cuando aparece:
      - el panel negro de contacto del listado;
      - la tarjeta dorada del artículo;
      - el reclamo negro final del artículo;
      - el teléfono del pie.

   Los textos y estilos se modifican en HTML/CSS, no en este archivo.
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
    var floatingCall = document.querySelector('.blog-mobile-call');
    var lastScroll = window.pageYOffset || 0;
    var threshold = 14;

    /* ---------------------------------------------------------------
       [REF JS-BLOG-HEADER-01] CABECERA MÓVIL
       --------------------------------------------------------------- */
    if (header) {
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
    }

    /* ---------------------------------------------------------------
       [REF JS-BLOG-SCROLL-PANELS-01] PANELES DE CONTACTO EN PC
       ---------------------------------------------------------------
       El panel negro del índice utiliza position:sticky nativo de CSS.
       Esto permite que el navegador lo mueva de forma totalmente fluida.

       En los artículos, la tarjeta dorada también utiliza sticky. Solo se
       interviene una vez cuando el CTA negro final entra en pantalla:
       entonces la tarjeta queda fijada en su posición dentro del artículo.
       Al volver hacia arriba recupera automáticamente el sticky.
       --------------------------------------------------------------- */
    var DESKTOP_SCROLL_MIN = 981;
    var articleLayout = document.querySelector('.article-layout-wide');
    var articleContactCard = articleLayout
      ? articleLayout.querySelector('.article-contact-card')
      : null;
    var articleFinalCta = articleLayout
      ? articleLayout.querySelector('.article-final-cta')
      : null;
    var articleCardFrozen = false;
    var articleStopFramePending = false;

    function clearArticleCardFreeze() {
      if (!articleContactCard) return;

      articleContactCard.classList.remove('is-scroll-frozen');
      articleContactCard.style.removeProperty('--article-card-freeze-top');
      articleContactCard.style.removeProperty('--article-card-freeze-width');
      articleCardFrozen = false;
    }

    function updateArticleCardStop() {
      articleStopFramePending = false;

      if (!articleLayout || !articleContactCard || !articleFinalCta) return;

      if (window.innerWidth < DESKTOP_SCROLL_MIN) {
        clearArticleCardFreeze();
        return;
      }

      var ctaRect = articleFinalCta.getBoundingClientRect();
      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      var shouldFreeze = ctaRect.top <= viewportHeight;

      if (shouldFreeze && !articleCardFrozen) {
        var layoutRect = articleLayout.getBoundingClientRect();
        var cardRect = articleContactCard.getBoundingClientRect();
        var topInsideLayout = cardRect.top - layoutRect.top;

        articleContactCard.style.setProperty(
          '--article-card-freeze-top',
          Math.max(0, topInsideLayout) + 'px'
        );
        articleContactCard.style.setProperty(
          '--article-card-freeze-width',
          cardRect.width + 'px'
        );
        articleContactCard.classList.add('is-scroll-frozen');
        articleCardFrozen = true;
      } else if (!shouldFreeze && articleCardFrozen) {
        clearArticleCardFreeze();
      }
    }

    function requestArticleCardStopUpdate() {
      if (articleStopFramePending) return;
      articleStopFramePending = true;
      window.requestAnimationFrame(updateArticleCardStop);
    }

    if (articleLayout && articleContactCard && articleFinalCta) {
      window.addEventListener('scroll', requestArticleCardStopUpdate, {
        passive:true
      });
      window.addEventListener('resize', function () {
        clearArticleCardFreeze();
        requestArticleCardStopUpdate();
      }, false);
      window.addEventListener('load', requestArticleCardStopUpdate, false);
      requestArticleCardStopUpdate();
    }

    /* ---------------------------------------------------------------
       [REF JS-BLOG-CALL-01] EVITAR DOS BOTONES DE LLAMADA A LA VEZ
       --------------------------------------------------------------- */
    if (!floatingCall) return;

    var staticCallTargets = Array.prototype.slice.call(
      document.querySelectorAll(
        '.blog-ready-panel [data-copy-phone], ' +
        '.article-contact-card [data-copy-phone], ' +
        '.article-final-cta [data-copy-phone], ' +
        '.footer-contact-details'
      )
    );

    function setFloatingCallSuppressed(suppressed) {
      floatingCall.classList.toggle(
        'is-suppressed-by-static',
        Boolean(suppressed)
      );
    }

    /* Alternativa para navegadores antiguos sin IntersectionObserver. */
    function updateWithRectangles() {
      if (window.innerWidth > 820) {
        setFloatingCallSuppressed(false);
        return;
      }

      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      var staticCallIsVisible = staticCallTargets.some(function (target) {
        var rectangle = target.getBoundingClientRect();
        return rectangle.bottom > 0 && rectangle.top < viewportHeight;
      });

      setFloatingCallSuppressed(staticCallIsVisible);
    }

    if ('IntersectionObserver' in window && staticCallTargets.length) {
      var visibility = staticCallTargets.map(function () {
        return false;
      });

      try {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            var targetIndex = staticCallTargets.indexOf(entry.target);
            if (targetIndex !== -1) {
              visibility[targetIndex] = entry.isIntersecting;
            }
          });

          setFloatingCallSuppressed(
            visibility.some(function (isVisible) {
              return isVisible;
            })
          );
        }, {
          threshold:0.08
        });

        staticCallTargets.forEach(function (target) {
          observer.observe(target);
        });
      } catch (error) {
        window.addEventListener('scroll', updateWithRectangles, {
          passive:true
        });
        window.addEventListener('resize', updateWithRectangles, false);
        updateWithRectangles();
      }
    } else {
      window.addEventListener('scroll', updateWithRectangles, {
        passive:true
      });
      window.addEventListener('resize', updateWithRectangles, false);
      updateWithRectangles();
    }
  });
}());
