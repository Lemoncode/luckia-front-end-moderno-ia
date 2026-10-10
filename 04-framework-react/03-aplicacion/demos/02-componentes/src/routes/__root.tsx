import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: () => <h1>Página no encontrada</h1>,
});
function Layout() {
  return <main>
    <nav aria-label="Principal" className="flex flex-wrap gap-4">
      <Link to="/members">Directorio</Link>
      
    </nav>
    <p>Datos ficticios.</p>
    <Outlet />
  </main>;
}
