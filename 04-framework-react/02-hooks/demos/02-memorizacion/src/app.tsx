import { useState } from "react";

const people = Array.from({ length: 2000 }, (_, index) => ({
  id: index + 1,
  name: `Persona ${index + 1}`,
}));

type Person = (typeof people)[number];

interface ResultsProps {
  people: Person[];
  onSelect: (person: Person) => void;
}

function Results({ people, onSelect }: ResultsProps) {
  console.count("Render de Results");

  return (
    <section className="space-y-2">
      <h2>Resultados</h2>
      <ul>
        {people.slice(0, 8).map((person) => (
          <li key={person.id}>
            <button onClick={() => onSelect(person)}>{person.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function App() {
  const [filter, setFilter] = useState("");
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState("");

  console.count("Calculamos el filtro");
  const visible = people.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );

  function selectPerson(person: Person) {
    setSelected(person.name);
  }

  return (
    <main>
      <h1>Memorización paso a paso</h1>
      <label htmlFor="filter">Filtro local</label>{" "}
      <input
        id="filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />{" "}
      <button onClick={() => setCount((previous) => previous + 1)}>
        Cambio ajeno al listado: {count}
      </button>
      <p>Seleccionada: {selected || "ninguna"}. Coincidencias: {visible.length}</p>
      <Results people={visible} onSelect={selectPerson} />
    </main>
  );
}
