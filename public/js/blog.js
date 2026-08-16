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
       [REF JS-BLOG-SCROLL-PANELS-01] PANELES QUE ACOMPAÑAN EL SCROLL EN PC
       ---------------------------------------------------------------
       El panel permanece en su columna y se desplaza verticalmente con
       transform:translateY(). Esto evita los problemas que position:sticky
       y position:fixed pueden tener con los estilos heredados del proyecto.

       PORTADA DEL BLOG
       - el panel negro acompaña el scroll;
       - se detiene exactamente en la base de la última publicación.

       ARTÍCULOS
       - la tarjeta dorada acompaña el scroll;
       - se detiene cuando el CTA negro final empieza a entrar en pantalla;
       - al volver hacia arriba recupera automáticamente su posición.
       --------------------------------------------------------------- */
    var DESKTOP_SCROLL_MIN = 821;
    var PANEL_TOP = 154;

    var blogGrid = document.querySelector('.blog-grid');
    var blogReadyPanel = blogGrid
      ? blogGrid.querySelector('.blog-ready-panel')
      : null;

    var articleLayout = document.querySelector('.article-layout-wide');
    var articleContactCard = articleLayout
      ? articleLayout.querySelector('.article-contact-card')
      : null;
    var articleFinalCta = articleLayout
      ? articleLayout.querySelector('.article-final-cta')
      : null;

    var blogPanelMetrics = null;
    var articlePanelMetrics = null;
    var panelsFramePending = false;

    function clearPanelTransform(element) {
      if (!element) return;
      element.style.removeProperty('transform');
      element.style.removeProperty('will-change');
    }

    function documentTop(element) {
      var rect = element.getBoundingClientRect();
      return rect.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
    }

    function captureBlogPanelMetrics() {
      if (!blogGrid || !blogReadyPanel) return null;

      clearPanelTransform(blogReadyPanel);

      return {
        naturalTop:documentTop(blogReadyPanel),
        gridBottom:documentTop(blogGrid) + blogGrid.offsetHeight,
        panelHeight:blogReadyPanel.offsetHeight
      };
    }

    function captureArticlePanelMetrics() {
      if (!articleLayout || !articleContactCard || !articleFinalCta) return null;

      clearPanelTransform(articleContactCard);

      return {
        naturalTop:documentTop(articleContactCard),
        layoutBottom:documentTop(articleLayout) + articleLayout.offsetHeight,
        panelHeight:articleContactCard.offsetHeight,
        ctaTop:documentTop(articleFinalCta)
      };
    }

    function translatePanel(element, amount) {
      if (!element) return;
      var safeAmount = Math.max(0, Math.round(amount));
      element.style.setProperty(
        'transform',
        'translate3d(0,' + safeAmount + 'px,0)',
        'important'
      );
      element.style.setProperty('will-change', 'transform', 'important');
    }

    function resetBlogScrollPanel() {
      clearPanelTransform(blogReadyPanel);
      blogPanelMetrics = null;
    }

    function resetArticleScrollPanel() {
      clearPanelTransform(articleContactCard);
      articlePanelMetrics = null;
    }

    function updateBlogScrollPanel() {
      if (!blogGrid || !blogReadyPanel) return;

      if (window.innerWidth < DESKTOP_SCROLL_MIN) {
        resetBlogScrollPanel();
        return;
      }

      if (!blogPanelMetrics) {
        blogPanelMetrics = captureBlogPanelMetrics();
      }

      var scrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;

      var desiredDocumentTop = Math.max(
        blogPanelMetrics.naturalTop,
        scrollY + PANEL_TOP
      );

      var maximumDocumentTop =
        blogPanelMetrics.gridBottom - blogPanelMetrics.panelHeight;

      desiredDocumentTop = Math.min(
        desiredDocumentTop,
        maximumDocumentTop
      );

      translatePanel(
        blogReadyPanel,
        desiredDocumentTop - blogPanelMetrics.naturalTop
      );
    }

    function updateArticleScrollPanel() {
      if (!articleLayout || !articleContactCard || !articleFinalCta) return;

      if (window.innerWidth < DESKTOP_SCROLL_MIN) {
        resetArticleScrollPanel();
        return;
      }

      if (!articlePanelMetrics) {
        articlePanelMetrics = captureArticlePanelMetrics();
      }

      var scrollY =
        window.pageYOffset || document.documentElement.scrollTop || 0;
      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      var desiredDocumentTop = Math.max(
        articlePanelMetrics.naturalTop,
        scrollY + PANEL_TOP
      );

      /*
       * La tarjeta deja de avanzar en el instante en que la parte superior
       * del CTA negro alcanza la parte inferior de la ventana.
       */
      var stopWhenCtaAppearsTop =
        articlePanelMetrics.ctaTop - viewportHeight + PANEL_TOP;

      var maximumInsideLayout =
        articlePanelMetrics.layoutBottom - articlePanelMetrics.panelHeight;

      var maximumDocumentTop = Math.min(
        stopWhenCtaAppearsTop,
        maximumInsideLayout
      );

      maximumDocumentTop = Math.max(
        articlePanelMetrics.naturalTop,
        maximumDocumentTop
      );

      desiredDocumentTop = Math.min(
        desiredDocumentTop,
        maximumDocumentTop
      );

      translatePanel(
        articleContactCard,
        desiredDocumentTop - articlePanelMetrics.naturalTop
      );
    }

    function updateDesktopScrollPanels() {
      panelsFramePending = false;
      updateBlogScrollPanel();
      updateArticleScrollPanel();
    }

    function requestDesktopScrollPanelsUpdate() {
      if (panelsFramePending) return;
      panelsFramePending = true;
      window.requestAnimationFrame(updateDesktopScrollPanels);
    }

    function recalculateDesktopScrollPanels() {
      resetBlogScrollPanel();
      resetArticleScrollPanel();
      requestDesktopScrollPanelsUpdate();
    }

    if (blogReadyPanel || articleContactCard) {
      window.addEventListener(
        'scroll',
        requestDesktopScrollPanelsUpdate,
        { passive:true }
      );

      window.addEventListener(
        'resize',
        recalculateDesktopScrollPanels,
        false
      );

      window.addEventListener(
        'load',
        recalculateDesktopScrollPanels,
        false
      );

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(recalculateDesktopScrollPanels);
      }

      updateDesktopScrollPanels();
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
