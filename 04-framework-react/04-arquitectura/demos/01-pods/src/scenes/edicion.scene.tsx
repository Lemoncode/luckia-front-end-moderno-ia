import { Link, useNavigate } from "@tanstack/react-router";
import { AltaContainer, EdicionContainer } from "../pods/edicion";
import type { Member } from "../core/members/model";
export function EdicionScene({ id }: { id?: string }) {
  const navigate = useNavigate();
  const onSaved = async (member: Member) => {
    await navigate({ to: "/members/$memberId", params: { memberId: String(member.id) } });
  };
  return <>
    <h1>{id ? "Editar persona" : "Añadir persona"}</h1>
    <Link to="/members">Cancelar</Link>
    {id ? <EdicionContainer key={id} id={id} onSaved={onSaved} /> : <AltaContainer onSaved={onSaved} />}
  </>;
}
