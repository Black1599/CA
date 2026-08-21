# Contexto actual — Carandell Advocats

## Estado del proyecto

- Web estática bilingüe **ES / CAT**.
- La versión ES vive en `public/` y la versión CAT en `public/cat/`.
- CSS, JavaScript, imágenes y fuentes se comparten; no se duplican dentro de `public/cat/`.
- El selector **ES / CAT** lleva a la página equivalente del otro idioma.
- En el HTML se usa `lang="ca"` y `hreflang="ca"` para CAT porque `ca` es el código técnico estándar del idioma.
- Inter y Playfair Display están alojadas localmente en `public/assets/fonts/`; no se usa Google Fonts.
- GitHub Pages publica únicamente `public/` mediante `.github/workflows/pages.yml`. El workflow no modifica ni limpia automáticamente el repositorio.
- Google Analytics 4 está preparado en `public/js/consent.js`, pero el ID `G-...` sigue pendiente. Analytics solo se carga tras consentimiento.
- Google Maps también se controla mediante consentimiento.
- Las URLs absolutas siguen apuntando temporalmente a `https://black1599.github.io/CA/` porque el traslado a CDmon se hará después de cerrar y probar la traducción.

## Estructura principal

```text
public/
├── index.html                 # ES
├── aviso-legal.html           # ES
├── privacidad.html            # ES
├── politica-cookies.html      # ES
├── blog/                      # ES
├── cat/
│   ├── index.html             # CAT
│   ├── avis-legal.html        # CAT
│   ├── privacitat.html        # CAT
│   ├── politica-cookies.html  # CAT
│   └── blog/                  # CAT
├── assets/                    # compartido
├── css/                       # compartido
└── js/                        # compartido
```

## Criterios que deben mantenerse

- No recrear `public/public/`, `public/docs/` ni `public/project/`.
- No reintroducir dependencias externas de Google Fonts.
- Mantener las versiones `.html.md`, `llms.txt` y `llms-full.txt` porque sirven como contexto textual y apoyo de mantenimiento/IA.
- No crear archivos históricos `CAMBIOS_*.txt` o `VERSION.txt`; Git conserva el historial.
- Mantener `project/GA4-PENDIENTE.txt` hasta completar GA4.
- Cada artículo ES y CAT puede tener su propio slug descriptivo. El selector de idioma debe enlazar explícitamente las dos páginas equivalentes.

## Próximos pasos acordados

1. Subir esta versión a GitHub y comprobar GitHub Pages en PC y móvil.
2. Revisar visualmente ES y CAT, especialmente selector de idioma, blog, páginas legales, cookies y enlaces.
3. Preparar despliegue en CDmon.
4. Sustituir todas las URLs absolutas de GitHub Pages por `https://carandelladvocats.com/` y actualizar canonical, Open Graph, Schema.org, robots y sitemap.
5. Crear/configurar Google Analytics 4 y añadir el ID real `G-...`.
6. Configurar Google Search Console y enviar el sitemap definitivo.
7. Revisar indexación, datos estructurados, cookies/consentimiento y rendimiento tras publicación.
