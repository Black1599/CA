# Carandell Advocats — proyecto intel12

## Abrir sin Internet

1. Descomprime toda la carpeta.
2. Abre `index.html` con Safari o Chrome.
3. En VS Code: **File → Open Folder** y selecciona la carpeta completa.
4. Guarda con `Cmd + S` y recarga el navegador.

## Estructura

```text
index.html                         Página principal
blog/index.html                    Inicio del blog
blog/corte-suministros-....html    Artículo publicado
css/home.css                       Portada, cabecera y estilos comunes
css/blog.css                       Listado y artículos
js/site-header.js                  Menú, idiomas y desplazamientos
js/home.js                         Carruseles de la portada
js/blog.js                         Cabecera del blog al hacer scroll
assets/images/                     Fotos y logotipo
plantillas/articulo-blog.html      Base de un artículo
plantillas/tarjeta-blog.html       Base de una tarjeta
```

## Crear otro artículo

1. Copia `plantillas/articulo-blog.html` dentro de `blog/`.
2. Cámbiale el nombre.
3. Copia la cabecera y el pie del artículo existente.
4. Sustituye los textos marcados en mayúsculas.
5. Copia `plantillas/tarjeta-blog.html` dentro de `blog/index.html`.
6. Cambia sus enlaces para que apunten al nuevo artículo.

## Añadir una imagen de portada

Guárdala en `assets/images/blog/` y sustituye el marcador blanco por:

```html
<img src="../assets/images/blog/nombre-imagen.jpg"
     alt="Descripción de la imagen">
```

## Revisión jurídica obligatoria

Antes de publicar:

- comprobar la normativa vigente;
- consultar la resolución judicial original;
- verificar tribunal, fecha, recurso y alcance;
- no convertir un caso concreto en regla general;
- validar el texto final con Maria.

Sin conexión no cargarán Google Maps, Google Fonts, Instagram ni enlaces
externos. La navegación local, estilos, fotos y artículos sí funcionarán.


## Orden de las publicaciones del blog

Las publicaciones están dentro de:

```html
<div class="blog-post-list">
```

Cada publicación es un bloque:

```html
<article class="blog-card">
```

Para añadir una nueva:

1. Copia `plantillas/tarjeta-blog.html`.
2. Pega el bloque dentro de `.blog-post-list`.
3. Colócalo arriba del artículo anterior si es la publicación más reciente.
4. Cambia fecha, categoría, título, resumen y enlaces.

Las entradas aparecerán una debajo de otra y todas conservarán el mismo
cuadro blanco. El listado no utiliza imágenes de portada.


## Ancho del título de los artículos

En `css/blog.css`, el bloque **INTEL14 — ANCHO DEL TÍTULO DEL ARTÍCULO**
hace que el título superior llegue hasta la misma línea derecha que la tarjeta
lateral de llamada.

Para volver a limitarlo, modifica:

```css
.article-hero-no-cover h1 {
  max-width: none;
}
```


## Ajustes móviles de intel15

En móvil:

- menú e idiomas se sitúan en los extremos de la barra blanca;
- el logotipo permanece centrado;
- el texto inicial de la portada es más compacto;
- «Cómo llegar» está más cerca de la tarjeta de ubicación;
- el inicio del blog no muestra «Últimas publicaciones»;
- en los artículos, la tarjeta dorada aparece antes de la columna blanca;
- el tiempo de lectura aproximada queda oculto;
- la llamada flotante desaparece mientras haya otro botón de llamada visible.

Todos estos cambios están dentro de reglas `@media(max-width:820px)`.
El diseño de PC no se ha modificado.


## Corrección de cabecera móvil en intel16

La barra blanca móvil utiliza posicionamiento independiente:

- `.site-menu-button`: izquierda;
- `.shared-header-brand`: centro;
- `.site-language-button`: derecha.

El logo tiene una caja de 82 px de alto con `overflow:hidden`, por lo que no
puede sobresalir por debajo de la barra. Estos cambios no afectan al diseño PC.


## Tarjetas del blog en intel16.01

Las tarjetas del listado ya no incluyen una descripción breve.

Cada publicación muestra únicamente:

1. categoría;
2. fecha;
3. título;
4. enlace «Leer artículo».

La plantilla `plantillas/tarjeta-blog.html` ya está preparada con este formato.


## Favicon añadido
- Se ha añadido el icono de pestaña en `assets/images/`:
  - `favicon-ca.png`
  - `favicon-ca-32.png`
  - `apple-touch-icon.png`
  - `android-chrome-192x192.png`
- El favicon ya está enlazado en `index.html`, `blog/index.html` y `blog/corte-suministros-vivienda-ocupada.html`.

## Favicon actualizado en intel16.03

El favicon anterior se ha sustituido por el nuevo monograma negro «CA».
Las rutas HTML no han cambiado, por lo que no es necesario modificar
ninguna página individual.
