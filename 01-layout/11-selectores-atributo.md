# 11 · Selectores de atributo

> ⏱️ ~10-15 min

## Seleccionar por lo que el elemento ya dice de sí mismo

En el 00 vimos que las etiquetas tienen **atributos**: `href`, `type`, `alt`, `target`… Y hasta ahora, si queríamos dar estilo a unos elementos concretos, les poníamos una **clase**.

Pero muchas veces el HTML **ya nos está diciendo** lo que necesitamos saber:

- Un enlace con `href="https://…"` → es un enlace **externo**.
- Un enlace con `href="….pdf"` → lleva a un **PDF**.
- Un `<input type="email">` → es un campo de **email**.
- Un `<input disabled>` → está **desactivado**.

¿Para qué inventar una clase `enlace-externo` si el propio `href` ya lo dice? Con los **selectores de atributo** podemos elegir elementos **por sus atributos**. Y lo mejor: si mañana alguien añade un enlace externo nuevo, el estilo se le aplica **solo**, sin acordarse de ponerle ninguna clase.

## Los selectores

Se escriben **entre corchetes** `[ ]`:

| Selector | Se aplica a los elementos… | Ejemplo |
|---|---|---|
| `[attr]` | que **tienen** ese atributo (valga lo que valga) | `input[disabled]` |
| `[attr="valor"]` | cuyo atributo vale **exactamente** eso | `input[type="email"]` |
| `[attr^="valor"]` | cuyo atributo **empieza** por eso | `a[href^="https"]` |
| `[attr$="valor"]` | cuyo atributo **termina** en eso | `a[href$=".pdf"]` |
| `[attr*="valor"]` | cuyo atributo **contiene** eso en cualquier parte | `a[href*="youtube"]` |

> Truco para acordarse: `^` y `$` son los mismos símbolos que en las expresiones regulares: `^` = **principio**, `$` = **final**. Y `*` = "en cualquier sitio".

> Se pueden combinar con todo lo anterior: `.menu a[href^="https"]`, `input[type="email"][required]`…

## Vamos a verlo

Cread una carpeta (por ejemplo `11-atributos`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Selectores de atributo</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav>
      <a href="index.html" aria-current="page">Inicio</a>
      <a href="cafes.html">Cafés</a>
      <a href="contacto.html">Contacto</a>
    </nav>

    <h2>Enlaces de interés</h2>
    <ul>
      <li><a href="recetas.html">Nuestras recetas</a></li>
      <li><a href="https://developer.mozilla.org">MDN (externo)</a></li>
      <li><a href="catalogo.pdf">Catálogo completo</a></li>
      <li><a href="mailto:hola@cafe.com">Escríbenos</a></li>
    </ul>

    <h2>Suscríbete</h2>
    <form>
      <input type="text" placeholder="Tu nombre" />
      <input type="email" placeholder="tu@email.com" />
      <input type="text" value="España" disabled />
      <button>Enviar</button>
    </form>

    <h2>Productos</h2>
    <ul>
      <li class="producto" data-estado="disponible">Café de Etiopía</li>
      <li class="producto" data-estado="agotado">Café de Kenia</li>
      <li class="producto" data-estado="disponible">Café de Colombia</li>
    </ul>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

input,
button {
  font: inherit;
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
}
```

Fijaos en que **no hay ninguna clase** para distinguir los enlaces ni los campos. Todo lo vamos a sacar de sus atributos.

### Paso 1: `[attr]` — el campo desactivado

El campo "España" tiene el atributo `disabled` (no se puede editar). Queremos que **se note** que está desactivado:

_./styles.css_

```diff
+ input[disabled] {
+   background-color: #eee;
+   color: #888;
+   cursor: not-allowed;
+ }
```

Pasad el ratón por encima: el cursor cambia a "prohibido". No importa el valor del atributo, basta con que **esté**.

### Paso 2: `[attr="valor"]` — el campo de email

Queremos destacar el campo de email con un borde de color:

_./styles.css_

```diff
+ input[type="email"] {
+   border: 2px solid #b45309;
+ }
```

Solo el de email. Los `type="text"` no cambian.

### Paso 3: `^=` — enlaces externos

Queremos que los enlaces que **salen de nuestra web** lleven una flechita, para que el usuario sepa que se va a otro sitio. Los enlaces externos son los que **empiezan** por `http`:

_./styles.css_

```diff
+ a[href^="http"]::after {
+   content: " ↗";
+ }
```

> `::after` es el pseudo-elemento que asomamos en el 06: añade contenido **después** del contenido del elemento. Lo vemos a fondo en el 14.

Solo el enlace a MDN lleva la flecha. "Nuestras recetas" (`recetas.html`) no empieza por `http`, así que no.

#### ♿ Ojo con la accesibilidad del contenido generado

> ⏱️ **Muy interesante y muy recomendable**, pero puede que no nos dé tiempo a verlo en clase. Si es así, **no os lo saltéis**: leedlo en casa con calma (este apartado y el siguiente, "La opción más robusta"). La accesibilidad es de esas cosas que marcan la diferencia entre "funciona" y "está bien hecho", y la IA casi nunca la tiene en cuenta si no se lo pedís.

Lo que ponemos en `content` **no es solo visual**: la mayoría de lectores de pantalla **lo leen en voz alta** como si fuera parte del texto. Así que nuestro enlace se anunciaría como *"MDN externo, flecha hacia arriba a la derecha"*. Ruido.

Desde hace poco, `content` admite un **texto alternativo** después de una barra `/`, igual que el `alt` de una imagen:

_./styles.css_

```diff
  a[href^="http"]::after {
-   content: " ↗";
+   content: " ↗" / "(enlace externo)";
  }
```

- `/ ""` (alternativo vacío) → el símbolo es **decorativo**: se ve, pero el lector de pantalla lo ignora.
- `/ " (enlace externo)"` → se ve la flecha, pero se **lee** ese texto. Útil si la información importa.

Regla práctica:

- **Símbolo decorativo** (una flecha, un icono, un emoji) → alternativo vacío `/ ""`, o uno con texto si aporta información.
- **Texto útil** (como el "(PDF)" del paso siguiente) → dejadlo tal cual: que el lector de pantalla lo lea **está bien**, porque avisa de algo importante.
- **Información crítica** → mejor en el **HTML**, no en el CSS. El CSS es presentación; si se desactiva o falla, esa información desaparece.

> 🔮 ¿La barra `/` en `content` funciona en todos los navegadores? Otra buena pregunta para el 13 (Can I use). Si un navegador no la entiende, **ignora la línea entera** (03) y no pinta nada; por eso a veces se escribe dos veces: primero `content: " ↗";` y debajo `content: " ↗" / "";`. El que la entienda se queda con la segunda.

#### La opción más robusta: el texto en el HTML, oculto a la vista

El texto alternativo en `content` es moderno y no todos los lectores de pantalla lo tratan igual. La forma que funciona **en todas partes** es poner la información en el **HTML**, dentro del enlace, y ocultarla **solo visualmente**:

_./index.html_

```html
<a href="https://developer.mozilla.org">
  MDN <span class="sr-only">(enlace externo)</span>
</a>
```

_./styles.css_

```css
/* Oculto a la vista, pero el lector de pantalla SÍ lo lee */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

- `sr-only` = *screen reader only* (solo para lectores de pantalla).
- ¿Por qué no `display: none`? Porque, como vimos en el 09, `display: none` lo oculta **también** al lector de pantalla. Aquí queremos lo contrario: que **no se vea** pero **se lea**. Por eso el truco: una caja de 1px, recortada y sacada del flujo (`position: absolute`, lo vemos en el 16).
- No hace falta memorizar esa regla: es una receta estándar que se copia. **Tailwind la trae de serie**: la clase `sr-only`.

Lo ideal es **combinar** las dos cosas: la flecha en CSS como **decorativa** (`content: " ↗" / ""`) para quien ve la pantalla, y el `<span class="sr-only">` en el HTML para quien usa lector de pantalla. Cada uno recibe la información por su canal.

> ⚖️ El precio: hay que acordarse de poner el `<span>` en **cada** enlace externo, así que perdemos parte de la magia del selector de atributo ("se aplica solo"). En un proyecto con React, eso se resuelve con un componente `<EnlaceExterno>` que lo añade siempre.

### Paso 4: `$=` — enlaces a PDF

Los enlaces que **terminan** en `.pdf` descargan un fichero. Avisemos:

_./styles.css_

```diff
+ a[href$=".pdf"]::after {
+   content: " (PDF)";
+   font-size: 0.8em;
+   color: #888;
+ }
```

### Paso 5: otro `^=` — enlaces de email

Los enlaces de email empiezan por `mailto:`. Les ponemos un sobre delante:

_./styles.css_

```diff
+ a[href^="mailto:"]::before {
+   content: "✉️ " / "";
+ }
```

El sobre es decorativo (el texto "Escríbenos" ya se entiende), así que le ponemos alternativo vacío, como a la flecha.

Probad a añadir en el HTML **otro** enlace externo o **otro** PDF: el estilo se le aplica **solo**, sin tocar el CSS ni poner clases.

### Paso 6: la opción activa del menú (`aria-current`)

En el `nav`, el enlace "Inicio" tiene `aria-current="page"`: es un atributo de **accesibilidad** que le dice al lector de pantalla "esta es la página en la que estás". Ya que está ahí, lo aprovechamos para el estilo:

_./styles.css_

```diff
+ nav a[aria-current="page"] {
+   font-weight: bold;
+   color: #3b2412;
+   text-decoration: none;
+   border-bottom: 2px solid #b45309;
+ }
```

Un solo atributo sirve para **dos cosas**: accesibilidad y estilo. Mejor que una clase `activo`, que solo sirve para lo segundo.

### Paso 7: atributos `data-*` — el producto agotado

Los atributos que empiezan por **`data-`** son atributos **inventados por nosotros**: el HTML permite crear los que queramos (`data-estado`, `data-precio`, `data-lo-que-sea`) para guardar información en el elemento. Se usan mucho desde JavaScript… y también desde CSS:

_./styles.css_

```diff
+ .producto[data-estado="agotado"] {
+   color: #aaa;
+   text-decoration: line-through;
+ }
```

El café de Kenia aparece tachado y en gris. Cambiad en el HTML `data-estado="agotado"` por `"disponible"` y vuelve a la normalidad: el estado del producto está en **un sitio** (el HTML) y el CSS reacciona a él.

> 💡 **Esto lo veréis muchísimo en React.** Librerías de componentes como Radix o shadcn/ui marcan el estado con atributos: `data-state="open"`, `data-disabled`, `aria-expanded="true"`… Y en **Tailwind** se estiliza así: `data-[state=open]:bg-white`, `aria-[current=page]:font-bold`. Por debajo, son selectores de atributo.

## Para ampliar

- [MDN · Selectores de atributo](https://developer.mozilla.org/es/docs/Web/CSS/Attribute_selectors)
- [MDN · Atributos data-*](https://developer.mozilla.org/es/docs/Learn/HTML/Howto/Use_data_attributes)
- [MDN · aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current) (en inglés)
