# 14 · Pseudo-elementos

> ⏱️ ~15 min

## Seleccionar un **trozo** de un elemento… o inventarse uno

Los **pseudo-elementos**: seleccionan **una parte** de un elemento que no tiene etiqueta propia en el HTML, o **crean** una caja nueva que no está en el HTML:

- La **primera letra** de un párrafo, para hacer una letra capital de revista.
- La **primera línea** de un párrafo (que cambia según el ancho de la ventana: imposible marcarla en el HTML).
- El **texto que el usuario selecciona** con el ratón.
- La **viñeta** de una lista.
- Contenido **antes** o **después** de un elemento (`::before` y `::after`, que ya hemos asomado en el 06 y el 11).

Se escriben con **dos** dos puntos:

```css
p::first-line {
  font-weight: bold;
}
```

> Recordatorio: `:hover` (un `:`) = pseudo-clase, un **estado**. `::first-line` (dos `::`) = pseudo-elemento, una **parte**.

## Los más usados

| Pseudo-elemento | Selecciona / crea… |
|---|---|
| `::before` | una caja **antes** del contenido del elemento (necesita `content`) |
| `::after` | una caja **después** del contenido del elemento (necesita `content`) |
| `::first-letter` | la **primera letra** |
| `::first-line` | la **primera línea** (tal como se ve en pantalla) |
| `::selection` | el texto que el usuario **selecciona** |
| `::marker` | la **viñeta** o el número de un `li` |
| `::placeholder` | el texto de ejemplo de un `input` |

## Vamos a verlo

Cread una carpeta (por ejemplo `14-pseudoelementos`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pseudo-elementos</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <article class="articulo">
      <h1>El arte del café de filtro</h1>

      <p class="entradilla">
        Preparar café de filtro es casi un ritual. Requiere algo de paciencia,
        buen grano y agua a la temperatura adecuada, pero el resultado es una
        taza limpia, aromática y llena de matices que ninguna cápsula puede
        igualar.
      </p>

      <p>
        Lo más importante es la <mark>proporción entre café y agua</mark>:
        unos 60 gramos por litro es un buen punto de partida. A partir de ahí,
        ajusta a tu gusto.
      </p>

      <blockquote>
        El café es un lenguaje en sí mismo.
      </blockquote>

      <h2>Lo que necesitas</h2>
      <ul>
        <li>Café recién molido</li>
        <li>Un filtro y su soporte</li>
        <li>Agua a unos 93 °C</li>
      </ul>

      <input type="email" placeholder="Recibe más recetas: tu@email.com" />
    </article>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: Georgia, serif;
  line-height: 1.7;
  color: #333;
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem;
}

input {
  font: inherit;
  width: 100%;
  padding: 0.5rem;
}
```

> `<mark>` es la etiqueta HTML **semántica** para "texto resaltado" (como con un rotulador). Por defecto el navegador la pinta con fondo amarillo.

### Paso 1: `::first-letter` — la letra capital

Queremos que la entradilla empiece con una **letra grande**, como en las revistas:

_./styles.css_

```diff
+ .entradilla::first-letter {
+   float: left;
+   font-size: 3.5em;
+   line-height: 1;
+   font-weight: bold;
+   color: #b45309;
+   margin-right: 0.1em;
+ }
```

La "P" de "Preparar" ocupa ahora varias líneas y el texto la rodea.

> `float: left` es una propiedad antigua que hace que el texto **rodee** a un elemento. Hoy casi solo se usa para esto (y para imágenes dentro de un texto); para colocar cajas usaremos flexbox. Aquí es justo lo que queremos.

### Paso 2: `::first-line` — la primera línea

Y que la **primera línea** de la entradilla vaya en versalitas, otro clásico editorial:

_./styles.css_

```diff
+ .entradilla::first-line {
+   font-variant: small-caps;
+   letter-spacing: 0.05em;
+ }
```

Ahora **cambiad el ancho de la ventana**: la primera línea tiene cada vez palabras distintas… y el estilo se adapta **solo**. Esto no se podría hacer con un `<span>` en el HTML: no sabemos dónde acaba la primera línea hasta que el navegador pinta el texto.

### Paso 3: el efecto "fosforito"

El `<mark>` sale con un fondo amarillo que ocupa todo el alto de la letra. Queremos que parezca que lo hemos **subrayado con un rotulador fluorescente**: solo la mitad de abajo, como cuando pasas el fosforito un poco torcido.

_./styles.css_

```diff
+ mark {
+   background: linear-gradient(transparent 55%, #fde047 55%);
+   color: inherit;
+ }
```

`linear-gradient` pinta un **degradado** de arriba a abajo. Aquí lo usamos con trampa: transparente hasta el 55% de la altura y amarillo a partir de ahí, **sin transición**. Resultado: una franja amarilla en la mitad de abajo del texto.

> Esto no es un pseudo-elemento (es un fondo), pero es el truco clásico para el efecto fosforito y encaja aquí. El siguiente sí lo es…

### Paso 4: `::selection` — el fosforito al seleccionar

Seleccionad un trozo de texto con el ratón: sale el **azul** de siempre. Queremos que la selección use los colores de nuestra web:

_./styles.css_

```diff
+ ::selection {
+   background-color: #fde047;
+   color: #3b2412;
+ }
```

Volved a seleccionar texto: ahora es como pasar un **fosforito** por encima. Sin selector delante, se aplica a **toda** la página.

### Paso 5: `::before` — las comillas de la cita

La cita (`blockquote`) queda sosa. Queremos unas **comillas grandes** decorativas delante, sin tocar el HTML:

_./styles.css_

```diff
+ blockquote {
+   font-style: italic;
+   font-size: 1.25rem;
+   color: #3b2412;
+ }
+
+ blockquote::before {
+   content: "“" / "";
+   font-size: 3em;
+   line-height: 0;
+   vertical-align: -0.4em;
+   color: #b45309;
+   margin-right: 0.1em;
+ }
```

- `::before` crea una caja **dentro** del `blockquote`, **antes** de su texto. Sin `content` no aparece: es obligatorio (aunque sea `content: ""`).
- `/ ""` → decorativa, el lector de pantalla no la lee (lo del 11).
- `vertical-align` baja un poco las comillas para que queden alineadas con el texto; `line-height: 0` evita que, al ser tan grandes, separen las líneas.

👉 En DevTools (Elements), desplegad el `<blockquote>`: veréis un `::before` dentro, como si fuera un elemento más. **Existe para el CSS**, aunque no esté en vuestro HTML.

### Paso 6: `::marker` — viñetas con estilo

Las viñetas de la lista son los puntos negros de siempre. Queremos que sean del color de la web:

_./styles.css_

```diff
+ li::marker {
+   color: #b45309;
+ }
```

Y para rizar el rizo, cambiad el punto por una taza:

```diff
  li::marker {
    color: #b45309;
+   content: "☕ ";
  }
```

> 🔮 ¿`content` en `::marker` funciona en todos los navegadores? Ya sabéis dónde mirarlo (13). Si no lo entiende, simplemente se queda con el punto de color: la página no se rompe.

### Paso 7: `::placeholder`

El texto de ejemplo del campo sale en gris claro. Queremos que vaya a juego:

_./styles.css_

```diff
+ input::placeholder {
+   color: #b45309;
+   font-style: italic;
+ }
```

> 💡 **En Tailwind** los pseudo-elementos también son prefijos: `before:content-['“']`, `after:…`, `first-letter:text-5xl`, `first-line:uppercase`, `selection:bg-yellow-300`, `marker:text-amber-700`, `placeholder:italic`.

## Para ampliar

- [MDN · Pseudo-elementos](https://developer.mozilla.org/es/docs/Web/CSS/Pseudo-elements): la lista completa.
- [MDN · ::before](https://developer.mozilla.org/es/docs/Web/CSS/::before) y [::after](https://developer.mozilla.org/es/docs/Web/CSS/::after)
- [MDN · linear-gradient()](https://developer.mozilla.org/es/docs/Web/CSS/gradient/linear-gradient)
