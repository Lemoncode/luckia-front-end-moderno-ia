import React from "react";

export const HelloComponent = () => {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1_000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <h2>Hello from React</h2>
      <p>Counter state: {counter}</p>
    </>
  );
};
