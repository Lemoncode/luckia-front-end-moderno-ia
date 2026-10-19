# 03 · CarList

## 1. Que vamos a hacer

Vamos a mostrar el listado de coches, para ello accederemos a base de datos desde una función de servidor y cargaremos los datos.

También vamos a ver como estructurar la aplicación.

## 2. Estructurando en pods

Estructurar una aplicación web siempre puede traer quebraderos de cabeza, más cuando un mapeo uno a uno con backend puedeo no resultar bien.

En Lemoncode, empezamos a usar una aproximación que fue popular en el framework Ember hace tiempo, y que es parecida a Vertical Slicing, la llamamos "Estructura de PODS", y varios clientes grandes nos pidieron implantarla como estándar en sus proyectos.

Esta aproximación la empezamos a usar en 2020, y en 2022 dedicimos documentarla: https://github.com/Lemoncode/lemon-front-estructura/tree/main

La hemos usando tanto en proyectos React com Astro.

Para no manchar la carpeta de rutas con un montón de ficheros vamos a crearnos una carpeta para almacenar funcionlidad rica, la llamaremos `pods`.

Un pod engloba una funcionalidad rica y una página puede usar un pod o varios.

Vamos a por el pod de la lista de coches:

Creamos la carpeta principal `pods`

y debajo creamos la carpeta `car-list`.

Lo primero vamos a definir el modelo de datos que vamos a consumir desde la vista ¿Que informacíon nos hace falta?

_./src/pods/car-list/car-list.model.ts_

```ts
// View-model del pod `car-list`: lo MÍNIMO que necesita una tarjeta del listado.
//
// No es el coche completo (eso es cosa del pod `car-detail`): la tarjeta solo pinta
// una foto, la marca/modelo, año, km y el precio. Modelar solo lo que la UI usa
// mantiene el pod enfocado y desacoplado de la forma de la fuente de datos.
export interface CarSummary {
  id: string;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  photo: string; // una sola foto para la tarjeta (la primera del coche)
}
```

Y ahora que tenemos la estructura, vamos a meter datos harcodeados de momento para mostrarlos (fijate que en la firma lo ponemos como asíncrono así nos valdrá para más adelante cuando leamos de BBDD)

_./src/pods/car-list/car-list.repository.ts_

```ts
import type { CarSummary } from "./car-list.model";

export const carListRepository = {
  getCarList(): Promise<CarSummary[]> {
    return [
      {
        id: "seat-leon",
        make: "Seat",
        model: "León 1.5 TSI",
        price: 18900,
        year: 2021,
        km: 42000,
        photo: "http://localhost:9000/car-photos/seat-leon.jpg",
      },
      {
        id: "volkswagen-golf",
        make: "Volkswagen",
        model: "Golf 2.0 TDI",
        price: 21500,
        year: 2020,
        km: 68000,
        photo: "http://localhost:9000/car-photos/volkswagen-golf.jpg",
      },
      {
        id: "toyota-corolla",
        make: "Toyota",
        model: "Corolla Hybrid",
        price: 23900,
        year: 2022,
        km: 31000,
        photo: "http://localhost:9000/car-photos/toyota-corolla.webp",
      },
      {
        id: "tesla-model-3",
        make: "Tesla",
        model: "Model 3 Standard Range",
        price: 34900,
        year: 2021,
        km: 55000,
        photo: "http://localhost:9000/car-photos/tesla-model-3.jpg",
      },
      {
        id: "renault-clio",
        make: "Renault",
        model: "Clio 1.0 TCe",
        price: 13500,
        year: 2020,
        km: 49000,
        photo: "http://localhost:9000/car-photos/renault-clio.jpg",
      },
      {
        id: "bmw-serie-3",
        make: "BMW",
        model: "Serie 3 320d",
        price: 29900,
        year: 2019,
        km: 82000,
        photo: "http://localhost:9000/car-photos/bmw-serie-3.jpg",
      },
    ];
  },
};
```

Eso lo consumiremos desde el _loader_ de la página, punto inicial donde se cargan datos, ¿Qué ventajas tiene?

- No dependemos de _useEffect_ y los problemas que trae.
- Se puede cachear (incluso integrar con React Query).
- Se puede hacer streaming, unos elementos del loader los procesamos en la carga otros podemos diferir su procesado (streaming).
- Se pueden hacer cargas predictivas, por ejemplo si pongo el ratón encima de un coche de la lista puedo ejecutar el loader en background de la página de ese coche.

Vamos ahora a poner un componente simple que muestre al listado de coches, para ello definimos lo que llamamos el _pod_ principal:

_./src/pods/car-list/car-list.pod.ts_

```ts
import type { CarSummary } from "#/pods/car-list/car-list.model";

export function CarListPod({ cars }: { cars: CarSummary[] }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="display-title text-4xl font-bold text-foreground">
          Coches en venta
        </h1>
        <p className="text-muted-foreground">
          {cars.length} coches disponibles ahora mismo.
        </p>
      </div>

      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <p>{car.make} {car.model}<p/>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Creamos un barrel para exponer tanto el pod como el repository

_./src/pods/car-list/index.ts_

```ts
export * from "./car-list.pod";
export * from "./car-list.repository";
```

Ahora vamos a usar esto en la página de de listado de coches.

_./src/routes/index.tsx_

```diff
import { createFileRoute } from "@tanstack/react-router";
+ import {CarListPod, carListRepository } from '#/pods/car-list'

export const Route = createFileRoute("/")({
+  loader: async () => {
+    const cars = await carListRepository.getCarList();
+    return { cars };
+  },
  component: Home
});

function Home() {
+  const { cars } = Route.useLoaderData();

  return (
-    <div className="space-y-4">
-      <h1 className="text-3xl font-bold">Coches en venta</h1>
-      <p className="text-muted-foreground">
-        Aquí aparecerá el listado de coches. De momento es un placeholder: los
-        datos reales llegan en la guía <code>03-loaders</code>.
-      </p>
-    </div>
+    <CarListPod cars={cars}>
  );
}
```

Vamos al navegador y a ver si se muestra la lista...

¡ Perfecto !

Ahora que funciona, vamos a darle un poco de cariño al diseño, nos vamos al pod de `car-list` y creamos un card componente y despues un contenedor para mostrarlo.

_./src/pods/car-list/car-card.component.tsx_

```tsx
import { Link } from "@tanstack/react-router";
import type { CarSummary } from "#/pods/car-list/car-list.model";

// Tarjeta de un coche en el listado. Es un <Link> a su ficha: como /cars/$carId es
// una ruta con parámetro, el tipado exige `params={{ carId: car.id }}`.
export function CarCard({ car }: { car: CarSummary }) {
  return (
    <Link
      to="/cars/$carId"
      params={{ carId: car.id }}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <img
        src={car.photo}
        alt={`${car.make} ${car.model}`}
        className="aspect-[16/10] w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-1 p-4">
        <h2 className="font-semibold text-card-foreground">
          {car.make} {car.model}
        </h2>
        <p className="text-sm text-muted-foreground">
          {car.year} · {car.km.toLocaleString("es-ES")} km
        </p>
        <p className="text-lg font-bold text-primary">{car.price} €</p>
      </div>
    </Link>
  );
}
```

Creamos un barrel:

_./src/pods/car-list/components/index.ts_

```ts
export * from "./car-card.component";
```

Y ahora lo usamos dentro de `car-list.pod`:

_./src/pods/car-list/car-list.pod.tsx_

```diff
import type { CarSummary } from "#/pods/car-list/car-list.model";
+ import {CarCard} from './components'

export function CarListPod({ cars }: { cars: CarSummary[] }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="display-title text-4xl font-bold text-foreground">
          Coches en venta
        </h1>
        <p className="text-muted-foreground">
          {cars.length} coches disponibles ahora mismo.
        </p>
      </div>

-      <ul>
-        {cars.map((car) => (
-          <li key={car.id}>
-            <p>{car.make} {car.model}<p/>
-          </li>
-        ))}
-      </ul>
+      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
+        {cars.map((car) => (
+          <li key={car.id}>
+            <CarCard car={car} />
+          </li>
+        ))}
+      </ul>
    </div>
  );
}
```

Y ya tenemos la lista, pero con datos mock, vamos a implementar el acceso real a base de datos.
