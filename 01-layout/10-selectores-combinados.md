# 10 · Selectores combinados

> ⏱️ ~15-20 min

## Ya los hemos usado… sin explicarlos

En las secciones anteriores se nos han colado varios selectores "raros", siempre con la promesa de "lo vemos en el 10":

- `.lista li` (05) → los `li` que están **dentro** de `.lista`.
- `.menu a` (09) → los `a` que están **dentro** de `.menu`.
- `h1, p` (08) → los `h1` **y** los `p`.

Con los selectores básicos (elemento, clase, id) solo podemos decir **"a quién"**. Combinándolos podemos decir **"a quién, y dónde está"**: "los enlaces del menú", "el primer párrafo después de un título", "los elementos de una lista menos el primero"… Sin tener que poner una clase a cada cosa.

## Las combinaciones

| Selector     | Nombre                    | Se aplica a…                                                       |
| ------------ | ------------------------- | ------------------------------------------------------------------ |
| `h1, p`      | Lista (coma)              | Los `h1` **y** los `p`. Es una forma de no repetir la misma regla. |
| `.menu a`    | Descendiente (espacio)    | Los `a` que están **dentro** de `.menu`, a cualquier profundidad.  |
| `.menu > li` | Hijo directo (`>`)        | Los `li` que son **hijos directos** de `.menu` (no nietos).        |
| `h2 + p`     | Hermano adyacente (`+`)   | El `p` que va **justo después** de un `h2` (mismo padre).          |
| `h2 ~ p`     | Hermanos siguientes (`~`) | **Todos** los `p` que van después de un `h2` (mismo padre).        |
| `p.intro`    | Compuesto (sin espacio)   | Los elementos que son `p` **y además** tienen la clase `intro`.    |

> ⚠️ **El espacio importa, y mucho**:
>
> - `.menu a` (con espacio) → los `a` **dentro** de algo con clase `menu`.
> - `a.menu` (sin espacio) → los `a` que **tienen** la clase `menu`.
> - `.nota.importante` (sin espacio) → elementos que tienen **las dos** clases a la vez.

"Hijo", "nieto", "hermano"… CSS usa el vocabulario de un **árbol genealógico**:

```html
<ul class="menu">
  ← padre de los li de primer nivel
  <li>Inicio</li>
  ← hijo de .menu, hermano del siguiente li
  <li>
    Cafés
    <ul>
      <li>Etiopía</li>
      ← nieto de .menu (hijo de otro ul)
    </ul>
  </li>
</ul>
```

## Vamos a verlo

Cread una carpeta (por ejemplo `10-combinados`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Selectores combinados</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav>
      <ul class="menu">
        <li><a href="#">Inicio</a></li>
        <li>
          <a href="#">Cafés</a>
          <ul>
            <li><a href="#">Etiopía</a></li>
            <li><a href="#">Colombia</a></li>
          </ul>
        </li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>

    <article>
      <h2>Café con leche perfecto</h2>
      <p>El truco está en calentar la leche sin que llegue a hervir.</p>
      <p>Usa un café con cuerpo, mejor de tueste medio u oscuro.</p>
      <p>Y sirve primero el café, después la leche.</p>
    </article>

    <p>
      Este párrafo está fuera del artículo.
      <a href="#">Ver más recetas</a>
    </p>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}
```

### Paso 1: descendiente (espacio) — los enlaces del menú

Queremos que los enlaces **del menú** sean marrones y sin subrayado… pero **solo esos**, no los que pudiera haber en otras partes de la página:

_./styles.css_

```diff
+ .menu a {
+   color: #3b2412;
+   text-decoration: none;
+ }
```

Cambian **todos** los enlaces del menú, también "Etiopía" y "Colombia", que están dos niveles más abajo. El espacio significa "**dentro**, a cualquier profundidad".

Y fijaos en el enlace **"Ver más recetas"** del final: sigue **azul y subrayado**. No está dentro de `.menu`, así que la regla no le afecta. Justo lo que queríamos.

### Paso 2: hijo directo (`>`) — solo el primer nivel

Ahora queremos que las opciones **principales** del menú (Inicio, Cafés, Contacto) vayan en negrita, pero **no** las del submenú:

_./styles.css_

```diff
+ .menu > li {
+   font-weight: bold;
+ }
```

Recargad… 🤔 ¡"Etiopía" y "Colombia" **también** salen en negrita! ¿Hemos fallado?

No: `font-weight` **se hereda** (07). El selector ha elegido bien (solo los `li` de primer nivel), pero sus hijos heredan la negrita. Comprobadlo en DevTools: seleccionad el `li` de "Etiopía" y en **Styles** veréis "Inherited from li".

Para demostrar que el selector funciona, usad una propiedad que **no** se hereda:

_./styles.css_

```diff
  .menu > li {
-   font-weight: bold;
+   border-top: 4px solid #b45309;
  }
```

Ahora sí: solo las tres opciones principales llevan borde. El submenú, no. Probad a quitar el `>` (`.menu li`) y veréis que el borde aparece **también** en el submenú.

> 💡 Buen recordatorio: cuando un selector "parece que no funciona", mirad si no será **herencia**.

#### ¿Y si de verdad quiero la negrita solo en el primer nivel?

El problema es que le hemos dado la negrita al `li`, y **dentro** de ese `li` está también el submenú entero, que la hereda. La clave es darle el estilo **al elemento exacto** que la necesita: el **enlace** de primer nivel.

_./styles.css_

```diff
+ .menu > li > a {
+   font-weight: bold;
+ }
```

Leedlo de derecha a izquierda: "los `a` que son hijos directos de un `li`, que a su vez es hijo directo de `.menu`".

Ahora "Inicio", "Cafés" y "Contacto" salen en negrita, y "Etiopía" y "Colombia" **no**. ¿Por qué ya no hereda? Porque el `<a>` de "Cafés" solo contiene el texto "Cafés"; el submenú **no está dentro del enlace**, está al lado (es su hermano):

```html
<li>
  <a href="#">Cafés</a>   ← la negrita va aquí…
  <ul>…</ul>              ← …y esto no es hijo del <a>: no hereda nada de él
</li>
```

> La otra opción sería "deshacer" la herencia en el submenú: `.menu ul { font-weight: normal; }`. Funciona, pero es poner un parche para tapar otro. Mejor apuntar bien desde el principio.

### Paso 3: hermano adyacente (`+`) — la entradilla

En el artículo, queremos que el **primer párrafo** después del título sea más grande, como una entradilla. Sin ponerle una clase:

_./styles.css_

```diff
+ h2 + p {
+   font-size: 1.25rem;
+   color: #555;
+ }
```

Solo cambia el párrafo que va **justo después** del `h2`. Los otros dos, no.

### Paso 4: hermanos siguientes (`~`)

Cambiad el `+` por `~`:

_./styles.css_

```diff
- h2 + p {
+ h2 ~ p {
```

Ahora cambian los **tres** párrafos del artículo: todos van después del `h2` y comparten padre. El párrafo de **fuera** del artículo **no** cambia: no es hermano del `h2`. Volved a dejar el `+`.

### Paso 5: el truco del separador (`li + li`)

> Antes de empezar, **quitad la regla `.menu > li { border-top… }` del paso 2**, para que no se mezcle con esta.

Un clásico de cualquier menú o listado: queremos una **línea que separe** las opciones. Pero **entre** ellas: no queremos una línea encima de la primera (quedaría una raya suelta arriba del todo).

**Primer intento, lo obvio**: una línea encima de cada opción.

_./styles.css_

```diff
+ .menu > li {
+   border-top: 1px solid #e0d6cc;
+ }
```

Recargad: sale una línea encima de **Inicio**, **Cafés** y **Contacto**. La de Inicio sobra. Podríamos crear una clase `primero` para quitársela… pero hay una forma más elegante.

**Segundo intento, con `+`**:

_./styles.css_

```diff
- .menu > li {
+ .menu > li + li {
    border-top: 1px solid #e0d6cc;
  }
```

¿Qué dice `li + li`? Recordad que el estilo se aplica siempre a **lo último** del selector. Así que se lee: _"un `li`… que tiene **otro `li` justo antes**"_.

Vamos opción por opción:

| Opción   | ¿Tiene un `li` justo antes? | ¿Línea encima? |
| -------- | --------------------------- | -------------- |
| Inicio   | No, es el primero           | ❌             |
| Cafés    | Sí (Inicio)                 | ✅             |
| Contacto | Sí (Cafés)                  | ✅             |

El **único** `li` que no tiene otro delante es el primero, así que `li + li` significa en la práctica **"todos menos el primero"**. Y como la línea va **arriba** de cada uno, queda justo **entre** opciones.

Sin clases extra y sin tener que "quitársela" a nadie. Si mañana añadís una opción nueva al menú, la línea aparece sola.

### Paso 5b (propina): que parezca un menú de verdad

Ya tenemos los separadores, pero aquello sigue pareciendo una **lista de la compra**: con sus viñetas (los puntitos) y metida hacia la derecha. Vamos a dejarlo como un menú lateral, usando lo que ya sabemos.

Primero, fuera viñetas y sangría. Las dos cosas las pone el navegador a las listas: las viñetas con `list-style`, y el hueco de la izquierda con un **padding** (no un margin) de unos 40px. Lo quitamos en la lista principal **y** en el submenú, con una lista de selectores (coma). Como es la "base" del menú, la ponemos **arriba del todo**, justo después de `body`:

_./styles.css_

```diff
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
  }

+ .menu,
+ .menu ul {
+   list-style: none;
+   padding: 0;
+   margin: 0;
+ }
+
  .menu a {
    color: #3b2412;
    text-decoration: none;
  }
```

Ahora le damos forma de "caja" al menú y aire a cada opción. Justo **debajo** de la regla anterior:

_./styles.css_

```diff
  .menu,
  .menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

+ .menu {
+   max-width: 15rem;
+   background-color: #f5f0eb;
+   border: 1px solid #e0d6cc;
+   border-radius: 8px;
+ }
+
+ .menu > li {
+   padding: 0.5rem 1rem;
+ }
+
  .menu a {
    color: #3b2412;
    text-decoration: none;
  }
```

Y el submenú, un poco metido hacia dentro para que se vea que "cuelga" de Cafés, y con letra algo más pequeña. Debajo de `.menu > li`:

_./styles.css_

```diff
  .menu > li {
    padding: 0.5rem 1rem;
  }

+ .menu ul {
+   padding-left: 1rem;
+   font-size: 0.9rem;
+ }
+
  .menu a {
    color: #3b2412;
    text-decoration: none;
  }
```

> ⚠️ **Ojo al orden**: esta regla tiene que ir **después** de la de `.menu, .menu ul { padding: 0 }`. Las dos apuntan al submenú y "pesan" lo mismo, así que **gana la que esté más abajo** en el fichero (esto lo veremos en detalle en el módulo 15).
>
> Si la ponéis antes, el submenú **no se mete hacia dentro** (el `padding: 0` de abajo la pisa), pero la letra **sí** sale más pequeña (esa regla no toca el `font-size`). Comprobadlo en DevTools: en el `ul` del submenú veréis `padding-left: 1rem` **tachado**.

El `styles.css` completo tiene que quedar así (fijaos en el orden):

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.menu,
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu {
  max-width: 15rem;
  background-color: #f5f0eb;
  border: 1px solid #e0d6cc;
  border-radius: 8px;
}

.menu > li {
  padding: 0.5rem 1rem;
}

.menu ul {
  padding-left: 1rem;
  font-size: 0.9rem;
}

.menu a {
  color: #3b2412;
  text-decoration: none;
}

.menu > li > a {
  font-weight: bold;
}

.menu > li + li {
  border-top: 1px solid #e0d6cc;
}

h2 + p {
  font-size: 1.25rem;
  color: #555;
}
```

Ya tenemos un menú lateral decente: sin viñetas, con separadores, con submenú y sin una sola clase extra en el HTML, solo combinando selectores.

> 🔮 Faltan cosas de menú "de verdad", como que la opción **cambie de color al pasar el ratón** (_hover_). Eso lo haremos en el módulo 12, pseudo-clases.

### Paso 6: lista con coma — no repetirse

Queremos que el `h2` y los enlaces del menú compartan el mismo color. En vez de escribirlo dos veces, podemos separarlo por coma:

La ponemos justo **encima** de la regla `.menu a`, y a esa le **quitamos** el `color`, que ya lo da la nueva:

_./styles.css_

```diff
  .menu ul {
    padding-left: 1rem;
    font-size: 0.9rem;
  }

+ h2,
+ .menu a {
+   color: #3b2412;
+ }
+
  .menu a {
-   color: #3b2412;
    text-decoration: none;
  }

  .menu > li > a {
    font-weight: bold;
  }
```

Recargad: el título del artículo pasa a marrón, y el menú se queda igual. Una sola declaración de color para los dos.

> ⚠️ Si **uno** de los selectores de la lista está mal escrito, el navegador ignora **la regla entera**, no solo ese selector.

## Consejo: no encadenéis de más

Se pueden hacer selectores larguísimos, y la IA os los generará a menudo:

```css
body main article section ul li a { … }   /* 😱 */
```

- **Frágil**: si cambiáis el HTML (quitáis el `section`, por ejemplo), deja de funcionar.
- **Pesado**: cuantos más elementos, más "pesa" en la cascada y más cuesta sobrescribirlo (lo vemos en el 15).

Regla práctica: **uno o dos niveles**, y preferiblemente con clases (`.menu a`, `.tarjeta > h2`).

> 🔮 CSS moderno permite escribir estas combinaciones **anidadas** (_CSS nesting_), como en Sass:
>
> ```css
> .menu {
>   & a {
>     color: #3b2412;
>   }
>   & > li + li {
>     border-top: 1px solid #e0d6cc;
>   }
> }
> ```
>
> ¿Se puede usar ya en todos los navegadores? Buena pregunta para el 13 (Can I use).

Para que veáis cómo quedaría, este es **todo el CSS del ejemplo** escrito con anidamiento. Hace **exactamente lo mismo** que el que hemos construido paso a paso:

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  max-width: 15rem;
  background-color: #f5f0eb;
  border: 1px solid #e0d6cc;
  border-radius: 8px;

  /* .menu > li */
  & > li {
    padding: 0.5rem 1rem;

    /* .menu > li + li */
    & + li {
      border-top: 1px solid #e0d6cc;
    }

    /* .menu > li > a */
    & > a {
      font-weight: bold;
    }
  }

  /* .menu ul (el submenú) */
  & ul {
    list-style: none;
    margin: 0;
    padding: 0 0 0 1rem;
    font-size: 0.9rem;
  }

  /* .menu a */
  & a {
    color: #3b2412;
    text-decoration: none;
  }
}

h2 {
  color: #3b2412;

  /* h2 + p */
  & + p {
    font-size: 1.25rem;
    color: #555;
  }
}
```

Fijaos en:

- **`&` significa "el selector de fuera"**. Dentro de `.menu`, `& > li` es `.menu > li`; y dentro de ese, `& + li` es `.menu > li + li`.
- **Todo lo del menú queda junto**, en un solo bloque: se lee como la estructura del HTML.
- **Desaparece el problema de orden** del paso 5b: el reset del submenú y su `padding-left` ahora están en la **misma** regla (`padding: 0 0 0 1rem` = 0 arriba, 0 derecha, 0 abajo, 1rem izquierda, el shorthand de 4 valores del 06).
- **La lista con coma (`h2, .menu a`) se ha separado**: el color va en `h2` y en `& a`. Al anidar, a veces compensa repetir una línea a cambio de tener cada cosa en su sitio.

> ⚠️ Mismo consejo que antes: anidar es muy cómodo, pero **no anidéis 5 niveles**. Cada nivel es un selector más largo (y más pesado) aunque no lo veáis escrito.


## Para ampliar

- [MDN · Combinadores](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Selectors/Combinators)
- [MDN · Lista de selectores](https://developer.mozilla.org/es/docs/Web/CSS/Selector_list)
