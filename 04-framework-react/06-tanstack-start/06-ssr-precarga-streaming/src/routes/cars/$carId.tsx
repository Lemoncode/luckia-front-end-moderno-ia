import { createFileRoute, notFound } from "@tanstack/react-router";

import {
  carDetailRepository,
  CarDetailPod,
  CarNotFound,
} from "#/pods/car-detail";

export const Route = createFileRoute("/cars/$carId")({
  loader: async ({ params }) => {
    // La llamada lenta la lanzamos pero NO la esperamos
    const financingOfferPromise = carDetailRepository.getFinancingOffer(
      params.carId,
    );
    // La crítica sí la esperamos (además decide si es un 404)
    const car = await carDetailRepository.getCar(params.carId);

    if (!car) throw notFound();
    return { car, financingOfferPromise };
  },
  component: RouteComponent,
  notFoundComponent: CarNotFound,
});

function RouteComponent() {
  const { car, financingOfferPromise } = Route.useLoaderData();

  return <CarDetailPod car={car} financingOfferPromise={financingOfferPromise} />;
}
