---
name: tailwind-clases-limpias
description: Reglas de Lemoncode para escribir Tailwind CSS v4 sin "churros" de clases — tokens en @theme, cuándo extraer a componente o @utility, orden de clases y comprobación final. Usar siempre que se escriba o revise HTML/Astro con Tailwind v4.
origin: lemoncode
license: MIT (ver LICENSE de esta carpeta)
attribution:
  - source: wshobson/agents — tailwind-design-system
    author: Seth Hobson
    url: https://github.com/wshobson/agents/tree/main/plugins/frontend-mobile-development/skills/tailwind-design-system
    license: MIT
    copyright: Copyright (c) 2024 Seth Hobson
    relationship: inspired-by
    note: la jerarquía de tokens (marca → semántico → componente) y el uso de @theme con OKLCH
---

# Tailwind v4 sin churros

Tailwind es declarativo y la IA lo escribe bien, pero tiende a dos vicios:
**mezclar la versión 3 con la 4** y **amontonar clases** hasta que no se lee.
Esta skill fija las reglas para evitar las dos cosas. Complementa a
`tailwind-design-system` (que explica el *cómo* de v4); aquí va el *cuánto*.

## 1. Es Tailwind v4, no v3

| ❌ v3 (no usar) | ✅ v4 |
|---|---|
| `tailwind.config.js` | `@theme { … }` en el CSS |
| `@tailwind base; @tailwind components; …` | `@import "tailwindcss";` |
| `postcss.config.js` + `autoprefixer` | plugin `@tailwindcss/vite` en `vite.config` |
| `@astrojs/tailwind` | `@tailwindcss/vite` en `astro.config` |
| `darkMode: 'class'` | `@custom-variant dark (&:where(.dark, .dark *));` |
| `bg-opacity-50` | `bg-black/50` |
| `flex-shrink-0`, `flex-grow` | `shrink-0`, `grow` |
| `shadow-sm` / `rounded-sm` como “pequeño” | en v4 `shadow-xs` / `rounded-xs` son los pequeños |

## 2. Primero los tokens, luego las clases

Todo color, fuente, radio o sombra con significado va a `@theme` con nombre
**semántico**, y en el HTML solo se usa ese nombre.

```css
@theme {
  --color-surface: oklch(18% 0.02 280);
  --color-ink: oklch(96% 0.01 280);
  --color-accent: oklch(72% 0.19 340);
  --font-display: "Fraunces Variable", serif;
}
```

```html
<!-- ✅ -->
<h1 class="font-display text-ink">…</h1>
<!-- ❌ valores mágicos -->
<h1 class="font-['Fraunces'] text-[#f4f1fa]">…</h1>
```

Valores arbitrarios (`[…]`) solo para casos de **una vez** que no son parte del
sistema (una posición concreta de una ilustración). Si se repiten, son un token.
Un color, una sombra o un brillo **nunca** es "de una vez": va a `@theme`
(`--drop-shadow-neon`, `--shadow-glow`…), aunque se use en un solo sitio.

Esto vale también **fuera de las clases**: atributos de SVG inline
(`fill`, `stroke`, `stop-color`) y `style="…"` usan el token, no el hex.

```html
<!-- ✅ -->
<stop offset="0" style="stop-color: var(--color-magenta)" />
<!-- ❌ -->
<stop offset="0" stop-color="#FF2E88" />
```

## 3. Límite de clases y cuándo extraer

- **Más de ~12 utilidades en un elemento** → algo sobra o hay que extraer.
- **La misma lista de clases repetida 2+ veces** → extraer. Nunca copiar y pegar.
- **Ser un elemento único no es excusa** para pasar del límite. Si lo que
  engorda son variantes de estado (`focus:`, `hover:`…), se extraen a un
  `@utility` con nombre (p. ej. `@utility skip-link`).
- **Cómo extraer**, por orden de preferencia:
  1. **Componente** (Astro, React…): el sitio natural. Las clases viven una vez
     dentro del componente.
  2. **Bucle** en el HTML/plantilla si son elementos iguales con distinto dato.
  3. **`@utility`** para un patrón pequeño y transversal sin marcado propio
     (p. ej. `@utility focus-ring { … }`).
  4. **Clase de componente en `@layer components`** con `@apply` solo en HTML
     plano sin plantillas (Vite + HTML) y solo para piezas repetidas
     (botón, chip). `@apply` no es para “limpiar” un elemento único.

```css
@utility focus-ring {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

@layer components {
  .btn-icon {
    @apply grid size-10 place-items-center rounded-full text-ink/80
      transition hover:bg-ink/10 hover:text-ink;
  }
}
```

## 4. Estados con variantes, no con JS ni clases duplicadas

- Relación padre–hijo: `group` / `group-hover:`; hermanos: `peer`.
- Estado del dato: atributos `data-*` / `aria-*` y la variante
  (`data-[state=active]:text-accent`, `aria-[current=page]:font-semibold`).
- Contenedor: `@container` + `@sm:`… cuando el bloque cambia según su caja y no
  según la ventana.
- **`hover:` no existe en móvil.** En v4, `hover:` y `group-hover:` van
  dentro de `@media (hover: hover)`: en una pantalla táctil no pasan nunca.
  Todo efecto de hover lleva su pareja con `focus-visible:` (teclado) y
  `active:` (dedo). Si son varias variantes, se juntan en un `@utility`.
  En iOS Safari `:active` solo se activa si hay un listener táctil: pon
  `ontouchstart=""` en el `<body>`.

```html
<!-- ✅ -->
<svg class="group-hover:-rotate-12 group-focus-visible:-rotate-12 group-active:-rotate-12">
<!-- ❌ en móvil no hace nada -->
<svg class="group-hover:-rotate-12">
```

## 5. Orden de las clases

Siempre en este orden, para que se lean igual en todo el proyecto:

1. Layout y posición (`relative`, `grid`, `flex`, `col-span-2`)
2. Caja (`size-*`, `w-*`, `p-*`, `gap-*`)
3. Tipografía (`font-*`, `text-*`, `leading-*`)
4. Color y fondo (`bg-*`, `text-<color>`, `border-*`)
5. Efectos (`shadow-*`, `rounded-*`, `opacity-*`, `transition`)
6. Variantes de estado (`hover:`, `focus-visible:`, `data-*:`)
7. Responsive y dark al final (`md:`, `lg:`, `dark:`)

Si el proyecto tiene Prettier, instalar `prettier-plugin-tailwindcss` y dejar
que ordene él.

## 6. Accesibilidad mínima

- Botones de solo icono: `aria-label` y tamaño mínimo `size-10` (40 px).
- Foco visible siempre (`focus-visible:` o la utilidad `focus-ring`); nunca
  `outline-none` sin sustituto.
- Contraste AA del texto contra su fondo real (cuidado con `text-ink/60` sobre
  fondos con imagen).
- Respetar `motion-reduce:` en animaciones decorativas.
- **Zona para pulsar de 24 px como mínimo** en todo lo interactivo, también
  sliders (`<input type="range">`): el input mide `h-6`/`h-4`+padding, y la
  pista fina se pinta en `::-webkit-slider-runnable-track` / `::-moz-range-track`.
- **Un solo `aria-current="page"`** por pantalla. Para "elemento activo" en
  otra lista (la playlist abierta, la pestaña elegida) usa `aria-current="true"`
  y la variante `aria-[current=true]:`.
- **Landmarks con su significado**: `<footer>` solo para el pie de la página
  (contentinfo). Una barra fija de reproducción, un carrito… son
  `<section aria-label="…">`.
- **`sr-only` dentro de un contenedor con scroll** (`overflow-y-auto`): el
  contenedor necesita `relative`. Si no, el `sr-only` (que es
  `position: absolute`) se escapa, estira la página y sale un scroll de más.

## 7. Comprobación antes de dar por terminado

- [ ] No hay `tailwind.config.*`, ni `@tailwind`, ni `@astrojs/tailwind`.
- [ ] Ningún color en hex/rgb dentro de clases: todo sale de `@theme`.
- [ ] Ningún elemento pasa de ~12 utilidades sin motivo.
- [ ] Ninguna lista de clases repetida: extraída a componente, bucle o `@utility`.
- [ ] Clases en el orden de la sección 5.
- [ ] Ningún valor arbitrario de color/sombra en clases, ni hex en SVG o `style`.
- [ ] Foco visible y `aria-label` en botones de icono.
- [ ] Cada `hover:` / `group-hover:` tiene su pareja con `focus-visible:` y
      `active:`, y el `<body>` lleva `ontouchstart=""` si hay efectos al tocar.
- [ ] Zonas para pulsar ≥ 24 px (sliders incluidos).
- [ ] Un solo `aria-current="page"`; `<footer>` solo para el pie de la página.
- [ ] Contenedores con scroll que tienen `sr-only` dentro llevan `relative`.
- [ ] `npm run build` pasa sin avisos.
