# 02 · Carta de cócteles — Astro + Tailwind 4

La carta de una coctelería ficticia («El Último Trago»): portada con los seis
cócteles y una página por cóctel con su receta. Al entrar en un cóctel, la copa
y el nombre «viajan» de la carta al detalle (view transitions).

- `final/` — la carta ya generada, organizada en pods. Los datos están en
  `src/content.config.ts` (colección `cocktails`) y en las seis fichas de
  `src/content/cocktails/`.

En directo se genera en una carpeta nueva (`03-carta-cocteles`): el agente
crea el proyecto Astro y copia los datos de `final/`.

```bash
cd final
npm install
npm run dev
```

## Cómo arrancar

Abre Claude Code en la **raíz de la clase** (para que cargue agentes, skills
y el `CLAUDE.md` con el flujo) y escribe solo esto:

```
Quiero hacer una web de cócteles. Trabaja en 03-carta-cocteles.
```

Claude te hará preguntas una a una (para quién, secciones, estilo visual…),
escribirá `brief.md` en la carpeta, lo construirá con el agente y lo
revisará. Hay un `brief.md` de ejemplo en `final/`.

### Atajo, si vas con prisa

Pega esto y se salta las preguntas:

```
Trabaja en 03-carta-cocteles. No me hagas preguntas: escribe tú el brief.md con
esto, enséñamelo en cinco líneas y, si te digo que sí, sigue el flujo.

Haz la carta de una coctelería llamada «El Último Trago» con los cócteles
de la colección cocktails: copia `src/content.config.ts` y
`src/content/cocktails/` de 02-carta-cocteles-astro/final, sin cambiar los datos.

- Portada: título grande, una entradilla y una rejilla con los seis cócteles
  en el orden del campo order. Cada tarjeta lleva la ilustración de su copa
  (SVG hecho a mano según el campo glass, con el líquido del color del campo
  color), nombre, frase, precio y graduación.
- Página de cada cóctel en /cocteles/<slug>/: copa grande, nombre, frase,
  precio, graduación, la historia (el cuerpo del markdown), ingredientes con
  sus medidas, decoración y pasos numerados.
- Navegación con <ClientRouter />: la copa y el nombre hacen la transición
  de la carta al detalle.

Estilo de carta impresa: fondo crema, tinta verde oscuro y un acento
terracota. Fraunces para títulos e Inter para el texto.
Organízalo en pods: cocktail-list y cocktail-detail; la copa va a common
porque la usan los dos.
```

## Qué mirar en `final/`

```
src/
  pages/index.astro                    ← tonta: layout + CocktailList
  pages/cocteles/[slug].astro          ← tonta: getStaticPaths + CocktailDetail
  layouts/base.layout.astro            ← <ClientRouter />, fuentes, cabecera
  pods/cocktail-list/                  ← container · component · vm · components/
  pods/cocktail-detail/                ← container · component · vm · components/
  common/components/                   ← cocktail-glass y strength-meter (los usan los dos pods)
  styles/global.css                    ← @theme + @utility arch / focus-ring
```

| Qué | Dónde |
|---|---|
| Pods: container (datos) / component (pinta) | `src/pods/*` |
| Promoción a `common/` de lo compartido | `cocktail-glass`, `strength-meter` |
| Alias `#` con imports de subruta | `package.json` → `imports` |
| `transition:name` igual en lista y detalle | `arch-<slug>`, `name-<slug>` |
| Color por dato con una variable CSS (`--liquid`) y `color-mix()` | `@utility arch` |
| `group-hover:` y `motion-reduce:` | tarjeta de la carta |
