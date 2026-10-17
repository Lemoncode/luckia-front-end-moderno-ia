import styles from "./member-detail.module.css";
import { Link } from "@tanstack/react-router";
import { useMember } from "../hooks";
import { Loading, ErrorMessage } from "../components/request-status";
export function MemberDetail({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  return <>
    <h1>Detalle del equipo</h1>
    <Link to="/members">Volver al listado</Link>
    {loading ? <Loading /> : error ? <ErrorMessage message={error} /> :
      !member ? <p>Persona no encontrada.</p> :
      <article className={styles.detail}>
        <h2>{member.name}</h2><p>{member.role}</p><p>{member.email}</p>
      </article>}
  </>;
}
