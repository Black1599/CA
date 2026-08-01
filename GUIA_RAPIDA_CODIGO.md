# Guía rápida del código

Este archivo acompaña al manual PDF. El manual completo explica el proyecto
archivo por archivo y contiene ejemplos de HTML, CSS, JavaScript, imágenes,
blog, pruebas y publicación.

## Regla principal

Haz siempre una copia antes de modificar y cambia una sola cosa cada vez.

## Comentarios según el lenguaje

```html
<!-- Comentario HTML: no aparece en la página -->
```

```css
/* Comentario CSS: explica un bloque de estilos */
```

```javascript
// Comentario JavaScript de una línea
/* Comentario JavaScript de varias líneas */
```

`# comentario` no es válido dentro de HTML, CSS ni JavaScript. Se utiliza en
otros lenguajes o en ciertos archivos de configuración.

## Archivos principales

- `index.html`: contenido de la página principal.
- `blog/index.html`: listado de publicaciones.
- `blog/*.html`: artículos individuales.
- `css/home.css`: diseño general y portada.
- `css/blog.css`: diseño del blog.
- `js/site-header.js`: menú e idiomas.
- `js/home.js`: carruseles y llamada móvil de la portada.
- `js/blog.js`: cabecera y llamada móvil del blog.
- `assets/images/`: fotografías, logo y favicon.
- `plantillas/`: archivos para copiar al crear publicaciones.

## Abrir localmente

Abre `index.html` con Safari o Chrome. En VS Code abre la carpeta completa,
guarda con `Cmd + S` y recarga el navegador.


## Actualización intel16.05

- `assets/images/logo-carandell-hd.png`: ampliación del logo exacto. Para una
  nitidez perfecta, conviene conseguir el original vectorial SVG/PDF/AI.
- Todos los teléfonos muestran `683 176 820` y al pulsarlos copian
  `+34683176820`; la lógica está en `js/site-header.js`.
- El menú muestra solo el icono, manteniendo `aria-label` para accesibilidad.
- Se retiró el iframe de Google Maps; la tarjeta de ubicación sigue enlazando.
- El fondo queda liso y la tarjeta de Instagram pasa a negro y dorado.
