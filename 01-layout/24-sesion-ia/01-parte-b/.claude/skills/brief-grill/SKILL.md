---
name: brief-grill
description: Entrevista al usuario al empezar una web o pantalla — una pregunta cada vez, con opciones y recomendación — hasta tener un brief de diseño con dirección visual clara. Deja el resultado en brief.md. Usar siempre al arrancar un proyecto nuevo ("quiero hacer una web de…") o cuando falte brief.md.
origin: lemoncode
license: MIT (Lemoncode en LICENSE; la de grill-me, de Matt Pocock, en LICENSE-grill-me)
attribution:
  - source: mattpocock/skills — grill-me
    author: Matt Pocock
    url: https://github.com/mattpocock/skills
    license: MIT
    copyright: Copyright (c) 2026 Matt Pocock
    relationship: derived-from
    note: la entrevista rama a rama, el modo co-creación (preguntas con propuestas y pros/contras) y el tono que aprieta si las respuestas son flojas. Se cambia el PRD técnico por un brief de diseño
---

# Brief grill

Antes de escribir una línea de código, **entrevistas al usuario** hasta tener
claro qué se va a hacer y, sobre todo, **cómo se va a ver**. Sin esto, la IA
hace la web de siempre: plana y genérica.

## Cómo preguntar

- **Una pregunta cada vez.** Nunca una lista de preguntas.
- **Siempre con opciones** (2–4), cada una con su porqué, y **cuál recomiendas**.
  Ejemplo:
  > ¿Qué tiene que transmitir la web?
  > A) Coctelería clásica y elegante — tipografía con serifa, mucho aire.
  > B) Bar de barrio canalla — colores fuertes, tipografía gorda.
  > C) Mixología de autor — oscuro, detalles finos, casi de galería.
  > Recomiendo **A** para una carta: deja que las bebidas sean protagonistas.
- Si el usuario dice «no sé» o «me da igual», **propón tú** y sigue.
  Si contesta muy por encima, aprieta un poco con otra pregunta concreta.
- Si el usuario dice «suficiente» o «decide tú», cierra con lo que tengas y
  marca lo que has decidido tú.
- Antes de preguntar, **mira la carpeta**: si ya hay datos o contenido
  (p. ej. `src/content/`), no preguntes lo que ya está ahí.

## Qué preguntar (en este orden)

1. **Para quién y para qué**: quién la visita y qué tiene que poder hacer.
2. **Páginas o secciones**: la lista mínima. Si cabe en una, una.
   Entre las opciones de estructura, **al menos una tiene que salirse del
   molde** de la app o web de referencia del sector (si es un reproductor, no
   solo "el de Spotify"; si es una carta, no solo "rejilla de tarjetas").
   Puede que no sea la recomendada, pero tiene que estar sobre la mesa.
3. **Móvil**: escritorio primero, móvil primero o los dos por igual, y qué
   pasa en móvil con lo que no cabe (navegación, paneles laterales…).
   Que no lo decida la IA a escondidas.
4. **Contenido**: qué hay de verdad y qué se inventa (textos, datos, imágenes).
5. **Personalidad**: tres adjetivos que debería transmitir.
6. **Dirección visual** — la pregunta más importante. Propón **tres
   direcciones distintas** siguiendo la skill `frontend-design`, cada una con:
   paleta (3–4 colores), pareja de fuentes y un ejemplo de cómo sería la
   cabecera. Que sean distintas de verdad, no tres variantes de lo mismo.
7. **El detalle memorable**: una cosa por la que se recordará la web
   (una ilustración propia, una transición, un efecto al pasar el ratón,
   una tipografía enorme…). Propón dos o tres.
8. **Movimiento**: nada, sutil o protagonista.
9. **Stack**, solo si no está claro por la carpeta: HTML + Vite (una pantalla)
   o Astro (varias páginas).

## Cerrar: `brief.md`

Escribe `brief.md` en la raíz del proyecto (al lado de `package.json`):

```markdown
# Brief: <nombre>

## Para quién y para qué
## Páginas / secciones
## Móvil
## Contenido
- Real: …
- Inventado: …
## Personalidad
## Dirección visual
- Paleta: …
- Tipografía: … (solo los nombres; el agente las instala con
  `@fontsource-variable`, no se cargan de Google Fonts)
- Referencia de la cabecera: …
## Detalle memorable
## Movimiento
## Stack
## Decidido por la IA (revísalo)
- …
```

Después, **enséñale al usuario el resumen en 5–6 líneas** y pregunta si
arrancamos. No se construye nada hasta que diga que sí.
