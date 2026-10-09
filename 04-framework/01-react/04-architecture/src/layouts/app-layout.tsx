import { Link, Outlet } from "react-router";
import { routes } from "../core/router/routes";
export function AppLayout() {
  return <main>
    <nav aria-label="Principal"><Link to={routes.members}>Directorio</Link></nav>
    <p>Datos ficticios para la clase.</p>
    <Outlet />
  </main>;
}

