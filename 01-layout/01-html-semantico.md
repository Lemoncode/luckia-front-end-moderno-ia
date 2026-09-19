# 01 · HTML semántico

> ⏱️ ~30 min

## La idea en una frase

**HTML describe QUÉ es cada cosa, no CÓMO se ve.** Cómo se ve es trabajo del CSS.

Estas dos cosas se ven **exactamente igual** en pantalla:

```html
<!-- 🍝 "Sopa de divs" -->
<div class="header">
  <div class="menu">...</div>
</div>
<div class="contenido">...</div>
<div class="pie">...</div>
```

```html
<!-- ✅ Semántico -->
<header>
  <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

Entonces, ¿para qué molestarse? Porque **no solo lo leen personas**:

- **Lectores de pantalla**: un usuario ciego puede saltar directamente al `<nav>` o al `<main>`. Con `div` no hay nada a lo que saltar.
- **Buscadores (SEO)**: Google entiende mejor qué es el contenido principal y qué es relleno.
- **El navegador**: el _modo lectura_ de Safari o Firefox se basa en esto.
- **Otras personas desarrolladoras** (y tú dentro de 6 meses): se lee mucho mejor.
- **La IA**: los agentes y asistentes que navegan por la web también "leen" la estructura. Además, la IA **genera** sopa de divs muy a menudo, y tienes que saber detectarla.

## Las piezas grandes (landmarks)

| Etiqueta    | Para qué                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<header>`  | Cabecera: logo, título, a veces la navegación. Puede ser de la página o de un `<article>`.                                                       |
| `<nav>`     | Bloque de **navegación principal** (no cualquier grupo de enlaces).                                                                              |
| `<main>`    | El contenido principal. **Solo uno** por página.                                                                                                 |
| `<article>` | Contenido con sentido **por sí mismo**: un post, una noticia, una tarjeta de producto. Pregunta clave: _¿lo podría publicar suelto en otra web?_ |
| `<section>` | Un bloque temático **con su propio título** dentro de algo mayor.                                                                                |
| `<aside>`   | Contenido relacionado pero secundario: barra lateral, "artículos relacionados".                                                                  |
| `<footer>`  | Pie: autoría, copyright, enlaces legales.                                                                                                        |
| `<div>`     | Sin significado. **Sigue siendo válido** cuando solo necesitas un contenedor para dar estilo.                                                    |

> ¿`section` o `div`? Si el bloque tiene un título (`h2`, `h3`…), probablemente `section`. Si solo lo necesitas para el CSS, `div`.

## Títulos: `h1` … `h6`

- Forman el **índice** de la página. Los lectores de pantalla navegan por ellos.
- Un **`h1`** por página (el título principal).
- **No saltes niveles**: de `h2` pasas a `h3`, no a `h5`.
- ⚠️ **No elijas el nivel por el tamaño.** ¿El `h2` te parece enorme? Eso se cambia con CSS.

## Semántica dentro del texto

| Etiqueta                    | Significa                                         | Ojo con                                                |
| --------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| `<p>`                       | Párrafo                                           | No uses `<br><br>` para separar párrafos               |
| `<strong>`                  | Importante                                        | `<b>` solo pone negrita, sin significado               |
| `<em>`                      | Énfasis (cambia el sentido al leerlo en voz alta) | `<i>` solo pone cursiva                                |
| `<ul>` / `<ol>` + `<li>`    | Lista sin orden / con orden                       | Un menú de navegación **es** una lista                 |
| `<a href>`                  | **Navegar** a otro sitio                          |                                                        |
| `<button>`                  | **Hacer una acción** (abrir, enviar, borrar…)     | Nunca un `<div onclick>`: no se puede usar con teclado |
| `<img alt>`                 | Imagen                                            | `alt` describe la imagen. Si es decorativa: `alt=""`   |
| `<figure>` + `<figcaption>` | Imagen, gráfico o código con su pie               |                                                        |
| `<blockquote>` / `<q>`      | Cita larga / cita en línea                        |                                                        |
| `<time datetime>`           | Fecha legible por máquinas                        | `<time datetime="2026-09-19">19 de septiembre</time>`  |

## 🛠️ Práctica 1: un artículo de blog

En `index.html` montad esta estructura (el texto lo inventáis, lorem ipsum vale):

```
header
  ├─ título del blog (no es h1: el h1 será el del artículo)
  └─ nav con una lista de 3 enlaces
main
  └─ article
       ├─ header
       │    ├─ h1 con el título del post
       │    └─ autor + fecha (con <time>)
       ├─ p introducción (con algún <strong> y <em>)
       ├─ section → h2 + p + lista
       ├─ section → h2 + p + blockquote
       └─ figure → img + figcaption
aside
  └─ h2 "Artículos relacionados" + lista de enlaces
footer
  └─ copyright
```

> ⚡ Emmet ayuda: `nav>ul>li*3>a` + Tab. Para imágenes de prueba: `https://picsum.photos/800/400`

Arrastrad al navegador. Va a ser **feo de narices** (Times New Roman, todo pegado a la izquierda…). **Es lo esperado**: el HTML ya está bien, lo que falta es CSS. Lo arreglamos en un rato.

👀 Guardad este fichero: lo usaremos para empezar con CSS.

La solución:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cómo preparar un buen café en casa · Café &amp; Código</title>
  </head>
  <body>
    <header>
      <p><a href="index.html">Café &amp; Código</a></p>
      <nav>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="#">Artículos</a></li>
          <li><a href="#">Sobre mí</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <article>
        <header>
          <h1>Cómo preparar un buen café en casa</h1>
          <p>
            Por <strong>Ana García</strong> ·
            <time datetime="2026-09-19">19 de septiembre de 2026</time>
          </p>
        </header>

        <p>
          Preparar un buen café no requiere una cafetera de mil euros. Con
          <strong>café recién molido</strong> y un poco de paciencia puedes
          conseguir en casa una taza <em>mucho</em> mejor que la de la
          máquina de la oficina.
        </p>

        <section>
          <h2>Lo que necesitas</h2>
          <p>Antes de empezar, reúne estos básicos:</p>
          <ul>
            <li>Café en grano de tueste reciente</li>
            <li>Un molinillo (mejor de muelas que de cuchillas)</li>
            <li>Agua filtrada a unos 93 °C</li>
          </ul>
        </section>

        <section>
          <h2>El secreto está en la proporción</h2>
          <p>
            La regla más habitual es usar unos 60 gramos de café por litro de
            agua. A partir de ahí, ajusta a tu gusto.
          </p>
          <blockquote>
            <p>El café es un lenguaje en sí mismo.</p>
          </blockquote>
        </section>

        <figure>
          <img
            src="https://picsum.photos/800/400"
            alt="Taza de café recién hecho sobre una mesa de madera"
          />
          <figcaption>Una buena taza empieza por un buen grano.</figcaption>
        </figure>
      </article>
    </main>

    <aside>
      <h2>Artículos relacionados</h2>
      <ul>
        <li><a href="#">Cafetera italiana: guía rápida</a></li>
        <li><a href="#">Cómo elegir tu primer molinillo</a></li>
        <li><a href="#">Café de filtro vs. espresso</a></li>
      </ul>
    </aside>

    <footer>
      <p>© 2026 Café &amp; Código</p>
    </footer>
  </body>
</html>
```

Detalles para comentar:

- El nombre del blog **no es `h1`**: el `h1` es el título del artículo, que es lo que trata la página.
- Hay **dos `header`**: el de la página y el del artículo. Es válido.
- El `aside` va **fuera del `main`** porque no es el contenido principal.
- `&amp;` es la forma de escribir `&` en HTML (una *entidad*). Aquí funcionaría sin escapar, pero es buena costumbre.
- El `alt` describe la imagen, no dice "imagen de…".

## Para ampliar

- [MDN · Semántica en HTML](https://developer.mozilla.org/es/docs/Glossary/Semantics#sem%C3%A1ntica_en_html)
- [MDN · Estructura de documentos y sitios web](https://developer.mozilla.org/es/docs/Learn/HTML/Introduction_to_HTML/Document_and_website_structure)
- [HTML elements reference (MDN)](https://developer.mozilla.org/es/docs/Web/HTML/Element): la lista completa, para consultar, no para memorizar.
