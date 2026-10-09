import { useEffect, useRef, useState } from "react";
import { useMembers } from "./use-members";
function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    console.log("Conectamos el temporizador");
    const timer = window.setInterval(() => setSeconds(previous => previous + 1), 1000);
    return () => {
      console.log("Limpiamos el temporizador");
      window.clearInterval(timer);
    };
  }, []);
  return <p aria-live="off">Segundos montado: {seconds}</p>;
}
function MemberSearch() {
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { members, loading, error } = useMembers(filter);
  return <section className="space-y-3">
    <h2>Buscar personas</h2>
    <label htmlFor="filter">Nombre</label>{" "}
    <input id="filter" ref={inputRef} value={filter} onChange={event => setFilter(event.target.value)} />{" "}
    <button onClick={() => inputRef.current?.focus()}>Enfocar búsqueda</button>
    {loading ? <p role="status">Cargando…</p> : error ? <p role="alert">{error}</p> :
      members.length === 0 ? <p>Sin resultados.</p> :
      <ul>{members.map(member => <li key={member.id}>{member.name}</li>)}</ul>}
  </section>;
}
export function App() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const increaseThree = () => {
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
    setCount(previous => previous + 1);
  };
  return <main>
    <h1>Hooks en práctica</h1>
    <p>Contador: {count}</p>
    <button onClick={increaseThree}>Sumar tres</button>{" "}
    <button onClick={() => setVisible(previous => !previous)}>
      {visible ? "Desmontar" : "Montar"} temporizador
    </button>
    {visible && <Timer />}
    <MemberSearch />
  </main>;
}

