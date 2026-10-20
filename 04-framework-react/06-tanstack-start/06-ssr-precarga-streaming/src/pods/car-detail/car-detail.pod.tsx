import { CarSpecs } from "#/pods/car-detail/components/car-specs.component";
import { CarContact } from "#/pods/car-detail/components/car-contact.component";
import type { Car } from "#/pods/car-detail/car-detail.model";
import { CarFinancingOffer } from "#/pods/car-detail/components/car-financing-offer.component";

// Pod de la ficha: compone foto + cabecera (marca/modelo/precio) + ficha técnica +
// descripción + contacto. Recibe el coche ya cargado por el loader de la ruta (vía
// repository); el pod no toca ni la api ni el repository.
export function CarDetailPod({
  car,
  financingOfferPromise,
}: {
  car: Car;
  financingOfferPromise: Promise<string>;
}) {
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
          <p className="text-3xl font-bold text-primary">{car.price} €</p>
          <CarFinancingOffer offerPromise={financingOfferPromise} />
        </div>

        <CarSpecs car={car} />

        <p className="text-muted-foreground">{car.description}</p>

        <CarContact seller={car.seller} />
      </div>
    </article>
  );
}
