# 12 · Pseudo-clases

> ⏱️ ~25 min

## Seleccionar por el **estado**, no solo por lo que es

Hasta ahora hemos elegido elementos por **lo que son** (`p`, `.nota`), por **dónde están** (`.menu a`) o por **sus atributos** (`[type="email"]`). Pero hay cosas que **no están escritas en el HTML**:

- ¿Tiene el **ratón encima**?
- ¿Tiene el **foco** (el usuario ha llegado a él con el tabulador)?
- ¿Es el **primero** de su lista? ¿El **tercero**? ¿Uno **par**?
- ¿La casilla está **marcada**? ¿El email que ha escrito es **válido**?

Eso son **estados** y **posiciones** que cambian mientras el usuario usa la página. Para seleccionarlos existen las **pseudo-clases**: se escriben con **dos puntos** detrás del selector.

```css
a:hover {
  color: crimson;
}
```

"Los enlaces… **cuando** tienen el ratón encima."

> Ojo: **un** dos puntos (`:hover`) = pseudo-clase. **Dos** dos puntos (`::after`) = pseudo-elemento, que es otra cosa (el 14).

## Las más usadas

| Grupo | Pseudo-clase | Se aplica cuando… |
|---|---|---|
| **Interacción** | `:hover` | el ratón está encima |
| | `:focus` | el elemento tiene el foco (clic o tabulador) |
| | `:focus-visible` | tiene el foco **y** conviene mostrarlo (sobre todo con teclado) |
| | `:active` | se está pulsando (mientras mantienes el clic) |
| | `:visited` | el enlace ya se ha visitado (¿os acordáis del enlace morado del 10?) |
| **Formularios** | `:disabled` | el campo está desactivado |
| | `:checked` | la casilla o el radio están marcados |
| | `:valid` / `:invalid` | el valor cumple (o no) lo que pide el campo |
| **Posición** | `:first-child` / `:last-child` | es el primer / último hijo de su padre |
| | `:nth-child(…)` | ocupa la posición que le digamos (2, par, impar, cada 3…) |
| **Lógica** | `:not(…)` | **no** cumple lo de dentro |
| | `:has(…)` | **contiene** algo que cumple lo de dentro |

## Vamos a verlo

Cread una carpeta (por ejemplo `12-pseudoclases`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pseudo-clases</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav class="menu">
      <a href="#">Inicio</a>
      <a href="#">Cafés</a>
      <a href="#">Contacto</a>
    </nav>

    <h2>Nuestros cafés</h2>
    <table class="tabla">
      <thead>
        <tr>
          <th>Origen</th>
          <th>Tueste</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Etiopía</td><td>Claro</td><td>12,90 €</td></tr>
        <tr><td>Colombia</td><td>Medio</td><td>10,50 €</td></tr>
        <tr><td>Brasil</td><td>Medio</td><td>9,80 €</td></tr>
        <tr><td>Kenia</td><td>Claro</td><td>14,20 €</td></tr>
        <tr><td>Sumatra</td><td>Oscuro</td><td>11,00 €</td></tr>
        <tr><td>Guatemala</td><td>Medio</td><td>12,00 €</td></tr>
      </tbody>
    </table>

    <h2>Tu pedido</h2>
    <form>
      <input type="email" placeholder="tu@email.com" required />

      <label class="opcion"><input type="checkbox" /> Con leche</label>
      <label class="opcion"><input type="checkbox" /> Con azúcar</label>

      <button type="button">Pedir</button>
    </form>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem;
}

.menu a {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #3b2412;
  text-decoration: none;
  border-radius: 6px;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  text-align: left;
  padding: 0.5rem;
}

input,
button {
  font: inherit;
  padding: 0.25rem 0.5rem;
}

.opcion {
  display: block;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #e0d6cc;
  border-radius: 6px;
}
```

> `border-collapse: collapse` hace que las celdas de la tabla compartan borde en vez de tener cada una el suyo. Es un detalle de tablas; no le deis más vueltas.

### Paso 1: `:hover` — el menú reacciona al ratón

¿Os acordáis de la promesa del 10? Queremos que la opción del menú **cambie de color al pasar el ratón**:

_./styles.css_

```diff
  .menu a {
    display: inline-block;
    padding: 0.5rem 1rem;
    color: #3b2412;
    text-decoration: none;
    border-radius: 6px;
  }
+
+ .menu a:hover {
+   background-color: #3b2412;
+   color: white;
+ }
```

Pasad el ratón por las opciones. Fijaos en que la regla de `:hover` solo cambia **lo que cambia**: el padding, el radio, etc. siguen viniendo de `.menu a`.

👉 **DevTools**: seleccionad un `<a>` del menú → en **Styles**, botón **`:hov`** → marcad `:hover`. El navegador **simula** que el ratón está encima y podéis retocar el estilo sin tener que mantener el ratón quieto. (Lo mismo sirve para `:focus`, `:active`…)

### Paso 2: `:focus-visible` — ¿y si no uso ratón?

Haced clic en la barra de direcciones y pulsad **Tab** varias veces: vais saltando por los enlaces, el campo, las casillas y el botón. El navegador marca el elemento activo con un **contorno** (el *outline* de foco).

Mucha gente lo quita porque "queda feo" (`outline: none`)… y deja la web **inutilizable** para quien navega con teclado. Nunca lo quitéis sin poner otro a cambio. Mejor, **personalizadlo**:

_./styles.css_

```diff
+ .menu a:focus-visible {
+   outline: 3px solid #b45309;
+   outline-offset: 2px;
+ }
```

Volved a navegar con **Tab**: ahora el foco se ve con nuestro color. Y si hacéis **clic** con el ratón, no aparece. Esa es la diferencia:

- `:focus` → cuando tiene el foco, **venga de donde venga** (clic o teclado).
- `:focus-visible` → solo cuando el navegador cree que **hace falta verlo** (sobre todo con teclado). Es la que conviene usar para el contorno.

> `outline` es como un borde, pero **no ocupa espacio** (no mueve nada) y va por fuera de la caja. `outline-offset` lo separa un poco.

### Paso 3: `:active` — el botón se "hunde"

Queremos que el botón dé una pequeña sensación de estar pulsado **mientras** se hace clic:

_./styles.css_

```diff
+ button:active {
+   transform: scale(0.95);
+ }
```

Mantened pulsado el botón: se encoge un poquito. Al soltar, vuelve. (El botón lleva `type="button"` para que al pulsarlo no envíe el formulario y recargue la página.)

> `transform: scale(0.95)` lo dibuja al 95% de su tamaño. Es de otra familia de propiedades (transformaciones) que no vemos hoy; aquí solo nos importa el `:active`.

### Paso 4: `:nth-child` — la tabla cebra

Con 6 filas, en la tabla cuesta seguir con la vista qué precio va con qué café. El truco clásico: **filas alternas** de otro color.

_./styles.css_

```diff
+ .tabla tbody tr:nth-child(even) {
+   background-color: #f5f0eb;
+ }
```

`even` = pares (2.ª, 4.ª, 6.ª…). También vale `odd` (impares). Y se puede usar una **fórmula** con `n`, que va valiendo 0, 1, 2, 3…:

| Selector | Filas | Por qué |
|---|---|---|
| `:nth-child(2)` | solo la 2.ª | un número fijo |
| `:nth-child(2n)` = `even` | 2, 4, 6… | 2·1, 2·2, 2·3… |
| `:nth-child(2n+1)` = `odd` | 1, 3, 5… | 2·0+1, 2·1+1… |
| `:nth-child(3n)` | 3, 6, 9… | cada 3 |
| `:nth-child(-n+3)` | 1, 2, 3 | "las 3 primeras" |

Probad a cambiar `even` por `3n`, y luego por `-n+3`. Volved a `even`.

Y para rematar la tabla, un `:hover` en las filas para saber en cuál estás:

```diff
+ .tabla tbody tr:hover {
+   background-color: #fef3c7;
+ }
```

> 💡 Si os liais con las fórmulas: [nth-child tester](https://css-tricks.com/examples/nth-child-tester/) (en inglés) os las pinta.

### Paso 5: `:first-child`, `:last-child` y `:not()`

La cabecera de la tabla necesita destacar, y queremos una línea **debajo de cada fila… menos de la última** (quedaría una raya suelta al final):

_./styles.css_

```diff
+ .tabla th {
+   border-bottom: 2px solid #3b2412;
+ }
+
+ .tabla tbody tr:not(:last-child) {
+   border-bottom: 1px solid #e0d6cc;
+ }
```

`:not(:last-child)` = "todos los que **no** son el último". Es la versión al revés del truco `li + li` del 10 (aquel era "todos menos el **primero**").

Y la primera columna (el nombre del café), en negrita:

```diff
+ .tabla td:first-child {
+   font-weight: bold;
+ }
```

`td:first-child` = "las celdas que son **la primera** de su fila".

### Paso 6: formularios — `:focus`, `:valid`, `:invalid`

> ⏱️ Si vamos justos, este paso se puede ver rápido o dejar para casa.

Queremos que el campo de email **se ilumine** cuando estás escribiendo en él, y que diga con color si el email es **válido**:

_./styles.css_

```diff
+ input:focus {
+   outline: 2px solid #2563eb;
+   outline-offset: 2px;
+ }
+
+ input[type="email"]:valid {
+   border: 2px solid #15803d;
+ }
+
+ input[type="email"]:invalid {
+   border: 2px solid #dc2626;
+ }
```

> Para el foco usamos **azul** y separado del campo (`outline-offset`), para que no se confunda con el verde de válido ni con el rojo de inválido: el foco dice "estás aquí", el borde dice "esto está bien / mal". Son dos informaciones distintas y conviene que se vean distintas.

> Usamos `input[type="email"]` (lo del 11) para que el color solo afecte al campo de email y no a las casillas, que también son `input`.

Escribid `hola` en el campo: rojo. Escribid `hola@cafe.com`: verde. El navegador **ya sabe** validar un `type="email"`; nosotros solo le ponemos color.

🤔 Pero fijaos: **nada más cargar la página** el campo ya sale en rojo, antes de escribir nada. Como tiene `required` y está vacío, es "no valido". Regañar al usuario antes de que haga nada queda fatal.

Para eso existe una pseudo-clase más moderna, **`:user-invalid`**: solo se activa **después** de que el usuario haya interactuado con el campo.

```diff
- input[type="email"]:invalid {
+ input[type="email"]:user-invalid {
    border: 2px solid #dc2626;
  }
```

> 🔮 ¿Funciona `:user-invalid` en todos los navegadores? Buena pregunta para el 13 (Can I use).

### Paso 7: `:has()` — el padre que mira a sus hijos

Tenemos dos opciones con casilla ("Con leche", "Con azúcar"). Queremos que la **opción entera** (la caja del `label`) se destaque cuando su casilla está marcada:

```html
<label class="opcion"><input type="checkbox" /> Con leche</label>
```

El problema: el que se marca es el `input`, pero el que queremos pintar es el **`label`, su padre**. Y con todo lo que hemos visto hasta ahora, CSS solo sabe ir **hacia abajo** (de padres a hijos) o hacia los hermanos de después, **nunca hacia arriba**.

Durante **años** fue la funcionalidad más pedida de CSS: el "selector de padre". Hoy existe, y se llama `:has()`:

_./styles.css_

```diff
+ .opcion:has(input:checked) {
+   background-color: #fef3c7;
+   border-color: #b45309;
+ }
```

"Las `.opcion` que **contienen** un `input` **marcado**." Marcad y desmarcad las casillas: la caja entera cambia. Sin una línea de JavaScript.

> 🔮 Siendo tan nuevo… ¿se puede usar ya? Lo comprobamos en el 13.

> 💡 **En Tailwind** todas estas pseudo-clases son prefijos: `hover:bg-black`, `focus-visible:outline`, `active:scale-95`, `even:bg-gray-100`, `first:font-bold`, `disabled:opacity-50`, `has-[:checked]:bg-yellow-100`… Ahora sabéis qué CSS hay detrás de cada uno.

## Para ampliar

- [MDN · Pseudo-clases](https://developer.mozilla.org/es/docs/Web/CSS/Pseudo-classes): la lista completa.
- [MDN · :has()](https://developer.mozilla.org/es/docs/Web/CSS/:has)
- [MDN · :focus-visible](https://developer.mozilla.org/es/docs/Web/CSS/:focus-visible)
- [CSS-Tricks · nth-child tester](https://css-tricks.com/examples/nth-child-tester/) (en inglés)
