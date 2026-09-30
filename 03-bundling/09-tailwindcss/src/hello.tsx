import { ENV } from "./env.constants";

export const HelloComponent = () => {
  return (
    <>
      <h2>Hello from React</h2>
      <p>Api server is {ENV.API_BASE}</p>
      <p>Feature A is {ENV.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
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
