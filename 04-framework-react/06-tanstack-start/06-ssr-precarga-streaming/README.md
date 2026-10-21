# 06 · SSR - Precarga - Streaming

## 1. Que vamos a hacer

Vamos a pararnos y ver delo que hemos implementado:

- Cómo funciona SSR y el código isomórfico.

- Cómo funciona la precarga.

- Cómo priorizar contenido y streaming.

## 2. Manos a la obra

Hasta ahora has visto que bueno, se organiza el código bien, y eso, pero si destripamos un poco lo que ya hay te vas a sorprender.

Lo primero hemos estado haciendo SSR sin saberlo, ¿Una demo, abre un ventana de terminal de debug (para si tenías corriendo el proyecto en otro terminal).

Y pon un breakpoint desde Visual Studio Code en el fichero

_src/routes/index.tsx_

En concreto dentro del loader:

```tsx
export const Route = createFileRoute("/")({
  loader: async () => {
    // ** AQUI DEBAJO***
    const cars = await carListRepository.getCarList();
    return { cars };
  },
  component: Home,
});
```

Ahora vamos cargar la página desde el navegador, hacemos un refresh y vemos que para el breakpoint.

¿Que pasa si navegamo a detalle de un coche y volvemos a la página principal? Pues que no para el breakpoint ¿Qué está pasando aquí? Pues que ahora está trabajando en modo SPA y hacer la carga desde cliente.

Fijate que chulo, el código del loader y la página es "isomórfica" es decir se puede ejecutar tanto en cliente como en servidor.

Vamos a por otro tema interesante, si estoy en una página de detalle y pongo el mismo breakpoint en la página principal pero en el navegador:

_src/routes/index.tsx_

En concreto dentro del loader:

```tsx
export const Route = createFileRoute("/")({
  loader: async () => {
    // ** AQUI DEBAJO***
    const cars = await carListRepository.getCarList();
    return { cars };
  },
  component: Home,
});
```

Fijate que en cuanto me acerco al enlace se ejecuta el loader, esto sirve para tener los datos listo y que la página parezca que carga de forma instantanea.

Esto se puede configurar, si nos vamos a:

_./src/routes/__root.tsx_

```tsx
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <Link to="/" className="text-lg font-bold">
            Compra Coches
          </Link>
```

Podemos añadir una propiedad al link

Deshabilitar el comportamiento

```diff
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
-          <Link to="/" className="text-lg font-bold">
          <Link
             to="/"
            className="text-lg font-bold"
+            preload={false}
          >

            Compra Coches
          </Link>
```

O hacer que haga la precargue cuando el enlace entre en pantalla

```diff
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
-          <Link to="/" className="text-lg font-bold">
          <Link
             to="/"
            className="text-lg font-bold"
+            preload="viewport"
          >

            Compra Coches
          </Link>
```

Las opciones son false, "intent", "viewport" y "render". "intent" precarga por interacción; "viewport", cuando el enlace entra en pantalla; y "render", cuando se muestra el enlace. También puedes ajustar el retraso con preloadDelay.

## 3. Streaming: priorizando contenido

Vamos ahora con un caso muy habitual: en una página tenemos datos que son críticos (la ficha del coche) y otros que son secundarios y además lentos (por ejemplo una oferta de financiación que nos da una API externa que tarda lo suyo).

¿Qué pasa si esperamos a todo antes de pintar? Vamos a verlo.

### 3.1 Una API lenta

Creamos una API que simula una llamada externa lenta con un `setTimeout` de 3 segundos:

_src/pods/car-detail/api/car-financing.api.server.ts_

```ts
// Simulamos una API externa lenta (p.ej. un servicio de financiación)
export async function fetchFinancingOffer(carId: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return `¡Financia este coche desde 199 €/mes! (oferta para ${carId})`;
}
```

### 3.2 La exponemos en el repository

Igual que hicimos con `getCar`, la envolvemos en una server function:

_src/pods/car-detail/car-detail.repository.ts_

```diff
import { createServerFn } from "@tanstack/react-start";
import { fetchCar } from "#/pods/car-detail/api/car-detail.api.server";
+ import { fetchFinancingOffer } from "#/pods/car-detail/api/car-financing.api.server";
import { mapCar } from "./car-detail.mapper";
import type { Car } from "#/pods/car-detail/car-detail.model";

(...)

+ const getFinancingOfferFn = createServerFn({ method: "GET" })
+   .validator((carId: string) => carId)
+   .handler(async ({ data: carId }): Promise<string> => fetchFinancingOffer(carId));

export const carDetailRepository = {
  getCar(carId: string): Promise<Car | null> {
    return getCarFn({ data: carId });
  },
+  getFinancingOffer(carId: string): Promise<string> {
+    return getFinancingOfferFn({ data: carId });
+  },
};
```

### 3.3 La pintamos en el pod

Le pasamos el texto al pod y lo mostramos en un `h2` debajo del precio:

_src/pods/car-detail/car-detail.pod.tsx_

```diff
- export function CarDetailPod({ car }: { car: Car }) {
+ export function CarDetailPod({
+   car,
+   financingOffer,
+ }: {
+   car: Car;
+   financingOffer: string;
+ }) {
  return (
    (...)
          <p className="text-3xl font-bold text-primary">
            {car.price} €
          </p>
+          <h2 className="text-xl font-semibold text-primary">
+            {financingOffer}
+          </h2>
        </div>
```

### 3.4 Primera versión: esperamos a todo

En el loader pedimos las dos cosas en paralelo y esperamos a que lleguen las dos:

_src/routes/cars/$carId.tsx_

```diff
export const Route = createFileRoute("/cars/$carId")({
  loader: async ({ params }) => {
-    const car = await carDetailRepository.getCar(params.carId);
+    const [car, financingOffer] = await Promise.all([
+      carDetailRepository.getCar(params.carId),
+      carDetailRepository.getFinancingOffer(params.carId),
+    ]);
    if (!car) throw notFound();
-    return { car };
+    return { car, financingOffer };
  },
  component: RouteComponent,
  notFoundComponent: CarNotFound,
});

function RouteComponent() {
-  const { car } = Route.useLoaderData();
+  const { car, financingOffer } = Route.useLoaderData();

-  return (<CarDetailPod car={car} />)
+  return <CarDetailPod car={car} financingOffer={financingOffer} />;
}
```

Arrancamos y abrimos el detalle de un coche, hacemos un refresh (F5)... y nos quedamos **3 segundos sin ver nada**. El servidor no manda el HTML hasta que tiene todos los datos, aunque la ficha del coche la tenía lista casi al momento.

Si navegas desde la lista (modo SPA) pasa lo mismo: haces click y la página no cambia hasta pasados los 3 segundos.

> Ojo: con la precarga por `intent` que vimos antes, al pasar el ratón por encima del enlace ya se empieza a cargar, así que parte de la espera se "esconde". Si quieres verlo claro, pon `preload={false}` en el enlace.

Mal asunto: un dato secundario está bloqueando toda la página.

### 3.5 Segunda versión: streaming

¿Y si pintamos ya la ficha del coche y la oferta la mostramos cuando llegue? Para eso, en el loader **no hacemos `await`** de la llamada lenta, devolvemos directamente la promesa:

_src/routes/cars/$carId.tsx_

```diff
export const Route = createFileRoute("/cars/$carId")({
  loader: async ({ params }) => {
-    const [car, financingOffer] = await Promise.all([
-      carDetailRepository.getCar(params.carId),
-      carDetailRepository.getFinancingOffer(params.carId),
-    ]);
+    // La llamada lenta la lanzamos pero NO la esperamos
+    const financingOfferPromise = carDetailRepository.getFinancingOffer(params.carId);
+    // La crítica sí la esperamos (además decide si es un 404)
+    const car = await carDetailRepository.getCar(params.carId);
    if (!car) throw notFound();
-    return { car, financingOffer };
+    return { car, financingOfferPromise };
  },
  component: RouteComponent,
  notFoundComponent: CarNotFound,
});

function RouteComponent() {
-  const { car, financingOffer } = Route.useLoaderData();
+  const { car, financingOfferPromise } = Route.useLoaderData();

-  return <CarDetailPod car={car} financingOffer={financingOffer} />;
+  return <CarDetailPod car={car} financingOfferPromise={financingOfferPromise} />;
}
```

> Fíjate que lanzamos la promesa lenta **antes** del `await` del coche, así las dos peticiones van en paralelo.

Ahora necesitamos un componente que sepa esperar a esa promesa. TanStack Router nos da `Await`, que por debajo usa `Suspense` de React: mientras la promesa no se resuelve muestra el `fallback`, y cuando llega pinta el contenido:

Para que sea más legible creamos NUEVO componente

_src/pods/car-detail/components/car-financing-offer.component.tsx_

```tsx
import { Await } from "@tanstack/react-router";

// Muestra la oferta de financiación cuando llega; mientras, un "Cargando...".
export function CarFinancingOffer({
  offerPromise,
}: {
  offerPromise: Promise<string>;
}) {
  return (
    <Await
      promise={offerPromise}
      fallback={<p className="text-muted-foreground">Cargando oferta...</p>}
    >
      {(offer) => (
        <h2 className="text-xl font-semibold text-primary">{offer}</h2>
      )}
    </Await>
  );
}
```

Lo exportamos:

_src/pods/car-detail/components/index.ts_

```diff
export * from './car-contact.component';
+ export * from './car-financing-offer.component';
export * from './car-not-found.component';
export * from './car-specs.component';
```

Y el pod, en vez de recibir el texto, recibe la promesa:

_src/pods/car-detail/car-detail.pod.tsx_

```diff
import { CarSpecs } from "#/pods/car-detail/components/car-specs.component";
import { CarContact } from "#/pods/car-detail/components/car-contact.component";
+ import { CarFinancingOffer } from "#/pods/car-detail/components/car-financing-offer.component";
import type { Car } from "#/pods/car-detail/car-detail.model";

export function CarDetailPod({
  car,
-  financingOffer,
+  financingOfferPromise,
}: {
  car: Car;
-  financingOffer: string;
+  financingOfferPromise: Promise<string>;
}) {
  return (
    (...)
          <p className="text-3xl font-bold text-primary">
            {car.price} €
          </p>
-          <h2 className="text-xl font-semibold text-primary">
-            {financingOffer}
-          </h2>
+          <CarFinancingOffer offerPromise={financingOfferPromise} />
        </div>
```

Volvemos a refrescar (F5) el detalle del coche: ahora **la ficha aparece al momento** con el texto "Cargando oferta..." y a los 3 segundos aparece el `h2` con la oferta.

¿Qué está pasando? TanStack Start hace **streaming SSR**: manda el HTML por trozos. Primero envía la página con lo que ya tiene (la ficha y el `fallback`) y deja la conexión abierta; cuando la promesa se resuelve en el servidor, manda por esa misma respuesta el resto y React lo encaja en su sitio.

Puedes comprobarlo en las DevTools del navegador, pestaña _Network_: la petición del documento se queda "abierta" unos 3 segundos aunque la página ya se vea.

Y si navegas desde la lista (modo SPA) funciona igual: la página cambia al momento y la oferta llega después.

### 3.6 ¿Cuándo usar cada cosa?

- **Esperar (`await`)**: datos críticos, sin los que la página no tiene sentido o que deciden qué mostrar (en nuestro caso el coche, que además decide si damos un 404), o que necesitamos en el HTML inicial para SEO.
- **Streaming (devolver la promesa)**: datos secundarios o lentos (ofertas, recomendaciones, comentarios, valoraciones...) que no deben bloquear el resto de la página.
