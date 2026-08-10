# Guía rápida del código - intel16.10

## Comentarios válidos

```html
<!-- Comentario HTML -->
```

```css
/* Comentario CSS */
```

```javascript
// Comentario JavaScript
```

`# comentario` no es válido dentro de HTML, CSS o JavaScript.

## Encontrar un bloque

Pulsa `Ctrl+F` y busca códigos como:

- `HTML-HOME-TEXT-01` - texto principal.
- `HTML-HOME-SCHEDULE-01` - horario.
- `HTML-HOME-INSTAGRAM-01` - Instagram.
- `HTML-BLOG-CARD-01` - tarjeta del blog.
- `HTML-ARTICLE-CONTENT-01` - cuerpo de un artículo.

El listado completo está en `docs/REFERENCIAS_CODIGO.md`.

## Ejecutar con PyCharm

Abre la carpeta completa, abre `index.html` y usa `Alt+F2`. No necesitas
Python ni instalar un servidor.

## Git sin conexión

Puedes crear ramas y commits sin Internet. Solo necesitas conexión para
`push`, `pull` y `fetch`.


## Actualización intel16.11 - SEO para IA y Atlas

- Archivos nuevos: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`.
- Guía detallada: `docs/SEO_IA_Y_ATLAS.md`.
- Los HTML incluyen canonical, Open Graph, Schema.org y mejoras ARIA.
- Busca las referencias `SEO-AI-*`, `CSS-A11Y-AGENT-01` y `JS-HEADER-PHONE-01`.


## Actualización intel16.12 - horario

El horario visible de la portada ya no se compone con filas de texto HTML.
Ahora utiliza la tarjeta gráfica aprobada:

- `assets/images/horario-oficina-diseno-horizontal.webp`
- `assets/images/horario-oficina-diseno-horizontal.png`

Busca `HTML-HOME-SCHEDULE-01` en `index.html`.

El contenido horario sigue escrito en el atributo `aria-label` para lectores de
pantalla y buscadores. Además, `index.html.md` mantiene el horario en texto.

Si en el futuro cambian los horarios, deben actualizarse:
1. la imagen visible;
2. el `aria-label` de los dos bloques `HTML-HOME-SCHEDULE-01`;
3. las líneas de horario de `index.html.md`.
