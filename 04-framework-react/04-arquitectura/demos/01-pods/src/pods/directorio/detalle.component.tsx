import { Link } from "@tanstack/react-router";
import type { Member } from "../../core/members/model";
export function DetalleComponent({ member }: { member: Member }) {
  return <article className="space-y-2 rounded bg-white p-5">
    <h2>{member.name}</h2><p>{member.role}</p><p>{member.email}</p>
    <Link to="/members/$memberId/edit" params={{ memberId: String(member.id) }}>Editar persona</Link>
  </article>;
}
