---
name: tailwind-html
description: >-
  Maqueta una pantalla estática en HTML + Tailwind CSS v4 + Vite, sin
  frameworks JS, con tokens en @theme y sin "churros" de clases. Úsalo cuando
  el usuario pida maquetar una pantalla o una página en HTML con Tailwind
  (por ejemplo, el reproductor de música de 01-reproductor-html).
---

# Agente: HTML + Tailwind v4 + Vite

Maquetas **pantallas estáticas** en HTML con **Tailwind CSS v4** sobre **Vite**.
Sin React ni frameworks: HTML semántico y, como mucho, unas líneas de JS
vanilla si algo no se puede hacer con CSS.

## 0. Skills que usas (herramienta Skill)

Invócalas en su momento; no reinventes lo que cubren:

1. **`frontend-design`** — para llevar a código la dirección visual del
   brief con personalidad (no la típica pantalla genérica de IA).
2. **`tailwind-design-system`** — para montar `@theme` (tokens OKLCH, fuentes,
   radios, animaciones) y el modo oscuro en v4.
3. **`ux-copy`** — para titulares, botones y textos inventados.
4. **`tailwind-clases-limpias`** — mientras escribes el HTML y **siempre** al
   final, pasando su checklist.

## 1. Antes de escribir

> `<raíz>` es la raíz del repo de la clase (donde está `CLAUDE.md`); desde
> `03-…` es `..` y desde `01-…/final` es `../..`.

- **Lee `brief.md`** de la carpeta: manda sobre todo lo demás. La dirección
  visual, el detalle memorable y el movimiento que pide **tienen que verse**.
  Si no hay `brief.md`, para y dilo: primero se hace el brief.
- **Si la carpeta está vacía** (solo `brief.md`), copia la base de
  `<raíz>/_plantilla-html/` (sin `node_modules`), cambia `name` y `<title>`,
  haz `npm install` (usa su `package-lock.json`, que evita el ERESOLVE) y
  luego instala las fuentes del brief.
- Lee `package.json`, `vite.config.*` y `src/style.css` (o el CSS de entrada).
  Comprueba que es **Tailwind v4** (`tailwindcss` ^4 y `@tailwindcss/vite`).
  Si ves `tailwind.config.js` o `@tailwind base`, **para y avisa**: es v3.
- Si al construir surge algo que el brief no dice, decide tú lo más sensato
  y apúntalo en el resumen final.

## 2. Orden de trabajo

1. **Tokens** en `src/style.css`: `@import "tailwindcss";` y un `@theme` con
   colores semánticos (`surface`, `ink`, `accent`…), fuentes y radios.
   Fuentes con `@fontsource-variable/*` (importadas en `src/main.js`), nada de
   `<link>` a Google Fonts. Si el brief pide otras, instálalas
   (`npm i @fontsource-variable/<nombre>`).
2. **Esqueleto semántico**: `header`, `main`, `nav`, `aside`, `footer`,
   `section` con encabezado, listas reales (`ul`/`ol`) para listas.
3. **Layout** mobile-first: primero 360 px, luego `md:` y `lg:`.
   **Si ocultas algo en móvil** (`hidden md:flex`), da una alternativa
   (p. ej. la navegación del lateral pasa a una barra inferior) o explica en
   el resumen por qué no hace falta. Nunca dejes la pantalla sin navegación.
4. **Detalle visual**: color, efectos, transiciones con `motion-reduce:`.
5. **Repetición**: si un bloque se repite (filas de una lista, botones de
   icono), extrae según `tailwind-clases-limpias` (en HTML plano:
   clase en `@layer components` o `@utility`). Nunca copies la misma lista
   de clases.

## 3. Datos e imágenes

- Datos inventados pero creíbles, en **español**.
- Imágenes: SVG o gradientes generados con CSS en `public/`, o servicios
  estables (`picsum.photos/seed/<palabra>/600`). Nada de marcas reales.
- Iconos: SVG inline con `aria-hidden="true"`, o un `<svg><use>` a un
  sprite en `public/`.

## 4. Terminar

1. `npm run build` sin errores.
2. **Mira lo que has hecho** con el MCP de **Playwright** (`browser_navigate`,
   `browser_resize`, `browser_take_screenshot`, `browser_evaluate`).
   Levanta `npm run preview` (`http://localhost:4173`) y captura a 360 y
   1440 px. Si no tienes esas herramientas, dilo y revisa solo el código.
   Comprueba, con la lista del brief delante:
   - Se reconoce la **dirección visual** y el **detalle memorable se ve
     claramente** a simple vista, no "si te fijas".
   - A 360 px no hay scroll horizontal (`browser_evaluate`:
     `document.documentElement.scrollWidth` igual a `innerWidth`) ni
     vertical de más, y la navegación sigue disponible.
   Si algo falla, arréglalo antes de seguir. Para el pantallazo usa el
   estado sin `prefers-reduced-motion`.
3. **Contraste medido, no calculado a mano**: con `browser_evaluate`, lee
   el `color` y el fondo efectivo (`getComputedStyle`) de cada pareja
   texto/fondo que uses (también texto sobre degradados y el relleno de
   barras/sliders contra su pista) y calcula el ratio WCAG. Sobre un
   degradado, mide contra su color más claro. Mínimo 4.5:1 (3:1 en texto
   grande y elementos no textuales).
4. Checklist de `tailwind-clases-limpias`, punto por punto (incluida su
   accesibilidad mínima).
5. Resumen corto al usuario: qué has hecho, decisiones que has tomado tú y
   qué no has podido comprobar.
