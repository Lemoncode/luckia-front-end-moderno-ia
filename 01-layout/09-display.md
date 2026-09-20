# 09 · La propiedad `display`

> ⏱️ ~15-20 min

## ¿Por qué unas cajas se apilan y otras van en línea?

Ya sabemos que todo es una caja. Pero si os fijáis, no todas se colocan igual:

- Un `<p>`, un `<h1>` o un `<div>` **empiezan siempre en una línea nueva** y ocupan **todo el ancho**, aunque su texto sea cortito.
- Un `<a>`, un `<strong>` o un `<span>` van **dentro del texto**, uno detrás de otro, como si fueran palabras.

Por ejemplo, este HTML:

```html
<h1>Café</h1>
<p>Corto.</p>
<p>Un café <strong>muy</strong> rico con <a href="#">receta</a> incluida.</p>
```

Se coloca así (los recuadros son las cajas de cada elemento):

```
┌──────────────────────────────────────────────────┐
│ Café                                     (h1)    │  ← línea propia, todo el ancho
└──────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────┐
│ Corto.                                   (p)     │  ← aunque el texto sea corto,
└──────────────────────────────────────────────────┘     la caja llega hasta el final
┌──────────────────────────────────────────────────┐
│ Un café ┌───┐ rico con ┌──────┐ incluida.  (p)   │
│         │muy│          │receta│                  │  ← strong y a: cajas ajustadas
│         └───┘          └──────┘                  │     a su texto, dentro de la línea
└──────────────────────────────────────────────────┘
```

El `h1` y los `p` se **apilan**; el `strong` y el `a` **fluyen** dentro del texto, como palabras.

¿Quién decide eso? La propiedad **`display`**. De hecho ya la hemos visto sin darnos cuenta: en DevTools, la regla del navegador para el `h1` empieza con `display: block;`. Y en el reset (08) pusimos `display: block` a las imágenes "por un hueco raro" que hoy vamos a entender.

## Los valores principales

| Valor          | Cómo se comporta                                                                                                                                               | Ejemplos (por defecto)                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `block`        | Empieza en **línea nueva** y ocupa **todo el ancho** disponible. Respeta `width`, `height`, `margin` y `padding`.                                              | `div`, `p`, `h1`…`h6`, `section`, `article`, `ul`, `li` |
| `inline`       | Va **dentro del texto**, como una palabra más. Mide lo que mida su contenido: **ignora `width` y `height`**, y los márgenes de arriba y abajo no empujan nada. | `span`, `a`, `strong`, `em`, `img`                      |
| `inline-block` | Va **en línea** como `inline`… pero **respeta** `width`, `height`, `margin` y `padding` como `block`. Lo mejor de los dos.                                     | `button`, `input`                                       |
| `none`         | **Desaparece**: no se pinta ni ocupa sitio.                                                                                                                    | `head`, `script`                                        |

Y dos más que tienen **capítulo propio**:

- `flex` → **flexbox**, en el 19.
- `grid` → **CSS grid**, en el 20.

> Cada elemento tiene un `display` por defecto (lo pone el navegador), pero **se puede cambiar**: un `<a>` puede ser `block` y un `<li>` puede ser `inline`. El HTML dice **qué es**; el `display`, **cómo se coloca**.

## Vamos a verlo

Cread una carpeta (por ejemplo `09-display`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>display</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav class="menu">
      <a href="#">Inicio</a>
      <a href="#">Cafés</a>
      <a href="#">Contacto</a>
    </nav>

    <h1>Café de Etiopía</h1>
    <p>
      Notas florales y afrutadas <span class="etiqueta">Nuevo</span>, ideal para
      preparar en filtro. Tueste claro y acidez brillante: un café para tomar
      solo y sin prisa.
    </p>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

* {
  outline: 1px solid red;
}
```

Hemos vuelto a poner los **rayos X** del 04 para ver las cajas. Fijaos:

- El `nav`, el `h1` y el `p` (**block**): cada uno en su línea y con una caja que llega **hasta el borde derecho**, aunque el texto sea corto.
- Los `a` y el `span` (**inline**): cajas **ajustadas a su texto**, una detrás de otra, dentro de la línea.

👉 En DevTools, seleccionad un `<a>` → **Computed** → filtrad por `display`: `inline`. Y el `<p>`: `block`.

### Paso 1: `inline` ignora el tamaño

Queremos convertir el `span.etiqueta` en una **etiqueta** de color, con su tamaño y separación. Probamos lo lógico:

_./styles.css_

```diff
+ .etiqueta {
+   background-color: #b45309;
+   color: white;
+   width: 200px;
+   height: 50px;
+   padding: 8px;
+   margin: 20px;
+ }
```

Recargad y mirad qué pasa:

- `width` y `height`: **ignorados**. La etiqueta mide lo que su texto.
- `margin`: a los lados **sí** separa; arriba y abajo **no** empuja nada.
- `padding`: se pinta el fondo más grande… pero **se monta encima** de las líneas de arriba y de abajo.

Un elemento `inline` se comporta como **una palabra**: no puedes decirle a una palabra que mida 200px de alto.

### Paso 2: `inline-block` al rescate

_./styles.css_

```diff
  .etiqueta {
+   display: inline-block;
    background-color: #b45309;
```

Ahora la etiqueta **sigue en la línea**, pero **respeta** el ancho, el alto, el padding y los márgenes: empuja las líneas de alrededor en vez de montarse encima.

Quitad los valores exagerados y dejadla bonita:

_./styles.css_

```diff
  .etiqueta {
    display: inline-block;
    background-color: #b45309;
    color: white;
-   width: 200px;
-   height: 50px;
-   padding: 8px;
-   margin: 20px;
+   padding: 0 0.5em;
+   border-radius: 999px;
+   font-size: 0.75rem;
+   font-weight: bold;
  }
```

> `border-radius: 999px` es un truco para hacer una "pastilla": un radio enorme redondea los extremos del todo.

Ya tenemos un **badge** como los de cualquier tienda online.

### Paso 3: `block` para un menú

Los enlaces del `nav` están en línea, pegados. Queremos un **menú vertical** en el que **toda la fila** sea clicable, no solo el texto:

_./styles.css_

```diff
+ .menu a {
+   display: block;
+   padding: 0.5rem 1rem;
+   background-color: #3b2412;
+   color: white;
+   text-decoration: none;
+   border-bottom: 1px solid #5c3d24;
+ }
```

> `.menu a` = "los `a` que están **dentro** de `.menu`" (lo vemos en el 10).

Cada enlace pasa a su propia línea y ocupa **todo el ancho**. Pasad el ratón: **toda la franja** es el enlace, no solo la palabra.

¿Y si lo queremos en horizontal? Cambiad `block` por `inline-block`: en fila, cada uno con su padding. (Para menús horizontales "de verdad", con el espacio bien repartido, usaremos **flexbox** en el 19.)

### Paso 4: `display: none` vs `visibility: hidden`

Queremos ocultar la etiqueta "Nuevo". Hay dos formas y **no son iguales**:

_./styles.css_

```diff
  .etiqueta {
    display: inline-block;
+   visibility: hidden;
```

La etiqueta **desaparece**, pero deja **su hueco** en el texto. Ahora cambiadlo:

```diff
-   visibility: hidden;
+   display: none;
```

(Quitad también el `display: inline-block` de arriba, o poned el `display: none` debajo: gana el último.)

Ahora desaparece **del todo**: el texto se cierra como si nunca hubiera existido.

|                      | ¿Se ve? | ¿Ocupa sitio? |
| -------------------- | ------- | ------------- |
| `visibility: hidden` | No      | **Sí**        |
| `display: none`      | No      | **No**        |

> Ojo: con `display: none` el elemento también desaparece para los **lectores de pantalla**. Es la forma de ocultar de verdad (un menú cerrado, un modal que no está abierto…).

Quitad el `display: none` y los rayos X (`* { outline… }`) antes de seguir.

> 💡 **En Tailwind**: `block`, `inline`, `inline-block`, `hidden` (= `display: none`) e `invisible` (= `visibility: hidden`). Ahora sabéis qué hace cada una.

## El misterio del hueco debajo de las imágenes

> ⏱️ **Si vamos justos de tiempo, lo saltamos en clase** y queda para repasar en casa. Es la explicación de una línea del reset (08).

Las imágenes son `inline` por defecto: el navegador las coloca **como si fueran una letra**, apoyadas en la línea del texto. Y en una línea de texto siempre se deja un espacio debajo para las letras que "cuelgan" (la g, la p, la j…). Resultado: un **huequito** debajo de la imagen.

Añadid la imagen dentro de un marco **al final del `body`**, justo después del párrafo:

_./index.html_

```diff
    <p>
      Notas florales y afrutadas <span class="etiqueta">Nuevo</span>, ideal
      para preparar en filtro. Tueste claro y acidez brillante: un café para
      tomar solo y sin prisa.
    </p>
+
+   <div class="marco">
+     <img
+       src="https://images.unsplash.com/photo-1715692727454-130e0dcad687?w=400&h=200&fit=crop"
+       alt="Taza de café sobre una mesa de madera"
+     />
+   </div>
  </body>
```

_./styles.css_

```diff
+ .marco {
+   background-color: #b45309;
+   width: fit-content;
+ }
```

Recargad: debajo de la foto asoma una **franjita naranja** de unos pocos píxeles. Es el hueco para las "letras que cuelgan".

_./styles.css_

```diff
+ .marco img {
+   display: block;
+ }
```

La franja desaparece: como `block`, la imagen ya no se comporta como una letra. Por eso el reset lleva `display: block` en las imágenes.

> `width: fit-content` hace que el `div` mida lo que su contenido, en vez de todo el ancho. Solo lo usamos para que se vea bien el ejemplo.

## Para ampliar

- [MDN · display](https://developer.mozilla.org/es/docs/Web/CSS/display)
- [MDN · Flujo normal (block e inline)](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Normal_Flow)
