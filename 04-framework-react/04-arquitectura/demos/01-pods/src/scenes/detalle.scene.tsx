import { Link } from "@tanstack/react-router";
import { DetalleContainer } from "../pods/directorio";
export function DetalleScene({ id }: { id: string }) {
  return <><h1>Detalle del equipo</h1><Link to="/members">Volver al listado</Link><DetalleContainer key={id} id={id} /></>;
}
