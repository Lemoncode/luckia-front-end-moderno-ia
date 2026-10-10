import { useMember } from "../../core/members/hooks";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { DetalleComponent } from "./detalle.component";
export function DetalleContainer({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return <DetalleComponent member={member} />;
}
