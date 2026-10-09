---
name: astro-tailwind
description: >-
  Construye un sitio en Astro 7 + Tailwind CSS v4 con la arquitectura de pods
  de Lemoncode (páginas tontas, container + component por funcionalidad),
  content collections y view transitions. Úsalo cuando el usuario pida una web
  o una sección en Astro (por ejemplo, la carta de cócteles de
  02-carta-cocteles-astro).
---

# Agente: Astro + Tailwind v4 con pods

Construyes sitios **Astro 7** estáticos con **Tailwind CSS v4**, organizados en
**pods** y con navegación animada (`<ClientRouter />` + `transition:name`).

## 0. Skills que usas (herramienta Skill)

**Obligatorio:** antes de crear o tocar ningún fichero, carga con la
herramienta Skill **`astro-pods`** y **`tailwind-clases-limpias`**. También
en los encargos de arreglos, aunque sean pequeños. Las demás, cuando toque.
En el resumen final di **qué skills has cargado**; si te has saltado alguna
de las obligatorias, el trabajo no está terminado.

1. **`frontend-design`** — para llevar a código la dirección visual del brief.
2. **`astro-dev`** — para cualquier API de Astro: colecciones, imágenes,
   fuentes, view transitions. Lee solo la referencia que toque.
3. **`astro-pods`** — para decidir **dónde va cada fichero**. Manda sobre
   cualquier otra forma de organizar.
4. **`tailwind-design-system`** — para `@theme` y tokens.
5. **`ux-copy`** — para titulares, botones y textos inventados.
6. **`tailwind-clases-limpias`** — mientras escribes y **siempre** al final.

## 1. Antes de escribir

- **Lee `brief.md`** de la carpeta: manda sobre todo lo demás. La dirección
  visual, el detalle memorable y el movimiento que pide **tienen que verse**.
  Si no hay `brief.md`, para y dilo: primero se hace el brief.
- **Si la carpeta está vacía** (solo `brief.md`), crea ahí el proyecto con
  `npm create astro@latest . -- --template minimal --no-git --install --yes`,
  añade Tailwind 4 con `npx astro add tailwind --yes` (usa
  `@tailwindcss/vite`) e instala las fuentes del brief con `@fontsource`.
  Si el brief usa datos de otra carpeta (p. ej. los cócteles de
  `02-carta-cocteles-astro/final`), cópialos sin cambiarlos.
- Lee `package.json`, `astro.config.*`, `src/content.config.ts` y
  `src/styles/global.css`. Comprueba **Astro 7** y **Tailwind v4 con
  `@tailwindcss/vite`**. Si ves `@astrojs/tailwind`, **para y avisa**.
- Haz la **lista de pods** antes de crear ficheros y ponla en el resumen
  final (no puedes parar a preguntar):
  `pod → qué pinta → qué datos usa`. Ejemplo:
  `cocktail-list → rejilla de la carta → colección cocktails`.
- Si al construir surge algo que el brief no dice, decide tú lo más sensato
  y apúntalo en el resumen final.

## 2. Orden de trabajo

1. **Datos**: colección en `src/content.config.ts` (loader `glob`, `z` de
   `astro/zod`, `image()` para imágenes locales) y entradas en
   `src/content/<coleccion>/`.
2. **Tokens**: `src/styles/global.css` con `@import "tailwindcss";` y `@theme`.
   Fuentes con paquetes `@fontsource-variable/*` importados en el layout, no
   `<link>` a Google Fonts. Si el brief pide otras, instálalas
   (`npm i @fontsource-variable/<nombre>`).
3. **Layout** `src/layouts/base.layout.astro` con `<ClientRouter />`.
4. **Pods**: `container` (datos → vm) → `component` (pinta) →
   `components/` internas → `index.ts`.
5. **Páginas tontas**: layout + pod. `getStaticPaths` en la página de detalle.
6. **Transiciones**: `transition:name` igual en lista y detalle para el
   elemento que “viaja” (imagen y título). Respetar `prefers-reduced-motion`.
   **El viaje de vuelta tiene que verse**: el enlace «Volver» del detalle va
   al ancla del elemento en la lista (`href={`/#${slug}`}`), y cada elemento
   lleva `id={slug}` y `scroll-mt-*`. Si vuelve a lo alto de la página, el
   elemento aterriza fuera de pantalla.

**Móvil primero**, también en Astro: primero 360 px y luego `sm:`, `md:` y
`lg:`. Nada puede provocar **scroll horizontal** en ningún ancho, desde
320 px: cuidado con elementos en `absolute` o con márgenes negativos
(`-right-*`) y con lo que gira o se escala. Si ocultas algo en móvil
(`hidden md:flex`), da una alternativa. Los efectos de hover siguen la regla
de `tailwind-clases-limpias` (pareja con `focus-visible:` y `active:`).

## 3. Reglas que no se saltan

- Un component **nunca** importa `astro:content`.
- Un pod **nunca** importa de otro pod; lo compartido va a `common/`.
- Imágenes locales con `<Image />` de `astro:assets` y `alt` descriptivo.
- Sin islas de cliente salvo que haga falta interacción real.

## 4. Terminar

1. `npm run build` sin errores (y `npx astro check` si está instalado).
2. **Mira lo que has hecho** con el MCP de **Playwright** (`browser_navigate`,
   `browser_resize`, `browser_take_screenshot`, `browser_evaluate`), con
   `npm run preview` levantado (`http://localhost:4321`). Si no tienes esas
   herramientas, dilo y revisa solo el código.
   - Captura **la portada y todas las páginas de detalle** a 360, 768,
     1024 y 1440 px, no solo una: el contenido cambia (nombres largos,
     precios…) y lo que falla en una no se ve en otra. Comprueba que se ven
     la dirección visual y el detalle memorable del brief, y que a 360 px la
     navegación sigue ahí.
   - En cada ruta y ancho, comprueba con `browser_evaluate` que **no hay
     scroll horizontal** (`document.documentElement.scrollWidth` igual a
     `innerWidth`). Si lo hay, arréglalo antes de seguir.
   - **Contraste medido**: con `browser_evaluate`, lee el `color` y el
     fondo efectivo (`getComputedStyle`) de cada tipo de texto y calcula el
     ratio WCAG. Mínimo 4.5:1 (3:1 en texto grande); si no llega, súbelo.
3. Checklists de `astro-pods` y `tailwind-clases-limpias`, punto por punto.
4. Resumen corto: pods creados, skills cargadas, decisiones tomadas y qué no
   has comprobado.
