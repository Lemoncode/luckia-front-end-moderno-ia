import { Link } from "@tanstack/react-router";

// Estado "no encontrado" del pod. La ruta /cars/$carId lo usa como
// `notFoundComponent`: se pinta cuando el loader hace `throw notFound()`.
export function CarNotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="display-title text-3xl font-bold text-foreground">
        Coche no encontrado
      </h1>
      <p className="text-muted-foreground">
        No hemos encontrado ningún coche con ese identificador. Puede que se
        haya vendido o que el enlace no sea correcto.
      </p>
      <Link
        to="/"
        className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        Volver al listado
      </Link>
    </div>
  );
}
