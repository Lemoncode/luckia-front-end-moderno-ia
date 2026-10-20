# 03 · CarList

## 1. Que vamos a hacer

Vamos a crear una server function para traernos los datos de la base de datos.

## 2. Manos a la obra

Primero nos aseguramos que tenemos lo servicios levantado (base de datos y S3).

Ahora, en TanStack start podríamos consumir de una API externa o podemos crear server functions que se ejecutan directamente en el servidro, que en proyectos sencillos nos pueden servir para atacar a una base de datos, en un proyecto más complejo podrían servirnos como una capa intermedia, y simplificar interacción cliente / servidor.

Ya tenemos instaladas en el proyecto las librerías para poder acceder a MongoDB, así que vamos a crear una función de ayuda cómun para gestionar la conexión a base de datos (asegurate también que tienes el fichero `.env` con las entradas de conexiones etc)

> Fijate que hemos añadido el sufijo "server" a este fichero, esto sirve para que falle si intentamo usarlo en un fichero de clente.

_./src/common/db.server.ts_

```ts
// Cliente de MongoDB compartido (solo servidor).
//
// Vive en `src/common/` porque lo usan las api de MÁS de un pod (car-list y
// car-detail). Reutilizamos un ÚNICO MongoClient entre invocaciones: abrir una
// conexión nueva por request agotaría el pool y sería lentísimo. Guardamos la
// PROMESA de conexión a nivel de módulo (singleton) y la reutilizamos.
//
// Este módulo SOLO se importa dentro de los `.handler` de server functions, así que
// el driver `mongodb` nunca acaba en el bundle de cliente.
import { MongoClient, ObjectId, type Db } from "mongodb";

// Leemos la conexión del entorno; los valores por defecto coinciden con el `.env`
// y el `docker-compose` de `01-datos`, así que en local funciona sin configurar nada.
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB ?? "compra-coches";

let clientPromise: Promise<MongoClient> | undefined;

// Devuelve la base de datos, abriendo la conexión la primera vez y reutilizándola
// después. `connect()` se llama una sola vez para toda la vida del proceso.
export function getDb(): Promise<Db> {
  if (!clientPromise) {
    clientPromise = new MongoClient(MONGODB_URI).connect();
  }
  return clientPromise.then((client) => client.db(MONGODB_DB));
}

// Convierte el `carId` de la URL en un ObjectId de Mongo. Si NO es un ObjectId válido
// (p. ej. `/cars/loquesea`), devolvemos `null` en vez de dejar que `new ObjectId()`
// lance: así el detalle acaba en "no encontrado" (404), no en un 500.
export function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}
```

Ahora dentro del pod de `car-list`, vamos a crear una subcarpeta que llamaremos "api", ahí vamos a definir el modelo de las entidades de mongodb que tenemos y una server function.

_./src/pods/car-list/api/car-list.api-model.server.ts_

```ts
import type { ObjectId } from "mongodb";

export interface CarListDoc {
  _id: ObjectId;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  photos: string[];
}
```

Y ahora vamos a definir función que va a leer de mongoDB

_./src/pods/car-list/api/car-list.api.server.ts_

```ts
import { getDb } from "#/common/db.server.ts";
import type { CarListDoc } from "#/pods/car-list/api/car-list.api-model";

export async function fetchCarList(): Promise<CarListDoc[]> {
  try {
    const db = await getDb();
    // Proyectamos solo los campos que el listado usa (no carga el coche entero) y
    // devolvemos los documentos CRUDOS, sin tocarlos.
    return await db
      .collection<CarListDoc>("cars")
      .find(
        {},
        {
          projection: {
            make: 1,
            model: 1,
            price: 1,
            year: 1,
            km: 1,
            photos: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray();
  } catch (error) {
    // No filtramos la URI ni el stack al cliente: log en servidor + error genérico.
    console.error("[car-list.api] error consultando Mongo:", error);
    throw new Error("No se pudieron cargar los coches. Inténtalo más tarde.");
  }
}
```

Sólo nos queda un paso ¿Te acuerdas de `car-list-repository`? Eso lo usabamos en un loader, vamos a eliminar la llamada a datos Mock e invocar a la api que hemos creado antes, pero... nos hace falta que esta llamada se ejecuta desde el serivdor, ¿Cómo hacemos esto? Usando `createServerFn`, vamos a reemplazar el fichero completo:

_./src/pods/car-list/car-list.repository.ts_

> OJO QUE ESTO DA UN ERROR, Y ES QUE FALTA MAPEAR

```ts
import { createServerFn } from "@tanstack/react-start";
import type { CarSummary } from "./car-list.model";
import { fetchCarList } from "./api/car-list.api.server";

const getCarListFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CarSummary[]> => {
    const docs = await fetchCarList();
    return docs;
  },
);

export const carListRepository = {
  getCarList(): Promise<CarSummary[]> {
    return getCarListFn();
  },
};
```

Todo Listo, pero, tenemos un error, results que _docs_ no es un array de _CarSummary_ si no de la entidad de mongo, ¿Qué podemos hacer aquí? Pues mapear de una entidad a otra, para ello creamos un mapper y lo usamos.

_./src/pods/car-list/car-list.mapper.ts_

```ts
import type { CarListDoc } from "#/pods/car-list/api/car-list.api-model";
import type { CarSummary } from "#/pods/car-list/car-list.model";

export function mapCarSummary(doc: CarListDoc): CarSummary {
  return {
    id: doc._id.toString(),
    make: doc.make,
    model: doc.model,
    price: doc.price,
    year: doc.year,
    km: doc.km,
    photo: doc.photos[0],
  };
}
```

Y ya podemos usarlo:

_./src/pods/car-list/car-list.repository.ts_

```diff
import type { CarSummary } from "./car-list.model";
import { fetchCarList } from "#/pods/car-list/api/car-list.api";
+ import { mapCarSummary } from "./car-list.mapper";

const getCarListFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CarSummary[]> => {
    const docs = await fetchCarList();
-    return docs;
+    return docs.map(mapCarSummary);
  },
});
```

Ahora si, y en el loader estamos usando ya este repo con esa firma, así que probamos en el navegador y vemos que está ahora tirando de BBDD

```bash
pnpm run dev
```
