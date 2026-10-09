import { useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from "react-router";
import { useMember, useMembers } from "./hooks";
function MemberList() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  return <>
    <h1>Equipo</h1>
    <label htmlFor="filter">Buscar por nombre</label>{" "}
    <input id="filter" value={filter} onChange={event => setFilter(event.target.value)} />
    {loading ? <p role="status">Cargando…</p> : error ? <p role="alert">{error}</p> :
      visible.length === 0 ? <p>Sin resultados.</p> :
      <ul className="grid gap-3 sm:grid-cols-2">
        {visible.map(member => <li key={member.id} className="rounded bg-white p-4 shadow-sm">
          <Link to={`/members/${member.id}`}>{member.name}</Link>
          <p>{member.role}</p>
        </li>)}
      </ul>}
  </>;
}
function MemberDetail() {
  const { id = "" } = useParams();
  const { member, loading, error } = useMember(id);
  return <>
    <h1>Detalle del equipo</h1>
    <Link to="/members">Volver al listado</Link>
    {loading ? <p role="status">Cargando…</p> : error ? <p role="alert">{error}</p> :
      !member ? <p>Persona no encontrada.</p> :
      <article className="space-y-2 rounded bg-white p-5">
        <h2>{member.name}</h2><p>{member.role}</p><p>{member.email}</p>
        <Link to={`/members/${member.id === 3 ? 1 : member.id + 1}`}>Siguiente persona</Link>
      </article>}
  </>;
}
export function App() {
  return <BrowserRouter><main>
    <nav aria-label="Principal"><Link to="/members">Directorio</Link></nav>
    <p>Datos ficticios para la clase.</p>
    <Routes>
      <Route path="/" element={<Navigate to="/members" replace />} />
      <Route path="/members" element={<MemberList />} />
      <Route path="/members/:id" element={<MemberDetail />} />
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  </main></BrowserRouter>;
}

