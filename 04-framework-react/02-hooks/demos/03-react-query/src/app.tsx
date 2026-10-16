import { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
}

export function App() {
  const [filter, setFilter] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch("/members.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
        return response.json() as Promise<Member[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setMembers(data.filter((member) =>
            member.name.toLowerCase().includes(filter.toLowerCase()),
          ));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("No se ha podido cargar el equipo.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filter]);

  return (
    <main>
      <h1>Buscar personas</h1>
      <label htmlFor="filter">Nombre</label>{" "}
      <input
        id="filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      {loading ? (
        <p role="status">Cargando…</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : members.length === 0 ? (
        <p>Sin resultados.</p>
      ) : (
        <ul>
          {members.map((member) => <li key={member.id}>{member.name}</li>)}
        </ul>
      )}
    </main>
  );
}
