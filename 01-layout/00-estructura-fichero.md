# 00 · Estructura de un fichero HTML

> ⏱️ ~15-20 min · Sin herramientas raras: un editor, un navegador y a picar.

## Cómo vamos a trabajar

- Un fichero `.html` es **texto plano**. El navegador lo lee y lo pinta.
- Para verlo: **arrastramos el fichero al navegador** (o doble clic). Nada de servidores ni bundlers.
- Cada vez que cambiemos algo: guardar y **F5**.

> 💡 Si os cansáis del F5, la extensión _Live Server_ de VS Code recarga sola. Opcional.

## Paso 1: crear el fichero

1. Cread una carpeta `playground` y dentro un fichero `index.html`.
2. En VS Code escribid `!` y pulsad **Tab** (esto es **Emmet**, viene de serie).

Os genera esto:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
```

La IA os va a generar esto mil veces. Vamos a entender **cada línea**.

## Paso 2: línea a línea

| Línea                        | Qué hace                                                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<!DOCTYPE html>`            | Le dice al navegador "esto es HTML moderno". Sin ella entra en _quirks mode_ (modo compatibilidad con webs de los 90) y el CSS se comporta raro. |
| `<html lang="en">`           | Raíz del documento. `lang` indica el idioma: lo usan los lectores de pantalla, el traductor del navegador y Google. **Cambiadlo a `es`**.        |
| `<head>`                     | Información **sobre** la página. No se pinta.                                                                                                    |
| `<meta charset="UTF-8" />`   | Codificación de caracteres. Sin ella las tildes y la ñ pueden salir como `Ã±`.                                                                   |
| `<meta name="viewport" ...>` | Clave para móvil (lo vemos abajo).                                                                                                               |
| `<title>`                    | El texto de la pestaña, favoritos y resultados de Google.                                                                                        |
| `<body>`                     | Todo lo que **se ve**.                                                                                                                           |

### El viewport, ¿por qué hace falta?

Los primeros smartphones se encontraron con webs pensadas para escritorio. Su solución fue **fingir que la pantalla mide ~980px** y encoger la página para que cupiera entera.

`width=device-width, initial-scale=1` le dice al móvil: "no finjas, usa tu ancho real, que esta web ya está preparada".

### ¿Qué más suele ir en el `head`?

```html
<meta name="description" content="Resumen que aparece en Google" />
<link rel="icon" href="favicon.svg" />
<link rel="stylesheet" href="styles.css" />
<!-- 👀 lo usaremos muy pronto -->

<!-- Open Graph: lo que se ve al compartir el enlace en WhatsApp, LinkedIn... -->
<meta property="og:title" content="Mi página" />
<meta property="og:image" content="preview.png" />
```

## Paso 3: anatomía de una etiqueta

```html
<a href="https://developer.mozilla.org" target="_blank">MDN</a>
```

- `<a ...>` etiqueta de **apertura**, `</a>` de **cierre**, y en medio el **contenido**.
- `href="..."`, `target="..."` son **atributos**: configuran el elemento.
- Todo junto es un **elemento**.
- Hay elementos **vacíos** (sin contenido ni cierre): `<meta>`, `<link>`, `<img>`, `<br>`, `<input>`. La `/` final (`<meta ... />`) es opcional.
- Los elementos se **anidan**: se cierran en orden inverso al que se abren.
- Comentarios: `<!-- esto no se pinta -->`

## 🛠️ Práctica

1. Cambiad `lang="es"` y el `<title>` a "Mi primera página". Arrastrad el fichero al navegador y mirad la pestaña.
2. Dentro de `<body>` añadid:

   ```html
   <h1>Hola, ñandú</h1>
   <p>Esto es un párrafo con saltos de línea y espacios de más.</p>
   ```

> Ojo si quitamos el UTF-8 el navegador es muy listo y lo pone por nosotros, si quieres verlo romper sustituye el meta por `<meta charset="windows-1252" />`

👉 **Espacios y saltos de línea se colapsan** a un solo espacio. El formato visual no lo da el HTML: eso es cosa del CSS.

3. Vamos ahora a familirizarnos con las Dev tools

- ¿Cómo se vería esto en Móvil? Vamos darle a F12 o botón derecho devtools y aquí podemos elegir movil.
- Y si quiero ver el código fuente de lo que se está mostrando?

## Para ampliar

- [MDN · Anatomía de un documento HTML](https://developer.mozilla.org/es/docs/Learn/Getting_started_with_the_web/HTML_basics)
- [MDN · ¿Qué hay en el head?](https://developer.mozilla.org/es/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)
- [MDN · Meta viewport](https://developer.mozilla.org/es/docs/Web/HTML/Viewport_meta_tag)
