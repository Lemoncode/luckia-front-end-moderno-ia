import { Await } from "@tanstack/react-router";

// Muestra la oferta de financiación cuando llega; mientras, un "Cargando...".
export function CarFinancingOffer({
  offerPromise,
}: {
  offerPromise: Promise<string>;
}) {
  return (
    <Await
      promise={offerPromise}
      fallback={<p className="text-muted-foreground">Cargando oferta...</p>}
    >
      {(offer) => (
        <h2 className="text-xl font-semibold text-primary">{offer}</h2>
      )}
    </Await>
  );
}
