import { createRootRoute } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";

function Layout() {
  return (
    <main>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-700">Personas · Equipo</p>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">Directorio interno</span>
      </header>
      <nav aria-label="Principal">
        <Link to="/members" activeOptions={{ exact: true }}>Directorio</Link>
        <Link to="/members/new">Añadir persona</Link>
      </nav>
      <Outlet />
      <footer className="border-t border-slate-200 pt-6 text-xs text-slate-500">
        Datos ficticios. Los cambios se guardan solo en este navegador.
      </footer>
    </main>
  );
}

export const Route = createRootRoute({ component: Layout, notFoundComponent: () => <h1>Página no encontrada</h1> });
