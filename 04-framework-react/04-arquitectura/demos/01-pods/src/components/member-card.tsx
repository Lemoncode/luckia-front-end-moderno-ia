import { Link } from "@tanstack/react-router";
import type { Member } from "../model";

export function MemberCard({ member }: { member: Member }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300">
      <div aria-hidden="true" className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700">
        {member.name.charAt(0)}
      </div>
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>{member.name}</Link>
      <p>{member.role}</p>
      <p className="break-all">{member.email}</p>
    </li>
  );
}
