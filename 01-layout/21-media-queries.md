# 21 · Media queries y diseño responsive

> ⏱️ ~25 min

## Primero: muchas veces no hacen falta

"Responsive" significa que la web **se adapta** a cualquier pantalla. Y aquí va la sorpresa: llevamos toda la sesión haciendo cosas responsive **sin una sola media query**:

- `max-width` en vez de `width` (06): la caja se encoge si no cabe.
- `max-width: 65ch` (05): el texto nunca se hace ilegible de ancho.
- `flex-wrap: wrap` + `flex: 1 1 16rem` (19): las tarjetas saltan de línea solas.
- `repeat(auto-fill, minmax(14rem, 1fr))` (20): la galería cambia de 4 a 1 columnas sola.

👉 **Regla de oro**: usad primero las herramientas que se adaptan solas. Las media queries son para cuando el diseño tiene que **cambiar de verdad**: una barra lateral que en el móvil no cabe, un menú que pasa a ser un botón de hamburguesa…

## Qué es una media query

Es una **condición** que envuelve reglas CSS: "aplica esto **solo si**…".

```css
@media (min-width: 48rem) {
  .pagina {
    grid-template-columns: 12rem 1fr;
  }
}
```

- `@media` es una **regla especial** (como `@layer` del 16).
- `(min-width: 48rem)` es la condición: "si la ventana mide **48rem o más**".
- Dentro van reglas CSS normales, que solo se aplican si se cumple.

### Las condiciones más usadas

| Condición                          | Se cumple cuando…                                      |
| ---------------------------------- | ------------------------------------------------------ |
| `(min-width: 48rem)`               | La ventana mide **48rem o más** (de ahí hacia arriba)  |
| `(max-width: 48rem)`               | La ventana mide **48rem o menos** (de ahí hacia abajo) |
| `(orientation: landscape)`         | La pantalla está **apaisada**                          |
| `(prefers-color-scheme: dark)`     | El usuario tiene el sistema en **modo oscuro**         |
| `(prefers-reduced-motion: reduce)` | El usuario ha pedido **menos animaciones**             |
| `print`                            | Se está **imprimiendo** la página                      |

Se pueden combinar con `and`: `@media (min-width: 48rem) and (max-width: 64rem) { … }`.

> 💡 CSS moderno permite escribirlas con **signos de comparación**, que se leen mucho mejor: `@media (width >= 48rem)`. ¿Se puede usar ya? Ya sabéis: Can I use (13).

### `min-width` o `max-width`: _mobile first_

Hay dos formas de plantearlo:

- **Escritorio primero**: escribo el diseño grande y voy **quitando** cosas con `max-width` para las pantallas pequeñas.
- **Móvil primero** (_mobile first_): escribo el diseño **simple** (una columna, que funciona en cualquier sitio) y voy **añadiendo** con `min-width` según hay más espacio.

Se recomienda **móvil primero**, por dos razones:

1. **El CSS base queda más simple**: una columna no necesita casi nada.
2. **El "por defecto" es el que funciona en todas partes.** Si por lo que sea la media query no se aplica (un navegador que no entiende la condición, una errata, una pantalla con una medida que no habíais previsto), lo que se ve es el CSS base:
   - Con móvil primero, ese base es **una columna**: en un monitor grande se ve ancha, pero es perfectamente usable.
   - Con escritorio primero, ese base son **dos columnas con lateral fijo**: en un móvil, justo lo que no cabe.

Es también lo que hacen Tailwind y Bootstrap.

### ¿Qué medidas uso?

Las habituales rondan estos valores, pero **no son sagradas**:

| Aprox.           | Suele ser…   |
| ---------------- | ------------ |
| `40rem` (640px)  | Móvil grande |
| `48rem` (768px)  | Tablet       |
| `64rem` (1024px) | Portátil     |

👉 Lo ideal no es copiar medidas de móviles concretos, sino **estrechar la ventana hasta que el diseño se vea mal**: ahí es donde va la media query.

> Usad **`rem`** y no `px` también aquí: así las medidas respetan el tamaño de letra del navegador del usuario (05).

> ⚠️ Y acordaos del `<meta name="viewport">` del 00: **sin él, las media queries no funcionan bien en el móvil**, porque el navegador finge que la pantalla mide 980px.

## 🛠️ Práctica: un layout de página en el móvil

Vamos a coger un layout de página clásico (cabecera, lateral, contenido y pie, el mismo tipo que montamos en el 20) y hacerlo responsive.

### Paso 0: punto de partida

Cread una carpeta nueva (por ejemplo `21-responsive`) con estos dos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Responsive</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body class="pagina">
    <header class="zona-cabecera">Cabecera</header>
    <nav class="zona-lateral">Lateral</nav>
    <main class="zona-principal">Contenido</main>
    <footer class="zona-pie">Pie</footer>
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
  padding: 1rem;
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 12rem 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "cabecera cabecera"
    "lateral  principal"
    "pie      pie";
  gap: 1rem;
}

.zona-cabecera {
  grid-area: cabecera;
}
.zona-lateral {
  grid-area: lateral;
}
.zona-principal {
  grid-area: principal;
}
.zona-pie {
  grid-area: pie;
}

/* Para ver bien las zonas */
.pagina > * {
  background-color: #f5f0eb;
  border: 1px solid #e0d6cc;
  padding: 1rem;
}
```

> Es el layout del 20: dos columnas con `grid-template-areas`. Si no habéis hecho esa sección, no pasa nada: para lo de hoy basta con saber que ese bloque de comillas es **el dibujo de la página** y que cada zona tiene su nombre.

### Paso 1: ver el problema

Abridla y activad el **modo móvil** de DevTools (`Ctrl/Cmd + Shift + M`) con un móvil estrecho.

El lateral de `12rem` se come media pantalla y al contenido no le queda sitio: dos columnas **no caben** en un móvil.

```
Escritorio (bien)                  Móvil (mal)
┌─────────────────────┐            ┌───────────┐
│      Cabecera       │            │ Cabecera  │
├──────┬──────────────┤            ├──────┬────┤
│ Lat. │  Contenido   │            │ Late │Cont│
├──────┴──────────────┤            ├──────┴────┤
│        Pie          │            │    Pie    │
└─────────────────────┘            └───────────┘
                                     ↑ ilegible
```

### Paso 2: darle la vuelta (móvil primero)

En vez de "arreglar" el móvil, hacemos lo contrario: el CSS **base** será el del móvil (una columna) y el diseño de dos columnas irá **dentro** de una media query.

_./styles.css_

```diff
  body {
    margin: 0;
    padding: 1rem;
    font-family: system-ui, sans-serif;
    min-height: 100vh;
    display: grid;
-   grid-template-columns: 12rem 1fr;
-   grid-template-rows: auto 1fr auto;
+   grid-template-columns: 1fr;
+   grid-template-rows: auto 1fr auto auto;
    grid-template-areas:
-     "cabecera cabecera"
-     "lateral  principal"
-     "pie      pie";
+     "cabecera"
+     "principal"
+     "lateral"
+     "pie";
    gap: 1rem;
  }
```

Fijaos en que, además de poner una sola columna, hemos **cambiado el orden**: en el móvil el contenido va **antes** que el lateral, que es lo que le interesa al usuario.

Y fijaos también en las filas: ahora son **cuatro** (una por zona), y el `1fr` va en la segunda, la del contenido, para que el pie siga quedando abajo del todo (20).

Recargad en modo móvil: todo en una columna, legible. Y en escritorio… también en una columna, claro. Ahora añadimos el diseño grande **al final del fichero**:

```diff
+ @media (min-width: 48rem) {
+   body {
+     grid-template-columns: 12rem 1fr;
+     grid-template-rows: auto 1fr auto;
+     grid-template-areas:
+       "cabecera cabecera"
+       "lateral  principal"
+       "pie      pie";
+   }
+ }
```

Cambiad el ancho de la ventana poco a poco: al pasar de 48rem (768px), el diseño **salta** de una columna a dos. 🎉

> **Importante**: la media query va **después** de las reglas base. Como "pesan" lo mismo (15), gana la que está más abajo. Si la pusierais arriba, no haría nada.

👉 **DevTools**: en el modo móvil, en el menú de los tres puntos (arriba a la derecha del panel) tenéis **"Show media queries"**: os dibuja una barra con **vuestras** media queries y podéis saltar de una a otra con un clic.

### Paso 3: ajustar detalles, no solo el layout

Una media query sirve para cualquier cosa, no solo para la cuadrícula. Por ejemplo, en pantallas grandes podemos permitirnos más aire y letra más grande:

_./styles.css_

```diff
  @media (min-width: 48rem) {
    body {
      grid-template-columns: 12rem 1fr;
      ...
+     padding: 2rem;
+     font-size: 1.5rem;
    }
  }
```

### Paso 4: modo oscuro (`prefers-color-scheme`)

Las media queries no solo preguntan por el **tamaño**. También por las **preferencias** del usuario. Esta es la más agradecida de todas.

Primero pasamos los colores a variables (05), en el CSS base:

_./styles.css_

```diff
+ :root {
+   --color-fondo: white;
+   --color-texto: #333;
+   --color-zona: #f5f0eb;
+   --color-borde: #e0d6cc;
+ }
+
  body {
    margin: 0;
+   background-color: var(--color-fondo);
+   color: var(--color-texto);
    ...
  }

  .pagina > * {
-   background-color: #f5f0eb;
-   border: 1px solid #e0d6cc;
+   background-color: var(--color-zona);
+   border: 1px solid var(--color-borde);
    padding: 1rem;
  }
```

Y ahora, la magia: si el usuario tiene el sistema en modo oscuro, **cambiamos solo las variables**.

```diff
+ @media (prefers-color-scheme: dark) {
+   :root {
+     --color-fondo: #1c1917;
+     --color-texto: #e7e5e4;
+     --color-zona: #292524;
+     --color-borde: #44403c;
+   }
+ }
```

Cuatro líneas y la web entera cambia de tema. Ese es el premio por haber usado variables.

👉 **Probadlo sin tocar el sistema**: en DevTools, menú de los tres puntos → _More tools_ → **Rendering** → `Emulate CSS media feature prefers-color-scheme` → `dark`.

> 💡 **¿Y si lo queréis de verdad, no emulado?** `prefers-color-scheme` lee la preferencia **del sistema operativo**, no del navegador:
>
> - **macOS**: Ajustes del Sistema → *Apariencia* → **Oscuro**.
> - **Windows 11**: Configuración → *Personalización* → *Colores* → "Elige tu modo" → **Oscuro**.
> - **Android / iOS**: Ajustes → Pantalla → **Modo oscuro**.
>
> Chrome, Edge y Safari siguen lo que diga el sistema. **Firefox** además permite decidirlo solo para las webs: Ajustes → General → *Apariencia del sitio web* → Claro / Oscuro / Automático.
>
> Si cambiáis el sistema a oscuro, veréis que **muchas webs cambian solas**: las que han hecho justo lo que acabamos de hacer.

### Paso 5 (rápido): respetar a quien no quiere animaciones

Hay personas a las que las animaciones les provocan mareo (vértigo, migrañas), y el sistema operativo tiene una opción para pedir que se reduzcan. Se respeta así:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

No hemos visto animaciones hoy, pero guardad la receta: es de esas cosas que cuestan tres líneas y para alguien marcan la diferencia. (Y sí, aquí el `!important` del 15 está justificado 😄.)

## Tipografía fluida con `clamp()`

Un último truco muy agradecido, y en la misma línea de "cuantas menos media queries, mejor". Vamos por pasos.

### 1. Un tamaño que depende del ancho de la ventana: `vw`

Recordad el 05: **`vw` = *viewport width*, el ancho de la ventana**. `1vw` es el **1% de ese ancho**.

Hasta ahora hemos puesto tamaños de letra en `rem`, que son fijos. Pero también podemos decirle al título que mida un **porcentaje de la ventana**:

```css
h1 {
  font-size: 5vw;
}
```

"Mide siempre el **5% del ancho de la ventana**", sea un móvil o un monitor:

| Ancho de la ventana | `5vw` son… |
|---|---|
| 320px (móvil pequeño) | 16px |
| 768px (tablet) | 38px |
| 1440px (portátil) | 72px |
| 2560px (monitor grande) | 128px |

Y lo mejor: al estrechar la ventana, el tamaño cambia **de forma continua**, sin los saltos de una media query.

### 2. El problema: sin límites, se va de madre

Mirad otra vez la tabla: en el móvil el título acaba midiendo 16px, **lo mismo que un párrafo** (no parece un título), y en el monitor grande, 128px, una barbaridad que ocupa media pantalla.

La idea de "que crezca con la ventana" es buena, pero le falta **un suelo y un techo** (un mínimo y un máximo).

### 3. `clamp()`: suelo, fórmula y techo

```css
h1 {
  font-size: clamp(1.75rem, 5vw, 3rem);
}
/*                    ↑      ↑     ↑
                    suelo  fórmula techo
                  (mínimo)        (máximo)   */
```

El navegador calcula la fórmula del medio y después la **recorta**:

- ¿Sale **menos** que el suelo? → usa el **suelo** (1.75rem = 28px). Es el tamaño mínimo del título.
- ¿Sale **más** que el techo? → usa el **techo** (3rem = 48px). Es el máximo.
- ¿Sale **entre medias**? → usa lo que dé la fórmula.

Con los mismos anchos de antes:

| Ancho de la ventana | `5vw` da… | ¿Qué se aplica? |
|---|---|---|
| 320px | 16px | Menos que el suelo → **28px** |
| 560px | 28px | Justo el suelo → **28px** |
| 768px | 38px | Entre medias → **38px** |
| 960px | 48px | Justo el techo → **48px** |
| 2560px | 128px | Más que el techo → **48px** |

Es decir: entre los 560px y los 960px de ventana, el título **va creciendo poco a poco**; fuera de ese tramo, se queda quieto en su mínimo o en su máximo.

### 4. El retoque final: `4vw + 1rem`

En la práctica, la fórmula del medio no suele ser `5vw` a secas, sino algo como:

```css
font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
```

Es la misma idea, pero la fórmula ahora dice "el **4%** del ancho **más 16px**". ¿Por qué?

- **Crece más despacio**, que suele quedar mejor: el punto de partida ya es alto (esos 16px fijos) y el crecimiento es más suave.

- Y lo importante: **respeta al usuario**. Si alguien ha configurado su navegador con la letra más grande (05), `vw` se lo salta olímpicamente, porque solo mira la ventana. La parte en `rem` **sí** lo tiene en cuenta.

👉 Regla práctica: **en el valor del medio, mezclad siempre `vw` con `rem`**.

### 5. Vedlo funcionando

Cread una carpeta aparte (por ejemplo `21-clamp`) con estos dos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>clamp()</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <h1 class="fija">Título de tamaño fijo</h1>
    <h1 class="fluida">Título que crece con la ventana</h1>
    <p>Estrechad y ensanchad la ventana y comparad los dos títulos.</p>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  padding: 1rem;
}

.fija {
  font-size: 3rem;
}

.fluida {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}
```

Cambiad el ancho de la ventana poco a poco:

- El **primer** título mide siempre lo mismo: en el móvil se sale o se ve enorme.
- El **segundo** va creciendo y encogiendo… hasta que toca sus topes y se queda quieto.

👉 En DevTools, seleccionad el título fluido y mirad **Computed** → `font-size`: veréis el valor en píxeles **cambiando** mientras movéis la ventana.

`clamp()` no es solo para la letra: vale para cualquier medida. Por ejemplo, `padding: clamp(1rem, 5vw, 4rem)` da unos márgenes que crecen con la pantalla pero nunca se pasan.

## Lo que viene después: _container queries_

Una media query pregunta por el tamaño de **la ventana**. Pero muchas veces lo que importa es el **espacio que tiene el componente**: la misma tarjeta puede estar en una columna ancha o en una barra lateral estrecha… y la ventana mide lo mismo en los dos casos.

Para eso están las **_container queries_**, que preguntan por el tamaño **del contenedor**:

```css
.tarjeta-contenedor {
  container-type: inline-size;
}

@container (min-width: 25rem) {
  .tarjeta {
    display: flex; /* solo si SU contenedor es ancho */
  }
}
```

Es el siguiente paso natural del responsive y ya funciona en todos los navegadores modernos (comprobadlo en Can I use, 13). No lo vemos hoy, pero que sepáis que existe: con componentes (React, por ejemplo) tiene muchísimo sentido.

> 💡 **En Tailwind**: los prefijos `sm:`, `md:`, `lg:`, `xl:` son exactamente media queries de `min-width` (por eso Tailwind es _mobile first_), `dark:` es `prefers-color-scheme: dark`, `motion-reduce:` es `prefers-reduced-motion`, y `@container` tiene su propio prefijo `@sm:`, `@md:`…

## Para ampliar

- [MDN · Media queries](https://developer.mozilla.org/es/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- [MDN · prefers-color-scheme](https://developer.mozilla.org/es/docs/Web/CSS/@media/prefers-color-scheme)
- [web.dev · Responsive design (Learn CSS)](https://web.dev/learn/design/) (en inglés)
- [MDN · Container queries](https://developer.mozilla.org/es/docs/Web/CSS/CSS_containment/Container_queries)
