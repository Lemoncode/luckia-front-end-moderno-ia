# 07 · Herencia

> ⏱️ ~10-15 min

## Lo que ya hemos visto sin darnos cuenta

- En el 03 pusimos `font-family` **solo en el `body`**… y cambió la fuente de **todo**: títulos, párrafos, listas.
- Pero los **enlaces** seguían azules aunque el `body` tenía `color: #333`.

Las dos cosas tienen la misma explicación: la **herencia**.

## Qué es

Algunas propiedades, si no se las defines a un elemento, **las toma de su padre**, y este del suyo… hasta llegar al `html`.

```html
<body>            ← font-family: system-ui
  <article>       ← (hereda system-ui)
    <p>           ← (hereda system-ui)
      <strong>    ← (hereda system-ui)
```

## Qué se hereda y qué no

La regla para acordarse: **lo que tiene que ver con el texto se hereda; lo que tiene que ver con la caja (lo que vimos en el 06), no**.

| ✅ Se hereda (texto) | ❌ No se hereda (caja) |
|---|---|
| `color` | `margin`, `padding` |
| `font-family`, `font-size`, `font-weight`, `font-style` | `border` |
| `line-height` | `background` |
| `text-align`, `letter-spacing` | `width`, `height` |
| `list-style` | `display`, `position` |
| `cursor`, `visibility` | |
| las **variables CSS** (`--lo-que-sea`) | |

¿Por qué `border` no se hereda? Imaginad que le ponéis un borde a una tarjeta y **cada párrafo, cada enlace y cada negrita** de dentro tuviera también su borde. 😅

> 💡 Las variables CSS se heredan: por eso al declararlas en `:root` (el `html`) están disponibles en toda la página.

## El valor heredado es el más débil

Un valor heredado **pierde contra cualquier regla que apunte directamente al elemento**, incluidas las del navegador.

- Los enlaces: el navegador tiene una regla para `a` que los pone azules → gana al `color` heredado.
- Los botones y los campos de formulario: el navegador les pone **su propia fuente** → no heredan la nuestra.

## Forzar la herencia: `inherit`

Si queremos que un elemento **sí** herede algo, se lo decimos:

```css
a {
  color: inherit; /* el color de tu padre, sea cual sea */
}

button,
input {
  font: inherit; /* la fuente de tu padre (familia, tamaño, peso…) */
}
```

> 🔮 Esa regla de `button, input` está en **casi todos los reset CSS**. La volveremos a ver en el 08.

Otras palabras clave que funcionan en cualquier propiedad:

| Valor | Significa |
|---|---|
| `inherit` | Usa el valor del padre |
| `initial` | Usa el valor "de fábrica" de CSS (¡no el del navegador!) |
| `unset` | Si la propiedad se hereda, `inherit`; si no, `initial` |

## 🛠️ Práctica

### 0. Punto de partida

Cread una carpeta `07-herencia` con estos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Herencia</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <article class="tarjeta">
      <h2>Suscríbete a la newsletter</h2>
      <p>
        Cada semana, un truco para mejorar tu café.
        <a href="#">Ver un ejemplo</a>
      </p>
      <input type="email" placeholder="tu@email.com" />
      <button>Suscribirme</button>
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
}
```

### 1. Lo que se hereda

Tenemos una tarjeta de suscripción (`article.tarjeta`) con un título, un párrafo con un enlace, un campo de email y un botón. Queremos que **toda la tarjeta** tenga un aire más "de revista": letra con remates y color marrón café. En vez de ir elemento por elemento, se lo ponemos **solo a la tarjeta**:

_./styles.css_

```diff
+ .tarjeta {
+   font-family: Georgia, serif;
+   color: #3b2412;
+ }
```

Recargad y fijaos en quién ha cambiado:

- ✅ El `h2` y el párrafo: fuente Georgia y color marrón. **Lo han heredado.**
- ❌ El enlace: sigue **azul** (tiene la regla del navegador).
- ❌ El campo de email y el botón: siguen con la **fuente del sistema** (también tienen la suya del navegador).

👉 DevTools: seleccionad el `<p>` y bajad en el panel **Styles**. Veréis un bloque **"Inherited from article.tarjeta"**: de ahí viene su fuente y su color.

### 2. Lo que no se hereda

Queremos que la tarjeta parezca una tarjeta: un borde y algo de aire por dentro.

_./styles.css_

```diff
  .tarjeta {
    font-family: Georgia, serif;
    color: #3b2412;
+   border: 2px solid #b45309;
+   padding: 1rem;
+   max-width: 30rem;
  }
```

El borde y el padding se aplican **solo a la tarjeta**. Ni el `h2`, ni el párrafo, ni el botón tienen borde propio. Menos mal.

👉 En DevTools, en el bloque "Inherited from article.tarjeta" del `<p>`, las propiedades que **no** se heredan (`border`, `padding`, `max-width`) salen **en gris**: DevTools os está diciendo "esto lo tiene tu padre, pero a ti no te afecta".

### 3. Forzar la herencia con `inherit`

Queremos que el enlace y el formulario **sigan el estilo de la tarjeta** en vez de ir por libre:

_./styles.css_

```diff
+ a {
+   color: inherit;
+ }
+
+ button,
+ input {
+   font: inherit;
+ }
```

- El enlace pasa a marrón (sigue subrayado, así que se sigue viendo que es un enlace).
- El campo de email y el botón pasan a Georgia, con el mismo tamaño que el resto del texto.

Y si mañana cambiamos la fuente o el color de `.tarjeta`, **todo** lo de dentro la sigue.

### 4. Extra: variables que se heredan

Las variables también se heredan… y se pueden **redefinir** para una parte de la página:

_./styles.css_

```diff
+ :root {
+   --color-acento: #b45309;
+ }
+
  .tarjeta {
    font-family: Georgia, serif;
    color: #3b2412;
-   border: 2px solid #b45309;
+   border: 2px solid var(--color-acento);
    padding: 1rem;
    max-width: 30rem;
  }
+
+ button {
+   background-color: var(--color-acento);
+   color: white;
+ }
```

Ahora añadid una segunda tarjeta en el HTML con otra clase más:

_./index.html_

```diff
+ <article class="tarjeta tarjeta-verde">
+   <h2>Hazte socio</h2>
+   <p>Descuentos en café de especialidad.</p>
+   <button>Quiero ser socio</button>
+ </article>
```

_./styles.css_

```diff
+ .tarjeta-verde {
+   --color-acento: #0f766e;
+ }
```

La segunda tarjeta y **su botón** cambian a verde: el botón hereda la variable de la tarjeta más cercana. Sin tocar la regla del botón.

## Para ampliar

- [MDN · Herencia](https://developer.mozilla.org/es/docs/Web/CSS/Inheritance)
- [MDN · Cascada, especificidad y herencia](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
- En MDN, la ficha de cada propiedad dice si se hereda o no (apartado *Definición formal → Heredable*).
