# Agentes

## Quién dirige

La **conversación principal** con Claude. Al abrir la carpeta lee
[`CLAUDE.md`](CLAUDE.md) y sigue su flujo: preguntar → construir → revisar →
arreglar. Pregunta, reparte el trabajo a los agentes y te cuenta qué pasa.

Los agentes no se hablan entre ellos: cada uno hace su parte y le devuelve el
resultado a la conversación principal.

```
Tú ──► Claude (dirige)
         │ 1. brief-grill → brief.md   (te pregunta a ti)
         │ 2. tailwind-html  o  astro-tailwind   (construye)
         │ 3. design-reviewer   (revisa, no toca código)
         └ 4. vuelve al 2 con lo que elijas arreglar
```

## `tailwind-html`

Maqueta **pantallas estáticas** en HTML + Tailwind 4 + Vite, sin frameworks.

1. Lee `brief.md` y comprueba que el proyecto es Tailwind v4.
2. Lleva a código la dirección visual del brief (`frontend-design`).
3. Monta los tokens en `@theme` (`tailwind-design-system`).
4. Escribe el HTML semántico, mobile-first, con buenos textos (`ux-copy`).
5. Extrae lo repetido a `@layer components` o `@utility` (`tailwind-clases-limpias`).
6. Termina con `npm run build` y el checklist de `tailwind-clases-limpias`.

## `astro-tailwind`

Construye **sitios en Astro 7** con Tailwind 4, organizados en **pods**.

1. Lee `brief.md` y comprueba Astro 7 y Tailwind v4 con `@tailwindcss/vite`.
2. Enseña la lista de pods antes de crear ficheros.
3. Colecciones de contenido, tokens y layout con `<ClientRouter />` (`astro-dev`).
4. Pods: container (datos) → component (pinta) → piezas internas → `index.ts` (`astro-pods`).
5. Páginas tontas: solo layout + pod.
6. Termina con `npm run build` y los checklists de `astro-pods` y `tailwind-clases-limpias`.

## `design-reviewer`

Revisa lo construido **contra el brief**, sin tocar código.

- Usa `design-critique`, `accessibility-review`, `ux-copy` y
  `tailwind-clases-limpias`.
- Su pregunta clave: **¿podría ser la web de cualquier otro sitio?** Si sí,
  le falta personalidad.
- Devuelve como mucho 10 puntos: Crítico / Importante / Sugerencia, cada uno
  con qué, dónde y cómo arreglarlo.

## Por qué hay skills propias

- **`brief-grill`**: sin preguntar antes, la IA hace la web de siempre.
  Esta skill obliga a decidir el estilo visual y un detalle memorable
  **antes** de escribir código.
- **`tailwind-clases-limpias`**: las skills de terceros enseñan **cómo** se
  escribe Tailwind v4, pero ninguna pone **límites** (cuántas clases, cuándo
  extraer, en qué orden).
- **`astro-pods`**: la arquitectura de pods de Lemoncode no está en ninguna
  skill pública.
