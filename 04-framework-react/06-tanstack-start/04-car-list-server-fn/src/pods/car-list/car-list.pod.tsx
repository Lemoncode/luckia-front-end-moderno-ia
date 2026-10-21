import type { CarSummary } from "#/pods/car-list/car-list.model";
import { CarCard } from "./components";

export function CarListPod({ cars }: { cars: CarSummary[] }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="display-title text-4xl font-bold text-foreground">
          Coches en venta
        </h1>
        <p className="text-muted-foreground">
          {cars.length} coches disponibles ahora mismo.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <li key={car.id}>
            <CarCard car={car} />
          </li>
        ))}
      </ul>
    </div>
  );
}
