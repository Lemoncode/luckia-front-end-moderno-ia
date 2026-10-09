import { Loading, ErrorMessage } from "../../common/components/request-status";
import { useMember } from "./hooks";
import { MemberDetailComponent } from "./member-detail.component";
export function MemberDetailContainer({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return <MemberDetailComponent member={member} />;
}

