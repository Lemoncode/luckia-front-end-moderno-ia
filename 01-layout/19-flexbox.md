# 19 · Flexbox

> ⏱️ ~40 min · La recompensa del día: por fin colocamos cajas **unas al lado de otras**.

## Por qué existe

Llevamos toda la sesión con cajas que se apilan (block) o que van en línea como palabras (inline). Para cosas como:

- una **barra de navegación** con el logo a la izquierda y el menú a la derecha,
- tres **tarjetas** en fila, **todas del mismo alto**,
- algo **centrado** en horizontal **y en vertical**,

…no teníamos herramienta. Durante años esto se hacía con trucos (`float`, `inline-block`, tablas) y el centrado vertical era el chiste recurrente de la profesión.

**Flexbox** (_flexible box layout_) está pensado justo para eso: colocar un grupo de elementos **en una dirección**, repartiendo el espacio entre ellos.

> **¿Flexbox o grid?** Regla rápida: **una dirección** (una fila **o** una columna) → **flexbox**. **Dos a la vez** (filas **y** columnas alineadas, como una cuadrícula) → **CSS grid**, que veréis en otra sesión.

## Las dos piezas

```css
.contenedor {
  display: flex; /* ← esto convierte a sus HIJOS en "flex items" */
}
```

- El **contenedor** (el padre) decide **cómo se reparten** sus hijos.
- Los **items** (los hijos directos) pueden ajustar **su** comportamiento individual.
- Ojo: solo afecta a los **hijos directos**, no a los nietos.

Y dos ejes:

```
flex-direction: row (por defecto)

  eje principal  ──────────────────────────────→
  ┌─────┐  ┌─────┐  ┌─────┐                    │ eje
  │  1  │  │  2  │  │  3  │                    │ secundario
  └─────┘  └─────┘  └─────┘                    ↓
```

Con `flex-direction: column`, los ejes se **intercambian**: el principal pasa a ser el vertical.

```
flex-direction: column

  eje secundario ──────→
  ┌─────┐              │
  │  1  │              │
  └─────┘              │
  ┌─────┐              │ eje
  │  2  │              │ principal
  └─────┘              │
  ┌─────┐              │
  │  3  │              │
  └─────┘              ↓
```

👉 Quedaos con esos dos nombres: **eje principal** y **eje secundario**. Las propiedades que vienen ahora no hablan de "horizontal" ni "vertical", sino de estos dos ejes. Así una misma propiedad sirve tanto si los items van en fila como si van en columna: lo único que cambia es hacia dónde apunta cada eje.

## Las propiedades que usaréis el 90% de las veces

**En el contenedor:**

| Propiedad         | Para qué                         | Valores habituales                                                      |
| ----------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `display: flex`   | Activar flexbox                  |                                                                         |
| `flex-direction`  | Dirección del eje principal      | `row` (defecto), `column`                                               |
| `gap`             | **Separación** entre items       | `1rem`, `0.5rem 1rem`                                                   |
| `justify-content` | Repartir en el **eje principal** | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` |
| `align-items`     | Alinear en el **eje secundario** | `stretch` (defecto), `center`, `flex-start`, `flex-end`                 |
| `flex-wrap`       | ¿Pueden saltar de línea?         | `nowrap` (defecto), `wrap`                                              |

**En los items:**

| Propiedad        | Para qué                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `flex: 1`        | "Reparte el espacio sobrante conmigo" (todos los `flex: 1` acaban igual de anchos)                                       |
| `flex: 0 0 auto` | "Déjame como estoy": ni crezco si sobra sitio ni encojo si falta (útil para un logo o un botón que no se deben deformar) |
| `align-self`     | Alinear **este** item distinto de sus hermanos                                                                           |

## Vamos a verlo

Cread una carpeta (por ejemplo `19-flexbox`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

Una cabecera con logo y menú, una portada y tres tarjetas de producto:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Flexbox</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="cabecera">
      <strong class="logo">Café &amp; Código</strong>
      <nav class="menu">
        <a href="#">Inicio</a>
        <a href="#">Cafés</a>
        <a href="#">Contacto</a>
      </nav>
    </header>

    <section class="portada">
      <h1>El mejor café, en tu casa</h1>
    </section>

    <section class="tarjetas">
      <article class="tarjeta">
        <h2>Etiopía</h2>
        <p>Notas florales y afrutadas. Tueste claro, ideal para filtro.</p>
        <p class="precio">12,90 €</p>
      </article>

      <article class="tarjeta">
        <h2>Colombia</h2>
        <p>
          Chocolate y caramelo, con mucho cuerpo. Un clásico que nunca falla,
          perfecto para espresso con leche.
        </p>
        <p class="precio">10,50 €</p>
      </article>

      <article class="tarjeta">
        <h2>Sumatra</h2>
        <p>Tueste oscuro y notas terrosas.</p>
        <p class="precio">11,00 €</p>
      </article>
    </section>
  </body>
</html>
```

_./styles.css_

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}

.cabecera {
  padding: 1rem;
  background-color: #3b2412;
  color: white;
}

.menu a {
  color: white;
  text-decoration: none;
}

.portada {
  background-color: #f5f0eb;
  min-height: 50vh;
  padding: 1rem;
}

.tarjetas {
  padding: 1rem;
}

.tarjeta {
  border: 1px solid #e0d6cc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.precio {
  font-weight: bold;
  color: #b45309;
}
```

Ahora mismo **todo se apila**: el logo encima del menú, los enlaces pegados unos a otros, las tarjetas una debajo de otra. Vamos a arreglarlo.

### Paso 1: el menú en fila

Los tres enlaces del `nav` están pegados (son `inline`). Los ponemos en fila con separación:

_./styles.css_

```diff
+ .menu {
+   display: flex;
+   gap: 1.5rem;
+ }
```

👉 **DevTools**: en **Elements**, al lado del `<nav class="menu">` aparece ahora una etiqueta **`flex`**. Pulsadla: el navegador **dibuja las guías** del contenedor sobre la página. Y en **Styles**, junto a `display: flex`, hay un iconito que abre un panel para probar las alineaciones a golpe de clic.

> `gap` es **la** forma moderna de separar cosas. ¿Os acordáis del consejo del 06 ("el componente no debería llevar margen hacia fuera")? Aquí está la alternativa: la separación la pone **el contenedor**, no los hijos.

### Paso 2: logo a la izquierda, menú a la derecha

La cabecera tiene **dos hijos**: el nombre de la web (el `<strong class="logo">`, que aquí hace de logo: es texto, no una imagen) y el `<nav class="menu">` que acabamos de poner en fila.

NO COPIAR ESTE CÓDIGO, ESTE DE REFERENCIA

```html
<header class="cabecera">
  <strong class="logo">Café &amp; Código</strong>
  <!-- hijo 1 -->
  <nav class="menu">…</nav>
  <!-- hijo 2 -->
</header>
```

Ahora mismo, al ser dos bloques, se apilan:

```
┌─────────────────────────────────────────────────┐
│ Café & Código                                   │
│ Inicio   Cafés   Contacto                       │
└─────────────────────────────────────────────────┘
```

Y lo que queremos es esto: el nombre pegado a la izquierda, el menú pegado a la derecha y los dos **centrados verticalmente** entre sí:

```
┌─────────────────────────────────────────────────┐
│ Café & Código            Inicio  Cafés  Contacto│
└─────────────────────────────────────────────────┘
  ↑                                              ↑
  pegado al principio              pegado al final
       └──── el espacio sobrante va EN MEDIO ────┘
```

_./styles.css_

```diff
  .cabecera {
+   display: flex;
+   justify-content: space-between;
+   align-items: center;
    padding: 1rem;
```

- `justify-content: space-between` → reparte el espacio sobrante **entre** los items: el primero pegado al principio, el último al final.
- `align-items: center` → los centra en el **otro** eje (el vertical).

Probad a cambiar `space-between` por `center`, `flex-end`, `space-around` y `space-evenly` para ver la diferencia.

### Paso 3: el famoso centrado vertical

La portada tiene un título arriba a la izquierda. Queremos el título **centrado en los dos ejes**:

_./styles.css_

```diff
  .portada {
+   display: flex;
+   justify-content: center;
+   align-items: center;
    background-color: #f5f0eb;
```

Tres líneas. Esto, hace 15 años, era **el** problema de CSS. 😄

> Truco mental: con `flex-direction: row`, `justify-content` es el **horizontal** y `align-items` el **vertical**. Con `column`, **al revés**. Por eso no se llaman "horizontal" y "vertical", sino "eje principal" y "eje secundario".

### Paso 4: las tarjetas en fila

_./styles.css_

```diff
  .tarjetas {
+   display: flex;
+   gap: 1rem;
    padding: 1rem;
  }
```

Las tres tarjetas se ponen en fila. Y fijaos en un detalle enorme: **las tres tienen el mismo alto**, aunque una tenga más texto que las otras. Es el valor por defecto de `align-items` (`stretch`): los items se estiran para igualar al más alto. Conseguir eso antes de flexbox era un dolor.

Ya podéis quitar el margen de las tarjetas, que ahora lo hace el `gap`:

```diff
  .tarjeta {
    border: 1px solid #e0d6cc;
    border-radius: 12px;
    padding: 1rem;
-   margin-bottom: 1rem;
  }
```

### Paso 5: que se repartan el espacio

Las tarjetas tienen anchos distintos (cada una mide lo que su contenido). Queremos que las tres ocupen **lo mismo**:

_./styles.css_

```diff
  .tarjeta {
+   flex: 1;
    border: 1px solid #e0d6cc;
```

`flex: 1` en todas = "repartíos el espacio a partes iguales".

`flex` es un shorthand (06) de tres propiedades:

|               | Qué significa                                    |
| ------------- | ------------------------------------------------ |
| `flex-grow`   | Cuánto **crece** si sobra espacio (0 = no crece) |
| `flex-shrink` | Cuánto **encoge** si falta (0 = no encoge)       |
| `flex-basis`  | Su tamaño **de partida**                         |

Así que `flex: 1` es `flex: 1 1 0` → "crece, encoge y parte de cero". Como las tres parten de cero y crecen lo mismo, acaban **iguales**.

> 📝 **Nota: los tres valores de `flex`, con calma**
>
> `flex` responde a **tres preguntas distintas**, y por eso son tres valores:
>
> ```
> flex: 1 1 16rem;
>       │ │   └── flex-basis:  ¿de qué tamaño PARTO?
>       │ └────── flex-shrink: si FALTA sitio, ¿encojo?
>       └──────── flex-grow:   si SOBRA sitio, ¿crezco?
> ```
>
> El navegador hace esto: coloca cada item con su **tamaño de partida**, mira si **sobra** o **falta** espacio en el contenedor, y reparte (o quita) según `grow` y `shrink`:
>
> ```
> Contenedor:  |--------------------------------|
> De partida:  [ A ][ B ][ C ]      sobra ▓▓▓▓▓▓▓
>
> flex-grow: 0 (nadie crece)
>              [ A ][ B ][ C ]      ▓▓▓▓▓▓▓ se queda vacío
>
> flex-grow: 1 en los tres (se reparten el sobrante)
>              [  A  ][  B  ][  C  ]
>
> flex-grow: 1 solo en B
>              [ A ][   B      ][ C ]
> ```
>
> Ejemplos típicos:
>
> | Valor                     | Se lee como…                                                   | Para qué                                                                            |
> | ------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
> | `flex: 1` (`1 1 0`)       | "parte de cero, crece y encoge"                                | Columnas **iguales**: las tarjetas del paso 5                                       |
> | `flex: auto` (`1 1 auto`) | "parte de tu contenido, crece y encoge"                        | Que se repartan el sobrante pero **respetando** que unos tienen más texto que otros |
> | `flex: none` (`0 0 auto`) | "déjame como estoy"                                            | Un **logo**, un icono, un botón que no se debe deformar                             |
> | `flex: 0 0 12rem`         | "mide 12rem y no te muevas"                                    | Una **columna lateral** de ancho fijo                                               |
> | (nada) = `flex: 0 1 auto` | "parte de tu contenido, no crezcas, pero encoge si hace falta" | El comportamiento **por defecto**                                                   |
>
> 👉 Ese último explica un despiste muy común: un botón o un título que **se aplastan** al estrechar la ventana. Como por defecto `flex-shrink` vale 1, encogen. La solución es `flex-shrink: 0` (o `flex: none`).
>
> 😌 **Y ahora, la buena noticia**: en el día a día no hay que darle tantas vueltas. Con **`flex: 1`** (reparte), **`flex: none`** (no me toques) y, como mucho, **`flex: 1 1 <ancho mínimo>`** (el del paso 6) se resuelve casi todo. El resto, cuando os haga falta, se mira en la chuleta de CSS-Tricks del final.

### Paso 6: que no se aplasten en el móvil

Haced la ventana estrecha (o modo móvil): las tarjetas se encogen hasta quedar ridículas, en tres columnas finísimas.

Queremos que, cuando no quepan, **salten de línea**:

_./styles.css_

```diff
  .tarjetas {
    display: flex;
+   flex-wrap: wrap;
    gap: 1rem;
```

```diff
  .tarjeta {
-   flex: 1;
+   flex: 1 1 16rem;
```

`flex: 1 1 16rem` = "crece, encoge, y parte de 16rem". Si no caben tres de 16rem, la última **baja** a la línea siguiente; si tampoco caben dos, se ponen en columna.

Cambiad el ancho de la ventana poco a poco: 3 tarjetas → 2 → 1. **Sin una sola media query.**

### Paso 7: alinear los precios abajo

Fijaos en los precios: cada uno está a una altura distinta, porque cada tarjeta tiene un texto de distinta longitud. Queremos que **todos los precios** queden abajo del todo, alineados.

La tarjeta también puede ser un contenedor flex… **en columna**:

_./styles.css_

```diff
  .tarjeta {
    flex: 1 1 16rem;
+   display: flex;
+   flex-direction: column;
    border: 1px solid #e0d6cc;
```

```diff
  .precio {
+   margin-top: auto;
    font-weight: bold;
```

`margin-top: auto` se come **todo el espacio sobrante** por arriba y empuja el precio al fondo. Es el mismo `auto` del `margin: 0 auto` del 06, pero en vertical.

> 👉 Este patrón (un contenedor flex en columna + `margin-top: auto` en lo último) es **la** forma de alinear los botones o los precios de una fila de tarjetas.

### Paso 8 (propina): empujar un solo item

En la cabecera, imaginad que añadís un enlace de "Entrar" que queréis pegado **al final**, separado del resto del menú:

_./index.html_

```diff
  <nav class="menu">
    <a href="#">Inicio</a>
    <a href="#">Cafés</a>
    <a href="#">Contacto</a>
+   <a href="#" class="entrar">Entrar</a>
  </nav>
```

_./styles.css_

```diff
  .menu {
    display: flex;
+   flex: 1;
    gap: 1.5rem;
  }
+
+ .entrar {
+   margin-left: auto;
+ }
```

El `margin: auto` vuelve a la carga: se come el espacio sobrante y empuja ese item (y solo ese) hacia el final.

> ⚠️ Fijaos en que hemos tenido que añadir `flex: 1` al menú. ¿Por qué? Porque `margin-left: auto` reparte el **espacio sobrante**… y si el menú mide justo lo que su contenido, **no sobra nada**. Con `flex: 1` el menú crece y ocupa todo el hueco libre de la cabecera, y entonces sí hay espacio que repartir. Quitad el `flex: 1` y lo veréis: "Entrar" se queda pegado a los demás.

## Lo que os queda por ver

- **`align-self`**: alinear **un** item distinto de sus hermanos.
- **`order`**: cambiar el orden visual sin tocar el HTML (⚠️ con cuidado: el teclado y los lectores de pantalla siguen el orden del HTML, así que puede desorientar).
- **CSS grid**: para cuadrículas de verdad, en dos dimensiones. Otra sesión.

> 💡 **En Tailwind** todo esto son clases directas: `flex`, `flex-col`, `gap-4`, `justify-between`, `items-center`, `flex-wrap`, `flex-1`, `ml-auto`… Si entendéis esta sección, entendéis el 80% del HTML que veréis en un proyecto con Tailwind.

## Para ampliar

- [CSS-Tricks · A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/): **la** chuleta de flexbox, con dibujos de cada valor (en inglés).
- [Flexbox Froggy](https://flexboxfroggy.com/#es): un juego para practicar flexbox. Muy recomendable y está en español.
- [MDN · Flexbox](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Flexbox)
