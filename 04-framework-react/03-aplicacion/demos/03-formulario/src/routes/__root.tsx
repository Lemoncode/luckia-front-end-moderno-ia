import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: () => <h1>Página no encontrada</h1>,
});
function Layout() {
  return <main>
    <nav aria-label="Principal" className="flex flex-wrap gap-4">
      <Link to="/members">Directorio</Link>
      <Link to="/members/new">Añadir persona</Link>
    </nav>
    <p>Datos ficticios. Los cambios se guardan solo en este navegador.</p>
    <Outlet />
  </main>;
}
