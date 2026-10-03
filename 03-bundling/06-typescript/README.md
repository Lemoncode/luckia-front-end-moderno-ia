# Typescript

It's time to test how `vite` behaves when using Typescript. This is an interesting and realistic exercise as most of the front-end projects nowadays are written in Typescript.

📌 We start from sample `05-images`.

# Steps to build it

## Prerequisites

Install [Node.js and npm](https://nodejs.org/en/) (20.19.0 || >=22.12.0) if they are not already installed on your computer.

> ⚠ Verify that you are running at least latest Node LTS version and npm. You can check your current version by running `node -v` and `npm -v` in a terminal/console window. Older versions may produce errors.

## Steps

- We start from `05-images`. Just copy the project and install:

  ```bash
  npm install
  ```

- Now let's install `typescript` locally as a **_dev_** dependency:

  ```bash
  npm install typescript --save-dev
  ```

- We have to setup `typescript`, so let's add a `tsconfig.json` file and populate it with a basic starting configuration:

  _tsconfig.json_

  ```json
  {
    "compilerOptions": {
      "esModuleInterop": true,
      "isolatedModules": true,
      "lib": ["ESNext", "DOM"],
      "module": "ESNext",
      "moduleResolution": "bundler",
      "noEmit": true,
      "noImplicitAny": false,
      "noImplicitReturns": true,
      "resolveJsonModule": true,
      "skipLibCheck": true,
      "sourceMap": true,
      "target": "ESNext",
      "useDefineForClassFields": true
    },
    "include": ["src"]
  }
  ```

  ⚡ Our compilation target and module format is gonna be `ESNext`, remember `vite` uses native modules (ESM) for development.

  ⚡ In the development flow, `vite` only perform transpilation on TS files. It relies on `oxc` (a Rust transformer, much faster than `tsc`) for such a task and once transpiled, it expose them as ES modules. **It does not perform type checking**, it is up to you to take care of that in the build process or rely on you IDE.

  ⚡ `oxc` transformer requires a couple of specific [compiler options](https://vitejs.dev/guide/features.html#typescript-compiler-options) to be turned on:
  - **isolatedModules**: `oxc` performs transpilation in isolated mode, this is, on a single file at a time. Therefore, it cannot transform code that depend on understanding the full type system. This flag turned on ensures we are warned against certain code that can't be correctly interpreted by a single-file transpilation process.
  - **useDefineForClassFields**: ensures EMCA compliant class fields.

  The rest is just a starting boilerplate configuration you can tweak based on your needs.

  ⚠️ Since TypeScript 6, `strict` is enabled by default even if it's not in `tsconfig.json`. That's why TypeScript will complain about values that may be `null` (e.g. `document.getElementById(...)`).

- ⚠️ It's time to do a bit of cleanup. Let's simplify our `index.html` file just to focus on TS:

  _index.html_

  ```diff
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>

  -   <body class="m-3">
  -     <h1>Check the console log</h1>
  -     <div id="imgContainer"></div>
  -     <img src="/src/content/logo_2.png" alt="logo lemoncode" />
  -     <div class="card" style="width: 18rem">
  -       <div class="card-body">
  -         <h5 class="card-title">Card title</h5>
  -         <p class="card-text">
  -           Some quick example text to build on the card title and make up the bulk of the card's content.
  -         </p>
  -         <a href="#" class="btn btn-primary">Go somewhere</a>
  -       </div>
  -     </div>
  -     <div class="red-background">RedBackground stuff</div>
  -     <script type="module" src="/src/index.js"></script>
  +   <body>
  +     <script type="module" src="/src/index.ts"></script>
      </body>
    </html>
  ```

- **Don't forget to rename** our `index.js` file extension to `index.ts`:

  ```bash
  RENAME src/index.js -> src/index.ts
  ```

- And now let's add some TS implementation in our `index.ts`, a simple test code like this one:

  _src/index.ts_

  ```diff
  - import "bootstrap/dist/css/bootstrap.css";
  - import "./mystyles.scss";
  - import logoImg from "./content/logo_1.png";
  -
  - console.log(logoImg);
  -
  - const user = "John Doe";
  -
  - console.log(`Hello ${user}!`);
  - console.log("This app is using Vite");
  -
  - const img = document.createElement("img");
  - img.src = logoImg;
  -
  - document.getElementById("imgContainer").appendChild(img);
  -
  + const numberA: number = 2;
  + const numberB: number = 3;
  +
  + console.log(numberA + numberB);
  ```

  🔎 Notice we didn't need to add module syntax like `export {}` because TS already understands it's a module since our `package.json` has `"type": "module"` (we added it in `01-basic`).

- ⚠️ Finally, now that we removed the usage of `SASS`, `bootstrap` and `images` let's delete related files to keep project tidy:

  ```bash
  DELETE src/content/
  DELETE src/mystyles.scss
  ```

  and also uninstall dependencies:

  ```bash
  npm uninstall bootstrap sass-embedded
  ```

- Time to start the project!

  ```bash
  npm start
  ```

  👍🏼 `vite` offers built-in support for TypeScript!

  🔎 You can check the new `index.ts` request in the `network` tab and preview the transpiled content

- 💥 What if we introduce a type error? Like this one:

  _src/index.ts_

  ```diff
  - const numberB: number = 3;
  + const numberB: string = 3;
  ```

  🔎 Check the server logs, `vite` won't complain! Only `VSCode` warns us.

  ⚡ As we already know, `vite` transpiles TS code via `oxc` by just removing all type annotations, the same way as `babel` does, so we won't have type checking while transpiling. We won't see TS errors in our dev-server terminal.

  In order get compilation errors we may run `tsc` by ourselves. It would require to install some development tools like `npm-run-all` and extra scripts setup in `package.json`.

  👍🏼 Why don't we take advantage of the [plugin ecosystem](https://github.com/vitejs/awesome-vite#plugins) for `vite`? We'll use a plugin called `vite-plugin-checker`.

- Let's first **stop the server** and install the plugin then:

  ```bash
  npm install vite-plugin-checker --save-dev
  ```

- Now, let's create a `vite` config file at the root folder for the first time. It must be called `vite.config.ts`:

  _vite.config.ts_

  ```ts
  import { defineConfig } from "vite";
  import checker from "vite-plugin-checker";

  export default defineConfig({
    plugins: [checker({ typescript: true })],
  });
  ```

  👍🏼 This plugin **runs background checks** like TS type checking or ESLint parsing in a **concurrent** worker thread, thus, not slowing down `vite` state-of-the-art performance and speeding up the whole process.

- Let's start the app with:

  ```bash
  npm start
  ```

  🔎 Now you can check how we obtain compilation errors in console:

  ```text
  ERROR(TypeScript)  TS2322: Type 'number' is not assignable to type 'string'.
  FILE  /project/src/index.ts:2:7

      1 | const numberA: number = 2;
    > 2 | const numberB: string = 3;
        |       ^^^^^^^
      3 |
      4 | console.log(numberA + numberB);

  [TypeScript] Found 1 error(s)
  ```

  🔎 If we take a look at the browser at [http://localhost:5173](http://localhost:5173) you'll notice the overlay with the compilation error too.

- Production flow relies on `rolldown` where TS is also supported out-of-the-box and type check is performed to proceed with a green build. Leave the error in the code and try to build for production:

  ```bash
  npm run build
  ```

  🔎 Check how we also get error feedback in the console.

- We can see thank to `vite-plugin-checker` it is preventing us from generating the production bundle, with errors.

  ```text
  vite v8.3.1 building client environment for production...
  transforming...
  src/index.ts(2,7): error TS2322: Type 'number' is not assignable to type 'string'.
  ```

- So, we can only fix the issue to continue:

  _src/index.ts_

  ```diff
    const numberA: number = 2;
  - const numberB: string = 3;
  + const numberB: number = 3;
  ```

  🔎 Run now a production build and check how it goes smoothly.

- Let's open the generated JavaScript in `dist/assets`. At the beginning there is some code we didn't write: it's the **modulepreload polyfill**. When our app is split in several chunks, `vite` adds `<link rel="modulepreload">` tags to `index.html` so the browser downloads them in parallel. Old browsers (e.g. Safari < 17) don't support it, so `vite` injects a small polyfill that does the same by hand.

  If our users have modern browsers we can remove it. This is optional: it only saves around 1 KB, and if you need to support old browsers you should keep it.

  _vite.config.ts_

  ```diff
    export default defineConfig({
      plugins: [checker({ typescript: true })],
  +   build: {
  +     modulePreload: { polyfill: false },
  +   },
    });
  ```

  🔎 Run `npm run build` again and check the generated JavaScript only contains our code.
