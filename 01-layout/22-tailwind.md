# 22 · Tailwind CSS: utilidades, componentes e IA

> ⏱️ ~2-3 h · Taller en bloques: primeros pasos, tour de utilidades, formulario, DaisyUI y práctica con IA. Usaremos Tailwind CSS 4 y DaisyUI 5.

## Todo lo anterior sigue sirviendo

Ya sabemos dar estilo a una página: cajas, selectores, capas, Flexbox, Grid y media queries. Ahora vamos a escribir ese mismo CSS de otra manera.

**Tailwind ofrece clases pequeñas que combinamos en el HTML para construir un diseño.** A esto se le llama *utility-first*: empezar por utilidades.

```html
<p class="rounded-lg bg-blue-600 p-4 text-white">
  Hola, Tailwind.
</p>
```

Podéis leerlo sin conocer la librería: bordes redondeados, fondo azul, padding y texto blanco. **Debajo sigue habiendo CSS.** Si no entendéis qué hace `display: flex`, escribir `flex` no arregla esa laguna.

### ¿Y Bootstrap?

| Enfoque | Cómo trabajamos |
| --- | --- |
| CSS propio | Inventamos clases y escribimos sus reglas: `.tarjeta`, `.boton`… |
| Bootstrap | Tenemos componentes con un aspecto inicial, como botones, tarjetas y navegación, además de utilidades. |
| Tailwind | Componemos el aspecto con utilidades: `flex`, `gap-4`, `rounded-lg`… |

Con Tailwind avanzamos rápido y compartimos una escala de colores, espacios y tamaños. La contrapartida es que **el HTML se llena de clases** y hace falta aprender sus nombres. Tampoco nos resuelve la semántica ni la accesibilidad.

> 💡 La IA suele generar Tailwind con facilidad. Nuestro trabajo sigue siendo entender lo que propone, comprobarlo y saber corregirlo.

## Paso 0: preparar el proyecto

Esta vez necesitamos un **paso de compilación**: Tailwind lee nuestros ficheros y genera CSS. Vamos a usar un proyecto preparado con Vite.

- [Repositorio de partida · Lemoncode/boiler-tailwind](https://github.com/Lemoncode/boiler-tailwind).
- [Abrir el proyecto en StackBlitz](https://stackblitz.com/github/Lemoncode/boiler-tailwind), para trabajar desde el navegador.

Si trabajáis en local, necesitáis Node.js y npm compatibles con la versión de Vite del proyecto. Clonad el repositorio en vuestra carpeta de prácticas:

```bash
git clone https://github.com/Lemoncode/boiler-tailwind.git 22-tailwind
cd 22-tailwind
npm install
npm run dev
```

Abrid **la dirección que muestra el terminal**. Dejad el proceso encendido mientras trabajáis. Aquí ya no arrastramos el HTML al navegador: Vite sirve el proyecto y recarga al guardar.

> El material original también incluye una carpeta `boiler-tailwind` con una inmobiliaria ya terminada. Si partís de esa copia, guardadla como referencia y trabajad en un duplicado. A continuación dejamos los ficheros de la práctica en un estado inicial conocido.

### Las piezas, sin meternos todavía en herramientas

| Fichero | Para qué sirve |
| --- | --- |
| `index.html` | El HTML que vamos a maquetar. |
| `src/main.ts` | Entrada que importa el CSS. Hoy no necesitamos programar en TypeScript. |
| `src/style.css` | Importa Tailwind y contiene nuestras personalizaciones. |
| `vite.config.ts` | Conecta Vite con el plugin de Tailwind. |
| `package.json` | Dependencias y comandos como `dev` y `build`. |

Comprobad que el proyecto usa Tailwind **4.x** y su plugin de Vite. Su configuración es:

_./vite.config.ts_

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Dejad estos tres ficheros así:

_./src/main.ts_

```ts
import "./style.css";
```

_./src/style.css_

```css
@import "tailwindcss";
@source not "../Readme.md";
```

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Primeros pasos con Tailwind</title>
  </head>
  <body>
    <main id="app">
      <h1>Por el poder de Tailwind</h1>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

👉 En todo el tema el fichero se llama **`style.css`, en singular**, como en el proyecto de partida. El `import` debe coincidir con su nombre.

### Ayuda del editor

Instalad [Tailwind CSS IntelliSense para VS Code](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): autocompletado, información al pasar el ratón y muestras de color.

Si el editor marca las directivas de Tailwind como desconocidas, cread esta configuración **dentro del proyecto**:

_./.vscode/settings.json_

```json
{
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  }
}
```

Esto configura el editor, **no cambia el CSS que recibe el navegador**.

## 🛠️ Práctica 1: nuestras primeras utilidades

### Paso 1: ¿por qué el título parece un párrafo?

El `h1` no tiene su tamaño habitual. Tailwind incluye **Preflight**, un reset (08): elimina márgenes y hace que los títulos hereden tamaño y peso, entre otras cosas.

El título **sigue siendo un `h1` semánticamente** (01). Le falta el aspecto:

_./index.html_

```diff
- <h1>Por el poder de Tailwind</h1>
+ <h1 class="text-4xl font-bold text-blue-600">Por el poder de Tailwind</h1>
```

| Clase | Qué aporta |
| --- | --- |
| `text-4xl` | Tamaño de letra y altura de línea de la escala de Tailwind. |
| `font-bold` | Negrita. |
| `text-blue-600` | Color azul, tono 600 de su paleta. |

Pasad el ratón por cada clase en VS Code y después buscad sus reglas en **DevTools → Styles**. No hay magia: hay declaraciones CSS.

### Paso 2: ver qué se genera

En otro terminal, dentro del proyecto:

```bash
npm run build
```

Abrid el CSS de `dist/assets` (el nombre incluye un identificador que puede cambiar). Encontraréis el reset, variables y utilidades generadas.

Tailwind detecta clases en los ficheros del proyecto; un Markdown también puede aportar candidatos. Por eso hemos excluido `Readme.md` con `@source not`. La ruta es relativa a la hoja CSS: adaptad el nombre si vuestro README se llama de otra manera.

👉 Quitad temporalmente esa exclusión y comparad las builds si el README contiene ejemplos de clases. Después recuperadla. **No hace falta borrar documentación.**

> Ojo para cuando usemos JavaScript: Tailwind necesita encontrar nombres completos. Construir `"bg-" + color + "-600"` no garantiza que genere la clase. Usad opciones completas como `"bg-red-600"` y `"bg-green-600"`. [Documentación sobre detección de clases](https://tailwindcss.com/docs/detecting-classes-in-source-files).

### Paso 3: un estilo base para los títulos

¿Y si todos los `h1` deben compartir un aspecto? Añadid al CSS:

_./src/style.css_

```css
h1 {
  @apply text-3xl font-bold text-blue-600;
}
```

`@apply` incorpora las declaraciones de esas utilidades en nuestra regla. Lo procesa Tailwind durante la compilación.

Dejad el título así:

```html
<h1 class="text-red-600">Por el poder de Tailwind</h1>
```

🤔 **Sale azul.** ¿La clase no era más específica que el selector de elemento?

Recordad el 16: para declaraciones normales, **las reglas sin capa ganan a las que están dentro de capas**. Nuestra regla está fuera; la utilidad está dentro.

La solución:

_./src/style.css_

```diff
- h1 {
-   @apply text-3xl font-bold text-blue-600;
+ @layer base {
+   h1 {
+     @apply text-3xl font-bold text-blue-600;
+   }
  }
```

Ahora sale **rojo**, manteniendo el tamaño y la negrita de la base.

Tailwind 4 organiza sus capas así:

```css
@layer theme, base, components, utilities;
```

No son niveles de especificidad: **son capas de cascada**. Las variantes responsive y de estado no necesitan una capa independiente llamada `variants`.

> Para seguir el tour, quitad el bloque `@layer base` que acabamos de añadir. Conservad el `@import` y el `@source not`.

## 🛠️ Práctica 2: un tour por Tailwind

En los ejemplos siguientes, **sustituid el contenido de `<main id="app">`**. Conservad el resto del documento, incluido el script de entrada.

### Paso 1: responsive, lo del 21 con prefijos

```html
<div class="bg-red-500 p-4 md:bg-green-500 lg:bg-blue-500">
  Cambiad el ancho de la ventana.
</div>
```

Con la configuración por defecto:

| Prefijo | Se aplica desde… | Equivalencia habitual |
| --- | --- | --- |
| Sin prefijo | Cualquier ancho | Estilo base |
| `sm:` | `40rem` | 640px |
| `md:` | `48rem` | 768px |
| `lg:` | `64rem` | 1024px |
| `xl:` | `80rem` | 1280px |
| `2xl:` | `96rem` | 1536px |

Las equivalencias suponen 16px. El bloque es rojo en pequeño, verde desde `md` y azul desde `lg`. **`sm:` no significa “solo en móvil”**: significa “desde ese ancho hacia arriba”.

Probad algo más útil:

```html
<p class="text-sm md:text-lg lg:text-2xl">
  El texto crece cuando hay más espacio.
</p>
```

### Paso 2: tamaños y espaciado

```html
<div class="h-48 w-full bg-gray-200 p-4">
  Ocupo el ancho disponible y tengo 12rem de alto.
</div>
```

| Clase | Qué significa con la escala por defecto |
| --- | --- |
| `w-full` | `width: 100%` |
| `w-80` | Ancho de `20rem`, **no 80%** |
| `w-1/2` | Ancho del 50% |
| `w-[80%]` | Valor arbitrario: ancho del 80% |
| `h-48` | Alto de `12rem` |
| `h-full` | Alto del 100%; depende de cómo esté definida la altura del contenedor |
| `min-h-screen` | Altura mínima de `100vh` |
| `max-w-md` | Ancho máximo de `28rem` |
| `mx-auto` | Márgenes horizontales automáticos |

👉 Probad `w-80`, `w-1/2` y `w-[80%]`, **una cada vez**. No pongáis dos utilidades que compitan por la misma propiedad para intentar que “gane la última del HTML”: manda el orden del CSS generado.

En la escala de espaciado por defecto, una unidad son `0.25rem`:

| Clase | CSS equivalente |
| --- | --- |
| `p-4` | `padding: 1rem` |
| `px-4` | Padding izquierdo y derecho de `1rem` |
| `py-2` | Padding superior e inferior de `0.5rem` |
| `mt-6` | `margin-top: 1.5rem` |
| `-mt-2` | `margin-top: -0.5rem` |
| `gap-4` | `gap: 1rem` |

Son las cajas del 06 y las unidades del 05, con nombres abreviados.

### Paso 3: Flexbox y Grid

```html
<div class="flex flex-col gap-4 bg-gray-100 p-4 md:flex-row">
  <div class="bg-blue-200 p-4">Elemento A</div>
  <div class="bg-blue-300 p-4">Elemento B</div>
  <div class="bg-blue-400 p-4">Elemento C</div>
</div>
```

En móvil, columna; desde `md`, fila. Añadid `justify-between` o `items-center` y relacionad el resultado con Flexbox (19).

Ahora cambiad solo el contenedor:

```diff
- <div class="flex flex-col gap-4 bg-gray-100 p-4 md:flex-row">
+ <div class="grid grid-cols-1 gap-4 bg-gray-100 p-4 md:grid-cols-3">
```

Una columna en pequeño, tres columnas iguales en grande: el Grid del 20. **Tailwind no elige el layout por vosotros.**

### Paso 4: texto, colores, bordes y sombras

```html
<article class="mx-auto mt-6 max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
  <h1 class="text-2xl font-bold text-gray-900">Una tarjeta con Tailwind</h1>
  <p class="mt-2 text-gray-600">
    El espacio interior, el borde y la sombra siguen siendo CSS.
  </p>
</article>
```

- Tamaño: `text-sm`, `text-lg`, `text-2xl`.
- Peso: `font-normal`, `font-semibold`, `font-bold`.
- Alineación: `text-left`, `text-center`, `text-right`.
- Color de texto y fondo: `text-gray-600`, `bg-blue-600`.
- Bordes y esquinas: `border`, `border-2`, `rounded-lg`, `rounded-full`.
- Sombras: `shadow-sm`, `shadow-md`, `shadow-lg`.

👉 Cambiad la tarjeta a fondo azul y texto blanco. Acordaos de cambiar también el color explícito del párrafo: la herencia no gana a una regla aplicada directamente (07).

### Paso 5: estados, transiciones y animaciones

```html
<button
  type="button"
  class="m-6 rounded-lg bg-blue-700 px-4 py-2 text-white transition duration-300 hover:scale-105 hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
>
  Pasad el ratón o llegad con Tab
</button>
```

`hover:` y `focus-visible:` son las pseudoclases del 12. `duration-300` dura 300ms; `hover:scale-105` escala al 105%. Las utilidades de escala ya funcionan sin añadir una clase `transform`.

También hay animaciones preparadas:

```html
<p class="p-6 motion-safe:animate-bounce">Un texto que rebota</p>
```

`motion-safe:` limita la animación a quien no haya pedido reducir movimiento. Probad esa preferencia en DevTools, como en el 21.

> Otros prefijos: `dark:` responde por defecto al modo oscuro del sistema y `print:` a la impresión. Pueden configurarse; no deduzcáis que cualquier proyecto usa siempre los valores por defecto.

### Paso 6: colores con significado en Tailwind puro (`@theme`)

Hasta ahora usamos `blue-600`, `gray-100`… ¿Dónde ponemos **el color de nuestra marca**? Vamos a verlo sin DaisyUI ni plugins adicionales.

#### Primero: una variable CSS normal

Añadid al CSS, después del `@import` y el `@source not`:

_./src/style.css_

```css
:root {
  --color-marca: #166534;
}
```

Sustituid el contenido del `<main id="app">` por:

_./index.html_

```html
<p class="p-6 text-[var(--color-marca)]">El color de nuestra marca.</p>
```

Funciona: la utilidad usa el valor de nuestra variable, como en el tema 05. Pero **declararla en `:root` no crea una utilidad llamada `text-marca`**.

#### Ahora: registrar el color en el tema

Sustituid el bloque anterior:

_./src/style.css_

```diff
- :root {
-   --color-marca: #166534;
+ @theme {
+   --color-primary: #166534;
+   --color-primary-hover: #14532d;
  }
```

`@theme` es una directiva de Tailwind 4: registra valores de diseño para sus utilidades. Se escribe **en el nivel superior del CSS**, fuera de selectores y de bloques `@layer`.

Ahora sustituid el contenido del `<main>` por esta tarjeta:

```html
<section class="m-6 max-w-md rounded-lg border border-primary p-6">
  <h1 class="text-2xl font-bold text-primary">Nuestra marca</h1>
  <p class="mt-2">Un mismo color para texto, bordes y botones.</p>
  <button
    type="button"
    class="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
  >
    Probar el color
  </button>
</section>
```

**El prefijo `--color-` conecta el valor con las utilidades de color**: `text-primary`, `border-primary`, `bg-primary`… Tailwind genera las que detecta en nuestros ficheros. No hemos escrito esas reglas una por una.

**`primary` es un token semántico**: nombra el papel del color en la interfaz, no su tonalidad. `primary-hover` nombra el color que hemos elegido para el estado hover.

| Tipo de token | Ejemplo | Qué expresa |
| --- | --- | --- |
| De paleta | `blue-400` | Un tono concreto de azul. |
| Semántico | `primary` | El color principal de nuestra interfaz, sea azul, verde o violeta. |

**Tailwind puro no trae un `primary` predefinido ni componentes que lo usen automáticamente.** Al declararlo en `@theme`, habilitamos utilidades como `bg-primary`; somos nosotros quienes las aplicamos al HTML. `primary-hover` tampoco activa un estado por su nombre: lo aplicamos expresamente con `hover:bg-primary-hover`.

No hace falta definir una escala de 50 a 950. Aquí necesitamos dos colores y definimos dos valores. Los colores originales de Tailwind siguen disponibles.

👉 Cambiad los dos valores por `#6d28d9` y `#5b21b6`. Al guardar, el título, el borde y el botón pasan a violeta, incluido su estado `hover`, **sin cambiar el HTML**.

Un elemento con `text-blue-400` seguirá usando su azul original: no está conectado a `primary`. Podríamos sobrescribir `--color-blue-400` en `@theme`, pero para expresar nuestra identidad visual es más claro usar un nombre semántico que convertir un token llamado «azul» en verde. Al cambiar un token de color, cambian todas las utilidades que lo consumen: texto, fondo, borde…

#### ¿Y si quiero cambiar un valor que ya existe?

También podemos ajustar el tema por defecto. Añadid dentro del mismo `@theme`:

```css
--radius-lg: 1.5rem;
```

Los elementos con `rounded-lg` tendrán ahora esquinas más redondeadas. El cambio afecta a **todos los que usen ese valor del tema**, no solo a esta tarjeta.

Estos valores compartidos de colores, radios, tipografías o espacios se suelen llamar **tokens de diseño**. Son decisiones que guardamos en un sitio para reutilizarlas.

| Dónde lo defino | Qué consigo |
| --- | --- |
| `:root { --color-marca: ...; }` | Una variable CSS normal, utilizable con `var()`. |
| `@theme { --color-primary: ...; }` | Un valor del tema conectado a utilidades como `bg-primary`. |
| `@theme { --radius-lg: ...; }` | Personalizar el valor usado por la utilidad existente `rounded-lg`. |

> 💡 Las variables de `@theme` también se pueden consumir desde CSS propio con `var(--color-primary)`. La diferencia es que además configuran el sistema de utilidades. [Tailwind · Variables del tema](https://tailwindcss.com/docs/theme).

Para continuar con el formulario, quitad este bloque `@theme` y conservad las dos líneas iniciales del CSS. Así la siguiente práctica vuelve a usar la escala por defecto.

## 🛠️ Práctica 3: un formulario y nuestras propias clases

### Paso 1: montarlo con utilidades

Sustituid el `<main>` completo por este bloque. Conservad el script de `src/main.ts` al final del `body`.

_./index.html_

```html
<main class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
  <form class="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-md">
    <h1 class="text-2xl font-semibold text-gray-900">Formulario de contacto</h1>

    <div>
      <label for="nombre" class="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
      <input
        id="nombre" name="nombre" type="text" autocomplete="name" required
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tu nombre"
      />
    </div>

    <div>
      <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
      <input
        id="email" name="email" type="email" autocomplete="email" required
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="tucorreo@ejemplo.com"
      />
    </div>

    <div>
      <label for="mensaje" class="mb-1 block text-sm font-medium text-gray-700">Mensaje</label>
      <textarea
        id="mensaje" name="mensaje" rows="4" required
        class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Tu mensaje…"
      ></textarea>
    </div>

    <button type="submit" class="w-full rounded-md bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
      Enviar
    </button>
    <p class="text-sm text-gray-600">Práctica de maquetación: no envía mensajes.</p>
  </form>
</main>
```

Para evitar la navegación del envío nativo, añadid este pequeño bloque a la entrada. Lo mantendremos también en el ejercicio de DaisyUI:

_./src/main.ts_

```ts
import "./style.css";

document.querySelector("form")?.addEventListener("submit", (event) => {
  event.preventDefault();
});
```

Es solo una ayuda para la demo: el navegador valida los campos, pero no hay servidor ni envío real. Probad con datos ficticios.

👉 Miradlo a 375px de ancho y recorredlo con **Tab**. Cada campo tiene una etiqueta asociada y el foco sigue visible aunque hayamos sustituido el contorno por un anillo.

### Paso 2: detectar la repetición

Los tres campos repiten las mismas clases. Podemos agruparlas con `@apply`:

_./src/style.css_ — añadid después de las dos líneas iniciales:

```css
@layer components {
  .form-container {
    @apply w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-md;
  }

  .form-label {
    @apply mb-1 block text-sm font-medium text-gray-700;
  }

  .form-input {
    @apply w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm;
    @apply focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500;
  }

  .boton-contacto {
    @apply w-full rounded-md bg-blue-700 px-4 py-2 font-medium text-white;
    @apply hover:bg-blue-800;
    @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700;
  }
}
```

Ahora **sustituid**, sin añadir un segundo atributo `class`:

| Elemento | Su nuevo atributo |
| --- | --- |
| `form` | `class="form-container"` |
| Cada `label` | `class="form-label"` |
| Los dos `input` y el `textarea` | `class="form-input"` |
| Botón de envío | `class="boton-contacto"` |

Mantened todos los demás atributos: `for`, `id`, `name`, `required`… El resultado visual debe ser el mismo.

### Paso 3: una excepción local

```html
<form class="form-container max-w-xl">
```

El formulario se ensancha: la utilidad puede sobrescribir el ancho máximo definido en `components`. Es la cascada del 16 aplicada a algo real.

> 💡 `@apply` puede ayudar cuando se repite un patrón, pero no hace falta esconder cada utilidad detrás de una clase propia. Cuando trabajemos con componentes de una aplicación, podremos reutilizar también su HTML. [Estilos propios en Tailwind](https://tailwindcss.com/docs/adding-custom-styles).

## 🛠️ Práctica 4: componentes con DaisyUI

Ya hemos creado clases para campos y botones. **DaisyUI nos da componentes CSS preparados sobre Tailwind**, utilizables con HTML o con distintos frameworks.

Podemos combinar `btn`, `card` o `input` con utilidades como `w-full`, `p-6` o `max-w-md`. La lógica de negocio sigue siendo nuestra: un formulario bonito no envía correos por sí solo.

### Paso 1: instalar y activar

En el terminal del proyecto:

```bash
npm install -D daisyui@5
```

Si el proyecto de partida ya lo trae, comprobad que es la versión 5. Dejad el CSS **solo con este contenido**, retirando las clases del formulario anterior:

_./src/style.css_

```css
@import "tailwindcss";
@source not "../Readme.md";
@plugin "daisyui";
```

Esta es la instalación como [plugin de Tailwind de DaisyUI](https://daisyui.com/docs/install/). No necesitamos una configuración de Tailwind 3.

### Paso 2: el mismo formulario con componentes

Sustituid el `<main>` del ejercicio anterior por este. Conservad la entrada y su manejador de envío.

_./index.html_

```html
<main class="flex min-h-screen items-center justify-center bg-base-200 p-4">
  <form class="card w-full max-w-md bg-base-100 text-base-content shadow-xl">
    <div class="card-body gap-4">
      <h1 class="card-title text-2xl">Formulario de contacto</h1>

      <div class="grid gap-1">
        <label for="nombre" class="label">Nombre</label>
        <input id="nombre" name="nombre" type="text" autocomplete="name"
          class="input w-full" placeholder="Tu nombre" required />
      </div>

      <div class="grid gap-1">
        <label for="email" class="label">Email</label>
        <input id="email" name="email" type="email" autocomplete="email"
          class="input w-full" placeholder="tucorreo@ejemplo.com" required />
      </div>

      <div class="grid gap-1">
        <label for="mensaje" class="label">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="4"
          class="textarea w-full" placeholder="Tu mensaje…" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary w-full">Enviar</button>
      <p class="text-sm">Práctica de maquetación: no envía mensajes.</p>
    </div>
  </form>
</main>
```

👉 Comparad los dos formularios: hemos conservado la estructura y cambiado cómo expresamos el aspecto. En DaisyUI 5, `input` ya proporciona el estilo base del campo; no copiéis sin revisar ejemplos antiguos con `input-bordered` o `form-control`.

### Paso 3: colores con significado

Probemos otro botón:

```diff
- <button type="submit" class="btn btn-primary w-full">Enviar</button>
+ <button type="submit" class="btn btn-secondary w-full">Enviar</button>
```

| Nombre | Papel en el diseño |
| --- | --- |
| `primary`, `secondary`, `accent` | Colores principales de la marca y acentos. |
| `base-100`, `base-200`, `base-300` | Superficies y fondos. |
| `base-content` | Texto sobre las superficies base. |
| `success`, `warning`, `error`, `info` | Estados y mensajes. |

También podéis probar `btn-error` para ver su aspecto, pero para “Enviar” recuperad `btn-primary`: el color debería acompañar el significado de la acción.

### Paso 4: cambiar el tema

Sustituid la activación del plugin:

_./src/style.css_

```diff
- @plugin "daisyui";
+ @plugin "daisyui" {
+   themes: cupcake --default, dark;
+ }
```

Ahora elegid el tema en la raíz del documento:

_./index.html_

```diff
- <html lang="es">
+ <html lang="es" data-theme="dark">
```

Probad `data-theme="cupcake"` y volved a `dark`. Cambian superficies, texto y componentes. **Los colores fijos como `bg-white` no cambian con el tema**: por eso usamos `bg-base-100`.

`data-theme` selecciona un tema explícitamente. Para seguir automáticamente la preferencia del sistema, quitad ese atributo y configurad `dark --prefersdark` en la lista de temas.

### Paso 5: personalizar un tema existente

En el tour usamos `@theme` para definir valores de **Tailwind puro**. Aquí usamos `@plugin "daisyui/theme"` para configurar un tema de **DaisyUI**, que ya ofrece componentes y colores con significado como `primary`. Son dos mecanismos distintos: no necesitamos DaisyUI para personalizar Tailwind.

La diferencia práctica: en Tailwind puro nosotros aplicábamos `bg-primary` al botón; DaisyUI ya conecta su componente `btn-primary` con el color `primary` y su color de contenido. Aquí personalizamos ese contrato existente. El `primary-hover` de nuestro ejercicio anterior era un nombre propio, no un token de DaisyUI.

Dejad el CSS así:

_./src/style.css_

```css
@import "tailwindcss";
@source not "../Readme.md";

@plugin "daisyui" {
  themes: light --default;
}

@plugin "daisyui/theme" {
  name: "light";
  default: true;
  --color-primary: #166534;
  --color-primary-content: #ffffff;
  --color-secondary: #115e59;
  --color-secondary-content: #ffffff;
}
```

Cambiad la raíz a `data-theme="light"`. El botón `btn-primary` pasa a verde y el `btn-secondary`, a verde azulado, sin tocar sus clases.

Para **crear un tema con nombre propio**, podéis usar el [generador de temas de DaisyUI](https://daisyui.com/theme-generator/) y pegar su bloque `@plugin "daisyui/theme"`. Un tema completo define superficies, colores de contenido, estados, radios y tamaños; no basta con cambiar el nombre y dar dos colores.

👉 Comparadlo con las variables CSS del 05: centralizamos decisiones para cambiar muchos elementos a la vez. La [documentación de temas](https://daisyui.com/docs/themes/) recoge ambas opciones.

## 🛠️ Práctica 5: una inmobiliaria con ayuda de IA

Ahora vamos a juntar todo. Usad Claude en modo agente, como en el material de partida, o el asistente de código que tengáis preparado para trabajar en el proyecto.

Antes de empezar, guardad el formulario en una copia o en un commit para poder compararlo después.

### Paso 1: dejar una base conocida

Conservad el CSS de la última práctica, con el tema `light` personalizado. Dejad `src/main.ts` solo con el import del CSS; el formulario anterior ya no estará.

_./index.html_

```html
<!doctype html>
<html lang="es" data-theme="light">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inmobiliaria Lemoncode</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Paso 2: pedir una primera versión concreta

```text
Revisa package.json y los ficheros de este proyecto antes de cambiar nada.
Trabajamos con Vite, HTML, Tailwind CSS 4 y DaisyUI 5.

Maqueta la ficha de una casa para Inmobiliaria Lemoncode en index.html.
Incluye cabecera, galería tipo carrusel con controles accesibles, título,
descripción, habitaciones, baños, superficie, precio, localización
y formulario de contacto con nombre, email y mensaje.

Usa HTML semántico, etiquetas asociadas a los campos y foco visible.
En móvil quiero una columna; en escritorio, contenido y contacto en dos
columnas. Evita desbordamientos horizontales.

Usa componentes DaisyUI y utilidades Tailwind. Personaliza los colores
desde el tema de src/style.css. No añadas un framework de JavaScript.
Para los iconos, usa SVG sencillos con texto visible para las características.
Busca imágenes de casas en Unsplash y comprueba las URLs que utilices.
Para la localización usa un enlace a un mapa, sin requerir claves de API.

El formulario es una demo: valida con HTML y evita el envío real.
Identifica los datos de la vivienda como ficticios. No simules un envío exitoso.
Si hace falta interacción, añade el mínimo código en src/main.ts.
Ejecuta npm run build y explica los cambios realizados.
```

### Paso 3: revisar con lo que ya sabemos

No os quedéis en “qué bonito”. Abrid el navegador y comprobad:

1. **HTML (00–01):** idioma, viewport, un título principal y estructura con sentido.
2. **Cajas y layout (06, 19–21):** probad 375px, 768px y 1280px; no debe aparecer scroll horizontal.
3. **Teclado (12):** llegad con Tab a enlaces, controles del carrusel y formulario. El foco tiene que verse.
4. **Capas (15–16):** si un color no cambia, inspeccionad qué regla gana antes de añadir `!important`.
5. **Imágenes y formulario:** verificad que cargan las fotos, que tienen alternativas adecuadas y que la demo no envía datos.

Que la build termine bien **no demuestra** que el diseño se vea bien ni que el carrusel funcione. Eso hay que probarlo.

### Paso 4: iterar con una referencia visual

El material de partida trae `Logo.png` dentro de `xx-tailwind`. Copiadlo a `public/Logo.png` del proyecto de prácticas; Vite lo sirve como `/Logo.png`.

```text
He añadido el logo en public/Logo.png. Incorpóralo en la cabecera de
Inmobiliaria Lemoncode sin deformarlo y con una alternativa de texto adecuada.

Ajusta el tema para que acompañe al logo: carbón para el color primario
y verde lima como acento. Mantén el texto legible sobre ambos colores.
Centraliza los cambios de color en el tema, en lugar de repartir valores
distintos por cada componente.

Revisa la cabecera a 375px y en escritorio: logo, nombre y navegación deben
caber. Conserva el contenido de la ficha y vuelve a comprobar la build.
```

Pedid después **un cambio cada vez** y revisad el resultado. Si la cabecera desborda, señalad el ancho y el elemento que falla; si el texto no se lee, identificad el fondo y el color. Cuanto mejor entendáis el CSS, mejor podréis dirigir esa conversación.

## Para ampliar

- [Tailwind CSS · Instalación con Vite](https://tailwindcss.com/docs/installation/using-vite).
- [Tailwind CSS · Responsive design](https://tailwindcss.com/docs/responsive-design).
- [Tailwind CSS · Estados y variantes](https://tailwindcss.com/docs/hover-focus-and-other-states).
- [Tailwind CSS · Preflight](https://tailwindcss.com/docs/preflight).
- [DaisyUI · Componentes](https://daisyui.com/components/).
- [DaisyUI · Colores](https://daisyui.com/docs/colors/).
