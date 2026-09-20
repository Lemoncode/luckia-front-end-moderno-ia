# 17 · Posicionamiento (`position`)

> ⏱️ ~30 min

## Salirse del "flujo normal"

Hasta ahora, todas nuestras cajas se han colocado **solas**, siguiendo el **flujo normal** de la página: los bloques uno debajo de otro, los elementos en línea uno detrás de otro (09). Es lo que queremos el 90% de las veces.

Pero hay cosas que no encajan en ese flujo:

- Una **etiqueta de "Oferta"** en la esquina de una foto, **encima** de ella.
- Una **cabecera** que se queda **pegada arriba** al hacer scroll.
- Un botón de **"volver arriba"** o de chat que **siempre** está en la esquina de la pantalla.

Para eso está la propiedad **`position`**: le dice al navegador **cómo** colocar una caja, y con `top`, `right`, `bottom` y `left` le decimos **dónde**.

## Los cinco valores

| Valor      | ¿Ocupa su hueco en el flujo? | `top`/`left`… se miden respecto a…                     | Para…                                                                |
| ---------- | ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| `static`   | Sí                           | (no hacen nada)                                        | Lo normal, el valor por defecto                                      |
| `relative` | **Sí**                       | su **propia posición** original                        | Moverla un poco… y sobre todo, ser **referencia** para un `absolute` |
| `absolute` | **No**                       | el **ancestro posicionado** más cercano                | Etiquetas, iconos, menús desplegables **encima** de algo             |
| `fixed`    | **No**                       | la **ventana**                                         | Botones flotantes, avisos que no se mueven con el scroll             |
| `sticky`   | Sí                           | la ventana, **mientras su contenedor esté a la vista** | Cabeceras que se "pegan" al hacer scroll                             |

> "Ancestro posicionado" = el padre, abuelo… más cercano que tenga un `position` **distinto de `static`**.

## Vamos a verlo

Cread una carpeta (por ejemplo `17-posicion`) con un `index.html` y un `styles.css`.

### Paso 0: punto de partida

Una página **larga** (para poder hacer scroll) con una cabecera, una tarjeta de producto y un botón de "volver arriba" al final:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Posicionamiento</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="cabecera">
      <strong>Café &amp; Código</strong>
    </header>

    <main class="contenido">
      <h1>Nuestros cafés</h1>

      <article class="tarjeta">
        <img
          src="https://images.unsplash.com/photo-1715692727454-130e0dcad687?w=600&h=300&fit=crop"
          alt="Taza de café sobre una mesa de madera"
        />
        <span class="etiqueta">-20%</span>
        <h2>Café de Etiopía</h2>
        <p>Notas florales y afrutadas. Tueste claro, ideal para filtro.</p>
      </article>

      <p>
        Preparar café de filtro es casi un ritual. Requiere algo de paciencia,
        buen grano y agua a la temperatura adecuada.
      </p>
      <p>
        Lo más importante es la proporción entre café y agua: unos 60 gramos por
        litro es un buen punto de partida.
      </p>
      <p>
        La molienda también cuenta: para filtro, ni muy fina ni muy gruesa,
        parecida a la sal de mesa.
      </p>
      <p>
        El agua, mejor filtrada y a unos 93 °C. Si hierve, quemará el café y
        saldrá amargo.
      </p>
      <p>
        Vierte primero un poco de agua para que el café "florezca" y suelte el
        gas, espera 30 segundos y sigue.
      </p>
      <p>
        Y sobre todo: prueba, ajusta y vuelve a probar hasta dar con tu taza
        perfecta.
      </p>
    </main>

    <a href="#" class="boton-arriba">↑</a>
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
  font-size: 1.25rem;
  line-height: 1.7;
  color: #333;
}

.cabecera {
  padding: 1rem;
  background-color: #3b2412;
  color: white;
}

.contenido {
  max-width: 40rem;
  margin: 0 auto;
  padding: 1rem;
}

.tarjeta {
  border: 1px solid #e0d6cc;
  border-radius: 12px;
  padding: 1rem;
}

.tarjeta img {
  display: block;
  max-width: 100%;
  border-radius: 8px;
}

.etiqueta {
  background-color: #dc2626;
  color: white;
  font-weight: bold;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.boton-arriba {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #b45309;
  color: white;
  text-decoration: none;
  border-radius: 999px;
}
```

(Si en vuestra pantalla no hay scroll, haced la ventana más bajita o copiad los párrafos un par de veces.)

### Paso 1: `static` — lo de siempre

Todo está en el **flujo normal**. La etiqueta "-20%" está debajo de la foto, como un elemento en línea más. Probad a moverla:

_./styles.css_

```diff
  .etiqueta {
+   top: -20px;
+   left: 20px;
    background-color: #dc2626;
```

**No pasa nada.** Con `position: static` (el valor por defecto), `top`, `left`… **se ignoran**. Para que funcionen, la caja tiene que estar **posicionada**.

### Paso 2: `relative` — moverse sin dejar el sitio

_./styles.css_

```diff
  .etiqueta {
+   position: relative;
    top: -20px;
    left: 20px;
    background-color: #dc2626;
```

La etiqueta **sube** 20px y se mueve 20px a la derecha **respecto a donde estaba**. Pero fijaos: el hueco que ocupaba **sigue ahí**. Para el resto de la página, la etiqueta sigue en su sitio original; solo se **dibuja** desplazada.

> `top: -20px` = "empújala desde arriba… -20px", o sea, súbela. Los valores negativos van en sentido contrario.

Mover cosas así casi nunca se usa. El **verdadero** uso de `relative` lo vemos en el paso siguiente.

### Paso 3: `absolute` — la etiqueta en la esquina de la foto

Queremos la etiqueta **encima** de la foto, en la **esquina superior derecha**, como en cualquier tienda online:

_./styles.css_

```diff
  .etiqueta {
-   position: relative;
-   top: -20px;
-   left: 20px;
+   position: absolute;
+   top: 1.75rem;
+   right: 1.75rem;
    background-color: #dc2626;
```

😮 La etiqueta se ha ido a la esquina… **de la página**, no de la tarjeta. Y además, el hueco que ocupaba ha **desaparecido**: un `absolute` **sale del flujo**, el resto de la página se comporta como si no existiera.

¿Por qué la página? Porque `top` y `right` se miden respecto al **ancestro posicionado** más cercano. La tarjeta es `static`, el `main` es `static`, el `body` es `static`… así que usa la página entera.

La solución es **el truco más usado de todo `position`**: convertir la tarjeta en referencia con `position: relative` (sin mover nada):

_./styles.css_

```diff
  .tarjeta {
+   position: relative;
    border: 1px solid #e0d6cc;
    border-radius: 12px;
    padding: 1rem;
  }
```

Ahora la etiqueta se coloca en la esquina **de la tarjeta**, encima de la foto. 🎉

> 👉 **Padre `relative` + hijo `absolute`**: memorizad este patrón. Lo usaréis para etiquetas, iconos sobre imágenes, el contador de notificaciones sobre un avatar, el botón de cerrar de un modal, los menús desplegables…

### Paso 4: `fixed` — el botón que siempre está ahí

El botón "↑" está al final de la página: para usarlo hay que llegar hasta abajo… justo cuando ya no hace falta. Queremos que esté **siempre** en la esquina inferior derecha de la **pantalla**:

_./styles.css_

```diff
  .boton-arriba {
+   position: fixed;
+   bottom: 1rem;
+   right: 1rem;
    display: inline-block;
```

Haced scroll: el botón **no se mueve**, está pegado a la ventana. Pulsadlo y os lleva arriba (`href="#"`).

Con `fixed`, `bottom` y `right` se miden respecto a la **ventana** del navegador, da igual dónde esté en el HTML.

**¿Por qué `bottom` y `right`, y por qué `1rem`?** Porque **vosotros elegís desde qué bordes se mide**:

- `top: 1rem` → a 1rem del borde **de arriba**; `bottom: 1rem` → a 1rem del borde **de abajo**.
- Igual con `left` y `right` en los laterales.

Queremos la esquina **inferior derecha** (donde están los botones de chat o de "subir" en casi todas las webs, y donde llega el pulgar en el móvil), así que anclamos por **abajo** y por la **derecha**. Con `top: 1rem; left: 1rem` se iría a la esquina de arriba a la izquierda, encima del logo.

El `1rem` es solo la **separación con el borde**, para que no quede pegado. Probad `3rem` y lo veréis.

Dos detalles más:

- **Se pueden combinar los cuatro.** Si ponéis `top` y `bottom` a la vez y la caja no tiene altura fija, **se estira** para llegar a los dos. Por eso `inset: 0` en un `absolute` hace que ocupe **todo** su contenedor: es la receta del fondo oscuro de un modal.
- **Si no ponéis ninguno**, la caja se queda donde estaba… pero ya fuera del flujo.

### Paso 5: `sticky` — la cabecera que se pega

Al hacer scroll, la cabecera se va con el resto de la página. Queremos que se quede **pegada arriba**… pero solo **cuando llegue** arriba (al principio de la página, que esté en su sitio normal):

_./styles.css_

```diff
  .cabecera {
+   position: sticky;
+   top: 0;
    padding: 1rem;
    background-color: #3b2412;
```

Haced scroll: la cabecera empieza en su sitio y, cuando toca el borde de arriba, **se queda pegada**.

- `sticky` es una mezcla: se comporta como `relative` (en su sitio, ocupando su hueco) **hasta** que llega al `top` que le digamos, y entonces se comporta como `fixed`.
- **Sin `top` (o `bottom`…) no hace nada**: tiene que saber **dónde** pegarse.
- Solo se pega **mientras su contenedor padre está a la vista**. Aquí el padre es el `body`, que es toda la página. Si la metierais dentro de una sección, se "despegaría" al acabarse la sección.

> ⚠️ Si un `sticky` "no funciona" y le habéis puesto `top`, el sospechoso habitual es un **ancestro con `overflow: hidden`** (o `auto`). Lo rompe.

### Paso 6: 🤔 algo raro al hacer scroll

Haced scroll despacio hasta que la **tarjeta** pase por debajo de la cabecera pegada.

¡La **tarjeta** (con su etiqueta) se dibuja **por encima** de la cabecera! Cuando varias cajas posicionadas se solapan, por defecto se pintan en el **orden del HTML**, y la tarjeta va después de la cabecera.

¿Cómo decimos quién va **delante** y quién **detrás**? Con `z-index`… que es justo el 18. 😉

## Para ampliar

- [MDN · position](https://developer.mozilla.org/es/docs/Web/CSS/position)
- [MDN · Posicionamiento (guía)](https://developer.mozilla.org/es/docs/Learn/CSS/CSS_layout/Positioning)
- [Josh W. Comeau · Why doesn't position: sticky work?](https://www.joshwcomeau.com/css/sticky/) (en inglés)
