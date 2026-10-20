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
