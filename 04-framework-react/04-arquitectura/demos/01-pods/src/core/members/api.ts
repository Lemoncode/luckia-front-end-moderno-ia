import type { Member, MemberInput } from "./model";
import { memberSchema } from "./member.schema";
// Cada demo usa una clave distinta para no mezclar las prácticas.
const storageKey = "luckia-architecture-members";
function readChanges(): Member[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  return JSON.parse(raw) as Member[];
}
export async function getMembers(signal: AbortSignal): Promise<Member[]> {
  const response = await fetch("/members.json", { signal });
  if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
  const initial: Member[] = await response.json();
  const byId = new Map(initial.map(member => [member.id, member]));
  for (const member of readChanges()) byId.set(member.id, member);
  return [...byId.values()];
}
export async function getMember(id: string, signal: AbortSignal): Promise<Member | null> {
  if (!/^[1-9]\d*$/.test(id)) return null;
  return (await getMembers(signal)).find(member => member.id === Number(id)) ?? null;
}
export async function saveMember(input: MemberInput, id?: number): Promise<Member> {
  const values = memberSchema.parse(input);
  const all = await getMembers(new AbortController().signal);
  if (id !== undefined && !all.some(member => member.id === id)) throw new Error("Persona no encontrada.");
  const member = { ...values, id: id ?? Math.max(0, ...all.map(item => item.id)) + 1 };
  const changes = readChanges().filter(item => item.id !== member.id);
  // Si setItem falla, la promesa rechaza y el formulario conserva los datos.
  localStorage.setItem(storageKey, JSON.stringify([...changes, member]));
  return member;
}
