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

- `assets/images/logo-carandell-vector.svg`: versión vectorial extraída del archivo original de Illustrator. Para una
  nitidez perfecta, conviene conseguir el original vectorial SVG/PDF/AI.
- Todos los teléfonos muestran `683 176 820` y al pulsarlos copian
  `+34683176820`; la lógica está en `js/site-header.js`.
- El menú muestra solo el icono, manteniendo `aria-label` para accesibilidad.
- Se retiró el iframe de Google Maps; la tarjeta de ubicación sigue enlazando.
- El fondo queda liso y la tarjeta de Instagram pasa a negro y dorado.


## Actualización intel16.06

- El logotipo principal utiliza `assets/images/logo-carandell-vector.svg`.
  Es vectorial y no pierde nitidez al ampliarse.
- El archivo original se conserva en
  `assets/source/logo-carandell-original.ai`.
- Google Maps vuelve a mostrarse en PC mediante una búsqueda exclusiva de
  la dirección. No se consulta la ficha comercial ni sus reseñas.
- Los botones de teléfono muestran únicamente `683 176 820`.
  Al pulsarlos, el número continúa copiándose al portapapeles.


## Actualización intel16.07

### Comportamiento de los teléfonos

Todos los botones siguen mostrando:

```text
683 176 820
```

- En PC, al pulsar se copia `+34683176820` al portapapeles.
- En móvil, al pulsar se abre la llamada mediante `tel:+34683176820`.

El comportamiento está programado en:

```text
js/site-header.js
```

Los enlaces conservan simultáneamente:

```html
href="tel:+34683176820"
data-copy-phone="+34683176820"
```

### Horario

El horario de lunes a jueves aparece en dos líneas:

```text
10:00–13:00
16:00–18:00
```

Se ha eliminado el punto central entre ambos horarios.


## Actualización intel16.08

### Instagram

Se utiliza el diseño negro original:

- fondo negro;
- icono de Instagram dorado y recto;
- usuario en blanco;
- detalles dorados;
- sin la frase «Curiosidades y actualidad jurídica».

El HTML del bloque está en `index.html`, dentro de:

```html
<section id="instagram">
```

Los estilos están al final de `css/home.css`, en el bloque:

```css
INTEL16.08 — INSTAGRAM NEGRO ORIGINAL Y TELÉFONOS
```

### Botones de teléfono

Los botones recuperan el texto y la estética anterior:

```text
Llamar al 683 176 820
```

- En móvil, al pulsarlos se inicia la llamada.
- En PC, el clic está desactivado; conservan únicamente el diseño y el hover.
- Ya no se copia el número al portapapeles.

La función se controla desde `js/site-header.js`.
