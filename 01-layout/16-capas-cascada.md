# 16 · Capas de cascada (`@layer`)

> ⏱️ ~10 min · Intro corta: lo justo para entenderlo cuando os lo encontréis (y os lo vais a encontrar).

> Ojo con el nombre: **layer** (capa), no **layout** (maquetación). No tiene nada que ver con colocar cajas; tiene que ver con **quién gana** en la cascada.

## El problema: en un proyecto real, todos se pelean

En el 15 vimos la **guerra de especificidad**: un id perdido en una regla antigua y, para ganarle, hay que subir la apuesta (otro id, `!important`…).

En un proyecto real, el CSS viene de **muchos sitios a la vez**:

1. Un **reset** (08).
2. Vuestros **estilos base** (tipografía, colores, enlaces…).
3. Los **componentes** (tarjetas, menús, botones…), vuestros o de una librería como MUI.
4. Las **utilidades** (clases pequeñas de "una sola cosa", como las de Tailwind: `p-4`, `text-red-500`…).

Lo lógico es que cada bloque **pueda pisar al anterior**: una utilidad debería ganar a un componente, y un componente a los estilos base. Pero con la cascada "de siempre" eso depende de la **especificidad** de cada selector y del **orden** en que se carguen los ficheros… y basta un selector demasiado fuerte en la base para romperlo todo.

## La solución: decidir el orden por capas

Con `@layer` agrupamos las reglas en **capas** y decimos **en qué orden mandan**:

```css
/* 1. Declaramos las capas y su orden: la ÚLTIMA manda más */
@layer reset, base, componentes, utilidades;

/* 2. Metemos cada regla en su capa */
@layer base {
  a {
    color: #3b2412;
  }
}

@layer componentes {
  .boton {
    background-color: #b45309;
  }
}
```

**La regla de oro**: entre capas distintas, **gana la capa que manda más, sin mirar la especificidad**. Un simple `.clase` en `utilidades` gana a un `#id` en `base`. La especificidad solo sigue contando **dentro** de una misma capa.

## Vamos a verlo

Cread una carpeta (por ejemplo `16-capas`) con un `index.html` y un `styles.css`.

### Paso 0: la bomba del id, otra vez

Recuperamos el problema del paso 3 del 15:

_./index.html_

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Capas de cascada</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <nav id="menu-principal" class="menu">
      <a href="#">Inicio</a>
      <a href="#" class="activo">Cafés</a>
      <a href="#">Contacto</a>
    </nav>
  </body>
</html>
```

_./styles.css_

```css
body {
  font-family: system-ui, sans-serif;
  font-size: 1.5rem;
}

#menu-principal a {
  color: steelblue;
}

.activo {
  color: crimson;
}
```

"Cafés" sale **azul**: `#menu-principal a` `(1,0,1)` aplasta a `.activo` `(0,1,0)`, aunque esté más abajo.

### Paso 1: lo metemos en capas

Imaginad que la regla del id es de los "estilos base" (quizá de otra persona, o de una librería que no podemos tocar) y `.activo` es un estilo de componente. Lo organizamos en capas:

_./styles.css_

```diff
  body {
    font-family: system-ui, sans-serif;
    font-size: 1.5rem;
  }

+ @layer base, componentes;
+
+ @layer base {
    #menu-principal a {
      color: steelblue;
    }
+ }

+ @layer componentes {
    .activo {
      color: crimson;
    }
+ }
```

Recargad: **"Cafés" sale en rojo.** El id sigue ahí, con toda su especificidad… pero está en la capa `base`, y `componentes` manda más. **Fin de la guerra**, sin tocar el selector y sin `!important`.

👉 **DevTools**: seleccionad "Cafés" → **Styles**. Encima de cada regla veréis en qué **capa** está (`@layer componentes`, `@layer base`).

### Paso 2: el orden lo decide la primera línea

Cambiad el orden de la declaración:

```diff
- @layer base, componentes;
+ @layer componentes, base;
```

Ahora vuelve a salir **azul**: la última capa de la lista es la que manda. **Una sola línea** decide la prioridad de todo el CSS. Dejadlo como estaba (`base, componentes`).

### Paso 3: lo que no está en ninguna capa, gana a todo

Añadid una regla **fuera** de las capas, al final:

_./styles.css_

```diff
+ a {
+   color: green;
+ }
```

🎲 Es el selector más débil posible `(0,0,1)`…

**Todos los enlaces salen verdes**, incluido "Cafés". Las reglas **sin capa** mandan más que **cualquier** capa.

Y esto es justo lo que hacen las librerías modernas: meten **su** CSS en capas, para que **vuestro** CSS normal, sin capas, les gane siempre sin pelearos con su especificidad.

Quitad la regla verde.

## Dónde lo vais a ver

- **Tailwind CSS (v4)**: si abrís el CSS que genera, empieza con algo así:

  ```css
  @layer theme, base, components, utilities;
  ```

  El reset (Preflight, 08) va en `base` y las clases como `p-4` o `text-red-500` en `utilities`, la capa que más manda. Por eso una clase de Tailwind siempre gana a los estilos base, sin importar la especificidad.

- **MUI** y otras librerías de componentes permiten meter sus estilos en una capa, precisamente para convivir con Tailwind o con vuestro CSS sin guerras de especificidad.

- **¿Se puede usar?** Sí: está en todos los navegadores desde 2022. Baseline **Widely available** (13).

> 💡 Hay más detalles (capas dentro de capas, cómo se comporta `!important` dentro de las capas…) que no hace falta saber para empezar. Si os pica la curiosidad, en los enlaces de abajo.

## Para ampliar

- [MDN · @layer](https://developer.mozilla.org/es/docs/Web/CSS/@layer)
- [CSS-Tricks · A Complete Guide to CSS Cascade Layers](https://css-tricks.com/css-cascade-layers/) (en inglés)
- [Tailwind CSS · Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles): cómo usa Tailwind las capas (en inglés).
