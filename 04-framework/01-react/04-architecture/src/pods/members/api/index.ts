import type { Member } from "../model";
export async function getMembers(signal: AbortSignal): Promise<Member[]> {
  const response = await fetch("/members.json", { signal });
  if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
  return response.json();
}
export async function getMember(id: string, signal: AbortSignal): Promise<Member | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const response = await fetch(`/members/${id}.json`, { signal });
  // Vite puede devolver index.html como fallback para un fichero inexistente.
  if (response.status === 404 || response.headers.get("content-type")?.includes("text/html")) return null;
  if (!response.ok) throw new Error("No se ha podido cargar la persona.");
  return response.json();
}

