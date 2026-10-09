# 01 · Reproductor de música — HTML + Tailwind 4 + Vite

Una pantalla estática de una app de música ficticia («Onda»): menú lateral,
cabecera del álbum, lista de canciones y barra de reproducción fija abajo.

- `final/` — la pantalla ya generada, por si en directo sale otra cosa.

En directo se genera en una carpeta nueva (`03-reproductor`): el agente parte
de `_plantilla-html/` y le instala las fuentes del brief.

```bash
cd final
npm install
npm run dev
```

## Cómo arrancar

Abre Claude Code en la **raíz de la clase** (para que cargue agentes, skills
y el `CLAUDE.md` con el flujo) y escribe solo esto:

```
Quiero maquetar la pantalla de un álbum en una app de música. Trabaja en 03-reproductor.
```

Claude te hará preguntas una a una (para quién, secciones, estilo visual…),
escribirá `brief.md` en la carpeta, lo construirá con el agente y lo
revisará. Hay un `brief.md` de ejemplo en `final/`.

### Atajo, si vas con prisa

Pega esto y se salta las preguntas:

```
Trabaja en 03-reproductor. No me hagas preguntas: escribe tú el brief.md con
esto, enséñamelo en cinco líneas y, si te digo que sí, sigue el flujo.

Maqueta la pantalla principal de una app de música ficticia llamada «Onda»,
con el álbum «Luz de agosto» del grupo «Las Mareas» abierto:

- Menú lateral (solo en escritorio) con logo, Inicio, Buscar, Biblioteca
  (activa) y cuatro listas del usuario.
- Cabecera del álbum: carátula grande hecha con un degradado CSS (sin
  imágenes), tipo, año, título enorme, grupo, nº de canciones y duración,
  y botones de reproducir, guardar y más opciones.
- Lista de 8 canciones con número, título, artista, álbum y duración.
  La 3 es la que está sonando. La columna «Álbum» solo aparece si el
  contenedor de la lista es ancho (container queries).
- Barra de reproducción fija abajo con fondo desenfocado: canción actual,
  controles (aleatorio, anterior, pausa, siguiente, repetir), progreso y
  volumen. En móvil solo canción y pausa.

Tema oscuro, con un color de acento vivo. Tokens en @theme con OKLCH.
Fuentes: Space Grotesk para títulos e Inter para el resto.
Es una pantalla estática: sin JavaScript.
```

## Qué mirar en `final/`

| Qué | Dónde |
|---|---|
| Tokens OKLCH en `@theme` | `src/style.css` |
| `@utility` propia (`focus-ring`, `cover-art`) | `src/style.css` |
| Piezas repetidas extraídas a `@layer components` | `.btn-icon`, `.nav-link`, `.track-row` |
| Container queries (`@container` + `@lg:`) | columna «Álbum» de la lista |
| Variante `aria-[current=page]:` | enlace activo del menú |
| `text-shadow-lg`, `backdrop-blur-xl`, `bg-surface/80` | título y barra inferior |
