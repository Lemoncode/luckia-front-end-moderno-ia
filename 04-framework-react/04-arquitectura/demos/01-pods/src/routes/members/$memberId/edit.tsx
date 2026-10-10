import { createFileRoute } from "@tanstack/react-router";
import { EdicionScene } from "../../../scenes/edicion.scene";
export const Route = createFileRoute("/members/$memberId/edit")({ component: EditPage });
function EditPage() {
  const { memberId } = Route.useParams();
  return <EdicionScene id={memberId} />;
}
