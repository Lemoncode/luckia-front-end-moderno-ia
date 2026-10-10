import type { Member } from "./model";
export async function getMembers(signal: AbortSignal): Promise<Member[]> {
  const response = await fetch("/members.json", { signal });
  if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
  return response.json();
}
export async function getMember(id: string, signal: AbortSignal): Promise<Member | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  const members = await getMembers(signal);
  return members.find(member => member.id === Number(id)) ?? null;
}
