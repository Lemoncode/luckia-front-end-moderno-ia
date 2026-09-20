# 18 · Profundidad: `z-index`

> ⏱️ ~15 min

## El problema que nos dejó el 17

Al hacer scroll, la tarjeta se dibujaba **por encima** de la cabecera pegada. ¿Por qué?

Porque cuando dos cajas se solapan, el navegador tiene un **orden de pintado** por defecto:

1. Primero los **fondos y bordes** del contenedor.
2. Después los elementos **normales** (en el flujo).
3. Y por último, los elementos **posicionados** (`relative`, `absolute`, `fixed`, `sticky`), **en el orden en que aparecen en el HTML**.

La cabecera y la tarjeta están las dos posicionadas… y la tarjeta va **después** en el HTML. Así que gana la tarjeta.

Hasta ahora hemos colocado cajas en **dos dimensiones** (arriba/abajo, izquierda/derecha). `z-index` añade la **tercera**: quién está **delante** y quién **detrás**. El nombre viene de los ejes: **x** horizontal, **y** vertical, **z** hacia el usuario.

## Las reglas de `z-index`

- Es un **número entero**: `z-index: 1`, `10`, `-1`… **Más alto = más cerca de vosotros** (más delante).
- Su valor por defecto es `auto`, que se comporta como 0.
- ⚠️ **Solo funciona en elementos posicionados**: si el elemento es `static`, `z-index` **se ignora**. (Excepción: también funciona en los hijos de un flex o un grid, lo veréis en el 19.)
- Con el mismo `z-index`, desempata **el orden del HTML**: gana el último.

## Vamos a verlo

Seguimos con el ejemplo del 17 (copiad la carpeta o seguid trabajando sobre ella).

### Paso 1: la cabecera, por encima de todo

Queremos que la cabecera pegada se vea **siempre por encima** del contenido:

_./styles.css_

```diff
  .cabecera {
    position: sticky;
    top: 0;
+   z-index: 10;
    padding: 1rem;
```

Haced scroll: ahora la tarjeta pasa **por debajo** de la cabecera, como en cualquier web.

> ¿Por qué `10` y no `1`? Podría ser `1`. Se suelen dejar huecos (10, 20, 30…) para poder meter algo en medio más adelante sin renumerar todo.

> 🏠 **A partir de aquí, para practicar en casa.** En clase nos quedamos con el paso 1 (que es el caso del 99% de las veces) y con la idea de que existe el *contexto de apilamiento*. Los pasos 2 y 3 y los consejos del final son cortos, pero merecen que los hagáis con calma: el paso 3 es el error con `z-index` que os vais a encontrar tarde o temprano.

### Paso 2: números negativos

Probad a mandar la etiqueta "-20%" **al fondo**:

_./styles.css_

```diff
  .etiqueta {
    position: absolute;
    top: 1.75rem;
    right: 1.75rem;
+   z-index: -1;
```

La etiqueta **desaparece**: se ha ido **detrás de la foto**. Los valores negativos colocan el elemento por detrás del contenido de su contenedor (e incluso por detrás de su fondo, si lo tuviera).

Quitadlo (`z-index: -1`) antes de seguir.

### Paso 3: el clásico "le he puesto 9999 y no funciona"

Este es **el** error con `z-index`, y os va a pasar. Vamos a provocarlo.

Imaginad que la tarjeta tiene un efecto de transparencia (algo muy normal: un `opacity`, una animación, una sombra con `filter`…):

_./styles.css_

```diff
  .tarjeta {
    position: relative;
+   opacity: 0.99;
    border: 1px solid #e0d6cc;
```

A simple vista **no cambia nada** (0.99 es casi opaco). Ahora intentad que la etiqueta se ponga por encima de la cabecera, a lo bestia:

```diff
  .etiqueta {
    position: absolute;
+   z-index: 9999;
```

Haced scroll… y la etiqueta **sigue pasando por debajo** de la cabecera, que solo tiene `z-index: 10`. 😤 ¿9999 pierde contra 10?

**Sí**, y este es el motivo: la tarjeta, al tener `opacity` menor que 1, ha creado un **contexto de apilamiento** (*stacking context*). Dentro de ese contexto, el 9999 de la etiqueta solo compite **con sus hermanos de dentro de la tarjeta**. Hacia fuera, la etiqueta **no puede** superar a su tarjeta: se mueve con ella, como en un edificio donde el piso 9999 de un bloque bajo sigue estando por debajo del tejado del bloque de al lado.

Quitad el `opacity: 0.99` y recargad: ahora sí, la etiqueta se pone por encima de la cabecera.

**¿Qué crea un contexto de apilamiento?** Los casos más habituales:

- Un elemento **posicionado** con un `z-index` distinto de `auto`.
- `opacity` menor que 1.
- `transform`, `filter`, `backdrop-filter`…
- Un hijo de un **flex** o **grid** con `z-index`.

> 🔎 **Truco de DevTools**: en **Firefox**, en el panel de Elements, los elementos que crean un contexto de apilamiento salen marcados con una etiqueta. En Chrome, el panel **Layers** (en los "…" → *More tools*) enseña las capas en 3D.

## Consejos para no acabar en el infierno del `z-index`

- **No useis `9999`.** Si tenéis que subir tanto, casi siempre el problema es un contexto de apilamiento, no el número.
- **Definid una escala pequeña** y dejadla escrita, por ejemplo con variables (05):

  ```css
  :root {
    --z-cabecera: 10;
    --z-desplegable: 20;
    --z-modal: 30;
    --z-aviso: 40;
  }
  ```

- **Solo a quien lo necesita**: si dos cosas no se solapan, no les pongáis `z-index`.
- Cuando algo "no se pone delante", el orden de sospechosos es: 1) ¿está **posicionado**? 2) ¿hay un **contexto de apilamiento** por encima? 3) y ya luego, el número.

## Para ampliar

- [MDN · z-index](https://developer.mozilla.org/es/docs/Web/CSS/z-index)
- [MDN · Contexto de apilamiento](https://developer.mozilla.org/es/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)
- [Josh W. Comeau · What the heck, z-index??](https://www.joshwcomeau.com/css/stacking-contexts/) (en inglés)
