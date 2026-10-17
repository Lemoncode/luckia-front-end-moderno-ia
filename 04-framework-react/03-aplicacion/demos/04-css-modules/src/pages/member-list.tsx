import styles from "./member-list.module.css";
import { useState } from "react";

import { useMembers } from "../hooks";
import { MemberCard } from "../components/member-card";
import { Loading, ErrorMessage } from "../components/request-status";
export function MemberList() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  const visible = members.filter(member => member.name.toLowerCase().includes(filter.toLowerCase()));
  return <>
    <h1>Equipo</h1>
    <div className={styles.filter}><label htmlFor="filter">Buscar por nombre</label>{" "}
    <input id="filter" value={filter} onChange={event => setFilter(event.target.value)} /></div>
    {loading ? <Loading /> : error ? <ErrorMessage message={error} /> :
      visible.length === 0 ? <p>Sin resultados.</p> :
      <ul className={styles.list}>
        {visible.map(member => <MemberCard key={member.id} member={member} />)}
      </ul>}
  </>;
}
