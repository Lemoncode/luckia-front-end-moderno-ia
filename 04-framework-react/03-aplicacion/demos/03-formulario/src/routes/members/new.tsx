import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MemberForm } from "../../member-form";
import { saveMember } from "../../api";
export const Route = createFileRoute("/members/new")({ component: NewMember });
function NewMember() {
  const navigate = useNavigate();
  return <>
    <h1>Añadir persona</h1>
    <Link to="/members">Cancelar</Link>
    <MemberForm onSave={async values => {
      const member = await saveMember(values);
      await navigate({ to: "/members/$memberId", params: { memberId: String(member.id) } });
    }} />
  </>;
}
