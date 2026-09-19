# 06 · El modelo de caja

> ⏱️ ~35 min · Probablemente **lo más importante de todo CSS**.

## Todo es una caja

¿Os acordáis del truco `* { outline: 1px solid red; }` del 04? Cada elemento de la página se pintaba como un rectángulo. **Todo** en una web es una caja: un párrafo, un enlace, una imagen, un botón…

Y cada caja tiene **cuatro capas**, de dentro hacia fuera:

```
┌─────────────────────────────────────────┐
│                 margin                  │  ← espacio FUERA de la caja (transparente)
│   ┌─────────────────────────────────┐   │
│   │             border              │   │  ← el borde
│   │   ┌─────────────────────────┐   │   │
│   │   │         padding         │   │   │  ← espacio DENTRO, entre borde y contenido
│   │   │   ┌─────────────────┐   │   │   │
│   │   │   │    contenido    │   │   │   │  ← texto, imagen…
│   │   │   └─────────────────┘   │   │   │
│   │   └─────────────────────────┘   │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

| Capa          | Qué es                                               | ¿Lleva el color de fondo?    |
| ------------- | ---------------------------------------------------- | ---------------------------- |
| **contenido** | Lo que hay dentro: texto, imagen…                    | Sí                           |
| **padding**   | Relleno: el aire **entre el contenido y el borde**   | Sí                           |
| **border**    | El borde                                             | (tiene su propio color)      |
| **margin**    | Margen: la separación **con las cajas de alrededor** | **No**, siempre transparente |

> 🔑 **padding = espacio de dentro**, **margin = espacio de fuera**. Si le ponéis fondo a una caja, el padding se ve coloreado; el margin nunca.

## Propiedades y _shorthands_

Cada capa se puede definir lado por lado:

```css
padding-top: 8px;
padding-right: 16px;
padding-bottom: 8px;
padding-left: 16px;
```

O con la **forma corta** (_shorthand_): una sola propiedad que agrupa varias.

| Valores | Ejemplo                        | Significa                                                               |
| ------- | ------------------------------ | ----------------------------------------------------------------------- |
| 1       | `padding: 16px;`               | Los 4 lados iguales                                                     |
| 2       | `padding: 8px 16px;`           | Arriba/abajo · izquierda/derecha                                        |
| 3       | `padding: 8px 16px 24px;`      | Arriba · izquierda/derecha · abajo                                      |
| 4       | `padding: 8px 16px 24px 32px;` | Arriba · derecha · abajo · izquierda (**como las agujas del reloj** 🕐) |

Lo mismo vale para `margin`. Y `border` agrupa grosor, estilo y color:

```css
border: 2px solid #b45309;
/* = border-width: 2px; border-style: solid; border-color: #b45309; */
```

Otras útiles:

```css
border-radius: 8px; /* esquinas redondeadas */
border-bottom: 1px solid #ddd; /* solo un lado */
```

## El ancho: la sorpresa de `box-sizing`

Ya sabemos que una caja tiene contenido, padding, borde y margen. Ahora la pregunta del millón: si a una caja le decimos `width: 300px`, **¿cuánto mide?**

Parece obvio: 300px. Pues **depende**. Depende de si el navegador cuenta el padding y el borde **dentro** de esos 300px o los **suma por fuera**. Y por defecto… los suma por fuera. La propiedad que controla esto se llama **`box-sizing`**.

Es una de las cosas que más despistan al empezar a maquetar ("¡le he puesto 300px y se me sale!"), así que vamos a verlo en el navegador paso a paso. Cread una carpeta aparte (por ejemplo `06-box-sizing`) con un `index.html` y un `styles.css`.

### Paso 1: una regla de 300px y una caja de 300px

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>box-sizing</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="regla">Esto mide 300px</div>
    <div class="caja">Soy una caja</div>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
}

/* Una "regla" de 300px para comparar */
.regla {
  width: 300px;
  background-color: #b45309;
  color: white;
  text-align: center;
}

.caja {
  width: 300px;
  background-color: #fef3c7;
  margin-top: 16px;
}
```

Recargad: a ojo, el div con la clase `caja` y el del div `regla`miden **lo mismo**. Vamos a comprobarlo con DevTools; lo usaremos en todo el ejemplo:

1. F12 → pestaña **Elements**.
2. Pasad el ratón (sin hacer clic) por encima de la línea `<div class="regla">`. En la página, el elemento se ilumina y aparece un **cartelito** con su nombre y medidas: `div.regla  300 × 24`. El primer número es el **ancho**, el segundo el alto.
3. Haced lo mismo con `<div class="caja">`: también **300** de ancho.

### Paso 2: le damos aire por dentro

El texto está pegado al borde de la caja. Le ponemos padding:

_./styles.css_

```diff
  .caja {
    width: 300px;
+   padding: 24px;
    background-color: #fef3c7;
    margin-top: 16px;
  }
```

Recargad… 😮 **la caja ha crecido**. Ya no coincide con la regla: sobresale por la derecha, aunque sigue diciendo `width: 300px`.

### Paso 3: y un borde

_./styles.css_

```diff
  .caja {
    width: 300px;
    padding: 24px;
+   border: 1px solid #333;
    background-color: #fef3c7;
    margin-top: 16px;
  }
```

Ha crecido **otra vez**. Medidla: en DevTools (Elements), pasad el ratón por encima del `<div class="caja">` y mirad el cartelito. **350px**:

```
300 (width) + 24 + 24 (padding) + 1 + 1 (border) = 350px
```

¿Por qué? Porque por defecto (`box-sizing: content-box`) el `width` es **solo el contenido**, y el padding y el borde **se suman por fuera**. Cada vez que tocas el padding o el borde, cambia el tamaño total. Un lío para maquetar.

### Paso 4: `border-box` al rescate

Añadimos una segunda caja, idéntica, para comparar:

_./index.html_

```diff
    <div class="regla">Esto mide 300px</div>
    <div class="caja">Soy una caja</div>
+   <div class="caja caja-border">Soy una caja con border-box</div>
```

_./styles.css_

```diff
+ .caja-border {
+   box-sizing: border-box;
+ }
```

Recargad: la segunda caja **encaja exacta con la regla**. Con `border-box`, el `width` es el tamaño **total** (contenido + padding + borde). Si pones 300px, mide 300px, y el padding y el borde se meten **hacia dentro** (el contenido se queda en `300 − 48 − 2 = 250px`).

Probad a subir el `padding` de `.caja` a `48px`: la primera caja **crece**, la de border-box **se queda en 300**.

### La receta

En vez de ponerlo caja a caja, se lo ponemos **a todos los elementos** con el selector universal, al principio del CSS:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Hay dos cosas nuevas en ese selector:

- **Las comas**: separan varios selectores que comparten las mismas declaraciones. `h1, h2 { color: red; }` es lo mismo que escribir una regla para `h1` y otra para `h2`. Aquí son tres selectores: `*`, `*::before` y `*::after`.
- **`::before` y `::after`**: son **pseudo-elementos**. Con CSS se puede añadir contenido "de mentira" justo antes o justo después del contenido de un elemento (un icono, una comilla decorativa, una línea…), sin tocar el HTML:

  ```css
  .nota::before {
    content: "💡 ";
  }
  ```

  Eso pinta un 💡 delante del texto de cada `.nota`. Esos "elementos de mentira" también son cajas, pero el `*` **no los incluye**, por eso se añaden a mano. Los veremos a fondo en el 14.

👉 **Lo usa todo el mundo**: prácticamente todos los reset CSS lo incluyen, y Tailwind lo trae de serie. Lo volvemos a ver en el 08.

## `width` vs `max-width`, y centrar

- `width: 600px` → siempre 600px. En un móvil de 375px… **se sale**.
- `max-width: 600px` → **como mucho** 600px. En pantallas pequeñas se encoge. ✅ Casi siempre es lo que queréis.

Para **centrar horizontalmente** una caja con ancho definido:

```css
.contenedor {
  max-width: 600px;
  margin: 0 auto; /* 0 arriba y abajo, "auto" a los lados → reparte el hueco */
}
```

## Las rarezas del `margin`

### 1. Los márgenes verticales se "colapsan"

Dos cajas una encima de otra: la de arriba con `margin-bottom: 32px` y la de abajo con `margin-top: 32px`. ¿Separación? **32px, no 64px.**

Cuando dos márgenes verticales se tocan, **no se suman: se queda el mayor**. Solo pasa en vertical (en horizontal sí se suman).

### 2. El margen del hijo se "escapa" del padre

Si el primer hijo de una caja tiene `margin-top` y el padre **no tiene ni padding ni borde** arriba, ese margen **se sale del padre** y lo empuja hacia abajo. El clásico "¿por qué hay un hueco encima de mi cabecera si no le he puesto margen?". Suele ser un `h1` con su margen de navegador. Se arregla poniéndole algo de padding al padre.

### 3. Consejo: cuidado con dónde pones el margin

- Un **componente** (una tarjeta, un botón) **no debería llevar margin hacia fuera**. El día que lo reutilices en otro sitio, ese margen molestará.
- La separación entre elementos es cosa del **contenedor**: con **padding** en el padre o, cuando veamos flexbox (18), con `gap`.
- Si usáis margin, mejor **en una sola dirección** (por ejemplo, solo `margin-bottom`) para no pelearos con el colapso.

## 🛠️ Práctica

### 0. Punto de partida

Cread una carpeta `06-caja` con estos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modelo de caja</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <article class="tarjeta">
      <img
        class="tarjeta-imagen"
        src="https://images.unsplash.com/photo-1715692727454-130e0dcad687?w=600&h=300&fit=crop"
        alt="Taza de café sobre una mesa de madera"
      />
      <h2>Café de Etiopía</h2>
      <p>Notas florales y afrutadas. Tueste claro, ideal para filtro.</p>
      <p class="precio">12,90 €</p>
    </article>

    <article class="tarjeta">
      <img
        class="tarjeta-imagen"
        src="https://images.unsplash.com/photo-1715692727454-130e0dcad687?w=600&h=300&fit=crop"
        alt="Taza de café sobre una mesa de madera"
      />
      <h2>Café de Colombia</h2>
      <p>Chocolate y caramelo. Tueste medio, perfecto para espresso.</p>
      <p class="precio">10,50 €</p>
    </article>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f0eb;
}
```

Tenemos dos tarjetas de producto (`article.tarjeta`), cada una con una imagen, un título, una descripción y un precio. Ahora mismo son texto suelto con una imagen gigante. Vamos a convertirlas en tarjetas.

### 1. Ver las cajas en DevTools

F12 → **Elements** → seleccionad un `<h2>` → pestaña **Computed** (al lado de Styles). Arriba aparece un dibujo con las 4 capas: **margin, border, padding y contenido**, con sus medidas.

- Pasad el ratón por cada capa del dibujo: se resalta en la página.
- El `h2` ya tiene **margin** arriba y abajo… que no hemos puesto nosotros: es del navegador (08, reset).

### 2. Padding, borde y fondo: que parezca una tarjeta

Queremos que cada tarjeta sea un bloque blanco, con borde, esquinas redondeadas y aire por dentro:

_./styles.css_

```diff
+ .tarjeta {
+   width: 300px;
+   background-color: white;
+   border: 1px solid #e0d6cc;
+   border-radius: 12px;
+   padding: 24px;
+ }
```

Y que la imagen ocupe el ancho de la tarjeta, con las esquinas también redondeadas:

```diff
+ .tarjeta-imagen {
+   width: 100%;
+   border-radius: 8px;
+ }
```

Fijaos: el **padding** se ve blanco (lleva el fondo de la tarjeta). Probad a cambiar `padding: 24px` por `padding: 8px 24px` y por `padding: 0`, y volved a `24px`.

### 3. La sorpresa del ancho

Hemos puesto `width: 300px`. Comprobadlo: seleccionad un `<article>` en DevTools y mirad el dibujo de **Computed**, o pasad el ratón por encima en Elements (sale un cartelito con las medidas).

Mide **350 × algo**. ¿Por qué? `300 + 24 + 24 + 1 + 1`. El padding y el borde se suman **por fuera** del `width`.

Arreglémoslo para siempre, al **principio** del fichero:

_./styles.css_

```diff
+ *,
+ *::before,
+ *::after {
+   box-sizing: border-box;
+ }
+
  body {
```

Recargad y medid otra vez: **300px** exactos. El padding ahora se mete hacia dentro.

### 4. Centrar la tarjeta

Las tarjetas están pegadas a la izquierda. Queremos centrarlas en la ventana:

_./styles.css_

```diff
  .tarjeta {
    width: 300px;
+   margin: 0 auto;
    background-color: white;
```

`auto` a los lados reparte el espacio sobrante a partes iguales. Probad a cambiar `width` por `max-width` y haced la ventana muy estrecha (o usad el modo móvil): con `width` la tarjeta se sale; con `max-width` se encoge. **Dejad `max-width`.**

### 5. Separar las tarjetas: el colapso de márgenes

Las dos tarjetas están pegadas. Queremos 32px de separación. Probamos poniendo margen arriba **y** abajo:

_./styles.css_

```diff
  .tarjeta {
    max-width: 300px;
-   margin: 0 auto;
+   margin: 32px auto;
```

Medid en DevTools la separación entre las dos tarjetas: **32px, no 64px**. El margen de abajo de la primera y el de arriba de la segunda se han **colapsado**.

> Y fijaos que ahora la tarjeta **lleva margen incorporado**: si la usamos en otra página, se lo lleva puesto. Cuando veamos flexbox (18), la separación la pondrá el contenedor con `gap`.

### 6. Detalles de la tarjeta

Para rematar, con lo que ya sabemos:

_./styles.css_

```diff
+ .precio {
+   font-size: 1.25rem;
+   font-weight: bold;
+   color: #b45309;
+   border-top: 1px solid #e0d6cc;
+   padding-top: 12px;
+ }
```

Una línea encima del precio con `border-top` y aire con `padding-top`. Ya tenemos una tarjeta de producto de verdad. ☕

👉 Echadle otro vistazo con los "rayos X" (`* { outline: 1px solid red; }`) y con el dibujo de Computed de DevTools: ahora podéis entender cada hueco.

## Para ampliar

- [MDN · El modelo de caja](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/The_box_model)
- [MDN · Colapso de márgenes](https://developer.mozilla.org/es/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)
- [CSS-Tricks · box-sizing](https://css-tricks.com/box-sizing/) (en inglés)
