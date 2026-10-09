# React — 4 sesiones de 2 horas

¿Qué cambia cuando una página tiene que recordar datos y mantener varias partes de la interfaz sincronizadas? Vamos a empezar con JavaScript, encontrar el problema y resolverlo después con React. A partir de ahí construiremos un directorio de personas y terminaremos organizando el código.

Las guías siguen la línea de [layout](../../01-layout/19-flexbox.md): partimos de algo conocido, planteamos un problema y lo desarrollamos en directo con cambios pequeños de código. Las preguntas y las demostraciones acompañan la explicación del profesor. Los proyectos contienen el resultado de referencia; las ampliaciones que construimos durante la clase se indican en cada tema.

## Antes de empezar

Necesitamos lo visto en funciones, destructuring, arrays, spread, closures y TypeScript. También saber arrancar Vite y aplicar clases de Tailwind. No dedicaremos otra clase a instalar herramientas ni a repasar CSS.

- [Mutabilidad](../../02-lenguajes/20-const-y-mutabilidad.md), [spread](../../02-lenguajes/21-operador-spread.md) y [funciones puras](../../02-lenguajes/22-funciones-puras.md).
- [Funciones como valores y closures](../../02-lenguajes/23-funciones-como-valores-y-closures.md).
- [React en Vite](../../03-bundling/07-react/README.md) y [Tailwind en Vite](../../03-bundling/09-tailwindcss/README.md).

Usamos Node 22.12 o superior (Node 24 es adecuado), npm, React 19, TypeScript, Vite y Tailwind 4 con su plugin oficial. Las versiones resueltas quedan en `package-lock.json` después de instalar. No necesitamos cuenta, claves ni backend para ejecutar las prácticas.

## Preparación del aula

Desde esta carpeta:

```bash
npm ci
cd 01-previous/01-vanilla
npm start
```

Abrimos la dirección que muestre Vite. Para cambiar de ejemplo, detenemos el servidor con Ctrl+C y entramos en su carpeta. Todos aceptan `npm start`, `npm run build` y `npm run preview`. La instalación se comparte mediante npm workspaces: no necesitamos copiar `node_modules` entre ejemplos. Si cambiamos dependencias, ejecutamos `npm install` desde `01-react` y guardamos el lockfile actualizado.

Desde `01-react`, `npm run build` comprueba tipos y genera las cinco aplicaciones; `npm run typecheck` solo comprueba tipos. Vite transpila durante el desarrollo, pero eso no sustituye la comprobación de TypeScript.

## Recorrido

| Sesión | Ejemplo y guía | Qué debe poder hacer el alumno al terminar |
| --- | --- | --- |
| 1 · 120 min | [01-previous](./01-previous/README.md) | Explicar el problema de sincronización del DOM; escribir componentes, props, eventos y estado |
| 2 · 120 min | [02-hooks](./02-hooks/README.md) | Usar estado funcional, efectos con limpieza, un custom hook y una referencia DOM |
| 3 · 120 min | [03-basic-app](./03-basic-app/README.md) | Navegar entre lista y detalle, leer parámetros y representar carga, error, vacío y no encontrado |
| 4 · 120 min | [04-architecture](./04-architecture/README.md) | Separar rutas, escenas, presentación, lógica y acceso a datos manteniendo la aplicación |

## Distribución del tiempo para preparar las clases

La planificación queda aquí para que el desarrollo de cada tema siga el hilo de la explicación. Cada columna suma 120 minutos e incluye cinco minutos de pausa. Las dependencias quedan instaladas antes de la sesión.

| Tramo | Sesión 1 | Sesión 2 | Sesión 3 | Sesión 4 |
| --- | --- | --- | --- | --- |
| Primeros 45 min | Problema, DOM y sincronización | Estado funcional, closures y temporizador | URLs, router y enlaces | Responsabilidades, rutas, layout y escenas |
| 5 min | Pausa | Pausa | Pausa | Pausa |
| Siguientes 50 min | JSX, props, eventos y estado | Petición, custom hook y ref | Lista, filtro y detalle | Pod, container/component y API |
| Últimos 20 min | Eliminar personas y recapitulación | Dos búsquedas y recapitulación | Casos de error y navegación | Cambio de contrato y recapitulación |

Los últimos tramos son demostraciones que desarrollamos con el grupo. Si el ritmo de la clase requiere más tiempo, reducimos las ampliaciones: debounce, cuarta persona o cambios adicionales de arquitectura.

## Cómo reducimos el material de Lemoncode

Referencia: [master-frontend-lemoncode / React](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react), consultada el 8 de octubre de 2026. Esta adaptación utiliza código y explicaciones preparados para este curso; no es una copia completa del máster.

| Origen | Qué conservamos | Qué recortamos o adaptamos |
| --- | --- | --- |
| [01-previous](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react/01-previous) | El recorrido desde manipular el DOM hasta componentes y estado | Vite local en lugar de CodeSandbox; sin construir un mini-framework |
| [03-react-hooks](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react/03-react-hooks) · 01–07, 12 y 14 | Estado, montaje/actualización/desmontaje, búsqueda, extracción de hook, actualizaciones funcionales y foco | Un laboratorio integrado; debounce queda como ampliación |
| [04b-basic-app](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react/04b-basic-app) · 01, 04 y 05 | Rutas, lista y detalle | Sin login, sesión, rutas privadas, Zod, Hono ni tabla de episodios; datos locales ficticios |
| [05b-architecture](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react/05b-architecture) · 01, 03 y 04 | Rutas, layouts, escenas, pods, container/component y API | Sin contexto de autenticación; modelo compartido mientras API y vista coincidan; mapper como ejercicio guiado |

Ojo con la numeración: **12 es `set-state-func`**, no una lección de ciclo de vida. El ciclo de vida se apoya en 03–05. Los ejemplos 06 y 07 conectan una búsqueda con un efecto y después extraen un custom hook; el 14 trabaja con `useRef` sobre el DOM.

Quedan fuera de estas ocho horas: componentes de clase, Redux, `useReducer`, Context, memoización, React Compiler, Suspense, SSR, frameworks de aplicación, librerías de formularios, UI kits y una infraestructura de tests. Se pueden abordar después sin sobrecargar este primer recorrido.

## Un mismo criterio para los ejemplos

React es una biblioteca para construir interfaces. Aquí usamos «frameworks» como nombre del bloque, pero React no aporta por sí solo routing o acceso a datos. React Router se añade en la tercera sesión.

Todos los ejemplos llevan Tailwind desde el principio. El CSS común ya está preparado para centrar la clase en React; las utilidades de layout y tarjetas siguen en el JSX. No añadimos DaisyUI ni otra librería visual.

`public/members.json` y `public/members/1.json` son respuestas estáticas servidas por Vite. Hay peticiones HTTP reales, pero no un servidor que filtre ni guarde cambios. En hooks se repite deliberadamente una petición al cambiar el filtro para practicar dependencias; en la aplicación se carga una vez y se filtra en memoria. Los datos son ficticios y los cambios de estado desaparecen al recargar.

## Referencias para ampliar

- [React: aprender](https://react.dev/learn).
- [React: useEffect](https://react.dev/reference/react/useEffect).
- [React Router: modo declarativo](https://reactrouter.com/start/declarative/installation).
- [Tailwind: integración con Vite](https://tailwindcss.com/docs/installation/using-vite).
