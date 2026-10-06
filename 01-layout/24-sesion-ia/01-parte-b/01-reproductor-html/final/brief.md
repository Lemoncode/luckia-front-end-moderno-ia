# Brief: Neon Drive — reproductor de música

## Para quién y para qué
App personal de escritorio para escuchar música (estilo Spotify). Solo front
estático: se ve el reproductor, pero los botones no hacen nada.

## Páginas / secciones
Una sola pantalla con tres zonas:
1. **Lateral**: logo, navegación (Inicio, Buscar, Tu biblioteca) y lista de "tus playlists".
2. **Centro**: cabecera de la playlist (carátula, nombre, nº canciones, duración, botones play / me gusta / más) y lista de canciones (nº, título + artista, álbum, duración). Una fila marcada como "sonando".
3. **Barra inferior fija "now playing"**: carátula, canción y artista, controles (aleatorio, anterior, play/pausa, siguiente, repetir), barra de progreso con tiempos y volumen.

## Contenido
- Real: nada.
- Inventado: playlist "Neon Drive", ~10–12 canciones con artistas y álbumes ficticios, 5–6 playlists en el lateral. Carátulas generadas con degradados CSS o SVG (sin imágenes externas).

## Personalidad
Nocturno, eléctrico, inmersivo.

## Dirección visual
Synthwave de madrugada.
- Paleta: `#0B0A1F` noche (fondo) · `#FF2E88` magenta · `#22E4FF` cian · `#E9E6FF` texto (más superficies derivadas del fondo para paneles).
- Tipografía: **Unbounded** (títulos) + **Inter Tight** (texto e interfaz), instaladas con `@fontsource-variable`.
- Escala: la interfaz debe sentirse como la versión anterior vista al **125 %** de zoom, pero conseguido con una **escala tipográfica y de espaciado propia** en `@theme` (no subiendo el `font-size` del `html`). Más aire, textos de interfaz más legibles, controles algo más grandes. En móvil se mantiene proporcionado.
- Referencia de la cabecera: degradado vivo magenta → cian detrás del nombre de la playlist, carátula cuadrada a la izquierda, "PLAYLIST" en pequeño, nombre grande en Unbounded, metadatos debajo y botón play circular con brillo neón. Al pie de la cabecera, una rejilla de horizonte en perspectiva con líneas cian a baja opacidad.

## Detalle memorable
**Carátula con halo de neón**: la carátula de la barra inferior proyecta un brillo difuso de su color sobre el fondo. Cada carátula define su color de halo (magenta o cian) para que se vea bien sobre el panel.

## Movimiento
Sutil: hovers con brillo en filas y botones, el halo de la carátula "respira" lento. Todo desactivado con `prefers-reduced-motion`.

## Stack
HTML + Tailwind CSS v4 + Vite, sin frameworks JS. Tokens en `@theme`.

## Decidido por la IA (revísalo)
- Nombre de la playlist y del proyecto: "Neon Drive".
- Contenido de la lista de canciones y las playlists del lateral.
- Pensado para escritorio; en móvil el lateral se oculta y la barra inferior se simplifica (con una línea fina de progreso).
- En móvil hay una barra de navegación inferior (Inicio, Buscar, Tu biblioteca) que sustituye al lateral.
- Iconos en SVG inline (sin librería de iconos).

## Decidido con la usuaria
- Proyecto solo visual: no se añade funcionalidad (ni filas reproducibles con teclado ni hover de scrollbar específico para Chrome).
- La pista sin rellenar de progreso/volumen es sutil a propósito (no busca 3:1).
