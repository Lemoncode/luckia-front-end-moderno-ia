import { Link, useParams } from "react-router";
import { routes } from "../core/router/routes";
import { MemberDetailContainer } from "../pods/members";
export function MemberDetailScene() {
  const { id = "" } = useParams();
  return <>
    <h1>Detalle del equipo</h1>
    <Link to={routes.members}>Volver al listado</Link>
    <MemberDetailContainer id={id} />
  </>;
}

