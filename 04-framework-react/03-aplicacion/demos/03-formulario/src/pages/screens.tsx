import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMember, useMembers } from "../hooks";
import { MemberGrid } from "../components/member-grid";
import { ViewProvider } from "../view-provider";
import { ViewToggle } from "../components/view-toggle";
import { Loading, ErrorMessage } from "../components/request-status";
export function MemberList() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  return <ViewProvider>
    <h1>Equipo</h1>
    <ViewToggle />
    <label htmlFor="filter">Buscar por nombre</label>{" "}
    <input id="filter" value={filter} onChange={event => setFilter(event.target.value)} />
    {loading ? <Loading /> : error ? <ErrorMessage message={error} /> :
      visible.length === 0 ? <p>Sin resultados.</p> :
      <MemberGrid members={visible} />}
  </ViewProvider>;
}
export function MemberDetail({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  return <>
    <h1>Detalle del equipo</h1>
    <Link to="/members">Volver al listado</Link>
    {loading ? <Loading /> : error ? <ErrorMessage message={error} /> :
      !member ? <p>Persona no encontrada.</p> :
      <article className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        <h2>{member.name}</h2><p>{member.role}</p><p>{member.email}</p>
      </article>}
  </>;
}
