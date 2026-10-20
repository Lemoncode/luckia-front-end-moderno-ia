import { createFileRoute } from "@tanstack/react-router";
import { carListRepository, CarListPod } from "#/pods/car-list";

export const Route = createFileRoute("/")({
  loader: async () => {
    const cars = await carListRepository.getCarList();
    return { cars };
  },
  component: Home,
});

function Home() {
  const { cars } = Route.useLoaderData();

  return <CarListPod cars={cars} />;
}
