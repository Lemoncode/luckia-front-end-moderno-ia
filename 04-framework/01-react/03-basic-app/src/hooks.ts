import { useEffect, useState } from "react";
import { getMember, getMembers } from "./api";
import type { Member } from "./model";
export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    getMembers(controller.signal)
      .then(data => { if (!controller.signal.aborted) setMembers(data); })
      .catch(() => { if (!controller.signal.aborted) setError("No se ha podido cargar el equipo."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return { members, loading, error };
}
export function useMember(id: string) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setMember(null);
    getMember(id, controller.signal)
      .then(data => { if (!controller.signal.aborted) setMember(data); })
      .catch(() => { if (!controller.signal.aborted) setError("No se ha podido cargar la persona."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);
  return { member, loading, error };
}

