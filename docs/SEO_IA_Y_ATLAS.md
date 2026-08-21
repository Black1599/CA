# SEO para IA, ChatGPT Search y accesibilidad de Atlas

## Qué se ha añadido

- `public/robots.txt`: permite `OAI-SearchBot` para ChatGPT Search y bloquea `GPTBot` para entrenamiento.
- `public/sitemap.xml`: lista las páginas públicas ES y CAT e incluye alternates `hreflang`.
- `public/llms.txt`: resumen experimental en Markdown para sistemas de IA.
- `public/llms-full.txt`: contexto textual ampliado.
- versiones `.md` de las páginas principales y artículos en ES y CAT.
- URL canonical, Open Graph, metadatos para compartir y Schema.org.
- etiquetas ARIA, enlace para saltar al contenido, foco visible y estados accesibles.

## Importante: qué está confirmado y qué es experimental

OpenAI recomienda permitir `OAI-SearchBot` en `public/robots.txt` para poder aparecer en resultados, resúmenes y fragmentos de ChatGPT. También recomienda etiquetas ARIA claras para que el agente de ChatGPT Atlas entienda botones, menús y formularios.

`public/llms.txt` no es un requisito oficial de OpenAI. Es una propuesta abierta de llmstxt.org. Se incluye porque es barata de mantener y puede resultar útil, pero no garantiza posicionamiento ni citas.

## Política elegida para los rastreadores

```txt
User-agent: OAI-SearchBot
Allow: /

User-agent: GPTBot
Disallow: /
```

Esta separación permite la búsqueda de ChatGPT sin conceder automáticamente permiso para entrenamiento. Se puede cambiar más adelante.


## Estructura bilingüe

- ES se publica desde `public/`.
- CAT se publica desde `public/cat/`.
- Cada HTML incluye `hreflang="es"`, `hreflang="ca"` y `x-default`.
- El código técnico del idioma CAT es `ca`; la carpeta pública y el selector visual usan `cat` / `CAT`.
- CSS, JavaScript, imágenes y fuentes son recursos compartidos y no se duplican dentro de `public/cat/`.

## Aviso sobre la URL actual de GitHub Pages

La web actual está en una subcarpeta:

`https://black1599.github.io/CA/`

Los buscadores consultan normalmente `public/robots.txt` en la raíz del host (`https://black1599.github.io/robots.txt`), no en `/CA/robots.txt`. Por tanto:

- el archivo incluido funcionará correctamente al usar un dominio propio conectado a este proyecto;
- mientras la web siga en `/CA/`, la ausencia de un bloqueo general en la raíz normalmente permite el rastreo, pero el `public/robots.txt` del proyecto no gobierna todo `black1599.github.io`;
- otra solución es publicar la web desde el repositorio de usuario `black1599.github.io`.

## Cambiar al dominio definitivo

Cuando exista dominio propio, usa PyCharm:

1. `Ctrl + Shift + R`.
2. Busca `https://black1599.github.io/CA/`.
3. Sustituye por `https://www.DOMINIO.es/`.
4. Revisa `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` y todos los HTML públicos.
5. Haz commit y push.

## Etiquetas para Atlas

No se han inventado atributos especiales. Se utilizan estándares web:

- elementos nativos: `<button>`, `<a>`, `<nav>`, `<main>`, `<section>`;
- `aria-label` para nombres comprensibles;
- `aria-controls` y `aria-expanded` para el menú;
- `aria-current="page"` para la página activa;
- `aria-disabled="true"` en los teléfonos inactivos de PC;
- `aria-live` en carruseles y avisos dinámicos;
- texto alternativo `alt` para imágenes.

## Cómo comprobar los archivos publicados

Después de subir la web, abre:

- `https://black1599.github.io/CA/robots.txt`
- `https://black1599.github.io/CA/sitemap.xml`
- `https://black1599.github.io/CA/llms.txt`
- `https://black1599.github.io/CA/llms-full.txt`

Valida también:

- HTML: https://validator.w3.org/
- datos estructurados: https://validator.schema.org/
- resultados enriquecidos: https://search.google.com/test/rich-results
- accesibilidad: Lighthouse del navegador o axe DevTools.

## Lo que no se puede prometer

Ningún archivo o etiqueta garantiza que una web aparezca en primera posición en ChatGPT, Google u otra IA. La autoridad del contenido, la calidad jurídica, la actualización, los enlaces externos, la reputación local y la claridad de cada artículo continúan siendo determinantes.
