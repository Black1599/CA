# Carandell Advocats

Proyecto web estático de Carandell Advocats, preparado para editarse con PyCharm y publicarse mediante GitHub Pages.

## Abrir el proyecto en PyCharm

1. Abre PyCharm.
2. Ve a **File > Open** y selecciona la carpeta completa del proyecto.
3. Abre `index.html`.
4. Usa **Open in Browser** o `Alt+F2` para previsualizar la web.
5. Guarda los cambios con `Ctrl+S`.

No hace falta Python para ejecutar la web. Sin conexión pueden dejar de cargar Google Maps, Google Fonts y otros recursos externos.

## Archivos principales

- `index.html`: página principal.
- `blog/index.html`: listado de publicaciones.
- `blog/*.html`: artículos publicados.
- `blog/*.html.md`: versión textual de los artículos.
- `css/home.css`: estilos generales y portada.
- `css/blog.css`: estilos del blog y artículos.
- `js/site-header.js`: menú, idiomas y comportamiento del teléfono.
- `js/home.js`: interacciones de la portada.
- `js/blog.js`: comportamiento específico del blog.
- `assets/images/`: fotografías, logo y favicon.
- `assets/source/`: archivos fuente de diseño.
- `plantillas/articulo-blog.html`: plantilla maestra de artículo.
- `plantillas/tarjeta-blog.html`: plantilla de tarjeta del listado.
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`: archivos auxiliares de rastreo y contenido estructurado.
- `docs/`: documentación breve de mantenimiento.
- `MANUAL_TECNICO_CARANDELL_ADVOCATS.pdf`: manual técnico completo.

## Historial de cambios

El proyecto no necesita archivos `VERSION.txt` ni `CAMBIOS_*.txt`. Git ya conserva el historial mediante commits, ramas y etiquetas. Para consultar cambios usa `git log` o el historial de Git de PyCharm.


## Compatibilidad de navegadores

El objetivo del proyecto es funcionar en navegadores modernos mantenidos:

- PC/Mac: Chrome, Edge, Firefox y Safari.
- iPhone/iPad: Safari y navegadores basados en WebKit.
- Android: Chrome y navegadores modernos equivalentes.

El CSS incluye fallbacks para `100dvh`, áreas seguras de iPhone (`safe-area`), `backdrop-filter` de Safari y otros comportamientos móviles. El JavaScript evita depender exclusivamente de `IntersectionObserver` y mantiene alternativas para desplazamientos.

Antes de publicar cambios de diseño prueba, como mínimo, 375 px, 390 px, 820 px, 1366/1440 px y un escritorio grande. La emulación de Chrome/Edge ayuda, pero para validar Safari conviene abrir la web en un iPhone/iPad o Mac real cuando el cambio afecte a cabecera fija, viewport, carruseles o barras inferiores.

## Crear un nuevo artículo

1. Copia `plantillas/articulo-blog.html` dentro de `blog/`.
2. Renómbralo con una URL clara, en minúsculas y separada por guiones.
3. Sustituye todos los campos marcados como **CAMBIAR**.
4. Cambia `robots` de `noindex,nofollow` a `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`.
5. Actualiza título, descripción, canonical, Open Graph y Schema.org.
6. Añade la tarjeta con `plantillas/tarjeta-blog.html` en `blog/index.html`.
7. Crea la versión `.html.md` del artículo.
8. Actualiza `blog/index.html.md`, `sitemap.xml`, `llms.txt` y `llms-full.txt`.
9. Prueba el artículo en PC y móvil antes del commit.

El aviso estándar de los artículos es:

> Este contenido tiene carácter informativo y no sustituye el asesoramiento jurídico individualizado.

Consulta el manual PDF para el procedimiento detallado.
