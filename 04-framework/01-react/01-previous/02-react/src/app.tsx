import { useState } from "react";
interface Member { id: string; name: string }
function MemberItem({ member }: { member: Member }) {
  return <li className="rounded bg-white p-3">{member.name}</li>;
}
export function App() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Julia" }, { id: "2", name: "Evan" },
  ]);
  const [name, setName] = useState("");
  const addMember = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const member = { id: crypto.randomUUID(), name: trimmed };
    setMembers(previous => [...previous, member]);
    setName("");
  };
  return <main>
    <h1>Equipo · React</h1>
    <p>Datos ficticios para la clase.</p>
    <label htmlFor="name">Nombre</label>{" "}
    <input id="name" value={name} onChange={event => setName(event.target.value)} />{" "}
    <button onClick={addMember}>Añadir</button>
    <p aria-live="polite">Personas: {members.length}</p>
    <ul className="space-y-2">
      {members.map(member => <MemberItem key={member.id} member={member} />)}
    </ul>
  </main>;
}

