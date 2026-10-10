# React · De JavaScript a una aplicación organizada

En este módulo vamos a construir una aplicación con React a lo largo de **cuatro sesiones de dos horas**. Partimos de lo aprendido en HTML, CSS, JavaScript/TypeScript, Vite y Tailwind.

Empezamos con una lista hecha con JavaScript para observar qué ocurre cuando tenemos que mantener los datos y el DOM sincronizados. A partir de ahí introducimos componentes, props y estado, y hacemos crecer el ejemplo hasta poder consultar, añadir y editar personas.

## Sesiones

| Sesión | Tema                                                                         | Qué vamos a ver                                                                                                                                 |
| ------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | [De JavaScript a React](./01-de-javascript-a-react/de-javascript-a-react.md) | Manipulación del DOM, componentes, JSX, props, estado y eventos.                                                                                |
| 2      | [Hooks](./02-hooks/hooks.md)                                                 | useState, useEffect, custom hooks, useRef, useMemo y useCallback, con una introducción a React Compiler.                                        |
| 3      | [Aplicación con React](./03-aplicacion/aplicacion-con-react.md)              | Lista y detalle con TanStack Router, extracción de componentes y alta con TanStack Form y Zod. CSS Modules queda como ampliación si hay tiempo. |
| 4      | [Arquitectura](./04-arquitectura/arquitectura.md)                            | Organización en escenas, componentes y pods de directorio y edición, con datos compartidos y persistencia local.                                |

## Cómo trabajamos

Cada carpeta contiene un documento con la explicación de la sesión y una carpeta `demos/` con los ejemplos. Las demos representan distintos momentos del recorrido: mostramos un problema, hacemos un cambio y observamos el resultado en el navegador.

Usamos **Vite, TypeScript y Tailwind** como base. Cada demo es un proyecto independiente, con su propio `package.json` y sus dependencias. Para arrancar la primera, desde la carpeta de este módulo:

```bash
cd 01-de-javascript-a-react/demos/01-javascript
npm install
npm start
```

Necesitamos Node.js 22.12 o superior. Abrimos la dirección que indique Vite. Para cambiar de demo, detenemos el servidor y ejecutamos los mismos comandos dentro de la carpeta del siguiente ejemplo. No hay que instalar nada en la raíz del módulo.

Las demos usan datos locales; el alta y la edición guardan los cambios en `localStorage`. El objetivo es comprender las bases de React y llegar preparados a la sesión posterior de TanStack Start.
