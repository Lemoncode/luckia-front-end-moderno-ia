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
