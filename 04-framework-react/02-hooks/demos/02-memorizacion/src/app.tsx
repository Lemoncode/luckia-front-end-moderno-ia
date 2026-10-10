import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
const people = Array.from({ length: 2000 }, (_, index) => ({ id: index + 1, name: `Persona ${index + 1}` }));
type Person = (typeof people)[number];
const Results = memo(function Results({ title, people, onSelect }: {
  title: string; people: Person[]; onSelect: (person: Person) => void;
}) {
  console.count(`Render de ${title}`);
  return <section className="space-y-2"><h2>{title}</h2>
    <ul>{people.slice(0, 8).map(person => <li key={person.id}>
      <button onClick={() => onSelect(person)}>{person.name}</button>
    </li>)}</ul>
  </section>;
});
function RefDemo() {
  const [name, setName] = useState("Julia");
  const [message, setMessage] = useState("");
  const [snapshot, setSnapshot] = useState(0);
  const clicks = useRef(0);
  const latestName = useRef(name);
  const timer = useRef<number | null>(null);
  useEffect(() => { latestName.current = name; }, [name]);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  const schedule = () => {
    if (timer.current !== null) clearTimeout(timer.current);
    setMessage("Esperando dos segundos…");
    timer.current = window.setTimeout(() => {
      setMessage(`Closure: ${name}. Ref actualizada tras el commit: ${latestName.current}.`);
    }, 2000);
  };
  return <section className="space-y-3">
    <h2>Refs para datos que no pintan</h2>
    <button onClick={() => { clicks.current += 1; }}>Incrementar ref</button>{" "}
    <button onClick={() => setSnapshot(clicks.current)}>Mostrar copia en estado</button>
    <p>Copia visible: {snapshot}</p>
    <label htmlFor="latest-name">Nombre para el aviso</label>{" "}
    <input id="latest-name" value={name} onChange={event => setName(event.target.value)} />{" "}
    <button onClick={schedule}>Programar aviso</button>
    <p role="status">{message}</p>
  </section>;
}
export function App() {
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState("");
  const visible = useMemo(() => {
    console.count("Calculamos el filtro");
    return people.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);
  const selectPerson = useCallback((person: Person) => setSelected(person.name), []);
  return <main>
    <h1>Identidad, memorización y refs</h1>
    <p>Abrimos la consola para comparar. El Compiler no está activado.</p>
    <label htmlFor="filter">Filtro local</label>{" "}
    <input id="filter" value={filter} onChange={event => setFilter(event.target.value)} />{" "}
    <button onClick={() => setCount(value => value + 1)}>Cambio ajeno al listado: {count}</button>
    <p>Seleccionada: {selected || "ninguna"}. Coincidencias: {visible.length}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <Results title="Callback estable" people={visible} onSelect={selectPerson} />
      <Results title="Callback nuevo" people={visible} onSelect={person => setSelected(person.name)} />
    </div>
    <RefDemo />
  </main>;
}
