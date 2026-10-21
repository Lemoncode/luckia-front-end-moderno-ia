import type { Car } from "../car-detail.model";

// Bloque de contacto del vendedor, con enlaces `tel:` y `mailto:` reales.
export function CarContact({ seller }: { seller: Car["seller"] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="font-semibold text-card-foreground">Contacto</h2>
      <p className="mt-1 text-sm text-muted-foreground">{seller.name}</p>
      <div className="mt-2 flex flex-col gap-1 text-sm">
        <a
          className="text-primary hover:underline"
          href={`tel:${seller.phone}`}
        >
          {seller.phone}
        </a>
        <a
          className="text-primary hover:underline"
          href={`mailto:${seller.email}`}
        >
          {seller.email}
        </a>
      </div>
    </div>
  );
}
