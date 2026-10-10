import { saveMember } from "../../core/members/api";
import { useMember } from "../../core/members/hooks";
import type { Member } from "../../core/members/model";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { EdicionComponent } from "./edicion.component";
type OnSaved = (member: Member) => Promise<void>;
export function AltaContainer({ onSaved }: { onSaved: OnSaved }) {
  return <EdicionComponent onSave={async values => onSaved(await saveMember(values))} />;
}
export function EdicionContainer({ id, onSaved }: { id: string; onSaved: OnSaved }) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return <EdicionComponent key={member.id} initialValues={member}
    onSave={async values => onSaved(await saveMember(values, member.id))} />;
}
