---
name: astro-pods
description: Arquitectura de pods de Lemoncode aplicada a Astro — una carpeta por funcionalidad (container + component + components/ + vm), páginas "tontas" que solo eligen layout y pod, y piezas comunes promocionadas a common/. Usar al crear o reorganizar un proyecto Astro.
origin: lemoncode
license: MIT (ver LICENSE de esta carpeta)
---

# Pods en Astro

Un **pod** es una carpeta por funcionalidad con todo lo suyo dentro. Es la misma
idea que usamos en React (`05b-architecture/03-pods` del máster), llevada a Astro.

## La regla en una frase

**La página elige layout y pod. El container consigue los datos. El component
pinta.**

## Estructura

```
src/
  content.config.ts                 ← colecciones (los datos)
  content/<coleccion>/*.md
  styles/global.css                 ← @import "tailwindcss" + @theme
  layouts/
    base.layout.astro               ← <html>, <head>, fuentes, <ClientRouter />
  pages/                            ← las "escenas": tontas
    index.astro
    <ruta>/[slug].astro
  pods/
    <pod>/
      <pod>.container.astro         ← getCollection / getEntry + mapeo a vm
      <pod>.component.astro         ← recibe props (vm) y pinta
      <pod>.vm.ts                   ← tipos del pod + mapper desde la entrada
      components/                   ← piezas que solo usa este pod
        <pieza>.component.astro
      index.ts                      ← barrel: solo exporta el container
  common/
    components/                     ← piezas usadas por 2+ pods
      index.ts
```

## Qué va en cada sitio

| Pieza | Hace | No hace |
|---|---|---|
| **page** (`pages/`) | Rutas, `getStaticPaths`, elegir layout y pod, pasar el `slug` | Pintar marcado propio, consultar colecciones para pintar |
| **container** | Pedir datos (`getCollection`, `getEntry`), mapear a vm, decidir estado vacío | Clases de Tailwind más allá de un envoltorio |
| **component** | Recibir la vm por props y pintar con Tailwind | Importar `astro:content` |
| **vm** | Tipos del pod y `mapXToVm(entry)` | Lógica de pintado |
| **components/** | Piezas internas del pod | Usarse desde otro pod |
| **common/** | Piezas que ya usan 2+ pods (promoción) | Cosas de un solo pod “por si acaso” |

## Ejemplo mínimo

```ts
// src/pods/cocktail-list/cocktail-list.vm.ts
import type { CollectionEntry } from "astro:content";

export interface CocktailCardVm {
  slug: string;
  name: string;
  tagline: string;
  image: ImageMetadata;
}

export const mapCocktailToCardVm = (
  entry: CollectionEntry<"cocktails">,
): CocktailCardVm => ({
  slug: entry.id,
  name: entry.data.name,
  tagline: entry.data.tagline,
  image: entry.data.image,
});
```

```astro
---
// src/pods/cocktail-list/cocktail-list.container.astro
import { getCollection } from "astro:content";
import CocktailListComponent from "./cocktail-list.component.astro";
import { mapCocktailToCardVm } from "./cocktail-list.vm";

const cocktails = (await getCollection("cocktails")).map(mapCocktailToCardVm);
---
<CocktailListComponent cocktails={cocktails} />
```

```ts
// src/pods/cocktail-list/index.ts
export { default as CocktailList } from "./cocktail-list.container.astro";
```

```astro
---
// src/pages/index.astro  ← tonta
import BaseLayout from "#layouts/base.layout.astro";
import { CocktailList } from "#pods/cocktail-list";
---
<BaseLayout title="Carta">
  <CocktailList />
</BaseLayout>
```

## Convenciones

- Nombres de fichero en **kebab-case** con sufijo de rol: `.container.astro`,
  `.component.astro`, `.vm.ts`, `.layout.astro`.
- **Dentro de un pod, imports relativos** (`./`, `../`). Para cruzar carpetas,
  alias `#` (imports de subruta de Node en `package.json`). Así cada pod se
  importa por su barrel:
  ```json
  "imports": {
    "#layouts/*": "./src/layouts/*",
    "#common/components": "./src/common/components/index.ts",
    "#pods/*": "./src/pods/*/index.ts"
  }
  ```
  ```astro
  import BaseLayout from "#layouts/base.layout.astro";
  import { CocktailList } from "#pods/cocktail-list";
  import { CocktailGlass } from "#common/components";
  ```
- Un pod **no importa** de otro pod. Si dos pods necesitan lo mismo, se
  promociona a `common/`.
- Las clases de Tailwind viven en los **components**: ahí es donde se extrae
  para no hacer churros (ver skill `tailwind-clases-limpias`).
- `transition:name` (view transitions) se pone en el **component** que pinta
  el elemento, con el mismo nombre en la lista y en el detalle
  (p. ej. `cocktail-${slug}-image`).

## Comprobación

- [ ] Ninguna página tiene marcado propio más allá de layout + pod.
- [ ] Ningún component importa `astro:content`.
- [ ] Cada pod tiene `index.ts` y solo exporta el container.
- [ ] Ningún pod importa de otro pod.
- [ ] `npm run build` pasa.
