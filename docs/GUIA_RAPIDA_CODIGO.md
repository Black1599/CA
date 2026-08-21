# Guía rápida del código

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

Pulsa `Ctrl+F` y busca referencias como:

- `HTML-HOME-TEXT-01`: texto principal.
- `HTML-HOME-SCHEDULE-01`: horario.
- `HTML-HOME-INSTAGRAM-01`: Instagram.
- `HTML-BLOG-CARD-01`: tarjeta de publicación.
- `HTML-ARTICLE-CONTENT-01`: cuerpo de un artículo.
- `TEMPLATE-ARTICLE-SEO-01`: SEO de la plantilla de artículo.

El mapa completo está en `docs/REFERENCIAS_CODIGO.md`.

## Ejecutar con PyCharm

Abre la carpeta completa, abre `public/index.html` y usa `Alt+F2`. No necesitas instalar un servidor adicional.

## Git y cambios

Git es el historial del proyecto. No se usan archivos separados de versión o changelog dentro de la web.

```bash
git status
git diff
git add .
git commit -m "Describe el cambio"
git log --oneline --decorate --graph --all
```


## Prueba entre navegadores

La web debe mantenerse compatible con Chrome, Edge, Firefox y Safari en escritorio, y con Safari/iOS y Chrome/Android en móvil.

Para cambios visuales prueba estos anchos: `375`, `390`, `820`, `1366/1440` y `1920` px. Revisa especialmente que no exista scroll horizontal, que la cabecera no tape contenido y que las barras fijas respeten el área segura del iPhone.

## Nuevo artículo

Usa `project/templates/articulo-blog.html` para la versión ES. La plantilla ya contiene favicon, cabecera, pie, CSS, JavaScript, metadatos sociales y Schema.org.

Antes de publicar:

1. cambia todos los campos marcados como `CAMBIAR`;
2. crea y revisa la versión ES en `public/blog/`;
3. crea la versión CAT equivalente en `public/cat/blog/`, con su slug CAT;
4. enlaza ambas versiones mediante `hreflang` y `data-language-href`;
5. cambia `noindex,nofollow` por `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
6. añade las tarjetas a los dos índices del blog;
7. crea los `.html.md` ES y CAT;
8. actualiza `public/sitemap.xml`, los dos índices `.html.md`, `llms.txt` y `llms-full.txt` de ambos idiomas;
9. prueba PC y móvil.

Aviso estándar ES:

> Este contenido tiene carácter informativo y no sustituye el asesoramiento jurídico individualizado.

Aviso estándar CAT:

> Aquest contingut té caràcter informatiu i no substitueix l’assessorament jurídic individualitzat.
