import React from "react";
import { ENV } from "./env.constants";

export const HelloComponent = () => {
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1_000);

    return () => clearInterval(timer);
  }, []);

  const applyOperation = async () => {
    const { operate } = await import("./math");
    setCounter((prevCounter) => operate(prevCounter));
  };

  return (
    <>
      <h2>Hello from React</h2>
      <p>Api server is {ENV.API_BASE}</p>
      <p>Feature A is {ENV.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
      <p>Counter state: {counter}</p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={applyOperation}
      >
        Apply operation
      </button>
      <a
        href="#"
        className="m-2 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Card title</h5>
        <p className="font-normal text-gray-700">
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </p>
      </a>
    </>
  );
};
