import type { Member } from "../../core/members/model";
import { MemberCard } from "./member-card";
export function DirectorioComponent({ members, filter, onFilterChange }: {
  members: Member[]; filter: string; onFilterChange: (value: string) => void;
}) {
  return <>
    <label htmlFor="filter">Buscar por nombre</label>{" "}
    <input id="filter" value={filter} onChange={event => onFilterChange(event.target.value)} />
    {members.length === 0 ? <p>Sin resultados.</p> :
      <ul className="grid gap-3 sm:grid-cols-2">
        {members.map(member => <MemberCard key={member.id} member={member} />)}
      </ul>}
  </>;
}
