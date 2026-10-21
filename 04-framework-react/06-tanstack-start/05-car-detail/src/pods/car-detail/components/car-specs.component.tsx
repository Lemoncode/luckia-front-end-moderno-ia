import type { Car } from "../car-detail.model";

// Etiquetas legibles del tipo de combustible.
const fuelLabel: Record<Car["fuelType"], string> = {
  diesel: "Diésel",
  gasolina: "Gasolina",
  hibrido: "Híbrido",
  electrico: "Eléctrico",
};

// Etiquetas legibles de la transmisión (con tilde: "Automático").
const transmissionLabel: Record<Car["transmission"], string> = {
  manual: "Manual",
  automatico: "Automático",
};

// Ficha técnica del coche (año, km, combustible, transmisión, potencia, color).
export function CarSpecs({ car }: { car: Car }) {
  return (
    <dl className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <dt className="text-muted-foreground">Año</dt>
        <dd className="font-medium text-foreground">{car.year}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Kilómetros</dt>
        <dd className="font-medium text-foreground">
          {car.km.toLocaleString("es-ES")} km
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Combustible</dt>
        <dd className="font-medium text-foreground">
          {fuelLabel[car.fuelType]}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Transmisión</dt>
        <dd className="font-medium text-foreground">
          {transmissionLabel[car.transmission]}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Potencia</dt>
        <dd className="font-medium text-foreground">{car.power} CV</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Color</dt>
        <dd className="flex items-center gap-2 font-medium text-foreground">
          <span
            className="inline-block h-4 w-4 rounded-full border border-border"
            style={{ backgroundColor: car.color }}
            aria-hidden="true"
          />
          <span>{car.color}</span>
        </dd>
      </div>
    </dl>
  );
}
