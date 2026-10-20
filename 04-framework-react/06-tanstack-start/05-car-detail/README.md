# 03 · Car Detail

## 1. Que vamos a hacer

Vamos ahora con la ficha de detalle de un coche, esto va a ser parecido a lo que hicimos antes y nos servira para repasar.

## 2. Manos a la obra

Vamos a crear un pod de para `car-detail` y esta vez iremos más rápido con la parte que es parecida a lo que hicimos en el ejemplo anterior.

Empezamos desde la api:

_./src/pods/car-detail/api/car-detail.api-model.server.ts_

```ts
import type { ObjectId } from "mongodb";

// Esto se podría promocionar a `common`
export type FuelType = "diesel" | "gasolina" | "hibrido" | "electrico";
export type Transmission = "manual" | "automatico";

export interface CarDoc {
  _id: ObjectId;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  fuelType: FuelType;
  transmission: Transmission;
  power: number;
  color: string; // hex (#8e44ad), tal cual lo guarda el seed
  description: string;
  photos: string[];
  seller: { name: string; phone: string; email: string };
  createdAt: Date; // la ficha no lo usa (el mapper lo descarta)
}
```

_./src/pods/car-detail/api/car-detail.api.server.ts_

```ts
import { getDb, toObjectId } from "#/common/db.server";
import type { CarDoc } from "./car-detail.api-model.server";

export async function fetchCar(carId: string): Promise<CarDoc | null> {
  const _id = toObjectId(carId);
  if (!_id) return null; // carId no es un ObjectId válido -> no encontrado
  try {
    const db = await getDb();
    // Devolvemos el documento CRUDO, sin tocarlo (ni `_id`, ni `createdAt`).
    return await db.collection<CarDoc>("cars").findOne({ _id });
  } catch (error) {
    console.error("[car-detail.api] error consultando Mongo:", error);
    throw new Error("No se pudo cargar el coche. Inténtalo más tarde.");
  }
}
```

Y ahora creamos el modelo de la vista, el mapper y el repositorio.

_./src/pods/car-detail/car-detail.model.ts_

```ts
// Esto se podría promocionar a `common`
export type FuelType = "diesel" | "gasolina" | "hibrido" | "electrico";
export type Transmission = "manual" | "automatico";

export interface Car {
  id: string;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  fuelType: FuelType;
  transmission: Transmission;
  power: number; // CV
  color: string;
  description: string;
  photos: string[]; // URLs públicas de MinIO
  seller: { name: string; phone: string; email: string };
}
```

Añadimos el mapper

_./src/pods/car-detail/car-detail.mapper.ts_

```ts
import type { CarDoc } from "./api/car-detail.api-model.server";
import type { Car } from "./car-detail.model";

export function mapCar(doc: CarDoc): Car {
  return {
    id: doc._id.toString(),
    make: doc.make,
    model: doc.model,
    price: doc.price,
    year: doc.year,
    km: doc.km,
    fuelType: doc.fuelType,
    transmission: doc.transmission,
    power: doc.power,
    color: doc.color,
    description: doc.description,
    photos: doc.photos,
    seller: doc.seller,
  };
}

```

_./src/pods/car-detail/car-detail.repository.server.ts_

```ts
import { createServerFn } from "@tanstack/react-start";
import { fetchCar } from "#/pods/car-detail/api/car-detail.api.server";
import { mapCar } from "./car-detail.mapper";
import type { Car } from "#/pods/car-detail/car-detail.model";

// Server function con validador: recibe el `carId` como `ctx.data`.
const getCarFn = createServerFn({ method: "GET" })
  // Validamos lo que viene de cliente en este caso que venga un string
  // Para entradas más complejas podemo usar Zod: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
  .validator((carId: string) => carId)
  // Simplement usamos un alias, para que en vez de algo generico como
  // data, tenga más sentido
  .handler(async ({ data: carId }): Promise<Car | null> => {
    const doc = await fetchCar(carId); // doc CRUDO de Mongo (CarDoc) o null
    return doc ? mapCar(doc) : null; // mapper -> model (plano) o null (-> notFound())
  });

export const carDetailRepository = {
  getCar(carId: string): Promise<Car | null> {
    return getCarFn({ data: carId });
  },
};
```

Y el componente para mostrar el detalle de un coche... para ello necesitamos crear varios subomponentes:

_./src/pods/car-detail/compoennts/car-contact.component.tsx_

```tsx
import type { Car } from "../car-detail.model";

// Bloque de contacto del vendedor, con enlaces `tel:` y `mailto:` reales.
export function CarContact({ seller }: { seller: Car["seller"] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="font-semibold text-card-foreground">Contacto</h2>
      <p className="mt-1 text-sm text-muted-foreground">{seller.name}</p>
      <div className="mt-2 flex flex-col gap-1 text-sm">
        <a
          className="text-primary hover:underline"
          href={`tel:${seller.phone}`}
        >
          {seller.phone}
        </a>
        <a
          className="text-primary hover:underline"
          href={`mailto:${seller.email}`}
        >
          {seller.email}
        </a>
      </div>
    </div>
  );
}
```

_./src/pods/car-detail/compoennts/car-not-found.component.ts_

```tsx
import { Link } from "@tanstack/react-router";

// Estado "no encontrado" del pod. La ruta /cars/$carId lo usa como
// `notFoundComponent`: se pinta cuando el loader hace `throw notFound()`.
export function CarNotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="display-title text-3xl font-bold text-foreground">
        Coche no encontrado
      </h1>
      <p className="text-muted-foreground">
        No hemos encontrado ningún coche con ese identificador. Puede que se
        haya vendido o que el enlace no sea correcto.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        Volver al listado
      </Link>
    </div>
  );
}
```

_./src/pods/car-detail/components/car-specs.component.tsx_

```tsx
import type { Car } from "../car-detail.model";

// Etiquetas legibles del tipo de combustible.
const fuelLabel: Record<Car["fuelType"], string> = {
  diesel: "Diésel",
  gasolina: "Gasolina",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};

// Etiquetas legibles de la transmisión (con tilde: "Automático").
const transmissionLabel: Record<Car["transmission"], string> = {
  manual: "Manual",
  automatico: "Automático",
};

// Ficha técnica del coche (año, km, combustible, transmisión, potencia, color).
export function CarSpecs({ car }: { car: Car }) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-muted-foreground">Año</dt>
        <dd className="font-medium text-foreground">{car.year}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Kilómetros</dt>
        <dd className="font-medium text-foreground">
          {car.km.toLocaleString("es-ES")} km
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Combustible</dt>
        <dd className="font-medium text-foreground">
          {fuelLabel[car.fuelType]}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Transmisión</dt>
        <dd className="font-medium text-foreground">
          {transmissionLabel[car.transmission]}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Potencia</dt>
        <dd className="font-medium text-foreground">{car.power} CV</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Color</dt>
        <dd className="flex items-center gap-2 font-medium text-foreground">
          <span
            className="inline-block h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: car.color }}
            aria-hidden="true"
          />
          <span>{car.color}</span>
        </dd>
      </div>
    </dl>
  );
}
```

Y vamos a exponer un barrel con todos los componentes:

_./src/pods/car-detail/components/index.ts_

```ts
export * from './car-contact.component';
export * from './car-not-found.component';
export * from './car-specs.component';
```

y lo consumimos en el pod principal (lo creamos):

_./src/pods/car-detail/components/car-detail.pod.tsx_

```ts
import { CarSpecs } from "#/pods/car-detail/components/car-specs.component";
import { CarContact } from "#/pods/car-detail/components/car-contact.component";
import type { Car } from "#/pods/car-detail/car-detail.model";

// Pod de la ficha: compone foto + cabecera (marca/modelo/precio) + ficha técnica +
// descripción + contacto. Recibe el coche ya cargado por el loader de la ruta (vía
// repository); el pod no toca ni la api ni el repository.
export function CarDetailPod({ car }: { car: Car }) {
  return (
    <article className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <img
        src={car.photos[0]}
        alt={`${car.make} ${car.model}`}
        className="aspect-[16/10] w-full rounded-lg border border-border object-cover"
      />

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="display-title text-3xl font-bold text-foreground">
            {car.make} {car.model}
          </h1>
          <p className="text-3xl font-bold text-primary">
            {car.price} €
          </p>
        </div>

        <CarSpecs car={car} />

        <p className="text-muted-foreground">{car.description}</p>

        <CarContact seller={car.seller} />
      </div>
    </article>
  );
}
```

Vamos a crear un barrel para exponer que exportamos a la página que lo vaya a consumir

_./src/pods/car-detail/index.ts_

```ts
export {CarNotFound} from './components';
export * from './car-detail.repository';
export * from './car-detail.pod';
```


Ahora ya sólo nos queda irnos a la página de detalle de un coche leer el campo slug e invocarlo en el loader para mostrarlo en el detalle.

_./src/routes/cars/$carId.tsx_

```diff
import { 
  createFileRoute, 
+ notFound
} from "@tanstack/react-router";

+ import { carDetailRepository, CarDetailPod, CarNotFound } from "#/pods/car-detail";

export const Route = createFileRoute("/cars/$carId")({
+  loader: async ({ params }) => {
+    const car = await carDetailRepository.getCar(params.carId);
+    if (!car) throw notFound();
+    return { car };
+  },  
  component: RouteComponent,
+ notFoundComponent: CarNotFound,  
});

function RouteComponent() {
-  // Leemos el parámetro de la URL de forma tipada: `carId` es exactamente el
-  // nombre que pusimos tras el `$` en el fichero ($carId.tsx).
-  const { carId } = Route.useParams();
+  const { car } = Route.useLoaderData();


+  return (<CarDetailPod car={car} />)
-  return (
-    <div className="space-y-4">
-      <h1 className="text-3xl font-bold">Ficha del coche</h1>
-      <p className="text-muted-foreground">
-        Estás viendo la ficha del coche con identificador:
-      </p>
-      <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
-        carId = {carId}
-      </p>
-      <p className="text-muted-foreground">
-        De momento es un placeholder: los datos reales del coche llegan en la
-        guía <code>03-loaders</code>.
-      </p>
-    </div>
-  );
}
```

Lo probamos y ... ya lo tenemos :)
