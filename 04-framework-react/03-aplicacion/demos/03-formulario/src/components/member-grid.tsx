import type { Member } from "../model";
import { MemberCard } from "./member-card";

export function MemberGrid({ members }: { members: Member[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {members.map((member) => <MemberCard key={member.id} member={member} />)}
    </ul>
  );
}
