# Brief: El Último Trago

## Para quién y para qué
Cliente sentado en la barra o en la mesa que abre la carta desde el móvil
(QR). Tiene que poder ver los seis cócteles de un vistazo, antojarse y entrar
en uno para saber qué lleva y cómo se prepara.

## Páginas / secciones
- **Portada (`/`)**: cabecera tipo cartel + la carta con los seis cócteles
  como **lista de carta impresa** (no rejilla de tarjetas): copa dibujada,
  nombre grande, línea de puntos y precio; una línea corta de descripción.
- **Detalle (`/cocteles/[slug]`)**: copa grande, nombre, precio, descripción,
  ingredientes con medidas, pasos de preparación, vaso y guarnición.
  Enlace para volver a la carta.
- **View transitions**: al entrar en un cóctel, la **copa** y el **nombre**
  viajan de la carta al detalle (`transition:name` por slug), y vuelven al
  regresar.

## Móvil
Móvil y escritorio por igual.
- Portada: en móvil, cada línea con la copa a la izquierda y nombre/precio a
  la derecha; en escritorio, columna de carta más ancha y cabecera más grande.
- Detalle: en móvil, copa arriba y receta debajo; desde tablet (`md`),
  **dos columnas** (copa a un lado, receta al otro).
- No hay navegación lateral: solo «← Volver a la carta», que vuelve a la
  línea de ese cóctel en la carta (ancla), no al principio de la página,
  para que se vea el viaje de vuelta.
- Nada puede provocar scroll horizontal en ningún ancho (desde 320 px).

## Contenido
- Real: seis cócteles clásicos con recetas reales (Negroni, Margarita,
  Old Fashioned, Daiquiri, Mojito, Espresso Martini).
- Inventado: textos de descripción (tono canalla), precios y frases de la
  casa. Las copas son **SVG propias**, una por tipo de vaso (rocks, cóctel,
  highball, coupe…), en content collection con los datos de cada cóctel.

## Personalidad
Canalla, divertido, descarado.

## Dirección visual
«Cartel de verbena»: como un cartel de fiestas pegado en la pared del bar.
- Paleta: crema `#F3E9D2` (fondo), rojo tomate `#E63B2E`, azul tinta
  `#1B2A4A` (texto), amarillo yema `#F5B700` (acentos), y lima `#9CC63B`
  solo para líquidos y guarniciones de las copas (nunca texto).
- Tipografía: **Bricolage Grotesque** (titulares, muy gruesa y apretada) +
  **Space Mono** (precios, medidas). Instaladas con `@fontsource-variable`
  (Space Mono con `@fontsource` si no hay variable).
- Referencia de la cabecera: franja superior «★ Abierto hasta que nos echen ★»;
  debajo «EL ÚLTIMO / TRAGO.» en Bricolage 800 (el máximo de la variable),
  rojo, en dos líneas también en móvil, enorme y con interletrado apretado;
  una copa ladeada al lado. Banderines de verbena bajo la franja, en la
  portada y en el detalle.
- Cada cóctel lleva su número de carta (Nº 01…06) visible en la carta y en
  la franja del detalle.
- Precios sin decimales cuando son enteros («10 €»).

## Detalle memorable
- El viaje de copa y nombre entre carta y detalle.
- Al pasar el ratón o enfocar una línea de la carta, **su copa se ladea**
  como si brindara. En móvil brinda al tocarla (`active`).

## Movimiento
Sutil: solo el viaje y la copa que se ladea. Todo respeta
`prefers-reduced-motion`.

## Stack
Astro + Tailwind CSS v4 (con `@tailwindcss/vite`, tokens en `@theme`),
arquitectura de pods, content collections para los cócteles.

## Decidido por la IA (revísalo)
- Carpeta nueva `04-el-ultimo-trago` (proyecto desde cero).
- Los seis cócteles elegidos y sus precios.
- Ruta del detalle: `/cocteles/[slug]`.
- Cartel crema/rojo/tinta/amarillo y la pareja Bricolage + Space Mono.
- Franja «Abierto hasta que nos echen» en la cabecera.
