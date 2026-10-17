import { useContext } from "react";
import { ViewContext } from "../compact-context";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
export function MemberCard({ member }: { member: Member }) {
  const view = useContext(ViewContext);
  if (view === null) throw new Error("MemberCard necesita un ViewContext.Provider.");
  const { compact } = view;
  return <li className={compact ? "rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"}>
    <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>{member.name}</Link>
    {!compact && <p>{member.role}</p>}
  </li>;
}
