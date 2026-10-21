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
