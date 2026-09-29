import { ENV } from "./env.constants";

export const HelloComponent = () => {
  return (
    <>
      <h2>Hello from React</h2>
      <p>Api server is {ENV.API_BASE}</p>
      <p>Feature A is {ENV.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
    </>
  );
};
