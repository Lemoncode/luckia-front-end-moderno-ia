# Environment variables

In this example, we are going to support the use of environment variables for our application using `vite`.

📌 We start from sample `07-react`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `07-react`. Just copy the project and install:

  ```bash
  npm install
  ```

- First, let's remove the counter from `07-react`, we don't need it anymore:

  _src/hello.tsx_

  ```diff
  - import React from "react";
  -
    export const HelloComponent = () => {
  -   const [counter, setCounter] = React.useState(0);
  -
  -   React.useEffect(() => {
  -     const timer = setInterval(() => {
  -       setCounter((prev) => prev + 1);
  -     }, 1_000);
  -
  -     return () => clearInterval(timer);
  -   }, []);
  -
      return (
        <>
          <h2>Hello from React</h2>
  -       <p>Counter state: {counter}</p>
        </>
      );
    };
  ```

- Let's create our `.env` file in the root folder. We'll create a variable **without** prefix on purpose:

  _.env_

  ```ini
  API_BASE=http://localhost:8080
  ```

- Let's modify our `HelloComponent` to display the environment value. In `vite`, environment variables are read from `import.meta.env`:

  _src/hello.tsx_

  ```diff
      return (
        <>
          <h2>Hello from React</h2>
  +       <p>Api server is {import.meta.env.API_BASE}</p>
        </>
      );
  ```

- Now start the project with:

  ```bash
  npm start
  ```

  💥 We get a compilation error in the terminal and in the browser: `TS2339: Property 'env' does not exist on type 'ImportMeta'`. `import.meta` belongs to the language, but `env` is added by `vite`, and TypeScript doesn't know about it. We have to add `vite` definition types to our project.

- Let's create the typings file `src/vite-env.d.ts`:

  _src/vite-env.d.ts_

  ```ts
  /// <reference types="vite/client" />
  ```

  ⚠️ It must be `types`, not `path`. And the file must be inside `src`: our `tsconfig.json` has `"include": ["src"]`, so a file in the root folder is ignored.

  🔎 Save the file and check the error is gone!

- 🔎 Navigate to [http://localhost:5173](http://localhost:5173): the value is empty. `vite` only exposes to our code the variables starting with `VITE_` prefix. This constraint prevents from accidentally leaking system environment variables (e.g., `USER`, `PATH`, `HOME` on some unix systems). Let's rename it in both places:

  _.env_

  ```diff
  - API_BASE=http://localhost:8080
  + VITE_API_BASE=http://localhost:8080
  ```

  _src/hello.tsx_

  ```diff
  -       <p>Api server is {import.meta.env.API_BASE}</p>
  +       <p>Api server is {import.meta.env.VITE_API_BASE}</p>
  ```

  🔎 Check the terminal: `.env changed, restarting server`. `vite` watches that file. Now the value is displayed.

  🔎 Also check intellisense through `import.meta.env` to discover a few out-of-the-box variables ready to be consumed (`MODE`, `DEV`, `PROD`...).

- Let's add another variable to our `.env` file, to enable or disable a feature:

  _.env_

  ```diff
    VITE_API_BASE=http://localhost:8080
  + VITE_ENABLE_FEATURE_A=true
  ```

- Let's log `import.meta.env` inside the component, before the `return`:

  _src/hello.tsx_

  ```diff
    export const HelloComponent = () => {
  +   console.log(import.meta.env);
  +
      return (
  ```

  ⚡ Check the browser console: the value is `"true"`, a **string**. All variables are strings, and be careful: the string `"false"` is truthy.

- Let's create an `src/env.constants.ts` file to read the variables in a single place and parse them to their real type:

  _src/env.constants.ts_

  ```ts
  export const ENV = {
    API_BASE: import.meta.env.VITE_API_BASE,
    IS_FEATURE_A_ENABLED: import.meta.env.VITE_ENABLE_FEATURE_A === "true",
  } as const;
  ```

  > Note: ⚠ We've typed `ENV` as `const` to be a constant object with read-only keys to avoid accidental rewrite.

- Let's remove the `console.log` and update our `HelloComponent` to use our new `ENV` object:

  _src/hello.tsx_

  ```diff
  + import { ENV } from "./env.constants";
  +
    export const HelloComponent = () => {
  -   console.log(import.meta.env);
  -
      return (
        <>
          <h2>Hello from React</h2>
  -       <p>Api server is {import.meta.env.VITE_API_BASE}</p>
  +       <p>Api server is {ENV.API_BASE}</p>
  +       <p>Feature A is {ENV.IS_FEATURE_A_ENABLED ? "enabled" : "disabled"}</p>
        </>
      );
    };
  ```

- 💥 If we misspell a property of `ENV` in the component (e.g. `ENV.API_BA`), TypeScript reports an error. But what if we misspell the variable in `env.constants.ts`?

  _src/env.constants.ts_

  ```diff
  -   API_BASE: import.meta.env.VITE_API_BASE,
  +   API_BASE: import.meta.env.VITE_API_BAS,
  ```

  🔎 No error at all: for TypeScript, any name in `import.meta.env` is valid (typed as `any`). Let's tell TypeScript which variables we have:

  _src/vite-env.d.ts_

  ```diff
    /// <reference types="vite/client" />
  +
  + // Only allow the variables declared in ImportMetaEnv (typos become errors).
  + interface ViteTypeOptions {
  +   strictImportMetaEnv: unknown;
  + }
  +
  + // We'll add here our environment variables. Remember all have string values.
  + interface ImportMetaEnv {
  +   readonly VITE_API_BASE: string;
  +   readonly VITE_ENABLE_FEATURE_A: string;
  + }
  ```

  > ℹ️ This extension to already existing types is usually called "augmentation".

  ⚠️ `ImportMetaEnv` gives us intellisense, but without `strictImportMetaEnv`, `vite` still accepts any other name. With it, only the variables declared in `ImportMetaEnv` are allowed, so now `VITE_API_BAS` is an error. Fix the typo back to `VITE_API_BASE`.

  ⚡ When you add a new variable, add it to `.env` and to `ImportMetaEnv`.

- Environment variables usually have different values in each environment: the backend address in our machine is not the same as in production. Vite loads different files depending on the **mode**:

  | File               | When is it loaded?                                    |
  | ------------------ | ----------------------------------------------------- |
  | `.env`             | Always                                                |
  | `.env.local`       | Always, ignored by git (values only for your machine) |
  | `.env.development` | `npm start` (`vite`, `development` mode)              |
  | `.env.production`  | `npm run build` (`vite build`, `production` mode)     |

  The more specific file wins: values in `.env.production` override the ones in `.env`.

- Let's create a `.env.production` file:

  _.env.production_

  ```ini
  VITE_API_BASE=https://backend.com
  VITE_ENABLE_FEATURE_A=false
  ```

- Run the dev server: we still see `http://localhost:8080`, because `.env.production` is not loaded in development:

  ```bash
  npm start
  ```

- Now build the project and preview it:

  ```bash
  npm run build
  npm run preview
  ```

  🔎 Navigate to [http://localhost:4173](http://localhost:4173): now we see `https://backend.com` and feature A disabled.

  🔎 Open the generated JavaScript in `dist/assets` and search for `backend.com`: the value is written directly in the code. Vite replaces every `import.meta.env` with its value at build time, so **changing a value requires a new build**, and **never put secrets in `VITE_` variables**: they end up in the JavaScript that anyone can download.
