# Carandell Advocats

Proyecto web estático bilingüe (ES / CAT) de Carandell Advocats. La web pública está separada de la documentación y de los archivos de trabajo para poder desplegar únicamente `public/` en producción.

## Estructura

- `public/`: versión principal en castellano, recursos compartidos, blog y archivos SEO/IA.
- `public/cat/`: versión completa CAT, con las mismas páginas y publicaciones.
- `public/assets/fonts/`: Inter y Playfair Display alojadas localmente junto con sus licencias OFL.
- `docs/`: documentación de mantenimiento del proyecto.
- `project/templates/`: plantillas de trabajo para nuevos artículos y tarjetas del blog.
- `project/design/`: archivos fuente de diseño que no deben publicarse.
- `.github/workflows/pages.yml`: despliegue de `public/` en GitHub Pages para pruebas.

## Idiomas

El selector `ES / CAT` abre la página equivalente en el otro idioma. Las dos versiones comparten CSS, JavaScript, imágenes, fuentes y preferencias de cookies. Los nombres propios, nombres comerciales y direcciones de correo se conservan en su forma original. Los textos visibles, incluidas las reseñas, tienen versión CAT.

## Fuentes

Inter y Playfair Display se sirven desde `public/assets/fonts/`; la web ya no necesita conectarse a Google Fonts. Las licencias se conservan en la misma carpeta.

## Crear un nuevo artículo

1. Crea y revisa primero la versión castellana en `public/blog/`.
2. Crea la versión CAT equivalente en `public/cat/blog/` con un slug descriptivo en CAT y enlázala desde la versión ES mediante el selector de idioma.
3. Actualiza ambos índices del blog y sus versiones `.html.md`.
4. Añade `canonical`, `hreflang="es"`, `hreflang="ca"` y `x-default` correctamente.
5. Actualiza `public/sitemap.xml`, `public/llms.txt`, `public/llms-full.txt` y sus equivalentes en `public/cat/`.
6. Comprueba PC y móvil antes del commit.

El aviso estándar de los artículos es:

> Este contenido tiene carácter informativo y no sustituye el asesoramiento jurídico individualizado.

En CAT:

> Aquest contingut té caràcter informatiu i no substitueix l’assessorament jurídic individualitzat.

## Google Analytics

GA4 está preparado en `public/js/consent.js`, pero permanece sin identificador de medición hasta la configuración final. Debe introducirse únicamente el ID real `G-...` cuando se cree la propiedad correspondiente.

## GitHub Pages de prueba

El workflow `.github/workflows/pages.yml` publica únicamente la carpeta `public/`. En GitHub, la fuente de Pages debe estar configurada como **GitHub Actions**.

## Producción

La estructura está preparada para que el hosting publique únicamente `public/`. La adaptación de canonical, Open Graph, sitemap y demás URLs al dominio definitivo `https://carandelladvocats.com/` se realizará al desplegar en CDmon.

## Historial

No se mantienen archivos `VERSION.txt` ni `CAMBIOS_*.txt`: Git conserva el historial mediante commits, ramas y etiquetas.
