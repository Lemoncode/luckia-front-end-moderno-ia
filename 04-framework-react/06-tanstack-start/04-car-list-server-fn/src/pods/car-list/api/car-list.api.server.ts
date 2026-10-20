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
