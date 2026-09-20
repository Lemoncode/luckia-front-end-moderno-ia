# 02 · Introducción a CSS

> ⏱️ ~10 min · Poco código, mucha idea. En el 03 ya picamos.

## Qué es CSS

**CSS** (*Cascading Style Sheets*, hojas de estilo en cascada) es el lenguaje que dice **cómo se ve** el HTML: colores, tipografías, tamaños, espacios, posición…

- **HTML** → qué es cada cosa (estructura y significado).
- **CSS** → cómo se ve.
- **JS** → cómo se comporta.

### Un poco de historia (para entender por qué existe)

En los 90 el aspecto se metía **dentro del propio HTML**:

```html
<body bgcolor="yellow">
  <font face="Comic Sans MS" color="red" size="5">¡Bienvenidos a mi web!</font>
</body>
```

¿Queríais cambiar el color de todos los títulos de una web de 200 páginas? Pues 200 ficheros a mano. CSS nació para **separar contenido y presentación**: el HTML dice qué es cada cosa y el aspecto se define **en un solo sitio**.

## La prueba de que funciona: CSS Zen Garden

👉 [csszengarden.com](https://www.csszengarden.com/)

**Exactamente el mismo HTML** en todas las versiones. Lo único que cambia es el fichero CSS. Abrid 3 o 4 diseños de la lista y comparad.

## ¿Por qué "en cascada"?

A un mismo elemento le pueden llegar estilos desde **varios sitios a la vez**:

1. El propio **navegador** (sí, el navegador trae su CSS de serie).
2. **Nuestros** ficheros CSS.
3. Estilos escritos directamente en la etiqueta.

Todos esos estilos **caen en cascada** sobre el elemento y se combinan. Cuando dos dicen cosas distintas, hay unas reglas para decidir quién gana.

> 🔮 Esto es la base de todo CSS. Lo veremos con calma (especificidad, DevTools) más adelante. Por ahora quedaos con la idea: **varias fuentes de estilo, se mezclan, y alguien gana**.

## Los navegadores

El CSS no se "ejecuta" en ningún servidor: **lo interpreta el navegador** de cada usuario. Y no hay uno, hay varios **motores**:

| Motor | Navegadores |
|---|---|
| **Blink** | Chrome, Edge, Opera, Brave… |
| **WebKit** | Safari (y **todos** los navegadores en iPhone hasta hace poco) |
| **Gecko** | Firefox |

- Las reglas del juego (los **estándares**) las define el **W3C**, pero cada motor las implementa **a su ritmo**.
- Por eso a veces algo funciona en Chrome y no en Safari.
- Ya no existe "CSS4": CSS evoluciona **por módulos** y se añaden cosas nuevas continuamente.

> 🔮 ¿Cómo sé si puedo usar algo nuevo? Hay una web para eso: lo vemos en el 13 (*Can I use*).

## 🛠️ Práctica: desnudar una web

Coged cualquier web que uséis a diario (un periódico, la Wikipedia, GitHub…) y **quitadle el CSS**:

- Abrid DevTools (F12) → pestaña **Console** y pegad:

  ```js
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => el.remove());
  ```

  > ⚠️ La primera vez Chrome **bloquea el pegado** y pide escribir `allow pasting`. Es una protección contra estafas del tipo "pega esto en la consola y te regalo…". Escribid `allow pasting`, Enter, y volved a pegar.
  >
  > Moraleja (que vale también para lo que os genera la IA): **no ejecutéis código que no entendéis**. Este es inofensivo: busca todas las etiquetas `<style>` y `<link>` de CSS de la página y las quita. Y solo en vuestro navegador: al recargar vuelve todo.

- En **Firefox** es aún más fácil: menú *Ver → Estilo de página → Sin estilo*.

Fijaos en dos cosas:

1. Lo que queda es **el HTML a pelo**, como vuestro blog del 01. Las webs "bonitas" son HTML normal y corriente con CSS encima.
2. Aunque hemos quitado todo el CSS, los títulos siguen siendo grandes y en negrita, los enlaces azules y subrayados, las listas con puntos… **¿Quién ha puesto esos estilos?** 🤔 Lo resolvemos en el siguiente punto.

## Para ampliar

- [MDN · ¿Qué es CSS?](https://developer.mozilla.org/es/docs/Learn/CSS/First_steps/What_is_CSS)
- [CSS Zen Garden](https://www.csszengarden.com/)
