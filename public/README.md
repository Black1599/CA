# Carandell Advocats

Proyecto web estático de Carandell Advocats. La web pública está separada de la documentación y de los archivos de trabajo para poder desplegar únicamente `public/` en producción.

## Estructura

- `public/`: web que se publica (HTML, CSS, JavaScript, imágenes, blog y archivos SEO/IA).
- `docs/`: documentación de mantenimiento del proyecto.
- `project/templates/`: plantillas para crear nuevos artículos y tarjetas del blog.
- `project/design/`: archivos fuente de diseño que no deben publicarse.
- `.github/workflows/pages.yml`: despliegue de `public/` en GitHub Pages para pruebas.

## Abrir el proyecto en PyCharm

1. Abre la carpeta completa del proyecto.
2. Abre `public/index.html`.
3. Usa **Open in Browser** o `Alt+F2` para previsualizar la web.
4. Guarda los cambios con `Ctrl+S`.

No hace falta Python para ejecutar la web. Sin conexión pueden dejar de cargar Google Maps, Google Fonts y otros recursos externos.

## Crear un nuevo artículo

1. Copia `project/templates/articulo-blog.html` dentro de `public/blog/`.
2. Renómbralo con una URL clara, en minúsculas y separada por guiones.
3. Sustituye todos los campos marcados como **CAMBIAR**.
4. Cambia `robots` de `noindex,nofollow` a `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`.
5. Actualiza título, descripción, canonical, Open Graph y Schema.org.
6. Añade la tarjeta con `project/templates/tarjeta-blog.html` en `public/blog/index.html`.
7. Crea la versión `.html.md` del artículo.
8. Actualiza `public/blog/index.html.md`, `public/sitemap.xml`, `public/llms.txt` y `public/llms-full.txt`.
9. Prueba el artículo en PC y móvil antes del commit.

El aviso estándar de los artículos es:

> Este contenido tiene carácter informativo y no sustituye el asesoramiento jurídico individualizado.

## GitHub Pages de prueba

El workflow `.github/workflows/pages.yml` publica únicamente la carpeta `public/`. En GitHub, la fuente de Pages debe estar configurada como **GitHub Actions**.

## Producción

La estructura está preparada para que el hosting publique únicamente `public/`. La adaptación de URLs al dominio definitivo se realizará en una fase posterior.

## Historial

No se mantienen archivos `VERSION.txt` ni `CAMBIOS_*.txt`: Git conserva el historial mediante commits, ramas y etiquetas.
