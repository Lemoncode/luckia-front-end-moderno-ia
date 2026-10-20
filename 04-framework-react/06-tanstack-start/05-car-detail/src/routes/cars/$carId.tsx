import { createFileRoute, notFound } from "@tanstack/react-router";

import { carDetailRepository, CarDetailPod, CarNotFound } from "#/pods/car-detail";

export const Route = createFileRoute("/cars/$carId")({
  loader: async ({ params }) => {
    const car = await carDetailRepository.getCar(params.carId);
    if (!car) throw notFound();
    return { car };
  },  
  component: RouteComponent,
  notFoundComponent: CarNotFound, 
});

function RouteComponent() {
  const { car } = Route.useLoaderData();

  return (<CarDetailPod car={car} />)
}
