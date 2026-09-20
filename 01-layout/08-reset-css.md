# 08 · Reset CSS

> ⏱️ ~15 min

## Los estilos del navegador nos persiguen

Llevamos toda la sesión chocándonos con el CSS que trae el navegador de serie (la _user agent stylesheet_ del 03):

- El **hueco blanco** alrededor de la página: un `margin` de 8px en el `body` (lo vimos en la portada del 05).
- Los **márgenes de los títulos y párrafos**, que además se escapan del padre (06).
- Los **botones y campos de formulario** con su propia fuente (07).
- Y encima, cada navegador trae **sus propios valores**, un poco distintos.

Podemos ir apagando fuegos uno a uno… o empezar **todos** nuestros proyectos con unas pocas líneas que dejen una **base limpia y predecible**. Eso es un **reset CSS**.

## Dos filosofías

|               | Qué hace                                                                                                                                           | Ejemplos                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Reset**     | **Borra** los estilos del navegador: márgenes a 0, títulos del mismo tamaño que el texto, listas sin viñetas… Partes de cero y lo decides todo tú. | Reset de Eric Meyer (el clásico), **Preflight de Tailwind** |
| **Normalize** | **Iguala** los navegadores entre sí, pero mantiene los estilos útiles (títulos grandes, listas con viñetas…).                                      | normalize.css, modern-normalize                             |

Hoy en día lo más habitual es algo intermedio: un **reset moderno** pequeño, de 15-20 líneas, que arregla lo que molesta y deja el resto.

> 💡 **¿Usáis Tailwind?** Tailwind trae su propio reset (_Preflight_), bastante agresivo: un `<h1>` sin clases se ve **igual que un párrafo** y las listas no tienen viñetas. Mucha gente se lleva la sorpresa. Ahora sabéis por qué.

## ¿Y en un proyecto real, qué hago?

Casi nunca tendréis que escribir un reset desde cero:

- **Si usáis una librería o framework de UI, normalmente ya trae el suyo**:
  - **Tailwind** → *Preflight* (viene activado de serie; está construido sobre modern-normalize).
  - **MUI** (Material UI) → el componente `<CssBaseline />` (ojo: hay que **añadirlo** vosotros a la app).
  - **Bootstrap** → *Reboot*.
- **Si no usáis ninguna**, lo normal es **copiar uno conocido** al principio del proyecto:
  - **modern-normalize**, si queréis respetar los estilos útiles del navegador.
  - **El reset de Josh W. Comeau**, si preferís un reset moderno y pequeño que podéis leer y entender entero.

> El de Eric Meyer es **historia** (2008): está bien conocerlo, pero hoy no se suele usar tal cual.

👉 Lo importante no es escribirlo, es **saber que existe**, que **alguien lo está aplicando** en vuestro proyecto, y **saber leerlo**. Cuando algo "se ve raro" (el `h1` sale pequeño, la lista no tiene viñetas…), muchas veces la respuesta está en el reset.

## 🏠 Para casa: monta tu propio reset

> 🏠 **Práctica para casa.** En clase nos quedamos con lo anterior. Montar vuestro propio reset línea a línea es un **ejercicio muy bueno** para repasar todo lo visto (modelo de caja, herencia, estilos del navegador), pero no nos da tiempo en la sesión.

La idea es crear un fichero `reset.css` con lo mínimo imprescindible, **entendiendo cada línea**. Cread una carpeta (por ejemplo `08-reset`).

### Paso 0: una página "sin tocar"

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset CSS</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="contenido">
      <h1>Café &amp; Código</h1>
      <p>Una web sobre café hecha con CSS.</p>
      <img
        src="https://images.unsplash.com/photo-1715692727454-130e0dcad687?w=1600"
        alt="Taza de café sobre una mesa de madera"
      />
      <p>Apúntate a la newsletter:</p>
      <input type="email" placeholder="tu@email.com" />
      <button>Suscribirme</button>
    </main>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  background-color: #f5f0eb;
}
```

Recargad y fijaos en todo lo que **no** hemos pedido:

- Un **hueco** alrededor de la página (el margen del `body`).
- Márgenes arriba y abajo del `h1` y de los párrafos.
- La **imagen se sale** por la derecha y aparece scroll horizontal (la foto mide 1600px).
- El campo y el botón con **otra letra**, más pequeña.

👉 En DevTools, seleccionad el `body`, el `h1` o el `button` y buscad en **Styles** las reglas **user agent stylesheet**: de ahí sale todo esto.

### Paso 1: un fichero aparte para el reset

El reset no es "nuestro diseño": es la **base** sobre la que construimos. Por eso va en su propio fichero, y se enlaza **antes** que el nuestro (primero la base, después nuestros estilos encima):

_./index.html_

```diff
    <title>Reset CSS</title>
+   <link rel="stylesheet" href="reset.css" />
    <link rel="stylesheet" href="styles.css" />
```

Cread `reset.css` vacío. Lo vamos llenando línea a línea.

### Paso 2: `box-sizing: border-box` para todos

Ya lo conocemos del 06: que el `width` sea el tamaño **total** de la caja.

_./reset.css_

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

### Paso 3: fuera los márgenes del navegador

_./reset.css_

```diff
+ * {
+   margin: 0;
+ }
```

Recargad: el hueco alrededor de la página **desaparece** y los títulos y párrafos quedan **pegados** unos a otros.

¿Hemos roto algo? No: ahora **los espacios los decidimos nosotros**, no el navegador. Se acabaron los márgenes que se escapan del padre porque alguien los puso sin que lo supiéramos. Vamos a poner los nuestros:

_./styles.css_

```diff
  body {
    font-family: system-ui, sans-serif;
    background-color: #f5f0eb;
  }
+
+ .contenido {
+   max-width: 40rem;
+   margin: 0 auto;
+   padding: 1.5rem;
+ }
+
+ h1,
+ p {
+   margin-bottom: 1rem;
+ }
```

Fijaos en que usamos lo del 06: el contenedor centrado con `max-width` + `margin: 0 auto`, el aire de dentro con `padding`, y los márgenes **en una sola dirección** (`margin-bottom`).

### Paso 4: imágenes que no se salen

_./reset.css_

```diff
+ img,
+ picture,
+ video,
+ svg {
+   display: block;
+   max-width: 100%;
+ }
```

- `max-width: 100%`: una imagen **nunca** será más ancha que su contenedor. Si la foto mide 1600px y el hueco 600px, se encoge a 600px (y mantiene la proporción). Adiós scroll horizontal.

- `display: block`: por defecto las imágenes se comportan como si fueran **una letra más dentro del texto**, y eso deja un pequeño hueco debajo de ellas. Lo entenderemos en el 09 (display).

Añadid también un poco de aire debajo de la imagen en `styles.css`:

_./styles.css_

```diff
  h1,
- p {
+ p,
+ img {
    margin-bottom: 1rem;
  }
```

### Paso 5: formularios con nuestra letra

Lo del 07:

_./reset.css_

```diff
+ input,
+ button,
+ textarea,
+ select {
+   font: inherit;
+ }
```

El campo y el botón pasan a usar la misma letra y tamaño que el resto de la página.

### Paso 6: comprobadlo en DevTools

Seleccionad el `h1` y mirad **Styles**. Veréis las reglas **de arriba abajo por orden de prioridad**: primero las nuestras (`*` de `reset.css`), y debajo la del navegador (`h1 { … }` *user agent stylesheet*) con su `margin-block-start: 0.67em`.

🤔 Curiosamente, la regla del navegador **no sale tachada**, aunque en pantalla el `h1` ya no tiene ese margen. ¿Por qué? El navegador usa propiedades **lógicas** (`margin-block-start`, `margin-block-end`) y nuestro `margin: 0` se traduce a las **físicas** (`margin-top`, `margin-bottom`…). Son "la misma" propiedad por detrás, pero DevTools no siempre sabe relacionarlas para tacharlas.

Para ver el valor que **de verdad** se aplica, id a la pestaña **Computed** y escribid `margin` en el filtro:

- `margin-top: 0px` y `margin-bottom: 0px`.
- Desplegad la flechita de cualquiera de ellos: os dice **de qué regla sale** (`* { margin: 0 }` en `reset.css`).

👉 Moraleja: **Styles** te dice qué reglas le llegan al elemento; **Computed** te dice el valor **final** que gana. Cuando dudéis, Computed manda.

Ese es el truco del reset: **no borramos** los estilos del navegador (siguen ahí), los **pisamos** con los nuestros.

## El reset completo

El resultado del ejercicio anterior, todo junto y comentado:

_./reset.css_

```css
/* 1. El width es el tamaño total de la caja (06) */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 2. Sin márgenes del navegador: los espacios los decidimos nosotros */
* {
  margin: 0;
}

/* 3. Las imágenes nunca se salen de su contenedor */
img,
picture,
video,
svg {
  display: block;
  max-width: 100%;
}

/* 4. Los formularios heredan la letra de la página (07) */
input,
button,
textarea,
select {
  font: inherit;
}
```

👉 No hace falta memorizarlo. En un proyecto real copiaréis uno conocido (o os lo dará el framework, o la IA). Lo importante es que **sepáis leerlo y entender por qué está cada línea**, para poder decidir si os sirve.

## Para ampliar

- [Josh W. Comeau · A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/): un reset moderno explicado línea a línea (en inglés). Muy recomendable.
- [modern-normalize](https://github.com/sindresorhus/modern-normalize): la opción "normalize", que respeta los estilos útiles del navegador.
- [Tailwind · Preflight](https://tailwindcss.com/docs/preflight): el reset que usa Tailwind y qué cambia exactamente.
- [Eric Meyer · Reset CSS](https://meyerweb.com/eric/tools/css/reset/): el reset clásico, por curiosidad histórica.
