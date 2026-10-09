import { useEffect, useState } from "react";
interface Member { id: number; name: string }
export function useMembers(filter: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    // Simulación didáctica: el JSON es local y el filtro se aplica en cliente.
    // Repetimos la petición para practicar una búsqueda dependiente de un campo.
    fetch("/members.json", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
        return response.json() as Promise<Member[]>;
      })
      .then(data => {
        if (!controller.signal.aborted) {
          setMembers(data.filter(member => member.name.toLowerCase().includes(filter.toLowerCase())));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("No se ha podido cargar el equipo.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [filter]);
  return { members, loading, error };
}

