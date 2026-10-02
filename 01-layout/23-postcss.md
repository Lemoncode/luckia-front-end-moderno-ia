# 23 · PostCSS: escribir CSS moderno que funcione en todas partes

## Todo lo anterior sigue sirviendo

Ya sabemos escribir CSS: cajas, selectores, cascada, Flexbox, Grid, variables y media queries. Esta vez no cambiamos la forma de escribirlo, sino lo que pasa **después** de escribirlo.

**PostCSS coge nuestro CSS, lo pasa por plugins y nos devuelve otro CSS.** Está hecho en JavaScript, pero nosotros seguimos escribiendo CSS "normal".

```
nuestro CSS  →  [ PostCSS + plugins ]  →  CSS que entiende cualquier navegador
```

PostCSS solo, sin plugins, **no hace nada**: entra CSS y sale el mismo CSS. Es la base del Lego, y cada plugin es una pieza que decidimos si ponemos o no.

### Qué conseguimos

1. **Compatibilidad**: prefijos (`-webkit-`, `-moz-`) y colores de respaldo, sin escribirlos.
2. **CSS del futuro, hoy**: sintaxis que todavía no entienden los navegadores, traducida a algo que sí funciona.
3. **Comodidad al escribir**: anidar con BEM, variables de compilación y trozos de CSS reutilizables.

### ¿Y Sass?

| Enfoque     | Qué es                                                          |
| ----------- | --------------------------------------------------------------- |
| Sass / Less | **Otro lenguaje** que se compila a CSS. Aprendemos su sintaxis. |
| PostCSS     | Trabaja **sobre CSS**. Escribimos CSS y él lo transforma.       |

No compiten: en muchos proyectos conviven, Sass para escribir y PostCSS para procesar al final.

> ⚠ Cada plugin es una dependencia más, y muchos son de la comunidad. Pocos plugins, y a ser posible los mantenidos por el equipo de PostCSS. Antes de instalar uno, mirad en GitHub cuándo fue su último commit, y si tiene mantenimiento activo.

## Paso 0: preparar el proyecto

Esta vez necesitamos un **paso de compilación**: PostCSS lee nuestro CSS y genera otro CSS. Vamos a usar un proyecto preparado con Vite.

- [Repositorio de partida · Lemoncode/boiler-postcss](https://github.com/Lemoncode/boiler-postcss).

Necesitáis [Node.js y npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0), que es lo que pide Vite 8.

> ⚠ Comprobad vuestra versión con `node -v` y `npm -v`. Versiones anteriores dan error al arrancar.

Clonad el repositorio en vuestra carpeta de prácticas:

```bash
git clone https://github.com/Lemoncode/boiler-postcss.git 23-postcss
cd 23-postcss
npm install
npm run dev
```

Abrid **la dirección que muestra el terminal** y dejad el proceso encendido mientras trabajáis.

### Las piezas

| Fichero            | Para qué sirve                                                     |
| ------------------ | ------------------------------------------------------------------ |
| `index.html`       | La página que vamos a estilar, con clases BEM.                     |
| `src/main.ts`      | La entrada: solo importa el CSS. Hoy no programamos en TypeScript. |
| `src/css/main.css` | Los estilos: variables, reset y la maquetación.                    |
| `package.json`     | Dependencias y comandos (`dev`, `build`, `preview`).               |

Dos cosas de cómo funciona Vite:

- **El CSS entra desde TypeScript.** En `main.ts` hay un `import './css/main.css'`; no hay un `<link>` en el HTML.
- **La carpeta `dist/` no se toca.** La genera el build y no se sube al repositorio.

> **Las clases del HTML siguen BEM**: `bloque`, `bloque__elemento` y `bloque--modificador`. Por eso veréis `.section` y `.section__title`. Es solo una convención para nombrar clases, pero nos vendrá bien al final de la sesión. Para profundizar: [BEM 101](https://css-tricks.com/bem-101/).

| Comando           | Qué hace                                            |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con recarga al guardar       |
| `npm run build`   | Genera `dist/` para producción, minificado          |
| `npm run preview` | Sirve `dist/` para probar la build antes de subirla |

Vamos a mirar mucho el CSS que sale del build. Para leerlo sin minificar:

```bash
npm run build -- --minify false
```

El resultado está en `dist/assets/index-xxxx.css`.

### Ayuda del editor

Instalad la extensión **PostCSS Language Support** de VS Code. Más adelante escribiremos sintaxis como `@custom-media` o `@define-mixin` que el editor marca en rojo si no la tiene. Es solo cosmético: compila igual.

Y no hace falta instalar nada global: ni PostCSS, ni la CLI de Vite. Todo entra como dependencia del proyecto.

## 🛠️ Práctica 1: qué hace Vite sin PostCSS

Antes de añadir nada, veamos qué nos resuelve Vite por su cuenta.

### Paso 1: usar las variables que ya están

Abrid `src/css/main.css` y mirad el bloque `:root`. Hay una paleta entera derivada de **un solo color**:

```css
:root {
  --main-color: #562012;
  --pure-white: #ffffff;
  --light-color: hsl(from var(--main-color) h s calc(l + 70));
  --surface-color: var(--light-color);
  --footer-background: var(--main-color);
  --text-primary: var(--main-color);
  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
  --border-color: hsl(from var(--main-color) h s calc(l + 10));
  --border-page-color: hsl(from var(--main-color) h s calc(l + 60));
}
```

`hsl(from ...)` coge un color y le cambia el canal que queramos: el tono (`h`), la saturación (`s`) o la luminosidad (`l`). Aquí sumamos luminosidad para el fondo claro y la restamos para el texto. Si mañana cambiamos `--main-color`, se recalcula toda la paleta.

El `body` todavía no las usa. Vamos a conectarlo:

_src/css/main.css_

```css
body {
  font-family: system-ui, sans-serif;
  min-width: 360px;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  color: var(--text-base);
  background: var(--surface-color);
}
```

### Paso 2: partir el CSS en varios archivos

Tener todo el CSS en un archivo deja de aguantarse en cuanto el proyecto crece. Sacamos las variables a su sitio.

1. Cread `src/css/variables.css` y mover ahí el bloque `:root` entero.
2. Guardad. **Se rompen los colores**: `main.css` ya no sabe nada de esas variables.
3. Importadlo. Los `@import` van **siempre arriba del todo**, antes de cualquier regla:

_src/css/main.css_

```css
@import './variables.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Vuelve a funcionar. Y en `dist/` sigue habiendo **un solo archivo CSS**: Vite ha pegado el contenido de `variables.css` dentro al compilar.

> El `@import` nativo de CSS lo resuelve el navegador en tiempo de ejecución, y cada uno es una petición más. Este se resuelve al compilar: una sola petición, con los archivos organizados en el proyecto.

### Paso 3: mirar la build

El título de la cabecera lleva `user-select: none`, que todavía necesita prefijo para funcionar en todos los navegadores:

```css
.header {
  padding: 20px 0;

  .header__title {
    text-align: center;
    font-size: 3rem;
    color: var(--text-primary);
    user-select: none;
  }
}
```

Generad la build y abrid `dist/assets/index-xxxx.css`:

```bash
npm run build -- --minify false
```

```css
.header {
  padding: 20px 0;
}
.header .header__title {
  text-align: center;
  -webkit-user-select: none;
  user-select: none;
  font-size: 3rem;
  color: var(--text-primary);
}
```

Dos cosas que han pasado solas: el nesting se ha **aplanado** (`.header .header__title`) y ha aparecido **`-webkit-user-select`**.

Resumiendo lo que hace Vite por su cuenta, con `npm run build`:

- **Junta los `@import`** en un único archivo. Sin bundler, esto haría falta el plugin `postcss-import`.
- **Minifica el CSS**, con Lightning CSS. Sin bundler, haría falta el plugin `cssnano`.
- **Aplana el nesting** y **añade algunos prefijos**.

Ojo: todo esto pasa en el **build**. En `npm run dev` el CSS llega tal cual, solo con los `@import` resueltos. Y los prefijos que pone son los de Lightning CSS, el minificador de Vite: no decidimos nosotros cuáles ni para qué navegadores.

## 🛠️ Práctica 2: postcss-preset-env

Vamos a añadir **un solo plugin**. Y digo uno, pero en realidad son muchos: `postcss-preset-env` es un **paquete que trae un montón de plugins pequeños dentro**, Autoprefixer incluido.

### Paso 1: instalar y configurar

Parad el servidor antes de instalar.

```bash
npm i -D postcss-preset-env
```

No hace falta instalar `postcss`: Vite ya lo lleva dentro.

Cread **`postcss.config.js`** en la raíz del proyecto, al lado de `package.json` (no dentro de `src`):

_postcss.config.js_

```js
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [postcssPresetEnv({ stage: 1 })]
};
```

Vite detecta este archivo solo. No hay que tocar `vite.config` ni instalar nada más.

> Si cambiáis este archivo, parad el servidor y volved a lanzar `npm run dev`.

Usamos `import` / `export` porque el `package.json` tiene `"type": "module"`. Con la extensión `.cjs` y `require` también funciona: es la forma antigua.

**El `stage`** es el nivel de madurez de la sintaxis que aceptamos:

| `stage` | Qué entra                                                  |
| ------- | ---------------------------------------------------------- |
| `0`     | Experimental, la especificación puede cambiar mañana       |
| `1`     | **El que usamos.** Aquí están las custom media queries     |
| `2`     | El valor por defecto: variables, nesting, lo del día a día |
| `3`     | Casi estándar                                              |
| `4`     | Estándar                                                   |

### Paso 2: los prefijos, ahora con control

Volved a generar la build y mirad el mismo `user-select`:

```css
.header .header__title {
  text-align: center;
  font-size: 3rem;
  color: #562012;
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
```

Tres cambios respecto a antes:

- Ahora salen **dos prefijos**, `-webkit-` y `-moz-`. Los pone Autoprefixer, que es quien se dedica a esto.
- Aparece un **color de respaldo**: `color: #562012` justo encima de `color: var(--text-primary)`. Si el navegador no entiende la variable, usa el valor fijo y la página no se queda en blanco.
- Y pasa **también en desarrollo**, no solo en el build.

Para comprobar lo último sin hacer build: con `npm run dev`, abrid **DevTools → Elements** y mirad el `<style>` que Vite inyecta dentro del `<head>`.

> En el navegador al inspeccionar el elemento vemos que PostCSS está trabajando **si y solo si** vemos `-moz-user-select` y la línea del color de respaldo.

`user-select: none` impide seleccionar el texto. Va bien como ejemplo porque sigue necesitando prefijo, pero **no es buena práctica**: al usuario hay que dejarle copiar.

### Paso 3: custom media queries

Un breakpoint se define **una vez** y se usa en todo el proyecto.

_src/css/main.css_

```css
@import './variables.css';

@custom-media --bp-md (width >= 768px);

.header {
  padding: 20px 0;

  .header__title {
    text-align: center;
    font-size: 3rem;
    color: var(--text-primary);
    user-select: none;

    @media (--bp-md) {
      font-size: 7rem;
    }
  }
}
```

Salida:

```css
@media (min-width: 768px) {
  .header .header__title {
    font-size: 7rem;
  }
}
```

Aquí han pasado **dos traducciones a la vez**:

- El nombre `--bp-md` se ha sustituido por su contenido.
- `width >= 768px` se ha convertido en `min-width: 768px`.

Esa segunda es la **sintaxis de rango** de las media queries, que se lee como una condición matemática. Donde más se agradece es en los rangos cerrados, que sin ella hay que encadenar con `and`:

```css
@media (400px <= width <= 700px) {
}
```

```css
@media (min-width: 400px) and (max-width: 700px) {
}
```

El nombre del breakpoint nos lo inventamos: `--bp-md`, `--bp-xl`, `--movil`… Lo habitual es seguir la nomenclatura de tamaños (sm, md, lg, xl). También podéis llevaros las custom media a `variables.css`, o a un `breakpoints.css` aparte.

> Las custom media queries están propuestas en [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/), una especificación viva del CSS Working Group. Hoy no las implementa ningún navegador por defecto: Firefox las tiene detrás de un flag. O sea que esto funciona **solo** porque PostCSS nos lo traduce.

### Paso 4: los colores, con respaldo

Las variables de la paleta ya las conectamos en la práctica 1. Mirad ahora qué sale en el `dist`:

```css
body {
  background: rgb(247, 221, 214);
  background: var(--surface-color);
  color: rgba(23, 8, 5, 0.87);
  color: var(--text-base);
}
```

PostCSS ha **resuelto el color** y lo ha dejado de respaldo justo encima. Y lo hace en cualquier propiedad que use una variable, no solo en colores de texto o fondo.

Vamos a estilar la tarjeta para verlo en un borde:

_src/css/main.css_

```css
.section {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;

  .section__image-container {
    max-width: 400px;
    border: 2px solid var(--border-color);
    padding: 24px 16px 56px 16px;
    border-radius: 12px;
  }

  .section__image {
    border-radius: 8px;
  }
}

.footer {
  background: var(--footer-background);
  color: var(--text-contrast);
  text-align: center;
  padding: 16px 0;
}
```

Salida del borde:

```css
.section {
  border: 2px solid rgb(128, 48, 27);
  border: 2px solid var(--border-color);
}
```

### Paso 5: `clamp()`, lo que ya no necesita media query

Un valor que se adapta sin media queries: un mínimo, un valor que crece con la pantalla y un máximo.

_src/css/main.css_

```css
.section {
  .section__title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
}
```

Salida:

```css
.section .section__title {
  font-size: max(1.5rem, min(4vw, 2.5rem));
}
```

Se lee así: nunca menos de `1.5rem`, nunca más de `2.5rem`, y entre medias el 4% del ancho de la ventana. El título crece y encoge solo.

Comparadlo con el título de la cabecera, que hace lo mismo **a saltos**: `3rem` y, a partir de 768px, `7rem`. Dos formas de resolver lo mismo, y las dos están en el proyecto. Redimensionad el navegador despacio y miradlos.

`max()` y `min()` tienen más soporte que `clamp()` en navegadores antiguos: por eso lo reescribe así.

## 🛠️ Práctica 3: plugins tipo Sass

Hasta aquí PostCSS nos ha servido para ir **hacia el estándar**. Ahora vamos a la otra cara: plugins que dan **comodidades para escribir**, las mismas ideas que Sass, sin meter Sass en el proyecto.

> En otros tutoriales el primero de la lista es `postcss-import`, para partir el CSS en archivos. Aquí no hace falta: **Vite ya resuelve los `@import`**, como vimos en la práctica 1.

### Paso 1: instalar y ordenar

Parad el servidor.

```bash
npm i -D postcss-nested postcss-simple-vars postcss-mixins
```

_postcss.config.js_

```js
import simpleVars from 'postcss-simple-vars';
import mixins from 'postcss-mixins';
import nested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [simpleVars(), mixins(), nested(), postcssPresetEnv({ stage: 1 })]
};
```

**El orden importa, y mucho.** PostCSS pasa el CSS por los plugins de arriba abajo, y cada uno recibe lo que le dejó el anterior:

1. `simpleVars` sustituye las `$variable` por su valor.
2. `mixins` expande los mixins, que traen dentro `&` y `@media`.
3. `nested` aplana todo ese anidamiento.
4. `preset-env` traduce lo que queda y pone prefijos y respaldos.

Si los ponemos en otro orden, puede que un plugin reciba sintaxis que no entiende y la deje pasar tal cual. **Si algo deja de funcionar, lo primero que se mira es este array.**

### Paso 2: anidar con BEM

Hasta ahora anidábamos escribiendo el nombre completo de la clase dentro del bloque, y la salida era `.section .section__image`: **dos clases**.

Con `postcss-nested` podemos escribir **solo el trozo que cambia**, con `&`:

_src/css/main.css_

```css
.header {
  padding: 20px 0;

  &__title {
    text-align: center;
    font-size: 3rem;
    color: var(--text-primary);
    user-select: none;

    @media (--bp-md) {
      font-size: 7rem;
    }
  }
}

.section {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;

  &__title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  &__image-container {
    max-width: 400px;
    border: 2px solid var(--border-color);
    padding: 24px 16px 56px 16px;
    border-radius: 12px;
  }

  &__image {
    border-radius: 8px;
  }
}
```

Salida:

```css
.header {
  padding: 20px 0;
}

.header__title {
  text-align: center;
  font-size: 3rem;
  color: #562012;
  color: var(--text-primary);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .header__title {
    font-size: 7rem;
  }
}

.section__title {
  font-size: max(1.5rem, min(4vw, 2.5rem));
}

.section__image {
  border-radius: 8px;
}
```

El `&` es **el selector del bloque**, y al pegarle `__title` sale el nombre completo.

|                  | Lo escribimos                            | Lo que sale              | Especificidad |
| ---------------- | ---------------------------------------- | ------------------------ | ------------- |
| Nesting nativo   | `.header__title { }` dentro de `.header` | `.header .header__title` | dos clases    |
| `postcss-nested` | `&__title { }`                           | `.header__title`         | una clase     |

La diferencia real no es escribir menos: es que **la especificidad no sube**. Con BEM, donde cada elemento ya lleva el nombre del bloque, esto encaja perfecto: `.header__title` no necesita estar dentro de `.header` para saber a quién pertenece, ya lo dice su nombre.

El `&` concatenando texto **no funciona en CSS nativo**. Esto solo lo tenemos con el plugin.

### Paso 3: variables `$`

Ya tenemos variables CSS. ¿Para qué otras? Porque **no son lo mismo**:

| `--variable` (CSS)                          | `$variable` (simple-vars) |
| ------------------------------------------- | ------------------------- |
| Vive en el navegador                        | Desaparece al compilar    |
| Se puede cambiar con JavaScript, con temas… | Valor fijo                |
| **No funciona dentro de `@custom-media`**   | **Sí funciona**           |

Ese último punto es el caso de uso de verdad. Nuestro breakpoint está escrito a pelo, y ese `768px` acaba haciendo falta en más sitios.

_src/css/variables.css_

```css
$md: 768px;

:root {
  --main-color: #562012;
  --pure-white: #ffffff;
  --light-color: hsl(from var(--main-color) h s calc(l + 70));
  --surface-color: var(--light-color);
  --footer-background: var(--main-color);
  --text-primary: var(--main-color);
  --text-base: hsl(from var(--main-color) h s calc(l - 15) / 0.87);
  --text-contrast: hsl(from var(--pure-white) h s l / 0.7);
  --border-color: hsl(from var(--main-color) h s calc(l + 10));
  --border-page-color: hsl(from var(--main-color) h s calc(l + 60));
}
```

_src/css/main.css_

```css
@custom-media --bp-md (width >= $md);
```

La salida es exactamente la misma que antes, y eso es lo interesante: la `$md` **ha desaparecido** al compilar, no llega al navegador.

> La `$` va fuera del `:root`. No es una variable CSS, es una marca para PostCSS.

**Regla rápida:** `$` para medidas fijas y para sitios donde las variables CSS no llegan; `--` para colores y para todo lo que queramos poder cambiar en caliente.

### Paso 4: mixins

Un mixin es un bloque de CSS al que ponemos nombre y usamos donde queramos.

Cread `src/css/mixins.css` e importadlo en `main.css`:

```css
@import './variables.css';
@import './mixins.css';
```

_src/css/mixins.css_

```css
@define-mixin hover {
  @media (hover: hover) {
    &:hover {
      @mixin-content;
    }
  }
}
```

Dos piezas:

- `@define-mixin hover` le pone nombre.
- `@mixin-content` es **el hueco** donde se mete lo que le pasemos al usarlo.

Y el motivo de que este mixin exista: en pantallas táctiles el `:hover` se queda pegado al tocar, porque el dedo no se puede "quitar de encima". Con `@media (hover: hover)` el efecto solo se aplica si el dispositivo tiene un puntero de verdad.

_src/css/main.css_

```css
.section {
  &__image {
    border-radius: 8px;
    transition: transform 0.3s ease;

    @mixin hover {
      transform: scale(1.5);
    }
  }
}
```

Salida:

```css
.section__image {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

@media (hover: hover) {
  .section__image:hover {
    transform: scale(1.5);
  }
}
```

El día que decidamos que el hover necesita otra condición, lo cambiamos **en el mixin** y se arregla en todo el proyecto.

### Paso 5: mixins con parámetros, y la hoja de cuaderno

Cada vez que hacemos un `::before` decorativo repetimos siempre lo mismo: `display`, `content: ''` y `position: absolute`. Eso va al mixin; lo que cambia, a los parámetros.

_src/css/mixins.css_

```css
@define-mixin pseudo $width, $height {
  display: block;
  content: '';
  position: absolute;
  width: $(width);
  height: $(height);
  @mixin-content;
}
```

Ojo a la sintaxis: se define con `$width` y se usa dentro con `$(width)`, entre paréntesis.

Vamos a darle a la tarjeta el aspecto de una hoja de cuaderno, con la banda de agujeros a la izquierda:

_src/css/main.css_

```css
.section {
  --pseudo-size: 60px;
  --section-padding: 40px;
  --hole-size: 8px;
  --hole-ring: 1.5px;
  max-width: 800px;
  margin: 0 auto;
  padding: var(--section-padding);
  padding-left: calc(var(--section-padding) - 10px + var(--pseudo-size));
  border: 2px solid var(--border-color);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 20px;
  position: relative;

  &::before {
    @mixin pseudo var(--pseudo-size), 100% {
      z-index: -1;
      top: 0;
      left: 0px;
      border-radius: 8px 0 0 8px;
      background:
        radial-gradient(
          circle at 40% 50%,
          transparent 0 var(--hole-size),
          var(--border-color) calc(var(--hole-size) + 0.5px),
          var(--border-color) calc(var(--hole-size) + var(--hole-ring)),
          transparent calc(var(--hole-size) + var(--hole-ring) + 0.5px)
        ),
        var(--border-page-color);
      background-size: 100% 25%;
      background-repeat: repeat-y;
      mask: radial-gradient(
          circle at 40% 50%,
          transparent 0 var(--hole-size),
          #000 calc(var(--hole-size) + 0.5px)
        )
        left top / 100% 25% repeat-y;
    }
  }
}
```

Salida:

```css
.section::before {
  display: block;
  content: '';
  position: absolute;
  width: var(--pseudo-size);
  height: 100%;
  z-index: -1;
  top: 0;
  left: 0px;
  border-radius: 8px 0 0 8px;
  background:
    radial-gradient(
      circle at 40% 50%,
      transparent 0 var(--hole-size),
      rgb(128, 48, 27) calc(var(--hole-size) + 0.5px),
      rgb(128, 48, 27) calc(var(--hole-size) + var(--hole-ring)),
      transparent calc(var(--hole-size) + var(--hole-ring) + 0.5px)
    ),
    rgb(238, 186, 172);
  background-size: 100% 25%;
  background-repeat: repeat-y;
  -webkit-mask: radial-gradient(
      circle at 40% 50%,
      transparent 0 var(--hole-size),
      #000 calc(var(--hole-size) + 0.5px)
    )
    left top / 100% 25% repeat-y;
  mask: radial-gradient(
      circle at 40% 50%,
      transparent 0 var(--hole-size),
      #000 calc(var(--hole-size) + 0.5px)
    )
    left top / 100% 25% repeat-y;
}

@supports (background: radial-gradient(red, red 1px 2px, red 3px)) {
  .section::before {
    background:
      radial-gradient(
        circle at 40% 50%,
        transparent 0 var(--hole-size),
        var(--border-color) calc(var(--hole-size) + 0.5px),
        var(--border-color) calc(var(--hole-size) + var(--hole-ring)),
        transparent calc(var(--hole-size) + var(--hole-ring) + 0.5px)
      ),
      var(--border-page-color);
    background-size: 100% 25%;
    background-repeat: repeat-y;
  }
}
```

Qué está pasando en ese bloque:

- Las tres propiedades de siempre salen del mixin; el ancho y el alto van como parámetros, y entre llaves va lo propio de este caso.
- El **`mask`** recorta los agujeros, así que son transparentes de verdad. El anillo se pinta en el `background`, **justo por fuera** de lo que recorta la máscara: por eso `--hole-size` y `--hole-ring` se usan en los dos sitios y siempre encajan.
- El `padding-left` usa la variable del ancho de la banda, así el texto nunca se mete encima.
- Y el padre necesita `position: relative`, si no el pseudo-elemento se iría a buscar otro ancestro.

En la salida aparecen dos cosas nuevas:

- **`-webkit-mask`**: Autoprefixer ha duplicado la propiedad con prefijo.
- **Un `@supports`**: la sintaxis `transparent 0 8px` (dos posiciones en una parada del degradado) no la entienden todos los navegadores. PostCSS deja arriba la versión con los colores resueltos y, dentro del `@supports`, la versión con variables para los navegadores que sí la soportan.

## Hasta dónde llega PostCSS

La regla, que es la idea que hay que llevarse de la sesión:

> **Si se puede reescribir con CSS antiguo equivalente, PostCSS lo hace. Si hace falta que el motor del navegador haga algo nuevo, no sale.**

Por ejemplo, centrar en vertical con `align-content` sobre un `display: block`:

```css
.section__image-container {
  height: 300px;
  display: block;
  align-content: center;
}
```

Sale exactamente igual: PostCSS no lo toca. No hay forma de escribir eso con CSS viejo, o el navegador sabe colocar la caja o no sabe. Lo mismo pasa con `:has()`, las container queries o `@scope`: pasan tal cual.

Para algunas de esas cosas existen **polyfills**, que es JavaScript que simula la función en el navegador. Pero eso ya no es PostCSS resolviéndolo: es un script en nuestra página, con su peso y su parpadeo al cargar. De hecho `preset-env` trae cinco características que necesitan librería de cliente (`:has()`, `:focus-visible`, `:focus-within`, `:blank` y `prefers-color-scheme`) y vienen **desactivadas** por defecto.

## Dónde queda cada cosa

| Plugin                | Qué resuelve                                    | ¿Llega al navegador?      |
| --------------------- | ----------------------------------------------- | ------------------------- |
| `postcss-preset-env`  | Compatibilidad y sintaxis nueva                 | Sí: prefijos y respaldos  |
| `postcss-nested`      | Escribir `&__elemento`                          | No: se aplana al compilar |
| `postcss-simple-vars` | Valores fijos donde las variables CSS no llegan | No: desaparecen           |
| `postcss-mixins`      | Repetir bloques de CSS sin copiar y pegar       | No: se expanden           |

Los tres últimos son **azúcar para quien escribe**: el CSS que sale es el mismo que habríamos escrito a mano, solo que sin escribirlo.

## Para ampliar

- PostCSS: [https://postcss.org/](https://postcss.org/)
- postcss-preset-env y la lista de características con su stage: [https://preset-env.cssdb.org/features/](https://preset-env.cssdb.org/features/)
- PostCSS en Vite: [https://vite.dev/guide/features.html#postcss](https://vite.dev/guide/features.html#postcss)
- Buscador de plugins: [https://www.postcss.parts/](https://www.postcss.parts/)
- Browserslist, para decidir a qué navegadores llegamos: [https://browsersl.ist/](https://browsersl.ist/)
