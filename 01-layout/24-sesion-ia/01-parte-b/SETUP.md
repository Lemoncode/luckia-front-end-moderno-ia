# Setup

## 1. Requisitos

- **Node 22.12 o superior** (lo pide Astro 7).
- **Claude Code** instalado.

## 2. Abrir la clase con Claude Code

Abre Claude Code **en la raíz de esta carpeta** (no dentro de un proyecto): así
carga solos los agentes de `.claude/agents/` y las skills de `.claude/skills/`.

```bash
cd Clase-IA-Tailwind-Astro
claude
```

Compruébalo escribiendo `/agents` (deben salir `tailwind-html`,
`astro-tailwind` y `design-reviewer`) y `/` para ver las skills.

Luego, solo tienes que decirle lo que quieres
(«Quiero hacer una web de cócteles. Trabaja en 03-carta-cocteles.»):
el flujo está en `CLAUDE.md`.

## 3. MCP de la documentación de Astro (recomendado)

El MCP oficial de Astro deja que el agente consulte la documentación al día
en vez de tirar de memoria:

```bash
claude mcp add --transport http astro-docs https://mcp.docs.astro.build/mcp
```

## 4. MCP de Playwright (ya viene configurado)

Los agentes usan Playwright para **mirar lo que hacen**: abren la web en un
navegador, hacen capturas a varios anchos (de 360 a 1440 px) y miden el
contraste de los textos. Está en `.mcp.json`, así que no hay que instalar
nada:

- La primera vez que abras Claude Code en la carpeta te preguntará si
  apruebas el servidor `playwright` del proyecto: **di que sí**.
- Compruébalo con `/mcp`: debe salir `playwright` conectado.
- Si no tienes Chrome instalado, ejecuta una vez
  `npx playwright install chromium`.

Funciona igual en macOS, Windows y Linux.

## 5. Instalar y arrancar cada ejemplo

```bash
cd 01-reproductor-html/final      # o 02-carta-cocteles-astro/final
npm install
npm run dev
```

## 6. Un consejo para los prompts

Di siempre **«Tailwind 4»**. Si el agente crea un `tailwind.config.js` o
escribe `@tailwind base`, se ha ido a la versión 3: pídele que lo rehaga con
`@theme` y `@import "tailwindcss"`.
