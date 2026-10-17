import styles from "./layout.module.css";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: () => <h1>Página no encontrada</h1>,
});
function Layout() {
  return <main className={styles.container}>
    <nav aria-label="Principal" className={styles.navigation}>
      <Link to="/members">Directorio</Link>
      <Link to="/members/new">Añadir persona</Link>
    </nav>
    <p className={styles.notice}>Datos ficticios. Los cambios se guardan solo en este navegador.</p>
    <Outlet />
  </main>;
}
