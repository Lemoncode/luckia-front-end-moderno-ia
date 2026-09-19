# 05 · Valores, unidades y variables

> ⏱️ ~25 min

Hasta ahora hemos escrito valores como `#333`, `20px` o `1.6` sin pararnos a pensar. Vamos a ver qué tipos de valores hay y, sobre todo, **qué unidad usar en cada caso**.

## Tipos de valores

| Tipo                         | Ejemplos                                       |
| ---------------------------- | ---------------------------------------------- |
| Palabras clave               | `bold`, `none`, `auto`, `center`, `sans-serif` |
| Números sin unidad           | `line-height: 1.6`, `font-weight: 700`, `0`    |
| Longitudes (número + unidad) | `16px`, `1.5rem`, `2em`, `100vh`               |
| Porcentajes                  | `width: 50%`                                   |
| Colores                      | `crimson`, `#b45309`, `rgb(180 83 9)`          |
| Funciones                    | `calc(100% - 2rem)`, `var(--color-primario)`   |

> El `0` no necesita unidad: `margin: 0` es lo mismo que `margin: 0px`.

## Colores

```css
color: crimson; /* nombre: hay ~140, útiles para pruebas */
color: #b45309; /* hexadecimal: rojo, verde, azul (00 a ff) */
color: #333; /* abreviado: #333 = #333333 */
color: rgb(180 83 9); /* rojo, verde, azul (0 a 255) */
color: rgb(180 83 9 / 50%); /* …con 50% de transparencia */
color: hsl(30 90% 37%); /* tono, saturación, luminosidad */
```

- En el día a día veréis sobre todo **hex** (lo que os pasa diseño) y **rgb/hsl** cuando hace falta transparencia.
- `hsl` es el más "humano": para un tono más claro, subes la luminosidad.
- **Nota para alumno para jugar después** No hace falta calcular los códigos a mano: DevTools trae un **selector de color**.
  1. F12 → **Elements** → seleccionad un elemento que tenga color (por ejemplo, el `body`).
  2. En el panel **Styles**, al lado de cada valor de color (`color: #333`) aparece un **cuadradito relleno de ese color**.
  3. Clic en el cuadradito → se abre una paleta para elegir el color con el ratón, con cuentagotas para copiar cualquier color de la página.
  4. **Shift + clic** en el cuadradito cambia el formato: hex → rgb → hsl.

  Ojo: los cambios en DevTools son **temporales**. Al recargar se pierden; si os gusta el color, copiad el valor a vuestro `styles.css`.

## Unidades de longitud

### `px`: absoluta

- Un píxel "de CSS". Siempre mide lo mismo, pase lo que pase.
- Buena para **detalles finos**: bordes (`1px`), sombras, radios pequeños.

### `rem`: relativa a la raíz ⭐

- `1rem` = el tamaño de letra del elemento raíz (`<html>`). Por defecto, **16px**.
- `1.5rem` = 24px, `0.75rem` = 12px…
- **La unidad recomendada para tamaños de letra.** ¿Por qué no `px`? Porque hay usuarios que ponen la letra del navegador más grande (vista cansada, baja visión). Con `rem` la web respeta esa preferencia; con `px`, **la ignora**.

### `em`: relativa a la letra del propio elemento

- `1em` = el tamaño de letra **del elemento**… y si la usas en el propio `font-size`, el del **padre**.
- Útil para cosas que deben **crecer con su texto**: el padding de un botón, el tamaño de un icono junto a un texto.
- ⚠️ Cuidado en `font-size`: se **multiplica** en elementos anidados (lo veremos en la práctica).

### `%`: relativa al padre

- `width: 50%` = la mitad del ancho del contenedor padre.

### `vw` / `vh`: relativas a la ventana (_viewport_)

- `100vw` = todo el ancho de la ventana. `100vh` = todo el alto.
- Para secciones que ocupan la pantalla completa.
- 📱 En móvil, `100vh` a veces queda tapado por la barra del navegador. Para eso existe **`100dvh`** (_dynamic viewport height_), que se ajusta cuando la barra aparece y desaparece.

### `ch`: el ancho de un carácter

- `1ch` ≈ el ancho del carácter "0" en la fuente actual.
- Truco de legibilidad: `max-width: 65ch` → líneas de unos 65 caracteres, que es lo cómodo para leer.

### Resumen: ¿qué uso?

| Para…                        | Usad                                       |
| ---------------------------- | ------------------------------------------ |
| Tamaños de letra             | `rem`                                      |
| Espaciados (margin, padding) | `rem` (o `em` si debe crecer con el texto) |
| Bordes, sombras              | `px`                                       |
| Anchos                       | `%`, `ch` para texto, `max-width`          |
| Pantalla completa            | `vh`, mejor `dvh`                          |
| Interlineado                 | sin unidad (`1.6`)                         |

## `calc()`: mezclar unidades

```css
width: calc(100% - 2rem);
```

El 100% del padre **menos** 2rem. Se pueden mezclar unidades distintas: eso es lo potente.

## Variables CSS (_custom properties_)

Imaginad que el color principal de la web (`#b45309`) está escrito en 40 sitios y diseño decide cambiarlo…

```css
:root {
  --color-primario: #b45309;
  --color-texto: #333;
}

a {
  color: var(--color-primario);
}

.boton {
  background-color: var(--color-primario);
}
```

- Se declaran con **dos guiones** delante: `--nombre`.
- Se usan con `var(--nombre)`.
- `:root` es el elemento raíz (`<html>`). Declarándolas ahí, están disponibles **en toda la página**.
- Se puede poner un valor de reserva: `var(--color-primario, orange)`.
- Cambias el valor en **un** sitio y cambia en toda la web.

> 💡 Esto es lo que hay debajo de los **design tokens** de un sistema de diseño y del tema de **Tailwind**: la paleta de colores, los tamaños, los espaciados… son variables CSS.

## 🛠️ Práctica

### 0. Punto de partida

Cread una carpeta `05-unidades` con estos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Unidades</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="portada">
      <h1>Café &amp; Código</h1>
      <p>Una web sobre café hecha con CSS.</p>
    </header>

    <main>
      <p class="texto">
        Preparar un buen café no requiere una cafetera de mil euros. Con café
        recién molido, agua a la temperatura adecuada y un poco de paciencia
        puedes conseguir en casa una taza mucho mejor que la de la máquina de la
        oficina. La clave está en la proporción, la molienda y, sobre todo, en
        probar hasta dar con tu punto.
      </p>

      <ul class="lista">
        <li>
          Métodos
          <ul>
            <li>
              Filtro
              <ul>
                <li>V60</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>

      <button class="boton">Suscribirme</button>
      <button class="boton boton-grande">Suscribirme</button>
    </main>
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

### 1. `px` vs `rem`: respetar al usuario

_./styles.css_

```diff
+ h1 {
+   font-size: 40px;
+ }
+
+ .texto {
+   font-size: 16px;
+ }
```

> La clase h1 aplica elemento, y `.texto` lo usamos en el html en un parrafo

Ahora cambiad el tamaño de letra **del navegador**:

- Chrome: _Configuración → Aspecto → Tamaño de fuente → Muy grande_.
- Firefox: _Ajustes → General → Tipografía → Tamaño_.

Recargad: **no cambia nada**. Los `px` ignoran la preferencia del usuario. Pasadlo a `rem`:

```diff
  h1 {
-   font-size: 40px;
+   font-size: 2.5rem;
  }

  .texto {
-   font-size: 16px;
+   font-size: 1rem;
  }
```

Recargad: ahora **sí** crece. Dejad el tamaño del navegador como estaba.

> ¿Y el zoom (Ctrl/Cmd +)? El zoom lo agranda **todo**, píxeles incluidos. La preferencia de tamaño de letra es otra cosa, y es la que rompen los `px`.

### 2. El peligro de `em`: se multiplica

En el HTML tenemos una lista con tres niveles, una dentro de otra:

_./index.html_

```html
<ul class="lista">
  <li>
    Métodos
    <ul>
      <li>
        Filtro
        <ul>
          <li>V60</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

Queremos que el texto de la lista sea un poco más grande que el normal (un 20% más). Probamos con `em`:

_./styles.css_

```diff
+ .lista li {
+   font-size: 1.2em;
+ }
```

> `.lista li` significa "los `li` que están **dentro** de `.lista`". Lo vemos en el 10.

Cada nivel de la lista es más grande que el anterior: `1.2 × 1.2 × 1.2…` porque `em` se calcula sobre el padre, que ya había crecido. Cambiad `1.2em` por `1.2rem`: ahora todos miden igual, porque `rem` siempre mira a la raíz.

### 3. Donde `em` brilla: botones

Al final del `main` tenemos dos botones. Los dos tienen la clase `boton`, y el segundo además `boton-grande`:

_./index.html_

```html
<button class="boton">Suscribirme</button>
<button class="boton boton-grande">Suscribirme</button>
```

Queremos que los dos tengan el mismo estilo, pero que el segundo sea más grande. Primero lo hacemos "a lo normal": `rem` para la letra y `px` para el resto.

_./styles.css_

```diff
+ .boton {
+   font-size: 1rem;
+   padding: 8px 16px;
+   background-color: #b45309;
+   color: white;
+   border: none;
+   border-radius: 8px;
+ }
+
+ .boton-grande {
+   font-size: 1.5rem;
+ }
```

> `padding: 8px 16px` = 8px arriba y abajo, 16px a los lados. Estas formas cortas las vemos en el 07.

Mirad el botón grande: la **letra ha crecido**, pero el padding y el redondeo **siguen igual**. Se ve apretado, como si el texto no cupiera. Tendríamos que ajustar a mano el padding y el radio de cada tamaño de botón…

Ahora cambiamos los `px` por `em`:

```diff
  .boton {
    font-size: 1rem;
-   padding: 8px 16px;
+   padding: 0.5em 1em;
    background-color: #b45309;
    color: white;
    border: none;
-   border-radius: 8px;
+   border-radius: 0.5em;
  }
```

> Si prueba a cambiar el fon-size de boton-grande a 4rem se ve más el efecto

El botón normal se ve **igual** que antes (con letra de 16px, `0.5em` = 8px y `1em` = 16px). Pero el grande ahora tiene el **padding y el redondeo en proporción**, sin tocar nada más. Eso es `em`: crece con su propio texto.

### 4. `vh`: portada a pantalla completa

Al principio del HTML tenemos una cabecera con el nombre de la web:

_./index.html_

```html
<header class="portada">
  <h1>Café &amp; Código</h1>
  <p>Una web sobre café hecha con CSS.</p>
</header>
```

Ahora mismo mide solo lo que ocupa su texto. Queremos que sea una **portada**: que ocupe **toda la pantalla** al entrar en la web y que el contenido aparezca al hacer scroll. No sabemos cuánto mide la pantalla de cada usuario… pero `vh` sí:

_./styles.css_

```diff
+ .portada {
+   min-height: 100vh;
+   background-color: #3b2412;
+   color: white;
+ }
```

`100vh` = el 100% del alto de la ventana. La portada ocupa **toda la pantalla**; haced scroll para ver el resto. Probad a cambiar el tamaño de la ventana: la portada se adapta.

> Si queréis podemo dejarla en 20vh o quitarla

### 5. `ch`: texto que se lee bien

Dentro del `main` tenemos un párrafo largo con la clase `texto` (el mismo al que le pusimos el `font-size` en el paso 1):

_./index.html_

```html
<p class="texto">
  Preparar un buen café no requiere una cafetera de mil euros. Con café
  recién molido, agua a la temperatura adecuada y un poco de paciencia…
</p>
```

Haced la ventana muy ancha: el párrafo se estira de lado a lado y, al acabar cada línea, cuesta encontrar el principio de la siguiente. Queremos limitar su ancho a algo cómodo de leer, **sea cual sea el tamaño de la ventana**:

_./styles.css_

```diff
  .texto {
    font-size: 1rem;
+   max-width: 65ch;
  }
```

Ahora, por ancha que sea la ventana, las líneas no pasan de unos 65 caracteres.

### 6. Variables: cambiar la paleta en un segundo

Repasad el `styles.css`: tenemos los colores escritos a mano en varios sitios (`#333` en el `body`, `#b45309` en el botón, `#3b2412` en la portada). En una web real serían decenas de sitios. Si diseño decide cambiar el color principal, toca buscarlos todos…

Vamos a pasar los colores a variables:

_./styles.css_

```diff
+ :root {
+   --color-primario: #b45309;
+   --color-oscuro: #3b2412;
+   --color-texto: #333;
+ }
+
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
-   color: #333;
+   color: var(--color-texto);
  }
  ...
  .boton {
    ...
-   background-color: #b45309;
+   background-color: var(--color-primario);
  }
  ...
  .portada {
    ...
-   background-color: #3b2412;
+   background-color: var(--color-oscuro);
  }
```

Ahora cambiad `--color-primario` a `#0f766e` (verde azulado) y `--color-oscuro` a `#134e4a`: **toda la web** cambia de tema tocando dos líneas.

Extra: abrid DevTools → Elements → clic en `<html>` → en Styles, cambiad el valor de la variable en directo y ved cómo se actualiza todo.

## Para ampliar

- [MDN · Valores y unidades CSS](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Values_and_units)
- [MDN · Colores en CSS](https://developer.mozilla.org/es/docs/Web/CSS/color_value)
- [MDN · Propiedades personalizadas (variables)](https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties)
- [Josh W. Comeau · The Surprising Truth About Pixels and Accessibility](https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/): por qué `rem` y no `px`, muy bien explicado (en inglés).
