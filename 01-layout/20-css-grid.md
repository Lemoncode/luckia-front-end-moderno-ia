# 20 · CSS Grid

> ⏱️ ~30 min

> 🏠 Si en la sesión no llegamos hasta aquí, **no pasa nada**: esta guía está pensada para que la podáis seguir en casa. Grid y flexbox se complementan, así que merece la pena verla aunque sea después.

## Flexbox coloca en una dirección; grid, en dos

En el 19 pusimos las tarjetas en fila y, cuando no cabían, saltaban de línea. Pero fijaos en un detalle: cuando saltan, **las filas no tienen por qué cuadrar**. Flexbox mira cada línea por separado; no sabe nada de "columnas".

**CSS grid** parte de otra idea: primero **dibujas una cuadrícula** (tantas columnas y tantas filas) y luego **colocas** las cosas dentro.

```
FLEXBOX (una dirección)            GRID (dos direcciones)
┌────┐ ┌──────┐ ┌───┐              ┌──────┐┌──────┐┌──────┐
│    │ │      │ │   │              │      ││      ││      │
└────┘ └──────┘ └───┘              └──────┘└──────┘└──────┘
┌─────────┐ ┌───┐                  ┌──────┐┌──────┐┌──────┐
│         │ │   │                  │      ││      ││      │
└─────────┘ └───┘                  └──────┘└──────┘└──────┘
cada línea va a su aire           filas Y columnas cuadradas
```

**Regla práctica:**

| Si lo que queréis es… | Usad |
|---|---|
| Una fila (o una columna) de cosas: un menú, unos botones, una cabecera | **flexbox** |
| Una cuadrícula: una galería, un catálogo, el esqueleto de una página | **grid** |

Y no son excluyentes: lo normal es usar grid para el esqueleto y flexbox **dentro** de cada pieza.

## Lo básico

```css
.galeria {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 columnas iguales */
  gap: 1rem;
}
```

- `display: grid` convierte al elemento en **contenedor grid**; sus **hijos directos** pasan a ser items.
- `grid-template-columns` define **cuántas columnas hay y cuánto mide cada una**.
- `gap` es el mismo que en flexbox: la separación entre celdas.
- Las **filas** aparecen solas, según haga falta.

### La unidad `fr`

`fr` (*fraction*) es una unidad que **solo existe en grid**: significa "una parte del espacio **sobrante**".

| Valor | Significa |
|---|---|
| `1fr 1fr 1fr` | 3 columnas **iguales** |
| `2fr 1fr` | 2 columnas: la primera **el doble** de ancha |
| `200px 1fr` | Una fija de 200px y otra que se come el resto |
| `repeat(3, 1fr)` | Lo mismo que `1fr 1fr 1fr`, pero sin repetirse |

## Vamos a verlo

Cread una carpeta (por ejemplo `20-grid`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

Una galería de seis cafés:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Grid</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1>Nuestros cafés</h1>

    <section class="galeria">
      <article class="tarjeta">Etiopía</article>
      <article class="tarjeta">Colombia</article>
      <article class="tarjeta">Brasil</article>
      <article class="tarjeta">Kenia</article>
      <article class="tarjeta">Sumatra</article>
      <article class="tarjeta">Guatemala</article>
    </section>
  </body>
</html>
```

_./styles.css_

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  max-width: 60rem;
  margin: 0 auto;
  padding: 1rem;
}

.tarjeta {
  background-color: #f5f0eb;
  border: 1px solid #e0d6cc;
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  font-weight: bold;
}
```

Las seis tarjetas están apiladas, una debajo de otra.

### Paso 1: la cuadrícula

_./styles.css_

```diff
+ .galeria {
+   display: grid;
+   grid-template-columns: repeat(3, 1fr);
+   gap: 1rem;
+ }
```

Seis tarjetas, tres columnas → **dos filas de tres**, perfectamente cuadradas. Y las filas han aparecido **solas**: solo hemos definido las columnas.

👉 **DevTools**: al lado de `<section class="galeria">` aparece la etiqueta **`grid`**. Pulsadla y el navegador **dibuja la cuadrícula** sobre la página, con los números de cada línea. En la pestaña **Layout** (la que dejamos anunciada en el 15) podéis activar varias opciones: ver los números de línea, los tamaños de cada celda… Es **la** herramienta para entender grid.

Probad a cambiar `repeat(3, 1fr)` por:

- `repeat(2, 1fr)` → dos columnas, tres filas.
- `2fr 1fr 1fr` → la primera columna, el doble de ancha.
- `200px 1fr` → una columna fija y otra elástica.

### Paso 2: una galería que se adapta sola

Con `repeat(3, 1fr)` siempre hay 3 columnas, también en el móvil (y quedan finísimas). Podríamos usar media queries… o dejar que grid lo resuelva:

_./styles.css_

```diff
  .galeria {
    display: grid;
-   grid-template-columns: repeat(3, 1fr);
+   grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 1rem;
  }
```

Cambiad el ancho de la ventana: las columnas van pasando de 4 a 3, a 2, a 1. **Sin una sola media query.** Leamos la receta de dentro afuera:

- `minmax(14rem, 1fr)` = "cada columna mide **como mínimo** 14rem y **como máximo** una parte del sobrante".
- `repeat(auto-fill, …)` = "mete **tantas columnas como quepan** con esa medida".

> Existe también `auto-fit`, casi igual: la diferencia está en qué pasa cuando sobran columnas vacías (`auto-fit` las colapsa y estira las que hay; `auto-fill` las deja como huecos). Con la cuadrícula llena, se comportan igual.

Esto y las tres líneas del centrado del 19 son, probablemente, **los dos trucos de CSS moderno que más os van a resolver la vida**.

### Paso 3: que un item ocupe más de una celda

Queremos que la primera tarjeta, la destacada, ocupe **dos columnas**:

_./index.html_

```diff
- <article class="tarjeta">Etiopía</article>
+ <article class="tarjeta destacada">Etiopía</article>
```

_./styles.css_

```diff
+ .destacada {
+   grid-column: span 2;
+ }
```

`span 2` = "ocupa 2 columnas". Las demás se recolocan solas. También existe `grid-row: span 2` para ocupar dos filas de alto.

```
┌───────────────────────┐ ┌───────────┐
│  Etiopía (span 2)     │ │ Colombia  │
└───────────────────────┘ └───────────┘
┌───────────┐ ┌───────────┐ ┌───────────┐
│ Brasil    │ │ Kenia     │ │ Sumatra   │
└───────────┘ └───────────┘ └───────────┘
```

### Paso 4: el esqueleto de una página con `grid-template-areas`

Esta es la parte más vistosa de grid. Vamos a maquetar una página entera: cabecera, barra lateral, contenido y pie.

Añadid esto **debajo** de la galería:

_./index.html_

```diff
+ <div class="pagina">
+   <header class="zona-cabecera">Cabecera</header>
+   <nav class="zona-lateral">Lateral</nav>
+   <main class="zona-principal">Contenido</main>
+   <footer class="zona-pie">Pie</footer>
+ </div>
```

_./styles.css_

```diff
+ .pagina {
+   display: grid;
+   grid-template-columns: 12rem 1fr;
+   grid-template-areas:
+     "cabecera cabecera"
+     "lateral  principal"
+     "pie      pie";
+   gap: 1rem;
+   margin-top: 2rem;
+ }
+
+ .zona-cabecera  { grid-area: cabecera; }
+ .zona-lateral   { grid-area: lateral; }
+ .zona-principal { grid-area: principal; }
+ .zona-pie       { grid-area: pie; }
+
+ .pagina > * {
+   background-color: #f5f0eb;
+   border: 1px solid #e0d6cc;
+   padding: 1rem;
+ }
```

Fijaos en `grid-template-areas`: **es un dibujo de la página**. Cada línea entre comillas es una fila, cada palabra es una celda, y repetir el mismo nombre significa "esta zona ocupa esas celdas".

```
"cabecera cabecera"     ← la cabecera ocupa las dos columnas
"lateral  principal"    ← lateral estrecho + contenido ancho
"pie      pie"          ← el pie, otra vez las dos
```

Y lo mejor: **reordenar la página es reescribir el dibujo**. Probad a poner el lateral a la derecha:

```diff
  grid-template-areas:
    "cabecera cabecera"
-   "lateral  principal"
+   "principal lateral"
    "pie      pie";
```

(Y cambiad `grid-template-columns: 12rem 1fr` por `1fr 12rem` para que el lateral siga siendo el estrecho.)

> ⚠️ Cuidado con `order` y con reordenar zonas: el **orden del HTML** sigue siendo el que usan el teclado y los lectores de pantalla. Que se vea distinto de como se lee puede desorientar.

## Alineación (se parece mucho a flexbox)

Como en flexbox, hay propiedades para alinear, con dos ejes: las columnas (*inline*) y las filas (*block*).

| Propiedad | Alinea… |
|---|---|
| `justify-items` / `align-items` | El contenido **dentro** de cada celda (horizontal / vertical) |
| `justify-content` / `align-content` | **Toda la cuadrícula** dentro del contenedor |
| `justify-self` / `align-self` | Un item concreto dentro de **su** celda |

Y el centrado del 19 también funciona aquí, incluso más corto:

```css
.caja {
  display: grid;
  place-items: center; /* centrado en los dos ejes, en una línea */
}
```

## Lo que os queda por ver

- Nombrar las líneas de la cuadrícula y colocar items por número de línea (`grid-column: 2 / 4`).
- `grid-auto-rows` y `grid-auto-flow` (el comportamiento de las filas que aparecen solas).
- **Subgrid**, para que una cuadrícula hija siga las líneas de la madre.

> 💡 **En Tailwind**: `grid`, `grid-cols-3`, `gap-4`, `col-span-2`, `place-items-center`… Los mismos conceptos con otros nombres.

## Para ampliar

**Chuletas:**

- [CSS-Tricks · A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/): la chuleta de grid, con dibujos de cada propiedad. La hermana de la de flexbox del 19 (en inglés).
- [Grid Cheatsheet (yoksel)](https://yoksel.github.io/grid-cheatsheet/): ejemplos interactivos de cada propiedad (en inglés).
- [Grid by Example (Rachel Andrew)](https://gridbyexample.com/): recetas listas para copiar, de la persona que más ha divulgado grid (en inglés).

**Juegos para practicar:**

- 🥕 [Grid Garden](https://cssgridgarden.com/#es): regar las zanahorias con `grid-column` y `grid-row`. En español y de los mismos autores que Flexbox Froggy. **El equivalente a las ranitas, pero para grid.**
- 🗡️ [Grid Attack](https://codingfantasy.com/games/css-grid-attack/play): un juego de aventura por niveles para practicar grid (en inglés).

> 💡 Ojo con el nombre: **CSS Zen Garden** (el del 02) no es un juego de grid, es la web donde se ve el mismo HTML con muchos diseños distintos. El juego de grid es **Grid Garden**.

**Documentación:**

- [MDN · CSS Grid Layout](https://developer.mozilla.org/es/docs/Web/CSS/CSS_grid_layout)
- [Layout Land / Jen Simmons](https://www.youtube.com/c/LayoutLand): vídeos cortos sobre maquetación moderna (en inglés).
