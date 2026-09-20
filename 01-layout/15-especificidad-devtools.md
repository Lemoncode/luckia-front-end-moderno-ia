# 15 · Colisiones, especificidad y DevTools

> ⏱️ ~30 min

## ¿Quién gana cuando dos reglas se pelean?

A lo largo de la sesión nos hemos topado varias veces con reglas que **se pisan**, siempre con un "esto lo vemos en el 15":

- En el 04, `.nota` y `.nota-importante` daban las dos un `background-color`… y ganaba **la de abajo**.
- En el 04 también dijimos que los **ids** "pesan mucho" y cuesta sobrescribirlos.
- En el 03, que el **estilo inline** (`style="…"`) "gana a casi todo".
- En el 08, nuestro reset **pisaba** los estilos del navegador.
- Y en el 10, el submenú no se metía hacia dentro porque **una regla de más abajo** pisaba el `padding`.

Cuando a un elemento le llegan **varias reglas que dicen cosas distintas** sobre la misma propiedad, el navegador tiene que decidir cuál gana. Esa decisión es la **cascada** (la "C" de CSS, 02). Y entenderla es la diferencia entre **arreglar** un estilo que no se aplica… o ir poniendo `!important` a lo loco.

## La cascada en tres preguntas

El navegador se hace estas preguntas **en orden**. En cuanto una desempata, se acabó:

**1. ¿De dónde viene?** Nuestro CSS gana al del navegador (08). (Y `!important` le da la vuelta a todo; ahora lo vemos.)

**2. ¿Qué selector es más específico?** Gana el que apunta al elemento "con más precisión". Esto es la **especificidad**.

**3. ¿Cuál está más abajo?** Si empatan en todo lo anterior, gana **la última** que aparece (en el fichero, o en el último fichero enlazado).

> ¿Y la herencia (07)? Ni siquiera entra en la pelea: un valor heredado solo se usa si **ninguna** regla apunta al elemento. Por eso siempre pierde.

## La especificidad: tres cifras

Cada selector tiene una "puntuación" con **tres cifras** `(A, B, C)`:

| Cifra | Cuenta…                           | Ejemplos                            |
| ----- | --------------------------------- | ----------------------------------- |
| **A** | ids                               | `#menu`                             |
| **B** | clases, atributos y pseudo-clases | `.nota`, `[type="email"]`, `:hover` |
| **C** | elementos y pseudo-elementos      | `p`, `a`, `::before`                |

El `*` y los combinadores (espacio, `>`, `+`, `~`) **no suman nada**.

| Selector                 | Especificidad |
| ------------------------ | ------------- |
| `p`                      | (0, 0, 1)     |
| `.menu a`                | (0, 1, 1)     |
| `.menu > li + li`        | (0, 1, 2)     |
| `a[href^="http"]::after` | (0, 1, 2)     |
| `.menu a:hover`          | (0, 2, 1)     |
| `#menu a`                | (1, 0, 1)     |

**Se comparan como los números de versión**: primero la A; si empata, la B; si empata, la C. Así que `(1, 0, 0)` gana a `(0, 25, 0)`: **un solo id gana a cualquier cantidad de clases**. Por eso decíamos en el 04 que los ids para estilos dan problemas.

Y por encima de todo esto:

- **Estilo inline** (`style="…"`) → gana a cualquier selector.
- **`!important`** → gana incluso al inline.

## Vamos a verlo: el juego de "¿de qué color sale?"

En cada paso, **antes de recargar, apostad**: ¿de qué color saldrá? Después, comprobadlo en el navegador **y en DevTools**.

Cread una carpeta (por ejemplo `15-especificidad`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Especificidad</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav id="menu-principal" class="menu">
      <a href="#" class="enlace">Inicio</a>
      <a href="#" class="enlace activo">Cafés</a>
      <a href="#" class="enlace">Contacto</a>
    </nav>

    <p class="texto">Un párrafo cualquiera.</p>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  font-size: 1.5rem;
}

.enlace {
  margin-right: 1rem;
}
```

(Letra grande para que se vean bien los colores.)

### Paso 1: empate → gana la última

_./styles.css_

```diff
+ .texto {
+   color: green;
+ }
+
+ .texto {
+   color: purple;
+ }
```

🎲 ¿Verde o morado?

**Morado.** Mismo origen, misma especificidad `(0,1,0)`… desempata el **orden**: gana la de abajo.

👉 **DevTools**: seleccionad el `<p>` → **Styles**. Las dos reglas aparecen, **la ganadora arriba** y la perdedora debajo con `color: green` **tachado**. Pasad el ratón por encima del **selector** (`.texto`): Chrome os enseña su **especificidad**.

### Paso 2: la especificidad gana al orden

_./styles.css_

```diff
+ .menu a {
+   color: orange;
+ }
+
+ a {
+   color: crimson;
+ }
```

🎲 `a` va **después**… ¿salen rojos?

**No: naranjas.** `.menu a` es `(0,1,1)` y `a` es `(0,0,1)`. La especificidad se mira **antes** que el orden, así que el orden ni siquiera llega a contar.

### Paso 3: la bomba del id

Queremos que la opción **activa** ("Cafés") salga en otro color. Pero alguien (¿la IA?) había escrito antes esta regla:

_./styles.css_

```diff
+ #menu-principal a {
+   color: steelblue;
+ }
```

Todos los enlaces pasan a azul. Ahora intentamos destacar el activo:

```diff
+ .menu a.activo {
+   color: crimson;
+ }
```

🎲 Está más abajo y es un selector bastante concreto…

**Sigue azul.** `#menu-principal a` es `(1,0,1)` y `.menu a.activo` es `(0,2,1)`. **El id gana siempre.** Para ganarle, tendríamos que poner **otro id** (`#menu-principal a.activo`), y así empieza una **guerra de especificidad**: cada regla nueva tiene que ser más "fuerte" que la anterior.

La solución buena no es subir la apuesta, sino **quitar el id del CSS**:

```diff
- #menu-principal a {
+ .menu a {
    color: steelblue;
  }
```

Ahora `.menu a.activo` `(0,2,1)` gana a `.menu a` `(0,1,1)` y "Cafés" sale en rojo. (Quitad también la regla naranja del paso 2 para que no se mezcle.)

> 👉 **Ids en el HTML**: sí (enlaces internos, formularios, JavaScript). **Ids en el CSS**: mejor no.

> 🔮 ¿Y si ese id está en un CSS que **no podemos tocar** (una librería, código heredado)? CSS moderno tiene una salida elegante: las **capas de cascada**. Lo vemos en el 16.

### Paso 4: el estilo inline

_./index.html_

```diff
- <p class="texto">Un párrafo cualquiera.</p>
+ <p class="texto" style="color: teal;">Un párrafo cualquiera.</p>
```

🎲 Tenemos dos reglas `.texto` en el CSS…

**Verde azulado** (`teal`). El inline gana a cualquier selector. En DevTools aparece arriba del todo como `element.style`. Por eso en el 03 decíamos que se evitara: luego es muy difícil de sobrescribir desde el CSS.

Quitad el `style` antes de seguir.

### Paso 5: `!important`, el botón nuclear

_./styles.css_

```diff
  .texto {
-   color: green;
+   color: green !important;
  }
```

🎲 Es la regla de **arriba**, la que antes perdía…

**Verde.** `!important` se salta la especificidad y el orden (y hasta el inline). Parece la solución a todo… y ese es el problema: la única forma de ganarle a un `!important` es **otro** `!important`, más específico o más abajo. En un proyecto grande eso acaba siendo un caos.

> 👉 Regla práctica: **no uséis `!important`** salvo como último recurso (por ejemplo, para pisar el CSS de una librería externa que no podéis tocar). Si os encontráis poniéndolo, casi siempre el problema es un selector demasiado específico en otra parte: id, cadenas largas… Y ojo: la IA lo usa **muchísimo** para "arreglar" estilos que no se aplican.

Quitad el `!important`.

### Paso 6: `:where()` — especificidad cero

A veces queremos lo **contrario**: unos estilos "de base" que sean **muy fáciles** de sobrescribir. Por ejemplo, en una librería o en un reset.

`:where(…)` agrupa selectores y **no suma nada de especificidad**, cuente lo que cuente lo de dentro:

_./styles.css_

```diff
+ :where(.menu) .enlace {
+   font-weight: bold;
+ }
+
+ .enlace {
+   font-weight: normal;
+ }
```

🎲 La primera parece más específica (una clase más)…

**Normal**, sin negrita. `:where(.menu) .enlace` cuenta como `(0,1,0)`, lo mismo que `.enlace`, así que desempata el orden. Cambiad `:where` por `:is` y recargad: ahora sale **en negrita**, porque `:is(…)` sí suma (`(0,2,0)`). Misma sintaxis, distinto peso:

|                | Especificidad                                |
| -------------- | -------------------------------------------- |
| `:is(A, B)`    | la del selector **más específico** de dentro |
| `:where(A, B)` | **siempre 0**                                |

🤔 **¿Y para qué sirve `:is()`?** Con un solo selector dentro, `:is(.menu) .enlace` es **exactamente lo mismo** que `.menu .enlace`. Su gracia está en **agrupar** varios para no repetir:

```css
/* Sin :is() */
.menu a,
.footer a,
.lateral a {
  color: #3b2412;
}

/* Con :is(): "los a que estén dentro de .menu, .footer o .lateral" */
:is(.menu, .footer, .lateral) a {
  color: #3b2412;
}
```

Hace lo mismo, pero más corto. Dos diferencias con la lista de comas del 10:

- **Especificidad**: `:is()` coge la del selector **más fuerte** de dentro, y la aplica **siempre**. Si dentro hay un id (`:is(#menu, .footer) a`), **todos** los enlaces, también los del footer, pesan como si tuvieran id `(1,0,1)`. Con la lista de comas, `.footer a` seguiría pesando `(0,1,1)`.
- **Es "tolerante"**: si uno de los selectores de dentro está mal escrito, `:is()` ignora **solo ese** y sigue. Con la lista de comas, ya vimos en el 10 que se perdía **la regla entera**.

Y `:where()` es igual que `:is()` (agrupa y es tolerante)… pero con especificidad **cero**.

> 💡 Muchos resets modernos (y el Preflight de Tailwind) usan `:where()` para que sus estilos pesen lo mínimo y los vuestros ganen siempre.

## DevTools: vuestro detective

> 🏠 **Para ver y practicar en casa.** Durante la sesión ya hemos ido usando DevTools en cada sección; aquí está todo **junto**, a modo de chuleta. Repasadlo con cualquiera de los ejemplos de la guía: romped un estilo a propósito y seguid estos pasos hasta encontrar por qué.

Cuando "mi estilo no se aplica", el proceso es siempre el mismo:

1. **Seleccionad el elemento** (clic derecho → _Inspeccionar_, o el icono de la flecha).
2. **Styles**: todas las reglas que le llegan, **ordenadas de la que gana a la que pierde**.
   - Declaración **tachada** → otra regla la pisa. Buscad cuál está más arriba con esa propiedad.
   - Declaración con un **⚠️** → el valor o la propiedad están mal escritos (03).
   - Vuestra regla **no aparece** → el selector no coincide con el elemento (¿clase mal escrita? ¿CSS no cargado?).
   - Pasad el ratón por un **selector** para ver su especificidad.
   - **Checkbox** junto a cada declaración para desactivarla y ver qué pasa.
   - Botón **`:hov`** para forzar `:hover`, `:focus`… (12), y **`.cls`** para añadir o quitar clases al vuelo.
3. **Computed**: el valor **final** de cada propiedad. Desplegad la flechita para ver **de qué regla sale** (lo vimos en el 08). Si Styles os confunde, Computed manda.
4. **Layout**: de momento no lo necesitamos, pero guardadlo en la memoria. Cuando veamos **flexbox** (19) y **grid**, desde aquí se activan unas guías que dibujan las filas, columnas y huecos sobre la página. Imprescindible para maquetar.

> Y recordad que **todo lo que cambiáis en DevTools es temporal**: al recargar se pierde. Cuando encontréis el arreglo, copiadlo a vuestro `styles.css`.

## Resumen

- Gana el **origen** (nuestro CSS > navegador; `!important` le da la vuelta).
- Luego la **especificidad**: ids > clases/atributos/pseudo-clases > elementos.
- Si empatan, **la última**.
- La herencia solo cuenta si no hay ninguna regla.
- Para que todo sea fácil de mantener: **clases**, selectores **cortos**, **sin ids** en el CSS y **sin `!important`**.

## Para ampliar

- [MDN · Cascada, especificidad y herencia](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance)
- [MDN · Especificidad](https://developer.mozilla.org/es/docs/Web/CSS/Specificity)
- [Specificity Calculator](https://specificity.keegan.st/): pegáis un selector y os dice su especificidad (en inglés).
- [Chrome DevTools · Ver y cambiar CSS](https://developer.chrome.com/docs/devtools/css) (en inglés)
