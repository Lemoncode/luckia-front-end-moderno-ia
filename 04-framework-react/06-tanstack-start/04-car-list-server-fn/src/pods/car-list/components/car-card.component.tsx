import { Link } from "@tanstack/react-router";
import type { CarSummary } from "#/pods/car-list/car-list.model";

// Tarjeta de un coche en el listado. Es un <Link> a su ficha: como /cars/$carId es
// una ruta con parámetro, el tipado exige `params={{ carId: car.id }}`.
export function CarCard({ car }: { car: CarSummary }) {
  return (
    <Link
      to="/cars/$carId"
      params={{ carId: car.id }}
      className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <img
        src={car.photo}
        alt={`${car.make} ${car.model}`}
        className="aspect-[16/10] w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-1 p-4">
        <h2 className="font-semibold text-card-foreground">
          {car.make} {car.model}
        </h2>
        <p className="text-sm text-muted-foreground">
          {car.year} · {car.km.toLocaleString("es-ES")} km
        </p>
        <p className="text-lg font-bold text-primary">{car.price} €</p>
      </div>
    </Link>
  );
}
