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
       Se utiliza position:fixed controlado por JavaScript en vez de confiar
       en position:sticky. De este modo el comportamiento no depende de los
       overflow/transform heredados del resto de hojas de estilo.

       PORTADA DEL BLOG
       - el panel negro se mantiene visible mientras se recorre el listado;
       - al llegar al final de la última publicación queda apoyado en la base
         de .blog-grid.

       ARTÍCULOS
       - la tarjeta dorada se mantiene visible al hacer scroll;
       - cuando el CTA negro final empieza a entrar en pantalla, la tarjeta
         deja de seguir al usuario y queda fijada en ese punto del artículo;
       - al volver hacia arriba recupera automáticamente el seguimiento.
       --------------------------------------------------------------- */
    var DESKTOP_SCROLL_MIN = 981;
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
    var articleStopTop = null;
    var panelsFramePending = false;

    function setImportantStyle(element, property, value) {
      if (!element) return;
      element.style.setProperty(property, value, 'important');
    }

    function removePanelInlineStyles(element) {
      if (!element) return;
      [
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'width',
        'margin',
        'transform'
      ].forEach(function (property) {
        element.style.removeProperty(property);
      });
    }

    function resetBlogScrollPanel() {
      removePanelInlineStyles(blogReadyPanel);
      blogPanelMetrics = null;
    }

    function resetArticleScrollPanel() {
      removePanelInlineStyles(articleContactCard);
      articlePanelMetrics = null;
      articleStopTop = null;
    }

    function capturePanelMetrics(container, panel) {
      if (!container || !panel) return null;

      /* Se mide siempre en estado natural. */
      removePanelInlineStyles(panel);

      var containerRect = container.getBoundingClientRect();
      var panelRect = panel.getBoundingClientRect();

      return {
        width:panelRect.width,
        leftOffset:panelRect.left - containerRect.left,
        naturalTopOffset:panelRect.top - containerRect.top
      };
    }

    function updateBlogScrollPanel() {
      if (!blogGrid || !blogReadyPanel) return;

      if (window.innerWidth < DESKTOP_SCROLL_MIN) {
        resetBlogScrollPanel();
        return;
      }

      if (!blogPanelMetrics) {
        blogPanelMetrics = capturePanelMetrics(blogGrid, blogReadyPanel);
      }

      var gridRect = blogGrid.getBoundingClientRect();
      var panelHeight = blogReadyPanel.offsetHeight;
      var naturalViewportTop =
        gridRect.top + blogPanelMetrics.naturalTopOffset;

      /* Antes de que el panel alcance la parte superior, conserva su sitio. */
      if (naturalViewportTop >= PANEL_TOP) {
        removePanelInlineStyles(blogReadyPanel);
        return;
      }

      /* Al llegar a la base del listado, queda apoyado en el final del grid. */
      if (gridRect.bottom - panelHeight <= PANEL_TOP) {
        setImportantStyle(blogReadyPanel, 'position', 'absolute');
        setImportantStyle(blogReadyPanel, 'top', 'auto');
        setImportantStyle(blogReadyPanel, 'bottom', '0px');
        setImportantStyle(blogReadyPanel, 'left', 'auto');
        setImportantStyle(blogReadyPanel, 'right', '0px');
        setImportantStyle(
          blogReadyPanel,
          'width',
          blogPanelMetrics.width + 'px'
        );
        return;
      }

      /* Tramo central: acompaña de verdad al usuario en la ventana. */
      setImportantStyle(blogReadyPanel, 'position', 'fixed');
      setImportantStyle(blogReadyPanel, 'top', PANEL_TOP + 'px');
      setImportantStyle(blogReadyPanel, 'bottom', 'auto');
      setImportantStyle(
        blogReadyPanel,
        'left',
        (gridRect.left + blogPanelMetrics.leftOffset) + 'px'
      );
      setImportantStyle(blogReadyPanel, 'right', 'auto');
      setImportantStyle(
        blogReadyPanel,
        'width',
        blogPanelMetrics.width + 'px'
      );
    }

    function updateArticleScrollPanel() {
      if (!articleLayout || !articleContactCard || !articleFinalCta) return;

      if (window.innerWidth < DESKTOP_SCROLL_MIN) {
        resetArticleScrollPanel();
        return;
      }

      if (!articlePanelMetrics) {
        articlePanelMetrics = capturePanelMetrics(
          articleLayout,
          articleContactCard
        );
      }

      var layoutRect = articleLayout.getBoundingClientRect();
      var ctaRect = articleFinalCta.getBoundingClientRect();
      var viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      var naturalViewportTop =
        layoutRect.top + articlePanelMetrics.naturalTopOffset;

      /* Al volver hacia arriba y desaparecer el CTA negro, se reactiva. */
      if (articleStopTop !== null && ctaRect.top >= viewportHeight) {
        articleStopTop = null;
      }

      /* Antes de alcanzar la zona superior, la tarjeta permanece natural. */
      if (naturalViewportTop >= PANEL_TOP && articleStopTop === null) {
        removePanelInlineStyles(articleContactCard);
        return;
      }

      /* En cuanto el CTA negro empieza a verse, congelamos la posición
         documental exacta que tenía la tarjeta dorada. */
      if (articleStopTop === null && ctaRect.top < viewportHeight) {
        articleStopTop = Math.max(
          articlePanelMetrics.naturalTopOffset,
          PANEL_TOP - layoutRect.top
        );
      }

      if (articleStopTop !== null) {
        setImportantStyle(articleContactCard, 'position', 'absolute');
        setImportantStyle(
          articleContactCard,
          'top',
          articleStopTop + 'px'
        );
        setImportantStyle(articleContactCard, 'bottom', 'auto');
        setImportantStyle(articleContactCard, 'left', 'auto');
        setImportantStyle(articleContactCard, 'right', '0px');
        setImportantStyle(
          articleContactCard,
          'width',
          articlePanelMetrics.width + 'px'
        );
        return;
      }

      /* Tramo central del artículo: la tarjeta dorada acompaña el scroll. */
      setImportantStyle(articleContactCard, 'position', 'fixed');
      setImportantStyle(articleContactCard, 'top', PANEL_TOP + 'px');
      setImportantStyle(articleContactCard, 'bottom', 'auto');
      setImportantStyle(
        articleContactCard,
        'left',
        (layoutRect.left + articlePanelMetrics.leftOffset) + 'px'
      );
      setImportantStyle(articleContactCard, 'right', 'auto');
      setImportantStyle(
        articleContactCard,
        'width',
        articlePanelMetrics.width + 'px'
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

    if (blogReadyPanel || articleContactCard) {
      window.addEventListener('scroll', requestDesktopScrollPanelsUpdate, {
        passive:true
      });

      window.addEventListener('resize', function () {
        resetBlogScrollPanel();
        resetArticleScrollPanel();
        requestDesktopScrollPanelsUpdate();
      }, false);

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
