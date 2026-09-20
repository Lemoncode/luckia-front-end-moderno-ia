# 13 · ¿Puedo usar esto? Can I use y Baseline

> ⏱️ ~5 min en clase

> 🏠 **En clase solo enseñaremos el portal** ([caniuse.com](https://caniuse.com)) y buscaremos una funcionalidad en directo, para que sepáis que existe y cómo se lee. **El resto de esta sección es para leerla en casa**, incluida la práctica de resolver las preguntas pendientes: son 10 minutos y os servirá para el día a día.

## Las preguntas que hemos ido dejando por el camino

En el 02 vimos que CSS **no para de evolucionar** y que cada navegador (Chrome, Firefox, Safari…) implementa las novedades **a su ritmo**. Y a lo largo de la guía nos hemos ido encontrando cosas "nuevas" con la misma pregunta pendiente: _¿se puede usar ya?_

| Novedad                                                     | Dónde la vimos |
| ----------------------------------------------------------- | -------------- |
| CSS **nesting** (anidar con `&`)                            | 10             |
| El **texto alternativo** en `content` (`content: "↗" / ""`) | 11             |
| **`:user-invalid`**                                         | 12             |
| **`:has()`**                                                | 12             |

Hoy aprendemos a responder esa pregunta en un minuto, para esto y para cualquier cosa que os encontréis (o que os proponga la IA).

## Herramienta 1: Can I use

👉 [caniuse.com](https://caniuse.com)

Buscáis la funcionalidad (por ejemplo `:has`) y os enseña una **tabla por navegador y versión**:

- 🟩 **Verde**: soportado.
- 🟥 **Rojo**: no soportado.
- 🟨 **Amarillo/parcial**: soportado a medias (leed las **notas** de abajo).
- Arriba a la derecha, el **% de usuarios** del mundo cuyo navegador lo soporta.

> Un ejemplo de rojo, buscar: interpolate-size

Es la referencia clásica y la más detallada.

## Herramienta 2: MDN y el sello **Baseline**

En **MDN**, cada página de una propiedad o selector tiene:

- Arriba, un **sello Baseline** (lo explicamos ahora).
- Abajo del todo, una tabla de **compatibilidad** parecida a la de Can I use.

**Baseline** es una iniciativa conjunta de los navegadores para responder a la pregunta de forma sencilla. Tiene tres niveles:

| Nivel                    | Significa                                                                                                        | ¿Lo uso?                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Limited availability** | No funciona todavía en todos los navegadores principales                                                         | Solo como **mejora opcional**, con alternativa                                   |
| **Newly available**      | Ya funciona en **todos** los principales (Chrome, Edge, Firefox y Safari, en escritorio y móvil), pero hace poco | Sí, si vuestros usuarios tienen navegadores actualizados; si no, con alternativa |
| **Widely available**     | Lleva **más de 30 meses** funcionando en todos                                                                   | **Sí, sin pensarlo**                                                             |

> 💡 Las versiones recientes de **VS Code** también muestran el estado Baseline al pasar el ratón por encima de una propiedad CSS. Probadlo.

## 🛠️ Práctica: resolvamos las preguntas pendientes

Buscad en [caniuse.com](https://caniuse.com) y en [MDN](https://developer.mozilla.org) las cuatro novedades de la tabla del principio y apuntad su estado Baseline.

<details>
<summary>Soluciones (a fecha de septiembre de 2026; ¡comprobadlo, esto cambia!)</summary>

| Novedad                        | Estado                  | Comentario                                                                                                                                                                                            |
| ------------------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:has()`                       | ✅ **Widely available** | En todos los navegadores desde diciembre de 2023. Usadlo tranquilos.                                                                                                                                  |
| CSS nesting (`&`)              | ✅ **Widely available** | También desde diciembre de 2023.                                                                                                                                                                      |
| `:user-invalid`                | ✅ **Widely available** | Pasó a "widely" en mayo de 2026.                                                                                                                                                                      |
| Texto alternativo en `content` | 🟡 **Newly available**  | Firefox fue el último en añadirlo (versión 128, julio de 2024). Funciona en los navegadores actuales, pero todavía no lleva 30 meses. Por eso en el 11 vimos el truco de escribir la línea dos veces. |

</details>

## ¿Y si algo no está soportado?

Tres ideas, de más simple a más fina:

**1. CSS ignora lo que no entiende** (lo vimos en el 03). Si un navegador no conoce una propiedad o un selector, se salta esa línea (o esa regla) y **sigue**: la página no se rompe, simplemente no tiene esa mejora. Por eso muchas novedades se pueden usar como **mejora progresiva**: quien tenga un navegador moderno lo ve mejor; quien no, lo ve bien igualmente.

**2. Escribir primero lo viejo y después lo nuevo**, en la misma regla. El navegador que entienda lo nuevo se queda con lo de abajo (gana la última); el que no, se queda con lo de arriba:

```css
a[href^="http"]::after {
  content: " ↗"; /* todos los navegadores */
  content: " ↗" / ""; /* los que entienden el texto alternativo */
}
```

**3. Preguntar al navegador con `@supports`**: "aplica esto **solo si** entiendes tal cosa":

```css
@supports selector(:has(a)) {
  .opcion:has(input:checked) {
    background-color: #fef3c7;
  }
}
```

## Y con la IA, doble cuidado

- A veces os propondrá cosas **muy nuevas** (o incluso experimentales) sin avisar. → Can I use.
- Y otras veces, al revés, os dará soluciones **antiguas** que aprendió de código viejo: trucos con `float` para maquetar, prefijos como `-webkit-` que ya no hacen falta, hacks para Internet Explorer… Si algo os suena raro, buscad en MDN si hay una forma moderna.

Can I use y Baseline son vuestro **detector de mentiras** para ambos casos.

## Para ampliar

- [Can I use](https://caniuse.com)
- [web.dev · Baseline](https://web.dev/baseline): qué es y cómo funciona.
- [Web Platform Status](https://webstatus.dev): el estado Baseline de todas las funcionalidades, con buscador.
- [MDN · @supports](https://developer.mozilla.org/es/docs/Web/CSS/@supports)
