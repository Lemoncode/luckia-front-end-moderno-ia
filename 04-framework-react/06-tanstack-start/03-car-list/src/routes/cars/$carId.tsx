import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cars/$carId")({
  component: RouteComponent,
});

function RouteComponent() {
  // Leemos el parámetro de la URL de forma tipada: `carId` es exactamente el
  // nombre que pusimos tras el `$` en el fichero ($carId.tsx).
  const { carId } = Route.useParams();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Ficha del coche</h1>
      <p className="text-muted-foreground">
        Estás viendo la ficha del coche con identificador:
      </p>
      <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
        carId = {carId}
      </p>
      <p className="text-muted-foreground">
        De momento es un placeholder: los datos reales del coche llegan en la
        guía <code>03-loaders</code>.
      </p>
    </div>
  );
}
