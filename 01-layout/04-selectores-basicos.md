# 04 · Selectores básicos

> ⏱️ ~20 min

El **selector** es la parte de la regla que dice **a quién** se aplica. Vamos a ver los cuatro básicos; los más finos (combinados, atributos, pseudo-clases…) los veremos más adelante.

| Selector                    | Ejemplo         | Se aplica a…                              |
| --------------------------- | --------------- | ----------------------------------------- |
| De **elemento** (o de tipo) | `p { }`         | **Todos** los `<p>` de la página          |
| De **clase**                | `.nota { }`     | Todos los elementos con `class="nota"`    |
| De **id**                   | `#consejos { }` | El **único** elemento con `id="consejos"` |
| **Universal**               | `* { }`         | **Todos** los elementos                   |

## Selector de elemento

```css
a {
  color: #b45309;
}
```

- Afecta a **casi(*) todos** los `<a>` de la página.
- Perfecto para los estilos generales ("así son los enlaces en mi web").
- El problema: ¿y si solo quiero cambiar **uno** de los párrafos? → clases.

(*) Ya veremos luego detalles.

## Selector de clase

```html
<p class="intro">Preparar un buen café no requiere…</p>
```

```css
.intro {
  font-size: 20px;
}
```

- En el HTML **sin punto**, en el CSS **con punto**.
- Se puede **reutilizar** en todos los elementos que queráis.
- Un elemento puede tener **varias clases**, separadas por espacios: `class="nota nota-importante"`.
- Nombres: en minúsculas y con guiones (`nota-importante`), sin espacios ni tildes.
- Poned nombres que digan **qué es**, no **cómo se ve**: `.aviso` aguanta un rediseño; `.rojo` deja de tener sentido el día que el aviso pase a ser naranja.

## Selector de id

```html
<section id="consejos">…aquí van consejos</section>
```

```css
#consejos {
  background-color: #fef3c7;
}
```

- En el HTML sin almohadilla, en el CSS **con `#`**.
- Un `id` es **único**: no puede repetirse en la página.
- ⚠️ **Evitad usar ids para dar estilo**:
  - No se reutilizan.
  - **Pesan mucho** en la cascada: una regla con id gana a casi todas las de clase, y luego cuesta sobrescribirla (lo vemos en especificidad).
- ¿Para qué sirven entonces? Para **enlaces internos** (`href="#consejos"` salta a esa sección), formularios (`<label for="email">`) y JavaScript.

## Selector universal

```css
* {
  outline: 1px solid red;
}
```

- Se aplica a **todo**.
- Se usa poco y para cosas muy generales (lo veremos en el reset CSS).
- El truco de arriba es **oro para depurar**: dibuja el contorno de cada elemento y veis cómo se reparte la página en cajas. 📦 Spoiler del modelo de caja.

## 🛠️ Práctica

### 0. Punto de partida

Cread una carpeta nueva `04-selectores` con estos dos ficheros:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Selectores básicos</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav>
      <a href="#">Inicio</a>
      <a href="#">Consejos</a>
    </nav>

    <h1>Cómo preparar un buen café</h1>

    <p>
      Preparar un buen café no requiere una cafetera de mil euros, solo buen
      grano y un poco de paciencia.
    </p>

    <p>
      Si quieres profundizar, en <a href="https://developer.mozilla.org">MDN</a>
      no hay café, pero sí mucho CSS.
    </p>

    <p>Consejo: muele el café justo antes de prepararlo.</p>

    <section>
      <h2>Consejos</h2>
      <p>La regla más habitual: unos 60 gramos de café por litro de agua.</p>
      <p>Consejo: una báscula de cocina es tu mejor aliada.</p>
    </section>
  </body>
</html>
```

_./styles.css_ (lo que dejamos en el 03)

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
  color: #333;
}
```

### 1. Selector de elemento: el color de los enlaces

_./styles.css_

```diff
  body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #333;
  }

+ a {
+   color: #b45309;
+ }
+
+ h1 {
+   color: #3b2412;
+ }
```

Recargad: **todos** los enlaces cambian de color, y el `h1` también.

🧩 **¿Os acordáis de los enlaces que seguían azules en el 03?** El navegador tiene su propia regla para `a` que les pone el azul. Un valor **heredado** del `body` pierde contra **cualquier** regla que apunte directamente al elemento, incluida la del navegador. Ahora que nosotros apuntamos a `a` directamente, ganamos.

### 2. Selector de clase: la entradilla

Queremos que **solo el primer párrafo** se vea más grande. Con `p { }` cambiarían todos, así que usamos una clase:

_./index.html_

```diff
- <p>
+ <p class="intro">
    Preparar un buen café no requiere una cafetera de mil euros, solo
```

_./styles.css_

```diff
+ .intro {
+   font-size: 20px;
+   color: #555;
+ }
```

Solo cambia **ese** párrafo, el resto sigue igual.

### 3. Una clase reutilizable: notas destacadas

Los dos párrafos que empiezan por "Consejo" queremos que se vean como un bloque destacado:

_./index.html_

```diff
- <p>Consejo: muele el café justo antes de prepararlo.</p>
+ <p class="nota">Consejo: muele el café justo antes de prepararlo.</p>
  ...
- <p>Consejo: una báscula de cocina es tu mejor aliada.</p>
+ <p class="nota">Consejo: una báscula de cocina es tu mejor aliada.</p>
```

_./styles.css_

```diff
+ .nota {
+   background-color: #fef3c7;
+   border-left: 4px solid #d97706;
+   padding: 12px;
+ }
```

Una regla, dos elementos. Si mañana queremos las notas en verde, se cambia en **un** sitio.

> `border` y `padding` son del **modelo de caja**; los vemos en detalle en el 06.

### 3b. Varias clases en un mismo elemento

El segundo consejo es más importante que el primero y queremos que destaque **en rojo**… pero sin perder el estilo de nota (el padding, el borde a la izquierda). No hace falta copiar la regla `.nota` entera: un elemento puede tener **varias clases a la vez**, separadas por un espacio:

_./index.html_

```diff
- <p class="nota">Consejo: una báscula de cocina es tu mejor aliada.</p>
+ <p class="nota nota-importante">Consejo: una báscula de cocina es tu mejor aliada.</p>
```

_./styles.css_

```diff
  .nota {
    background-color: #fef3c7;
    border-left: 4px solid #d97706;
    padding: 12px;
  }
+
+ .nota-importante {
+   background-color: #fee2e2;
+   border-left-color: #dc2626;
+ }
```

Recargad. El segundo consejo recibe **las dos reglas**:

- De `.nota`: el padding y el borde de 4px a la izquierda.
- De `.nota-importante`: el fondo rojizo y el color del borde en rojo.

¿Y el `background-color`, que lo definen las dos? Gana **`.nota-importante`** porque está **después** en el CSS. Cuando dos reglas "pesan" lo mismo, gana la última. (Qué significa exactamente "pesar", lo vemos en el 15, especificidad.)

👉 Es la forma habitual de hacer **variantes**: una clase base (`nota`, `boton`, `tarjeta`) y otra que cambia solo lo que haga falta (`nota-importante`, `boton-grande`…).

### 4. Id: un enlace interno

_./index.html_

```diff
  <nav>
    <a href="#">Inicio</a>
-   <a href="#">Consejos</a>
+   <a href="#consejos">Consejos</a>
  </nav>
  ...
- <section>
+ <section id="consejos">
    <h2>Consejos</h2>
```

Haced la ventana del navegador **bajita** (para que haya scroll) y pinchad en "Consejos": la página **salta** a esa sección. Fijaos también en la URL: acaba en `#consejos`.

### 5. Universal: rayos X

_./styles.css_

```diff
+ * {
+   outline: 1px solid red;
+ }
```

Recargad y mirad cómo **todo** es una caja: el `nav`, cada `a`, cada `p`, el `section`, el `h2`… Cuando algo "no se coloca donde quiero", este truco ayuda mucho.

**Quitadlo** antes de seguir.

## Para ampliar

- [MDN · Selectores CSS](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Selectors)
- [MDN · Selectores de tipo, clase e ID](https://developer.mozilla.org/es/docs/Learn/CSS/Building_blocks/Selectors/Type_Class_and_ID_Selectors)
