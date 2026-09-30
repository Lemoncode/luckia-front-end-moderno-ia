# Vite — 03-bundling

Based on `master-frontend-lemoncode/03-bundling/06-vite`. Each step starts from the previous one, and each folder has a `README.md` with the step-by-step guide.

| Step | Content |
| --- | --- |
| `00-teoria` | Why we need a bundler, webpack vs Vite, dev vs prod (`bundling-conceptos.pptx`) |
| `01-basic` | `vite`, `vite build`, `vite preview`; 304, `?t=`, hashing |
| `02-custom-css` | CSS imported from JS is a JS module in dev; first HMR |
| `03-sass` | Sass with no config: just install `sass-embedded` |
| `04-bootstrap` | First third-party library; cascade order |
| `05-images` | Importing an image imports its URL; hashing in prod |
| `06-typescript` | Vite transpiles but doesn't type-check; `vite-plugin-checker` |
| `07-react` | Dependency pre-bundling, one-year cache, HMR keeping state |
| `08-env-vars` | `.env`, `VITE_` prefix, typings; **baked in at build time** |
| `09-tailwindcss` | Official plugin, only used classes |
| `10-code-splitting` | Dynamic `import()`: an on-demand chunk |
| `11-bundle-analyzer` | What the bundle is made of; shared dependency |

All steps use the latest versions (Vite 8.3 with Rolldown + OXC, TypeScript 7.0, React 19.3, Tailwind 4.3) and build without errors.

```bash
npm install
npm start
```
