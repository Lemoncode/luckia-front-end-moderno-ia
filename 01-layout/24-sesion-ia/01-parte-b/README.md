# Tailwind 4 con IA — HTML + Vite y Astro

Material de clase para **maquetar con un agente de IA (Claude Code) usando
Tailwind CSS v4** sin que salgan churros de clases.

Dos ejemplos con dos stacks:

| Ejemplo                                                | Stack                    | Qué es                                                                   |
| ------------------------------------------------------ | ------------------------ | ------------------------------------------------------------------------ |
| [`01-reproductor-html/`](01-reproductor-html/)         | HTML + Tailwind 4 + Vite | Una pantalla estática de una app de música                               |
| [`02-carta-cocteles-astro/`](02-carta-cocteles-astro/) | Astro 7 + Tailwind 4     | La carta de una coctelería, con una página por cóctel y view transitions |

Cada ejemplo tiene `final/` (ya generado) y su `README.md` con el prompt.
Lo que se genera en directo va en una **carpeta nueva** en la raíz
(`03-…`, `04-…`); en HTML se parte de [`_plantilla-html/`](_plantilla-html/).

Instalación y conexión: **[`SETUP.md`](SETUP.md)**.

## Cómo funciona

Abres Claude Code en esta carpeta y le dices lo que quieres, sin más:

```
Quiero hacer una web de cócteles. Trabaja en 03-carta-cocteles.
```

A partir de ahí sigue siempre el mismo flujo (está escrito en
[`CLAUDE.md`](CLAUDE.md), que Claude Code lee solo al abrir la carpeta):

1. **Preguntar** — te entrevista, una pregunta cada vez y con opciones, sobre
   para quién es, qué secciones lleva y, sobre todo, **qué estilo visual**
   tiene. Lo deja escrito en `brief.md` y no sigue hasta que digas que sí.
2. **Construir** — un agente maqueta siguiendo el brief.
3. **Revisar** — otro agente lo revisa con ojos frescos y te da una lista:
   Crítico / Importante / Sugerencia.
4. **Arreglar** — eliges qué se arregla y vuelve a construir.

## Agentes (`.claude/agents/`)

| Agente            | Para qué                                                                        |
| ----------------- | ------------------------------------------------------------------------------- |
| `tailwind-html`   | Maquetar pantallas estáticas en HTML + Tailwind 4 + Vite                        |
| `astro-tailwind`  | Sitios en Astro 7 + Tailwind 4 con la arquitectura de pods de Lemoncode         |
| `design-reviewer` | Revisar lo construido contra el brief: diseño, accesibilidad, textos y Tailwind |

Quien reparte el trabajo es la propia conversación con Claude: no hace falta
llamar a los agentes a mano. Detalle en **[`AGENTS.md`](AGENTS.md)**.

## Skills (`.claude/skills/`)

| Skill                     | Para qué                                                     | Licencia                                                  |
| ------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| `brief-grill`             | La entrevista del principio y el `brief.md`                  | MIT · Lemoncode (deriva de `grill-me`, MIT · Matt Pocock) |
| `tailwind-design-system`  | Cómo se escribe Tailwind v4: `@theme`, tokens, dark mode     | MIT · Seth Hobson                                         |
| `tailwind-clases-limpias` | Reglas anti-churros: límite de clases, cuándo extraer, orden | MIT · Lemoncode                                           |
| `astro-dev`               | Astro 7 al día: colecciones, view transitions, Tailwind v4   | MIT · Sungho Park                                         |
| `astro-pods`              | Pods de Lemoncode en Astro                                   | MIT · Lemoncode                                           |
| `frontend-design`         | Dirección visual con personalidad                            | Apache-2.0 · Anthropic                                    |
| `design-critique`         | Revisar jerarquía, consistencia y personalidad               | Apache-2.0 · Anthropic                                    |
| `accessibility-review`    | Revisar accesibilidad (WCAG 2.1 AA)                          | Apache-2.0 · Anthropic                                    |
| `ux-copy`                 | Titulares, botones y textos                                  | Apache-2.0 · Anthropic                                    |

Origen exacto y licencias en [`.claude/skills/NOTICE.txt`](.claude/skills/NOTICE.txt).

## ⚠️ El código de `final/` es la salida del agente

Está revisado por encima, no pulido. Cada vez que se lanza el prompt sale algo
distinto: tómalo como punto de partida y material para comparar.

## Estructura

```
.
├── .claude/
│   ├── agents/      tailwind-html · astro-tailwind · design-reviewer
│   └── skills/      9 skills + NOTICE.txt
├── _plantilla-html/  base Vite + Tailwind 4 para pantallas nuevas
├── 01-reproductor-html/
│   └── final/
├── 02-carta-cocteles-astro/
│   └── final/
├── CLAUDE.md      el flujo: preguntar → construir → revisar → arreglar
├── AGENTS.md
├── .mcp.json      Playwright: los agentes miran capturas y miden contraste
└── SETUP.md
```

# Prompts de inicio

Vamos a crear una web sencilla un reproductor de música, no quiero funcionalidad, quiero el front, para cerlo con tailwind y html estático. Usa Lucid para los iconos.

La carta de una coctelería ficticia («El Último Trago»): portada con los seis
cócteles y una página por cóctel con su receta. Al entrar en un cóctel, la copa
y el nombre «viajan» de la carta al detalle (view transitions).
