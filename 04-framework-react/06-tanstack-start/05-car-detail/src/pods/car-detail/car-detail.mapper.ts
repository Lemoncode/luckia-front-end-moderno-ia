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
