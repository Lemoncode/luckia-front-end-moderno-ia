import { createFileRoute } from "@tanstack/react-router";
import { DetalleScene } from "../../../scenes/detalle.scene";
export const Route = createFileRoute("/members/$memberId/")({ component: DetailPage });
function DetailPage() {
  const { memberId } = Route.useParams();
  return <DetalleScene id={memberId} />;
}
