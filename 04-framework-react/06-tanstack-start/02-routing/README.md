# 02 · Routing: rutas, navegación y layout

## 1. Qué vamos a hacer

Partimos del proyecto vacío funcionando.

Ahora:

- Vamos a añadir rutas de navegación:
  - Home (`/`) que tendrá un listado de coches (de momento un placeholder).
  - `/cars/$carId` que mostrará el detalle de un coche.
- Un **layout común** (una cabecera con navegación) que envuelve a todas las
  páginas, definido sobre `__root.tsx`.
- **Navegación tipo SPA** entre páginas con el componente `<Link>`: cambiar de
  página **no recarga** el navegador entero.

Al terminar esta guía tendrás, en tu proyecto **compra-coches**, el **esqueleto de
navegación** de la aplicación montado con el **enrutado por ficheros** de TanStack
Start/Router.

---

## 2. Punto de partida

Esta guía parte del proyecto semilla, ojo también tendrás que copiar de la guía del paso anterior el contenido para el fichero .env.

Antes de empezar, asegúrate de que el proyecto arranca en su estado actual:

```bash
pnpm install
pnpm dev   # debe servir http://localhost:3000 con la home de la semilla
```

---

## 3. Concepto

### Enrutado **por ficheros** (file-based routing)

En TanStack Start las rutas **no se declaran en un array**: se deducen de los
**ficheros** que colocas dentro de `src/routes/`. Cada fichero exporta una `Route`
y su **ubicación y nombre** determinan la URL:

| Fichero                      | URL que genera |
| ---------------------------- | -------------- |
| `src/routes/index.tsx`       | `/`            |
| `src/routes/cars/$carId.tsx` | `/cars/:carId` |
| `src/routes/__root.tsx`      | (layout raíz)  |

Reglas que usaremos:

- **`index.tsx`** es la ruta "índice" de su carpeta (la home, en la raíz).
- Una **carpeta** (`cars/`) añade un **segmento** a la URL (`/cars/...`).
- El prefijo **`$`** en el nombre del fichero marca un **parámetro dinámico**:
  `cars/$carId.tsx` captura cualquier valor en esa posición (`/cars/123`,
  `/cars/abc`, …) y te lo entrega como `carId`.
- **`__root.tsx`** es la ruta **raíz**: envuelve a todas las demás. Es el sitio
  natural para el **layout común** (cabecera, navegación, pie…).

---

## 4. Pasos

### Paso 0

Arranca el proyecto (le va a hacer falta a TanStack Start para ir regenerando las rutas cuando añadamos ficheros).

```bash
pnpm dev
```

### Paso 1 — Añadir el layout común en `__root.tsx`

Queremos una cabecera con navegación visible en todas las páginas (puede que a futuro queramos poner un footer), para ello definimos un layout, en el mundo aspx lo llamaban un "master page".

Antes de ponernos a crear esto, vamos a entender qué trae ahora ese `__root.tsx` y para qué sirve

`__root.tsx` define la ruta raíz de la aplicación y el documento HTML que envuelve las páginas. Es el lugar común para configurar metadatos, estilos globales y herramientas compartidas.

Abrimos el archivo y podemos ver:

- head define los metadatos de la página y carga styles.css.

- shellComponent establece la estructura del documento (<html>, <head> y <body>).

- <HeadContent /> inserta en el <head> los metadatos y enlaces definidos en head.

- {children} muestra el contenido de las rutas; TanStack Start lo proporciona dentro del documento.

- TanStackDevtools añade herramientas de desarrollo, incluido el panel de TanStack Router.

- <Scripts /> carga los scripts necesarios para que la aplicación funcione en el navegador.

¿Y ahora cómo encaja nuestro layout?

- Importamos el componente _Outlet_ que sirve para mostrar el contenido dentro del layout.

_./src/routes/\_\_root.tsx_

```diff
import {
  HeadContent,
  Scripts,
  createRootRoute,
+ Outlet,
} from '@tanstack/react-router'
```

- Creamos un componente que podemos llamar _AppLayout_ (podría ir en otro fichero), y ahí pintamos la cabecera y el pie de página, y dentro invocamos al outlet para pintar el resto de contenido (la página actual que se esté mostrando).

```diff
+ function AppLayout() {
+  return (
+    <>
+      <header>SOY EL HEADER</header>
+      <main>
+        <Outlet />
+      </main>
+      <footer>SOY EL FOOTER</footer>
+    </>
+  )
+ }

function RootDocument({ children }: { children: React.ReactNode }) {
```

- Y donde invocamos el `createRootRoute`, además del shellComponent que pinta el HTML principal, añadimos una sección `component` donde pintamos nuestro layout.

```diff
export const Route = createRootRoute({
  head: () => ({
    meta: [
      //(...)
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
+ component: AppLayout,
  shellComponent: RootDocument,
})
```

Vamos a comprobar que aparece el texto de header y footer.

Nos vamos al navegador y vemos el resultado.

Vamos ahora a darle un poco de estilo a esa cabecera:

_./src/routes/\_\_root.tsx_

```diff
import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
+  Link,
} from "@tanstack/react-router";
```

```diff
function AppLayout() {
  return (
    <>
-      <header>SOY EL HEADER</header>
+      <header className="border-b bg-white/70 backdrop-blur">
+        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
+          <Link to="/" className="text-lg font-bold">
+            Compra Coches
+          </Link>
+          <div className="flex items-center gap-4 text-sm">
+            <Link
+              to="/"
+              activeOptions={{ exact: true }}
+              className="hover:underline"
+              activeProps={{ className: "font-semibold underline" }}
+            >
+              Inicio
+            </Link>
+            <Link
+              to="/cars/$carId"
+              params={{ carId: "demo" }}
+              className="hover:underline"
+              activeProps={{ className: "font-semibold underline" }}
+            >
+              Ficha demo
+            </Link>
+          </div>
+        </nav>
+      </header>

      <main>
        <Outlet />
      </main>
      <footer>SOY EL FOOTER</footer>
    </>
  );
}
```

Fíjate que aquí nos da un error en la ruta y los parámetros

```
  to="/cars/$carId"
  params={{ carId: "demo" }}
```

Esto es porque TanStack Router tipa las rutas de forma automática y ve que no existe en el árbol.

Lo primero en la página `home` vamos a cambiar el contenido:

_./src/routes/index.tsx_

```diff
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
-    <div className="p-8">
-      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
-      <p className="mt-4 text-lg">
-        Edit <code>src/routes/index.tsx</code> to get started.
-      </p>
-    </div>
+    <div className="space-y-4">
+      <h1 className="text-3xl font-bold">Coches en venta</h1>
+      <p className="text-muted-foreground">
+        Aquí aparecerá el listado de coches. De momento es un placeholder: los
+        datos reales llegan en la guía <code>03-car-list-loader</code>.
+      </p>
+    </div>
  )
}
```

Y ahora vamos a por ese detalle de un coche, vamos a crear una ruta, en este caso:

- Creamos una carpeta `cars` dentro de `src/routes`.
- Dentro declaramos un fichero `$carId.tsx`, que tendrá el parámetro de entrada.

OJO de primeras al crear el fichero ya nos genera código TanStack Start (tenemos que tener levantado el proyecto).

Ya podríamos navegar.

Vamos ahora a mostrar el parámetro de navegación en la página (más adelante conectaremos con BBDD).

_./src/routes/cars/$carId.tsx_

```diff
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cars/$carId")({
  component: RouteComponent,
});

function RouteComponent() {  
+  // Leemos el parámetro de la URL de forma tipada: `carId` es exactamente el
+  // nombre que pusimos tras el `$` en el fichero ($carId.tsx).
+  const { carId } = Route.useParams();

-  return <div>Hello "/cars/$carId"!</div>;
+  return (
+    <div className="space-y-4">
+      <h1 className="text-3xl font-bold">Ficha del coche</h1>
+      <p className="text-muted-foreground">
+        Estás viendo la ficha del coche con identificador:
+      </p>
+      <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
+        carId = {carId}
+      </p>
+      <p className="text-muted-foreground">
+        De momento es un placeholder: los datos reales del coche llegan en la
+        guía <code>03-car-list-loader</code>.
+      </p>
+    </div>
+  );
}
```


