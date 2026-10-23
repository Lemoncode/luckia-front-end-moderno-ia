# Plan Mode

Al ser un proyecto sencillo y algo tipo prototipo tirando de plan mode a secas nos podría valer, vamos a ver que tal.

Primer paso crear el proyecto en blanco y para almacenar las diposnibilidades podemos tirar de un contenedor con MongoDB.

Sobre crear el proyecto desde cero, aquí es mejor crearlo usando el cli de tanstack start, ¿Por qué?

- Es algo rápido si lo hacemos nosotros.
- Las herramientas IA se suelen liar al configurar Tailwind y ShadCN, tendríamos que buscar los enlaces exactos, mejor tirar de cli y decirle lo que queremos.

Lo vamos a crear debajo de una carpeta front, y lo que haremos después ya tirando de IA es que queremos crear un mono repo usando turbo repo que ya tenemos el proyecto de front, pero que nos ha hacer falta un proyecto para compartir el modelo de datos y otro para crear una semilla de datos con mongoDB, y tener contenedor de dockerfile y de un emulador de S3 para poder tener imagenes.

Después le diremos que del diseño de claude se baje las imagenes de la casa, las meta en el S3 de desarrollo, y genere un fichero en el que indique las rutas para que después las use la aplicación web.

En el siguiente paso le pediremos que nos propona un modelo para almacenar reservas de clientes, y tener en cuenta que puede haber reservas de clientes o rangos de fecha que la vivienda no esté disponible (por ejemplo reformas).

Una vez que tenemos eso, le pedimos que nos cree semilla de datos con simulación de reservas para 2026 y 2027.

Y ahora si nos metemos a implementar el sitio, le diremos que el proyecto está con Tan Stack Start y que use:

- Tailwind y ShadCN
- TanStack Form para los formularios.
- Zod para validaciones.
- El envío de correos que lo saque un mensaje por consola (a futuro se podría integrar con Resend).

Vamos paso a paso

# Paso 1 - Crear el proyecto en blanco

Para crear el proyecto ejecutamos

```
npx @tanstack/cli@latest create
```

Le damos nombre front

y
**IMPORTANTE**: Elegir ShadCN

**NO CREAR REPO GIT** Porque ya lo haremos despues en carpet padre

# Paso 2 - Pasamos a monorepo

Ya tenemos el proyecto de Front Creado ahora quiero pasar a monorepo y dejar preparado dos contenedores uno de S3 local y otro con un mongoDB, vamos a darle un prompt:

```
Debajo de la carpeta Front tengo un proyecto creado con TanStackstart, ahora me hace falta pasar esto a monorepo ya que quiero crear una carpeta hermana de paquetes y dentro va a tener un modelo común de base de datos (ojo no hay que modelar nada en este fase, sólo crear el proyecto), y después otro hermano que se llamará seed que será el código para generar la semilla de datos para la base de datos en desarrollo (lo mismo no hay que crear nada de semilla hora lo haremos después), y ese proyecto seed tendrá dependencia con el proyecto de modelo.

Además me va hacer falta tirar de docker compose y levantar por un lado una BBDD mongoDB y por otro lado un emular de S3 en local para poder subir imagenes
```

Lanzamos Claude desde el terminal, y ponemos "plan mode".

Parece que todo bien, probamos

```bash
npm run dev
```

Y

```bash
docker compose up -d
```

Si va todo bien vamos a empezar a añadir un repo de git, lo primero le pedimos a Claude que nos cree un .gitignore para el raiz (el que hay es muy simple)

```
Añademe un .gitignore en el raiz del proyecto
```

hacer un `git init` desde el raiz del proyecto.

# Paso 3 - Conexión diseño y S3

Y ahora vamos a por el siguiente paso, conectamos el diseño de Claude Design y le decimos que meta las fotos de la casa en un S3 y lo guarde.

Para poder compartir el diseño de Claude Design con Claude code, le damos a botón de Compartir en Claude Design.

Nos vamos al chat y le decimos que queremos hacer un handoff a Calude Code

**En Claude Design\***

```
Quiero hacer un handoff a Claude Code
```

Ahí igual te ppregunta Claude design, tenemos que darle otra opcion:

TanStack Start + Tailwind + ShadCN

Ya ha volcado en una carpeta todo el material, incluso listo para arrancar un proyecto nuevo con TanStack start, en nuestro caso lo que queremos es utilizar ese material para nuestro proyecto que ya existe, así que vamos a referenciar la ruta del proyecto de handoff e indicarle que para empezar añada al S3 las imagenes y que deje una referencia en un .md o un json para después poder utilizarlas en el proyecto.

```
Ahora quiero subir las imagenes de la Villa al S3 y guardar en un .md o un json esas ruta y que son para poder usarlas despues en el proyecto, lo que es el diseño, tematizado etc, lo he hecho con Claude Design y he pedido un handoff, lo puedes encontrar en esta ruta: /Users/brauliodiez/lab/design-test pero ojo no sigas las instrucciones para crear el proyecto tanstack start, lo que haremos será integrarlo con el proyecto que hemos creado nosotros,pero eso en otro paso de momento solo las imagenes en S3
```

# Paso 4 - Maquetación ventana principal

Ya lo tenemos, siguiente paso vamos a montar la página principal, lo idea es partirlo en dos pasos:

- El primero toda la maquetación y un dejar un place holder para la parte de reservas.

- El segundo nos centramos en la parte de reservas.

Vamos a por el primero

```
Quiero maquetar la ventana principal, la que muestra el carrusel de fotos y detalles de la villa, de la página principal vamos a dejar para un segundo paso la parte en la que aparece el calendario y se puede hacer la reserva, pon un placeholder, y acuerdate de maquetar tanto para escritorio como para móvil, de momento los textos en el html, y las imagenes que son del carrusel de imagenes leelas del S3
```

Como versee, se ve bien, pero si nos vamos al codigo tenemos un index.tsx enorme, vamos a organizar este código, para ello podemos estructurarlo en PODS.

```bash
npx @content-island/ai-skills
```

Elegimos solo: **tanstack-pods-architecture**

Y ahora vamos a decirle lo siguiente

```
He visto que has creado las página principal, pero va a ser dificil de mantener, porque está todo en la página, quiero que hagas un refactor y utilizes la arquitectura de PODS, tienes un skill ya instalado content-island-tanstack-start-pods-architecture usalo
```

# Paso 5 - Calendario

Tiene buena pinta, vamos ahora a por el calendario, ¿Qué pasa aquí? Que podemos optar por varias opciones:

1. Implementarlo pero tirar de un calendario de mockeado de fechas ocupadas, tiene su sentido porque lo que llega a cliente no tiene que porque ser igual que servidor (solo nos interesa saber si está ocupado o no), y una vez hecho meternos con MongoDB y demás.

2. Tira de modelar en MongoDB las reservas, crear datos para pruebas en la semilla, y con eso conectarlo todo sabiendo que tiramos de datos reales.

Creo que mejor tirar por el 1, y ojo vamos a especificar bien que pasa en cada caso.

```
Vamos ahora a implementar la lógica del calendario, nos podemos abstraer de momento del backend y definirlo todo como modelos de la vista, ¿Que le va a llegar a la vista? Pues la ocupación del mes actual y el siguiente, igual con decir que dias están ocupados ya nos vale (discute los pros y los cons de si cargar varios meses en adelante o no, podría ser interesante porque así si avanzao igual no tengo que recargar), la idea es que el usuario pueda elegir un rango de fecha, ojo que pasa aquí, que si elije un rango de fechas que está ocupado no podría hacer reserva, pero por usabilidad, dejar al usuario que pulse en la fecha y que se le muestra un mensaje indicando que en el rango de fechas que ha elegido hay días que están ocupados, puedes navegar entre meses y ojo que en movil creo que pusimos vista de un mes solo, aquí podemos tener un caso complicado que es el de que reservo del 29 de diciembre al 1 de enero, si está todo ok, navegarías al formulario de reserva donde podemos pasar por parametros (que serían opcionales) la selección de fechas y ya aparece prepopulada en el formulario, y ya el usuario tiene que rellenar el resto (aquí paramos, esta paso no lo hacemos)
```

Siguiente paso, vamos a alimentar contenido de reservas de prueba, primero le pedimos modelado de base de datos, después que implemente en el seed un carga de datos de prueba.

```
Nos metemos ahora con el backend, quiero guardar en la base de datos mongoDB las reservas, me podrías proponer un módelo (no lo implementes).
```

Aquí vemos lo que propone, tendríamos que refinarlo, pero al menos hay una cosa que no cuadra

```
¿Cómo va a calcular reference? ponemos VA y año mes y dia de cuando se reservo? o dos primeras letras de la persona que reserva
```

Ya lo tenemos fino, vamos ahora a generar los datos de prueba en el seed para 2026 y 2027

```
Estoy de acuerdo con el modelo, vamos ahora a implementarlo y también a generar datos de prueba de reservas para 2026 y 2027, acuerdate que tenemos en packages un proyecto común model, y que tenemos también un proyecto seed que sería el que crearía la semilla de base de datos, aquí sería buena idea preguntar si borrar los datos de la base de datos (o incluso ni preguntar a fin de cuentas es desarrollo local)
```

Ejecutamos la semilla para ver que todo ha ido bien:

```bash
npm run seed
```

Seguimos

```
Y vamos ahora a  conectar el calendario a MongoDB: sustituir los datos de ejemplo del pod availability por una server function que lea las noches ocupadas con occupiedNights, ojo a cliente solo pasamos datos de ocupación, nada de quien ha hecho la reserva ni otros datos sensibles.
```

Ya tenemos está página lista, vamos ahora a por el formulario de reservas.

```
Perfecto, vamos ahora a por el formulario de reservas (la página a la que se navega después), a tener en cuenta: quero que uses tan stack form para gestionar el formulario y zod para validarlo, quiero que en tpo de documento ponga DNI, o "Otro" y en DNI valides si el DNI está bien formado (con expresiones regulares elimina los tipicos patrones de con un guion, sin guion, espacio minsculas), y también que sea valido(algoritmo de validación de DNI), en caso de otro, sólo valida que este informaod, el campo nombre obligatorio y al menos 2 de longitud, cambio apellidos igual, el telefono string y obligatorio, el emai obligatorio y además email bien formado, numero de huespedes pon un combo y entre 1 y 8, obligatorio de informar, y peticiones especiales no es obligatorio, también es obligatorio pincha en Acepteo la política de privacidad.

Por otro lado fechas de llegada y salida obligatorias, y ojo que puedes venir a esta página sin haber elegido fechas, en ese caso el usuario tiene que seleccionarlas y al pinchar en llegad salirle un calendario con las ocupaciones.

Una vez completado con éxito (enviar solicitud) que se muestre un popup diciendo que la solicitud se ha enviado que nos pondremos en contacto en breve.
```

Si te fijas en el código generado, hay un problema, cuesta leer el formulario, porque hay un montón de form.field, lo suyo es crear wrappers de tanstack form que simplifiquen el formulario y nos sirvan para futuras ventanas no tener que poner tanto código.

```
Veo que estás usando en el formulario un montón de form.Field, como wrapper de los inputs y demás campos, eso está bien, pero claro cuesta leer el formulario y también a futuro si creamos más formularios estaríamos repetiendo un montón de código, haz una cosa en la ruta common/components/form, create un wrapper por cada uno de los componentes que se está usando en el formulario, y permite que entren por props propiedades intrinsecas de ese componente para que se pueda personalizar sin tener que crear otro wrapper (por ejemplo el input tiene su type o incluso su class... lo que toque)
```

Y aquí paramos, si quieres seguir jugando:

- Puedes crearte una cuenta gratuita de Resend y probar a que se envíe en un email de conifrmación.

- Si tienes Pro de Content Island (si no pidonos upgrade), puedes también conectar el MCP y decirle que almacene todo el contenido en Content Island y de paso lo pase a Inglés, 

- Puedes crear una intranet donde el administrador puede ver las fechas de reservas, cancelar:
  - Habría que implementar un login y seguridad puedes probar con Better Auth que tiene bastante resuelto y se integra con diferentes motores de bases de datos (incluido mongoDB).

  - Puedes monrar un calendario con meses y la ocupación cuando se pincha en un día se muestra los detalles de reserva.

  - También puedes borrar reservas, y crear reservas o bloqueos manuales.
