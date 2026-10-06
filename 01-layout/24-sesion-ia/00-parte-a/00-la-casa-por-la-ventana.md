# Claude code ... la casa por la ventana

Vamos a empezar la casa por la ventana... ¿Por qué? Porque las herramientas IA se llevan su tiempo haciendo cosas, y mientras está generando, nosotros iremos explicando conceptos básicos.

**Ojo esto es una simulación, para un proyecto real, recopilaríamos más datos y también romperíamos en pasos más pequeños**

## El caso

⏱️ 2 minutos

Eres el jefe del departamento de Informática de una Universidad de nueva creación, resulta que ya estamos en mitad de campaña de promoción y la web actual se ha quedado muy antigua, no es responsiva y va fatal de rendimiento, se cae en cuanto lanzan una campaña de adsense... hace falta desarrollar algo que sea más moderno, responsivo y vaya como un cohete...

...Lo quieren para ayer ¿Qué hacemos?

Lo primero le hemos pedido al departamento de marketing que nos den el contenido en un formato markdown:

- Le pasamos una plantilla para cada titulación.
- Le pedimos las fotos.

También nos pasan un PDF con la imagen corporativa.

## Material de partida

⏱️ 5 minutos

Aquí lo importante es iterar rápido, ¿Y si está tarde ya le mostramos una versión y que encima vaya como un cohete y escale bien?

Vamos a revisar el contenido que nos han dado:

- El PDF con la guía de marca.
- Root.md la página principal.
- Titulaciones:
  - Le pasamos una plantilla a Marketing (\_template.md).
  - Ellos han creado un .md por cada titulación.
  - Además en Assets nos han pasado:
    - El temario de cada titulación en PDF.
    - Una imagen para usar en cada titulación.

# Desición tecnológica

⏱️ 5 minutos

Para que el sitio vaya como una moto, lo suyo es que esté en HTML estático, pero también queremos que los de marketing puedan tocar contenido, para ello elegimos:

- Usar un Headless CMS: es decir un almacen de contenido sin parte de UI, tu defines estructura, almacedas datos y lo puedes consumir con una API.

- Una tecnología de Front que permita leer de esa API y en el build generar el contenido estático:
  - Hemos elegido Astro.
  - Podríamos haber elegido Tan Stack Start + React también.

# Vamos a crear proyectos en blanco

⏱️ 5 minutos

Me voy a Content Island (Headless CMS) y creo un proyecto en blanco.

**contentisland.net y crear proyecto en blanco**

Me voy a mi terminal y creo una carpeta hermana a nivel de content que se va a llamar `front` y creo mi proyecto Astro:

```bash
cd front
npm create astro@latest .
```

Lo arrancamos para ver que funciona

```bash
npm run dev
```

## Conexiones Claude

### MCP

⏱️ 5 minutos

Vamos por pasos, nos hace falta que Claude hable con el Headless CMS, para ello:

- Vamos a copiar el token de escritura del proyecto (esto está sólo disponible a partir de la versión Pro de Content Island, si alguno tenéis ganas de bichearlo, comentadmelo por Discord y os doy un acceso, nosotros somos los creadores de este Headless CMS).

- Y vamos a enseñar a Claude como conectarse, para ello usamos un MCP (Model Context Protocol) y le pasamos el token de escritura.

> Un MCP es un estándar que permite a una IA conectarse y utilizar herramientas, servicios y datos externos.

```bash
claude mcp add content-island \
  --transport stdio \
  --scope project \
  -e CONTENT_ISLAND_ACCESS_TOKEN=TOKEN_DE_ESCRITURA \
  -- npx -y @content-island/mcp
```

## Skills

⏱️ 5 minutos

Con esto ya tenemos Claude conectado con nuestro proyecto de datos, pero... ahora le vamos a enseñar cómo trabajar, esta es la parte en la que Neo (Matrix) dice "I know kungfu" (https://media.licdn.com/dms/image/v2/D5622AQGp4DVXnBIHzg/feedshare-shrink_800/feedshare-shrink_800/0/1708577540358?e=2147483647&v=beta&t=zFAX-jvXOlOAnyT4gX-yK7Hjy18oJy9M7MVdrCodznA)

- Para el Front quiero que sepas interactuar con la API de Content Island (como leer contenido), para ello te explico como puedes consultar la documentación oficial.

- Por otro lado no quiero que piques a lo loco, quiero que estructures bien el proyecto, para ello quiero que uses la arquitectura de pods (parecida a vertical slices, auqnue pone más enfásis al encapsulamiento).

Para ello me instalo skills:

```bash
npx @content-island/ai-skills
```

En el selector, marcar:

- `content-island-client-api` (cómo consultar el contenido)
- `content-island-astro-pods-architecture` (cómo estructurar el proyecto Astro)

Lo siguiente, quiero que claude diseñe el front lo mejor posible y siguiendo buenas prácticas, como arranque me puedo bajar el skill de Claude de Front

Entro Claude dese el terminal e instalo el skill oficial de Front End de Claude:

```bash
claude
```

```bash
/plugin install frontend-design@claude-plugins-official
```

## Modelado y contenido

⏱️ 10 minutos

Ya tenemos todo listo para empezar a trabajar: el proyecto Astro creado, Claude conectado con Content Island y las skills instaladas.

El primer paso será preparar el contenido. Le voy a pedir que revise el material que nos ha entregado el equipo, proponga un modelo de datos y, cuando lo confirmemos, cree los modelos y cargue todo en Content Island.

De momento no vamos a tocar el diseño ni la web. Nos centramos únicamente en dejar bien estructurado y cargado el contenido.

**Prompt (guardado y listo para pegar):**

```text
Tienes acceso a Content Island por MCP, con permisos de escritura, sobre el proyecto "Universidad Valvera", que ahora mismo está vacío.

En la carpeta ../content tienes el material que ha entregado el equipo de contenido de una universidad:

- root.md: contenido de la página principal (hero, cifras y las tres áreas de conocimiento).
- titulaciones/*.md: una ficha por estudio, siguiendo siempre la estructura de titulaciones/_template.md.
- assets/: las imágenes .webp y los temarios en PDF que referencian esas fichas.

Quiero que hagas dos cosas:

1. Diseña el modelo de contenido y créalo en Content Island:
   - Una entrada única para la home.
   - Un modelo "Área" (nombre, slug, descripción, imagen).
   - Un modelo "Titulación" con, al menos: título, slug, área (relación con Área), tipo,
     duración, créditos ECTS, destacado, descripción corta, descripción larga,
     qué aprenderás, imagen de cabecera con su texto alternativo y temario en PDF.
   - Usa el tipo de campo que corresponda en cada caso (texto, texto enriquecido, número,
     booleano, imagen, archivo y relación). No metas todo como texto plano.

2. Carga todo el contenido: las tres áreas, las ocho titulaciones y la home,
   subiendo también las imágenes y los PDF de assets/ y enlazándolos donde toca.

Antes de crear nada, enséñame el modelo que propones y espera mi confirmación.
```

Aquí lo vamos a lanzar en modo "tira palante", si tenemos dudas podemos darle a "shift tab" y probar el "plan mode", que te va comentando y haciendo preguntas.

> En sesiones posteriores veremos una capa por encima que es un Harness en el que llevamos un proceso formal.

Le damos caña... y esperamos, mientras vamos a saltar a explicarlos conceptos :)

**PAUSA**

Vamos a ver el resultado en Content Island: modelo, gráfica, y datos.

## Front End

⏱️ 15 minutos -->

> OJO 11 minutos de espera saltar aqui

Vamos ahora a añadir una variable de entorno para tener el token de lectura de Content Island (no usamos el de escritura para aplicación).

```bash
# en front/.env
CONTENT_ISLAND_ACCESS_TOKEN=TOKEN_DE_SOLO_LECTURA
```

Y ahora vamos a decirle que cree el sitio, lo haga con una buena arquitectura, y leyendo los datos de Content Island:

```text
Vas a crear el portal web de la Universidad Valvera en este proyecto Astro,
leyendo el contenido de Content Island con @content-island/api-client
y el token que está en .env.

Sigue la guía de marca de ../guia-de-marca.pdf: colores, tipografías (Fraunces e Inter),
tono, botones, tarjetas, espaciados y radios. Convierte la paleta en variables CSS.

Páginas:

- /                    Home: hero, cifras, las tres áreas y las titulaciones destacadas.
- /estudios            Listado de todas las titulaciones, con filtro por área.
- /estudios/[slug]     Ficha: cabecera con imagen, descripción, qué aprenderás,
                       bloque resumen (área, duración, créditos) y botón de descarga del temario.
- /areas/[slug]        Titulaciones de un área.

Requisitos:

- Genera las rutas dinámicas en tiempo de build con getStaticPaths.
- Tipa el contenido que llega de Content Island.
- Sigue la arquitectura de pods de la skill de Content Island.
- Diseño responsive y accesible (contraste AA, textos alternativos de las imágenes).
- Utiliza la skill frontend-design para diseñar e implementar la interfaz,
  respetando siempre la guía de marca.
- Vas a usar Tailwind 4 como Framework CSS, ojo usa esta guia para Astro (Add Tailwind 4) y note lies con la versión 3: https://docs.astro.build/en/guides/styling/#tailwind
```

> IMPORTANTE aqui donde más va a tardar es en empollarse la guía en PDF, si estuviera en markdown podría ser más rápido.

Le damos... (modo auto, lo normal sería Plan Mode o Harness).

Listo, vamos a actualizar:

> Esto siempre es una caja de sorpresa, vamos a ver que tal va...

```bash
npm run dev
```

Y aquí tenemos el portal

> Jugar aquí escritorio y movil

Y además podemos crear un usuario para los de marketing y que editen y publiquen contenido.

> Ir A content Island y cambiar el nombre de titulación, de Ingenieria software por doble grado de...

¿Y que me dices del código?

> Nos paseamos por el proyecto en VSCode y enseñamos como está todo estructurado.
