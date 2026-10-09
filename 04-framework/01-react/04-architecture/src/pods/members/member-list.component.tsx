import { Link } from "react-router";
import { routes } from "../../core/router/routes";
import type { Member } from "./model";
interface Props { members: Member[]; filter: string; onFilterChange: (value: string) => void }
export function MemberListComponent({ members, filter, onFilterChange }: Props) {
  return <>
    <h1>Equipo</h1>
    <label htmlFor="filter">Buscar por nombre</label>{" "}
    <input id="filter" value={filter} onChange={event => onFilterChange(event.target.value)} />
    {members.length === 0 ? <p>Sin resultados.</p> :
      <ul className="grid gap-3 sm:grid-cols-2">
        {members.map(member => <li key={member.id} className="rounded bg-white p-4 shadow-sm">
          <Link to={routes.member(member.id)}>{member.name}</Link><p>{member.role}</p>
        </li>)}
      </ul>}
  </>;
}

