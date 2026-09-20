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

Un clásico: queremos una **línea separando** las opciones del menú, pero **entre** ellas, no encima de la primera. Con `+` es muy fácil: "todo `li` que tenga otro `li` justo antes"… es decir, **todos menos el primero**:

_./styles.css_

```diff
+ .menu > li + li {
+   border-top: 1px solid #e0d6cc;
+ }
```

Inicio no tiene línea encima; Cafés y Contacto, sí. Sin clases extra y sin tener que "quitársela al primero".

### Paso 6: lista con coma — no repetirse

Queremos que el `h2` y los enlaces del menú compartan el mismo color. En vez de escribirlo dos veces:

_./styles.css_

```diff
+ h2,
+ .menu a {
+   color: #3b2412;
+ }
```

(Y podéis quitar el `color` de la regla del paso 1.)

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

## Para ampliar

- [MDN · Combinadores](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Selectors/Combinators)
- [MDN · Lista de selectores](https://developer.mozilla.org/es/docs/Web/CSS/Selector_list)
