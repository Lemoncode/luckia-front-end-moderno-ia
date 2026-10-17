import styles from "./request-status.module.css";
export function Loading() { return <p className={styles.loading} role="status">Cargando…</p>; }
export function ErrorMessage({ message }: { message: string }) { return <p className={styles.error} role="alert">{message}</p>; }
