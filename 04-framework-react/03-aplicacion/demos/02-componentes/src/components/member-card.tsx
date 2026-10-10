import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
export function MemberCard({ member }: { member: Member }) {
  return <li className="rounded bg-white p-4 shadow-sm">
    <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>{member.name}</Link>
    <p>{member.role}</p>
  </li>;
}
