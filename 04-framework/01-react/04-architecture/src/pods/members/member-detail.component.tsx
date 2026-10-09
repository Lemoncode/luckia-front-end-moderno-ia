import { Link } from "react-router";
import { routes } from "../../core/router/routes";
import type { Member } from "./model";
export function MemberDetailComponent({ member }: { member: Member }) {
  return <article className="space-y-2 rounded bg-white p-5">
    <h2>{member.name}</h2><p>{member.role}</p><p>{member.email}</p>
    <Link to={routes.member(member.id === 3 ? 1 : member.id + 1)}>Siguiente persona</Link>
  </article>;
}

