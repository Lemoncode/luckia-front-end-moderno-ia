import { useState } from "react";

export function App() {
  const [count, setCount] = useState(0);

  const increaseThree = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <main>
      <h1>Hooks en práctica</h1>
      <p>Contador: {count}</p>
      <button onClick={increaseThree}>Sumar tres</button>
    </main>
  );
}
