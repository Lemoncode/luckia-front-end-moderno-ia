import { createServerFn } from "@tanstack/react-start";
import { fetchCar } from "#/pods/car-detail/api/car-detail.api.server";
import { fetchFinancingOffer } from "#/pods/car-detail/api/car-financing.api.server";
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

const getFinancingOfferFn = createServerFn({ method: "GET" })
  .validator((carId: string) => carId)
  .handler(async ({ data: carId }): Promise<string> =>
    fetchFinancingOffer(carId),
  );

export const carDetailRepository = {
  getCar(carId: string): Promise<Car | null> {
    return getCarFn({ data: carId });
  },
  getFinancingOffer(carId: string): Promise<string> {
    return getFinancingOfferFn({ data: carId });
  },
};
