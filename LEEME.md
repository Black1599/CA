# Carandell Advocats - intel16.10 documentada

Esta versión mantiene el diseño y comportamiento de **intel16.09** y añade:

- comentarios con códigos de referencia dentro de HTML, CSS y JavaScript;
- manual PDF actualizado para Windows, PyCharm, Git y dominio propio;
- `.gitignore` para no subir la configuración local de PyCharm;
- `.editorconfig` para conservar UTF-8, sangría y saltos de línea;
- guías de apoyo dentro de `docs/`.

## Abrir sin conexión en PyCharm

1. Abre PyCharm.
2. **File > Open** y selecciona la carpeta completa.
3. Abre `index.html`.
4. **View > Open in Browser** o `Alt+F2`.
5. Guarda con `Ctrl+S`.

No hace falta Python para ejecutar esta web. PyCharm puede servirla mediante su
servidor web integrado. Sin conexión no cargarán Google Maps, Google Fonts ni
enlaces externos.

## Archivos principales

- `index.html`: página principal.
- `blog/index.html`: listado del blog.
- `blog/*.html`: artículos.
- `css/home.css`: diseño general.
- `css/blog.css`: diseño del blog.
- `js/site-header.js`: menú, desplazamientos, idiomas y teléfono.
- `js/home.js`: carruseles y elementos de portada.
- `js/blog.js`: cabecera y llamada móvil del blog.
- `assets/images/`: imágenes, logo y favicon.
- `assets/source/`: archivo original del logo.
- `plantillas/`: bloques para crear publicaciones.
- `docs/`: referencias y comandos.
- `MANUAL_TECNICO_CARANDELL_ADVOCATS.pdf`: manual completo.

## Regla para editar textos

Busca el texto con `Ctrl+F`, cambia únicamente el contenido visible y conserva
las etiquetas (`<h1>`, `<p>`, `<a>`, etc.), las clases y los identificadores.
Consulta el manual antes de modificar CSS o JavaScript.


## Actualización intel16.11 - SEO para IA y Atlas

- Archivos nuevos: `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`.
- Guía detallada: `docs/SEO_IA_Y_ATLAS.md`.
- Los HTML incluyen canonical, Open Graph, Schema.org y mejoras ARIA.
- Busca las referencias `SEO-AI-*`, `CSS-A11Y-AGENT-01` y `JS-HEADER-PHONE-01`.


## Versión ca10_08_01

Primera versión con nomenclatura por fecha. Cambios principales del blog:

- eliminado el apartado de referencias jurídicas de artículos y plantilla;
- eliminada la línea de revisión jurídica de la cabecera;
- aviso informativo simplificado;
- textos de las tarjetas de contacto actualizados.
