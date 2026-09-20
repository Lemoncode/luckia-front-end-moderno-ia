# 03 · Nuestra primera regla CSS y dónde ponerla

> ⏱️ ~15 min · Trabajamos sobre el `index.html` del blog del 01.

## ¿Quién ha puesto esos estilos? El navegador

Nos quedó una pregunta en el aire: sin nada de CSS, los `h1` son grandes y en negrita, los enlaces azules, las listas con puntos… Y todo en **Times New Roman**.

Es el **CSS del propio navegador**, la _user agent stylesheet_ (hoja de estilos del agente de usuario, o sea, del navegador).

👉 Comprobadlo: abrid vuestro blog, F12 → pestaña **Elements** → clic en el `<h1>`. En el panel **Styles** aparece algo así:

```css
h1 {
  /* user agent stylesheet */
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  font-weight: bold;
}
```

- Cada navegador trae la suya, y **no son idénticas**: por eso la misma página sin CSS se ve un poco distinta en Chrome, Firefox o Safari.
- Nuestro CSS se pone **encima** de ese: no lo borramos, lo **sobrescribimos**.

> 🔮 Más adelante veremos los _reset CSS_, que sirven justo para "limpiar" estos estilos del navegador y partir de algo igual en todos.

## Anatomía de una regla CSS

```css
body {
  font-family: system-ui, sans-serif;
}
```

```
selector       →  body            ¿A QUIÉN se aplica?
{ ... }        →  bloque de declaraciones
propiedad      →  font-family     ¿QUÉ cambio?
valor          →  system-ui, ...  ¿CÓMO lo dejo?
propiedad: valor;  →  una declaración (¡con su ; al final!)
```

- Una regla puede tener todas las declaraciones que queráis.
- Comentarios en CSS: `/* así */` (ojo, **no** `<!-- -->` ni `//`).
- Si escribís mal una propiedad o un valor, **CSS no da error**: simplemente **ignora esa línea** y sigue. Lo bueno: nunca rompe la página. Lo malo: a veces no sabes por qué no funciona. DevTools la marca tachada con un ⚠️.

## Adiós, Times New Roman

`font-family` recibe una **lista de fuentes** separadas por comas. El navegador usa **la primera que tenga disponible**:

```css
font-family: system-ui, sans-serif;
```

- `system-ui`: la fuente del sistema operativo (San Francisco en Mac, Segoe UI en Windows, Roboto en Android). Se ve moderna y no hay que descargar nada.
- `sans-serif`: **familia genérica** de reserva. "Si no tienes ninguna de las anteriores, cualquier fuente sin remates".
- Genéricas más usadas: `serif` (con remates, como Times), `sans-serif` (sin remates), `monospace` (de ancho fijo, para código).

## ¿Dónde pongo el CSS? Tres opciones

### 1. En la propia etiqueta (estilo _inline_)

```html
<p style="color: red;">Este párrafo es rojo</p>
```

- Solo afecta a **ese** elemento. Si queréis cambiarlo en 50 sitios: 50 cambios.
- **Mezcla otra vez contenido y presentación** (volvemos a los 90).
- Además **gana a casi todo** en la cascada, y luego cuesta sobrescribirlo.
- 👉 Evitadlo. Lo veréis en código generado por IA y en algunos casos concretos de JavaScript.

### 2. En una etiqueta `<style>` dentro del `<head>`

```html
<head>
  ...
  <style>
    body {
      font-family: system-ui, sans-serif;
    }
  </style>
</head>
```

- Afecta a **toda la página**, pero **solo a esta página**.
- Útil para pruebas rápidas o ejemplos pequeños.

### 3. En un fichero aparte (la buena ✅)

```html
<head>
  ...
  <link rel="stylesheet" href="styles.css" />
</head>
```

- **Un solo fichero** para todas las páginas de la web: cambias una línea y cambia todo el sitio.
- El navegador lo **guarda en caché**: la segunda página carga más rápido.
- `href` es una **ruta relativa** al HTML: `styles.css` (misma carpeta), `css/styles.css` (en una subcarpeta).

## 🛠️ Práctica

1. **Ver los estilos del navegador**: F12 → Elements, fijate el "p" como tiene los estilso a en el panel de la derecha.

2. \*\*Vamos a actualizar del `styles.css` el estilado de `body`

```diff
  body {
    font-family: system-ui, sans-serif;
+    line-height: 1.6;
+    color: #333;
  }
```

- `line-height: 1.6` → más aire entre líneas: el texto se lee mucho mejor.
- `color: #333` → gris muy oscuro en vez de negro puro, más suave a la vista (los colores los vemos en el 05).

Vamos a añadir un h1 y otro parrafo en el HTML y enlace:

_./index.html_

```diff
  <body>
+  <h1>Cabecera</h1>
    <p style="color: red">Este párrafo es rojo</p>
+  <p>Otro parrafo</p>
+  <a href="https://www.lemoncode.net">Lemoncode</a>
  </body>
```

Recargad. 🎉 Ya parece otra cosa.

3. **¡Ojo al detalle!** La regla es solo para `body`… pero **los `h1`, los párrafos, las listas y los enlaces** también han cambiado de fuente. ¿Por qué, si no les hemos dicho nada?

   Eso es **herencia**: algunas propiedades pasan de padres a hijos. No todas se heredan (el borde o el margen, por ejemplo, no). Lo vemos en detalle en el 07.

   Y los enlaces siguen azules aunque hemos puesto `color: #333`… 🤔 ¿Por qué? Pista: mirad los estilos del navegador del `<a>`. También lo retomamos más adelante.

4. **Rompedlo a propósito**: cambiad el `href` a `style.css` (sin la _s_) y recargad.

```diff
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cómo preparar un buen café en casa · Café &amp; Código</title>
-    <link rel="stylesheet" href="styles.css" />
+    <link rel="stylesheet" href="style.css" />
```

- Vuelve la Times New Roman y **no sale ningún error en la página**.
- F12 → **Console** (o pestaña **Network**), aseguraros que tenéis marcado "all": ahí sí veréis el error de que el fichero no existe (`ERR_FILE_NOT_FOUND` abriendo el fichero en local, o un `404` cuando esté en un servidor). Primer sitio donde mirar cuando "mi CSS no hace nada".
- Dejadlo bien otra vez.

6. **Inline, para ver que existe**: poned `style="color: crimson;"` en un párrafo. Funciona… y ahora imaginad hacerlo en 200 párrafos. Quitadlo.

A partir de aquí, **todo el CSS va en `styles.css`**.

## Para ampliar

- [MDN · Cómo está estructurado el CSS](https://developer.mozilla.org/es/docs/Learn/CSS/First_steps/How_CSS_is_structured)
- [MDN · font-family](https://developer.mozilla.org/es/docs/Web/CSS/font-family)
- [Modern Font Stacks](https://modernfontstacks.com/): listas de fuentes del sistema listas para copiar.
