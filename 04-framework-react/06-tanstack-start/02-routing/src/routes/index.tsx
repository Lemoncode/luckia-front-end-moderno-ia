import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Coches en venta</h1>
      <p className="text-muted-foreground">
        Aquí aparecerá el listado de coches. De momento es un placeholder: los
        datos reales llegan en la guía <code>03-loaders</code>.
      </p>
    </div>
  );
}
