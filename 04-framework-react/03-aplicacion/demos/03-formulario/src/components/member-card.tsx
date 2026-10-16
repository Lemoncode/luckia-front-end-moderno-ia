import { useContext } from "react";
import { CompactContext } from "../compact-context";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
export function MemberCard({ member }: { member: Member }) {
  const compact = useContext(CompactContext);
  return <li className={compact ? "rounded bg-white p-2 shadow-sm" : "rounded bg-white p-4 shadow-sm"}>
    <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>{member.name}</Link>
    {!compact && <p>{member.role}</p>}
  </li>;
}
