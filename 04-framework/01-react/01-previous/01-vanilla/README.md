# Lista con JavaScript

Primera demostración de [01 · Por qué React](../README.md). Mostramos cómo coordinamos la lista, el contador y el campo de nombre con DOM y eventos.

Con las dependencias preparadas mediante `npm ci` desde `01-react`, arrancamos desde esta carpeta:

```bash
npm start
```

Abrimos `src/main.ts`. Comentamos la llamada a `render()` dentro del evento: el array cambia, pero la pantalla no. Esa diferencia da pie a explicar qué trabajo estamos haciendo a mano. Después recuperamos la llamada y pasamos a la versión con React.

```bash
npm run build
```
