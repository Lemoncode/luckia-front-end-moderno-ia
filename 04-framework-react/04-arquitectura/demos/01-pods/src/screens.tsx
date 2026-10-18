import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMember, useMembers } from "./hooks";
import { saveMember } from "./api";
import { MemberCard } from "./components/member-card";
import { Loading, ErrorMessage } from "./components/request-status";
import { MemberForm } from "./member-form";

export function MemberList() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <section className="space-y-5" aria-label="Personas del equipo">
      <header className="space-y-2">
        <h1>Tu equipo, a mano</h1>
        <p className="text-slate-500">Consulta las personas del equipo y mantén sus datos al día.</p>
      </header>
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5">
        <label htmlFor="filter">Buscar por nombre</label>
        <input id="filter" placeholder="Por ejemplo, Julia" value={filter} onChange={event => setFilter(event.target.value)} />
        <p className="text-sm text-slate-500" aria-live="polite">Personas encontradas: {visible.length}</p>
      </div>
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No hay personas con ese nombre. Prueba con otro filtro.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {visible.map(member => <MemberCard key={member.id} member={member} />)}
        </ul>
      )}
    </section>
  );
}

export function MemberDetail({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return (
    <>
      <header className="space-y-2">
        <h1>Ficha de la persona</h1>
        <Link to="/members">Volver al directorio</Link>
      </header>
      <article className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <header className="flex items-center gap-4">
        <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-700">{member.name.charAt(0)}</div>
        <div><h2>{member.name}</h2><p className="text-slate-500">{member.role}</p></div>
      </header>
      <dl className="grid gap-5 border-y border-slate-100 py-5 sm:grid-cols-2">
        <div><dt className="text-sm text-slate-500">Correo electrónico</dt><dd className="mt-1 break-all font-medium">{member.email}</dd></div>
        <div><dt className="text-sm text-slate-500">Identificador</dt><dd className="mt-1 font-medium">#{member.id}</dd></div>
      </dl>
    </article>
    </>
  );
}

export function NewMember() {
  const navigate = useNavigate();
  return <>
    <header className="space-y-2">
      <h1>Añadir persona</h1>
      <p className="text-slate-500">Completa los datos para incorporar una persona al directorio.</p>
      <Link to="/members">Cancelar y volver al directorio</Link>
    </header>
    <MemberForm onSave={async values => {
      const member = await saveMember(values);
      await navigate({ to: "/members/$memberId", params: { memberId: String(member.id) } });
    }} />
  </>;
}
