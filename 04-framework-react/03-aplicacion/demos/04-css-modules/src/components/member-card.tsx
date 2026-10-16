import styles from "../app.module.css";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
export function MemberCard({ member }: { member: Member }) {
  return <li className={styles.card}>
    <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>{member.name}</Link>
    <p>{member.role}</p>
  </li>;
}
