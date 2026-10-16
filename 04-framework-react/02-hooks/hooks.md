# 02 · Hooks

> ⏱️ 2 horas · Qué recuerda un componente y cómo se conecta con lo que hay fuera.

| Demo                                       | Momento de la explicación                        |
| ------------------------------------------ | ------------------------------------------------ |
| [01-basicos](./demos/01-basicos)           | Estado, efectos, custom hook y referencia al DOM |
| [02-memorizacion](./demos/02-memorizacion) | useMemo, useCallback, memo y refs para datos     |
| [03-react-query](./demos/03-react-query) | Ampliación opcional: TanStack Query y useDebounce |

## Render y estado: cada render vuelve a ejecutar la función

En la primera clase guardamos una lista con `useState`. Al añadir una persona, React volvía a ejecutar el componente y la pantalla cambiaba.

Vamos a detenernos en ese «volver a ejecutar». Las variables locales pertenecen a una ejecución. **El estado se conserva entre renders**, pero cada render ve sus propios valores.

Hoy vamos a trabajar con tres piezas pequeñas: un contador, un temporizador y una búsqueda. Entramos en `demos/01-basicos`, ejecutamos `npm install` la primera vez y arrancamos con `npm start` y miramos el código que está en `src/app.tsx`.

## `useState`: sumar tres y observar las actualizaciones

### Paso 0 · `useState`: un contador y el valor de cada render

```tsx
const [count, setCount] = useState(0);
```

El código de partida muestra `count` y tiene un botón conectado a esta función. Queremos que cada clic sume tres:

```tsx
const increaseThree = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
};
```

👉 Partimos de cero. **¿Cuánto va a mostrar: uno o tres?**

Pulsamos. Sale **uno**.

Las tres llamadas leen el mismo `count` de este render: cero. Las tres solicitan el valor uno. `setCount` no reasigna la variable que está leyendo ese manejador.

### Paso 1 · `useState`: actualización funcional a partir del estado anterior

Cambiamos las tres llamadas:

```diff
- setCount(count + 1);
+ setCount(previous => previous + 1);
```

Ahora pasamos una transformación. React aplica una detrás de otra al estado pendiente:

```text
0 → 1 → 2 → 3
```

Pulsamos de nuevo y comprobamos que cada clic suma tres.

Si calculamos el nuevo estado a partir del anterior, podemos pasar una función: `setCount(previous => previous + 1)`. React entrega a cada actualización el resultado de la anterior; por eso ahora obtenemos tres incrementos.

Esta función calcula y devuelve el siguiente valor. No debe modificar el estado recibido ni realizar acciones como peticiones.

## `useEffect`: iniciar y limpiar un temporizador

Vamos a mostrar cuántos segundos lleva montado un componente. Para eso necesitamos un intervalo del navegador.

¿Dónde lo ponemos? Si lo creamos directamente en el cuerpo del componente, crearemos **otro intervalo en cada render**.

### Render y efectos secundarios: un intervalo en el lugar equivocado

Vamos a comprobarlo con una versión incorrecta. En `src/app.tsx`, antes de `App`, añadimos este componente:

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  console.log("Creamos un intervalo");

  window.setInterval(() => {
    setSeconds((previous) => previous + 1);
  }, 1000);

  return <p>Segundos montado: {seconds}</p>;
}
```

En el JSX de `App`, debajo del botón «Sumar tres», añadimos `<Timer />`. Abrimos la consola y lo dejamos funcionar solo unos segundos.

El contador empieza a avanzar cada vez más rápido y el mensaje aparece una y otra vez. Seguimos lo que está ocurriendo:

1. React ejecuta `Timer` y creamos un intervalo.
2. El intervalo actualiza el estado con `setSeconds`.
3. React vuelve a ejecutar `Timer` y creamos otro intervalo, sin detener el anterior.
4. Los intervalos se acumulan y cada uno sigue solicitando incrementos.

👉 **Queremos actualizar el número cada segundo, pero ¿queremos crear otro temporizador cada vez que cambia?**

Crear el intervalo es un efecto secundario: pone en marcha algo fuera del cálculo de la interfaz. Vamos a moverlo a `useEffect` y a indicar cómo detenerlo.

Para terminar la prueba, quitamos temporalmente `<Timer />` de `App`, guardamos y recargamos la página. Quitar el componente o guardar el archivo no limpia estos intervalos: esta versión no tiene ninguna limpieza. La recarga elimina los que quedaron activos.

### Paso 2 · `useEffect`: conectar el intervalo y devolver su limpieza

_./src/app.tsx_

Añadimos `useEffect` al import de React:

```tsx
import { useEffect, useState } from "react";
```

Sustituimos el componente `Timer` anterior por esta versión con efecto y limpieza. Lo mantenemos fuera de `App`. Hemos resuelto dónde crear el intervalo; ahora usaremos `seconds + 1` para observar después otro problema: qué valor recuerda su callback.

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    console.log("Conectamos el temporizador");
    const timer = window.setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);

    return () => {
      console.log("Limpiamos el temporizador");
      window.clearInterval(timer);
    };
  }, []);

  return <p>Segundos montado: {seconds}</p>;
}
```

El render describe el párrafo. El efecto conecta el intervalo. La función que devolvemos **lo limpia**.

Volvemos a añadir `<Timer />` al JSX de `App`, debajo del botón «Sumar tres». De momento lo dejamos siempre visible para centrarnos en que cuente correctamente.

### Closures y actualización funcional: ¿por qué se queda en uno?

Montamos el temporizador y esperamos unos segundos. **Pasa de cero a uno, pero no sigue subiendo.**

El callback del intervalo se creó cuando `seconds` valía cero. Como el efecto tiene `[]`, no se vuelve a configurar al cambiar el estado: el intervalo sigue ejecutando aquel callback, que solicita `setSeconds(0 + 1)` una y otra vez.

Esto es un closure: la función conserva acceso a las variables de la ejecución en la que se creó. Aunque React vuelva a ejecutar `Timer` con `seconds` igual a uno, eso no cambia el valor que lee el callback anterior.

Recuperamos la idea que acabamos de usar en el contador. Cambiamos la línea dentro del intervalo:

```diff
- setSeconds(seconds + 1);
+ setSeconds(previous => previous + 1);
```

Ahora pedimos a React que sume uno al estado pendiente, sin leer `seconds` desde el callback del intervalo. Guardamos y recargamos la página: **el contador avanza 0, 1, 2, 3…** Dejamos esta versión para continuar.

### `useEffect`: desmontar el componente y limpiar el intervalo

Ahora que el temporizador cuenta correctamente, añadimos un botón para ocultarlo y observar cuándo se ejecuta la limpieza.

Dentro de `App`, junto al estado del contador, añadimos un booleano:

```tsx
const [visible, setVisible] = useState(true);
```

En el JSX de `App`, sustituimos el `<Timer />` que teníamos por:

```tsx
<button onClick={() => setVisible((previous) => !previous)}>
  {visible ? "Ocultar" : "Mostrar"} temporizador
</button>;
{
  visible && <Timer />;
}
```

Abrimos la consola y pulsamos **Ocultar temporizador**. Al pasar `visible` a `false`, React retira `Timer` del árbol: lo desmonta. Antes de terminar, ejecuta la función de limpieza que devolvimos en el efecto:

```tsx
return () => {
  console.log("Limpiamos el temporizador");
  window.clearInterval(timer);
};
```

Vemos el mensaje en consola. `clearInterval(timer)` detiene el intervalo que habíamos creado con `setInterval`; no se trata solo de ocultar el párrafo con CSS.

Al desmontar, el intervalo se detiene. Al montar otra vez, el contador empieza en cero: es una nueva instancia del componente.

👉 Si después de varias alternancias el contador avanzase cada vez más rápido, tendríamos una pista: **se están acumulando intervalos**.

## Ciclo de vida y `useEffect`: montaje, dependencias y desmontaje

| Momento       | Qué ocurre                                               |
| ------------- | -------------------------------------------------------- |
| Montaje       | El componente aparece en el árbol                        |
| Actualización | React vuelve a calcular su salida con los datos actuales |
| Desmontaje    | El componente sale del árbol y pierde su estado          |

El efecto nos permite sincronizar el componente con algo externo. Sus dependencias indican cuándo hay que repetir esa sincronización:

| Dependencias          | Comportamiento                                                                 |
| --------------------- | ------------------------------------------------------------------------------ |
| Sin segundo argumento | Se ejecuta después de cada commit                                              |
| `[]`                  | Se conecta al montar y se limpia al desmontar                                  |
| `[filter]`            | También se repite cuando cambia `filter`; primero limpia la ejecución anterior |

**Commit** es el momento en que React aplica al DOM el resultado del render.

Ojo: con `StrictMode`, en desarrollo veremos un ciclo adicional de configuración y limpieza. Es una comprobación de React. Por eso `[]` no significa «garantizado que se ejecuta una única vez».

No necesitamos un efecto para calcular el total de personas o filtrar un array que ya tenemos. Eso puede hacerse durante el render.

## `useEffect` y `fetch`: pedir datos y cancelar peticiones

### Paso 3 · `useState` y `useEffect`: una búsqueda que depende del filtro

En `src/app.tsx`, antes de `App`, añadimos el tipo de persona y un componente `MemberSearch` con el campo de búsqueda:

```tsx
interface Member {
  id: number;
  name: string;
}

function MemberSearch() {
  const [filter, setFilter] = useState("");

  return (
    <section className="space-y-3">
      <h2>Buscar personas</h2>
      <label htmlFor="filter">Nombre</label>
      <input
        id="filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </section>
  );
}
```

En el JSX de `App`, debajo del temporizador, añadimos `<MemberSearch />`. Escribimos en el campo para comprobar que su estado funciona.

Dentro de `MemberSearch`, después del estado `filter` y antes del `return`, añadimos los tres estados de la petición:

```tsx
const [members, setMembers] = useState<Member[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```

Debajo de esos estados, todavía antes del `return`, añadimos el efecto. Primero desarrollamos la petición dentro del componente; después la extraeremos:

```tsx
useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  setError("");

  fetch("/members.json", { signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
      return response.json() as Promise<Member[]>;
    })
    .then((data) => {
      if (!controller.signal.aborted) {
        setMembers(
          data.filter((member) =>
            member.name.toLowerCase().includes(filter.toLowerCase()),
          ),
        );
      }
    })
    .catch(() => {
      if (!controller.signal.aborted) {
        setError("No se ha podido cargar el equipo.");
      }
    })
    .finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });

  return () => controller.abort();
}, [filter]);
```

Aquí hay varias decisiones:

- `response.ok`: una respuesta HTTP de error no hace que `fetch` rechace automáticamente.
- `[filter]`: al cambiar el campo, repetimos la petición.
- `abort()`: al cambiar la búsqueda o desmontar, cancelamos la anterior.
- La guarda `!controller.signal.aborted`: una ejecución antigua ya no puede cambiar los resultados ni quitar la carga de la nueva.

El tipo `Member[]` ayuda al escribir TypeScript; no valida el JSON que llegue en ejecución.

> Los datos están en `public/members.json`. Vite los sirve por HTTP, pero no hay un servidor que busque: aquí filtramos la respuesta en cliente. Repetimos la petición para mostrar el patrón de una búsqueda remota. En la siguiente clase cargaremos una vez y filtraremos en memoria.

### Paso 4 · Renderizado condicional: carga, error, lista y resultados vacíos

Con la petición pendiente mostramos «Cargando…». Si falla, el error. Si termina bien, la lista o «Sin resultados».

Añadimos este bloque después del input, dentro del `<section>` de `MemberSearch`:

```diff
 return (
    <section className="space-y-3">
      <h2>Buscar personas</h2>
      <label htmlFor="filter">Nombre</label>
      <input
        id="filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
+     {loading ? (
+       <p role="status">Cargando…</p>
+     ) : error ? (
+       <p role="alert">{error}</p>
+     ) : members.length === 0 ? (
+       <p>Sin resultados.</p>
+     ) : (
+       <ul>
+         {members.map((member) => (
+           <li key={member.id}>{member.name}</li>
+         ))}
+       </ul>
+     )}
    </section>
  );
```

Abrimos **Network**, desactivamos la caché y elegimos una conexión lenta. Escribimos varias letras. Vemos peticiones canceladas; el resultado que queda corresponde a la última búsqueda.

Después buscamos `zzzz`: la petición funciona, pero no hay coincidencias. **Vacío no es lo mismo que error.**

Para mostrar el error bloqueamos `/members.json` en DevTools y cambiamos el filtro. Desbloqueamos la petición y volvemos a cambiarlo para recuperar los datos.

## Custom hooks: extraer y reutilizar la lógica de la búsqueda

### Paso 5 · Custom hook: crear `useMembers`

Ahora el componente ya tiene bastante código que no describe su aspecto. Creamos `src/use-members.ts`, importamos `useEffect` y `useState` y movemos allí la interfaz `Member`. Dentro de la función `useMembers` movemos los tres estados de la petición y el efecto completos:

```tsx
export function useMembers(filter: string) {
  // Movemos aquí los estados members, loading y error y el efecto del paso 3.
  return { members, loading, error };
}
```

Este fragmento es el esquema de la extracción: el comentario se sustituye por el código que acabamos de escribir, sin cambiar su lógica. Eliminamos ese código de `MemberSearch`; su estado `filter` y su JSX se quedan en el componente.

En `src/app.tsx` añadimos el import:

```tsx
import { useMembers } from "./use-members";
```

Dentro de `MemberSearch`, debajo del estado `filter`, llamamos al nuevo hook:

```tsx
const { members, loading, error } = useMembers(filter);
```

**Un custom hook comparte lógica.** No crea un único estado compartido entre todas las pantallas que lo llamen.

Su nombre empieza por `use`. Como los demás hooks, se llama en el nivel superior de un componente o de otro hook, no dentro de un `if`, un bucle o un evento.

## `useRef`: acceder a un elemento del DOM

Con el estado decidimos qué se pinta. Pero ahora queremos algo distinto: que un botón lleve el foco al campo de búsqueda.

### Paso 6 · `useRef`: guardar la referencia del input y darle foco

Añadimos `useRef` al import de React en `src/app.tsx`. Dentro de `MemberSearch`, antes del `return`, declaramos:

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Conectamos `ref={inputRef}` al input.

```diff
      <input
        id="filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
+       ref={inputRef}
      />
```

En el botón:

```tsx
<button onClick={() => inputRef.current?.focus()}>Enfocar búsqueda</button>
```

Pulsamos y escribimos: el foco está en el campo.

React guarda el nodo en `current`. Usamos `?.` porque puede ser `null`. Cambiar una ref **no solicita un render**.

## Estado por instancia: dos búsquedas con el mismo custom hook

Terminamos montando dos `MemberSearch`. Antes de escribir, planteamos la pregunta: **si filtro Julia en el primero, qué aparecerá en el segundo?**

Cada instancia tiene su propio estado. Cambiar una no modifica la otra.

Al duplicar el componente también duplicaríamos `id="filter"`. Añadimos una prop `inputId: string`, la usamos tanto en `id` como en `htmlFor` y pasamos dos identificadores distintos. Así cada etiqueta sigue asociada a su campo.

Esta ampliación la hacemos sobre la búsqueda que acabamos de construir. La demo guardada conserva solo el contador inicial para poder repetir todo el recorrido desde el principio.

## Repaso: `useState`, `useEffect`, custom hooks y `useRef`

| Herramienta | Para qué la hemos usado                        |
| ----------- | ---------------------------------------------- |
| `useState`  | Recordar datos que afectan a la pantalla       |
| `useEffect` | Conectar y limpiar temporizadores y peticiones |
| Custom hook | Reutilizar esa lógica con un nombre            |
| `useRef`    | Acceder al input para enfocarlo                |


## Memorización: `useMemo`, `memo` y `useCallback`

Pasamos a `demos/02-memorizacion` y ejecutamos `npm install` y `npm start`. El proyecto guardado contiene solo `useState`: una búsqueda local, una lista que muestra las primeras ocho coincidencias, la persona seleccionada y un contador independiente. Construiremos las optimizaciones sobre ese mismo código.

Las 2.000 personas permiten observar cuándo se repite un cálculo; no demuestran por sí solas un problema de rendimiento. React Compiler está desactivado en esta demo para poder comparar los cambios manuales.

### Paso 7 · Render: observar el punto de partida

Abrimos `src/app.tsx` y la consola. Tenemos dos mensajes: «Calculamos el filtro», dentro de `App`, y «Render de Results», dentro del componente de la lista.

Pulsamos **Cambio ajeno al listado**. Se repiten ambos mensajes: cambia el estado del padre, se vuelve a calcular el filtro y se ejecuta el hijo. La lista no necesita cambiar visualmente para que sus componentes se ejecuten.

👉 **Si las personas y el filtro siguen siendo los mismos, ¿necesitamos repetir la búsqueda?**

> Con `StrictMode` podemos ver mensajes adicionales en desarrollo. Comparamos qué interacción dispara el cálculo, no un número exacto de ejecuciones. Los `console.count` son una ayuda temporal para la explicación.

### Paso 8 · `useMemo`: conservar el resultado del filtro

Añadimos `useMemo` al import de React. Dentro de `App`, sustituimos el `console.count` y la declaración de `visible` por:

```tsx
const visible = useMemo(() => {
  console.count("Calculamos el filtro");
  return people.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()),
  );
}, [filter]);
```

Pulsamos el contador: ya no aparece «Calculamos el filtro», pero sí «Render de Results». Cambiamos el texto de búsqueda: ahora se repite el cálculo.

`useMemo` conserva el resultado mientras no cambien sus dependencias. Aquí `people` está definido fuera del componente y no cambia; si llegase por props o estado, también tendría que estar entre las dependencias.

El primer render sigue haciendo el cálculo. Hemos evitado repetirlo al cambiar el contador, pero no hemos evitado que se ejecute el componente hijo.

### Paso 9 · `memo`: comparar las props del listado

`memo` no es un hook: envuelve un componente para que React pueda omitir su ejecución cuando sus props no cambian. Lo añadimos al import y sustituimos la declaración de `Results` por:

```tsx
const Results = memo(function Results({ people, onSelect }: ResultsProps) {
  console.count("Render de Results");

  return (
    <section className="space-y-2">
      <h2>Resultados</h2>
      <ul>
        {people.slice(0, 8).map((person) => (
          <li key={person.id}>
            <button onClick={() => onSelect(person)}>{person.name}</button>
          </li>
        ))}
      </ul>
    </section>
  );
});
```

Pulsamos el contador. **Results sigue ejecutándose.**

👉 **El array conserva su referencia gracias a `useMemo`. ¿Qué otra prop recibe la lista?**

Recibe `onSelect`. La función `selectPerson` se define dentro de `App`: cada ejecución crea una función nueva. Aunque su código sea el mismo, su referencia es distinta. `memo` compara cada prop con `Object.is`, no compara el código de las funciones ni recorre los campos de los objetos.

### Paso 10 · `useCallback`: conservar la función que pasamos al hijo

Añadimos `useCallback` al import. Sustituimos la declaración de `selectPerson` por:

```tsx
const selectPerson = useCallback((person: Person) => {
  setSelected(person.name);
}, []);
```

No cambiamos cómo la pasamos al hijo:

```tsx
<Results people={visible} onSelect={selectPerson} />
```

Pulsamos el contador: ahora no se repite el filtro y `memo` puede omitir la ejecución de `Results`, porque ambas props conservan sus referencias. Escribimos en el filtro: cambia el array y la lista sí se actualiza. Pulsamos una persona: su nombre sigue apareciendo en «Seleccionada».

La función solo usa su argumento y `setSelected`, cuya identidad es estable; por eso las dependencias están vacías. Si leyera otros valores del componente, tendríamos que incluirlos.

`useCallback` conserva la identidad de una función; no la ejecuta ni impide que se ejecute al pulsar. Su utilidad aquí aparece porque `memo` aprovecha esa identidad.

| Paso | Al pulsar el contador |
| --- | --- |
| Punto de partida | Se repiten el filtro y la ejecución de `Results`. |
| Con `useMemo` | Se conserva el filtro; `Results` sigue ejecutándose. |
| Con `memo` también | La función nueva impide omitir la ejecución del hijo. |
| Con `useCallback` también | Las props son estables y `memo` puede omitirla. |

### Identidad y dependencias: comprobaciones opcionales

Probamos un cambio cada vez y después recuperamos la versión anterior:

- Pasamos `onSelect={(person) => setSelected(person.name)}`: vuelve a ser una función nueva y `Results` se ejecuta al pulsar el contador.
- Pasamos `people={people.filter((person) => person.name.includes(filter))}`: creamos un array nuevo y también perdemos la ventaja de `memo`.
- Quitamos `filter` de las dependencias de `useMemo`: la búsqueda deja de responder correctamente. Una optimización no puede romper el resultado.

No necesitamos añadir estas herramientas a todos los componentes. En una aplicación real, medimos una interacción lenta antes de optimizarla. `memo` tampoco impide actualizaciones debidas al estado propio o al contexto del hijo.

## `useRef`: conservar un dato sin solicitar otro render

### Paso 11 · `useRef` frente a estado: acumular y mostrar

Añadimos `useRef` al import de React. Antes de `App`, creamos este componente y lo montamos con `<RefDemo />` debajo de `<Results ... />`:

```tsx
function RefDemo() {
  const clicks = useRef(0);
  const [snapshot, setSnapshot] = useState(0);

  return (
    <section className="space-y-3">
      <h2>Un dato que no actualiza la pantalla</h2>
      <button onClick={() => {
        clicks.current += 1;
        console.log("Valor de la ref:", clicks.current);
      }}>
        Incrementar ref
      </button>{" "}
      <button onClick={() => setSnapshot(clicks.current)}>
        Mostrar copia en estado
      </button>
      <p>Copia visible: {snapshot}</p>
    </section>
  );
}
```

Pulsamos **Incrementar ref** tres veces. La consola muestra 1, 2 y 3, pero la copia visible sigue en cero. Pulsamos **Mostrar copia en estado**: ahora aparece tres. Incrementamos otra vez y copiamos: aparece cuatro.

La ref conserva el dato entre renders; modificar `current` no solicita un render. El párrafo muestra una copia guardada en estado, no lee la ref durante el render. Para un contador que deba actualizarse con cada clic usaríamos directamente estado.


## React Compiler: memorización automática

React Compiler automatiza parte de esta memorización durante la compilación. Lo comentamos después de los ejemplos para entender qué trabajo intenta ahorrarnos. No corrige efectos incorrectos ni convierte una mutación en una actualización válida.

**Estado comprobado el 10 de octubre de 2026:** React Compiler 1.0 es estable. La integración nativa basada en Rust está disponible mediante `oxc-transform-react` y `@vitejs/plugin-react` 6.1; la documentación de esa integración todavía la marca como experimental. Por tanto, no lo presentamos como un proyecto parado ni decimos que el soporte Rust aún no exista.

Fuentes: [React Compiler](https://react.dev/learn/react-compiler/introduction), [soporte de Oxc](https://oxc.rs/blog/2026-08-18-react-compiler-support) y [plugin oficial de Vite](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#react-compiler).

En las demos está **desactivado** para que la comparación manual sea visible. Si sobra tiempo, desde `demos/02-memorizacion` instalamos `npm install -D oxc-transform-react` y cambiamos `react()` por `react({ compiler: true })` en Vite. Es una ampliación, no un requisito de los proyectos entregados. Reiniciamos Vite y repetimos la comparación; los conteos pueden cambiar porque ahora otra herramienta está optimizando.

## Ampliación opcional · TanStack Query y `useDebounce`: simplificar la búsqueda

Pasamos a [demos/03-react-query](./demos/03-react-query). Es un proyecto independiente: contiene la búsqueda funcionando con `useEffect`, sus estados de datos, carga y error y la cancelación de peticiones. No contiene temporizador, contador ni custom hook. Así empezamos desde el mismo punto, independientemente de los cambios que hayamos hecho en las demos anteriores.

Desde la carpeta de esta demo ejecutamos:

```bash
npm install
npm start
```

Abrimos `src/app.tsx` y Network. Al escribir, cada cambio del filtro lanza una petición. Los datos están en `public/members.json`: el filtro se aplica en cliente para simular el recorrido de una búsqueda remota. Si solo necesitásemos buscar en este JSON, bastaría con cargarlo una vez y filtrar en memoria.

### Paso A · TanStack Query: identificar la lógica que vamos a sustituir

Señalamos `members`, `loading`, `error` y el efecto. Ya sabemos escribir esta lógica, pero tendríamos que repetirla en otras pantallas.

TanStack Query, también conocido como React Query, gestiona el resultado de las peticiones, sus estados y su caché. Vamos a conservar `filter` como estado del formulario y sustituir la gestión manual de la petición.

### Paso B · `QueryClientProvider`: preparar el cliente

En otra terminal, dentro de esta demo, instalamos la librería:

```bash
npm install @tanstack/react-query
```

Sustituimos `src/main.tsx` por:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "./app";
import "./styles.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
```

El cliente mantiene la caché. Lo creamos fuera de los componentes para no crear uno nuevo en cada render. El proveedor permite que los componentes de la aplicación lo utilicen.

### Paso C · `useQuery`: datos, carga y error

En `src/app.tsx`, quitamos `useEffect` del import y añadimos `useQuery`:

```tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
```

Conservamos la interfaz `Member`. Debajo de ella, fuera de `App`, añadimos la función de petición:

```tsx
async function fetchMembers(
  filter: string,
  signal: AbortSignal,
): Promise<Member[]> {
  const response = await fetch("/members.json", { signal });

  if (!response.ok) {
    throw new Error("No se ha podido cargar el equipo.");
  }

  const members: Member[] = await response.json();
  return members.filter((member) =>
    member.name.toLowerCase().includes(filter.toLowerCase()),
  );
}
```

Dentro de `App`, conservamos el estado `filter`. Eliminamos los estados `members`, `loading` y `error` y todo el efecto. En su lugar añadimos:

```tsx
const {
  data: members = [],
  isPending,
  isError,
  error,
} = useQuery({
  queryKey: ["members", filter],
  queryFn: ({ signal }) => fetchMembers(filter, signal),
  staleTime: 60_000,
  retry: false,
});
```

La `queryKey` identifica los datos: cada filtro tiene una entrada distinta en caché. `queryFn` obtiene esos datos. Con `staleTime` los consideramos recientes durante un minuto. Desactivamos los reintentos en esta demo para observar los errores sin esperar varias peticiones.

React Query proporciona el `signal`; se lo pasamos a `fetch` para que pueda cancelar la petición cuando corresponda. Ya no creamos nuestro propio `AbortController`.

En el JSX conservamos el input y sustituimos el bloque de resultados por:

```tsx
{isPending ? (
  <p role="status">Cargando…</p>
) : isError ? (
  <p role="alert">{error.message}</p>
) : members.length === 0 ? (
  <p>Sin resultados.</p>
) : (
  <ul>
    {members.map((member) => (
      <li key={member.id}>{member.name}</li>
    ))}
  </ul>
)}
```

Probamos la búsqueda. Sigue funcionando, pero ya no escribimos nosotros las actualizaciones de carga, datos y error. `isPending` indica que la consulta aún no tiene un resultado; no representa todas las peticiones en segundo plano, para las que existe `isFetching`.

### Paso D · `useDebounce`: esperar antes de cambiar la consulta

👉 **Si escribimos Julia, ¿necesitamos buscar J, Ju, Jul y Juli antes de buscar Julia?**

Creamos `src/use-debounce.ts`. Este hook lo escribimos nosotros; no forma parte de React Query:

```tsx
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

Cada cambio limpia el timeout anterior. Si pasan 400 ms sin otro cambio, actualizamos el valor devuelto. Aquí reaparece la limpieza de `useEffect`, esta vez aplicada a un timeout.

En `src/app.tsx` importamos el hook:

```tsx
import { useDebounce } from "./use-debounce";
```

Debajo del estado `filter` añadimos:

```tsx
const debouncedFilter = useDebounce(filter, 400);
```

En `useQuery`, cambiamos tanto la clave como el argumento de la petición:

```tsx
queryKey: ["members", debouncedFilter],
queryFn: ({ signal }) => fetchMembers(debouncedFilter, signal),
```

**El input sigue usando `value={filter}` y `setFilter`** para responder inmediatamente. Solo retrasamos el filtro de la consulta. Mientras escribimos, pueden seguir visibles los resultados de la búsqueda anterior hasta que cambie `debouncedFilter`.

### Paso E · Network y caché: observar el resultado

Abrimos Network, filtramos por `members.json` y desactivamos la caché del navegador:

1. Escribimos Julia rápidamente. Después de la pausa aparece la petición de esa búsqueda. La consulta inicial con filtro vacío puede haber hecho otra al arrancar.
2. Buscamos Evan y volvemos a Julia antes de un minuto. La caché de React Query puede recuperar Julia sin otra petición; desactivar la caché HTTP en Network no desactiva la de React Query.
3. Para observar la cancelación, elegimos una conexión lenta, buscamos un nombre nuevo y esperamos a que arranque la petición. Cambiamos el texto y esperamos otros 400 ms: al cambiar la consulta, la petición anterior puede cancelarse si sigue en curso y ya no tiene observadores. El debounce cancela timeouts; el `signal` permite cancelar peticiones.
4. Bloqueamos `/members.json` en DevTools y buscamos un filtro que no hayamos usado para mostrar el error. Después desbloqueamos y probamos con otro filtro nuevo.

No recargamos entre las búsquedas con las que comparamos la caché: al recargar se crea un cliente nuevo. Con `StrictMode` puede aparecer una petición inicial cancelada durante su comprobación adicional.

El recorrido queda así:

```text
Escribimos → cambia filter → pausa de 400 ms → cambia debouncedFilter
           → cambia queryKey → consulta o reutilización de caché
```

## Para ampliar

Para repasar la sesión, podemos consultar estos recursos de la documentación oficial. Los de React están en español; los de TanStack Query, en inglés.

- [El estado: la memoria de un componente](https://es.react.dev/learn/state-a-components-memory): repaso de `useState` y de la diferencia entre una variable local y el estado.
- [useEffect](https://es.react.dev/reference/react/useEffect): efectos, dependencias y funciones de limpieza para coordinar el componente con temporizadores o peticiones.
- [StrictMode](https://es.react.dev/reference/react/StrictMode): por qué React realiza comprobaciones adicionales durante el desarrollo.
- [useRef](https://es.react.dev/reference/react/useRef): cómo conservar una referencia y acceder a elementos del DOM sin solicitar un render al modificarla.
- [useMemo](https://es.react.dev/reference/react/useMemo) y [useCallback](https://es.react.dev/reference/react/useCallback): cuándo puede ser útil conservar un resultado o la identidad de una función.
- [Inicio de TanStack Query](https://tanstack.com/query/latest/docs/framework/react/quick-start): punto de entrada para continuar con la ampliación opcional de consultas y caché.
- [Cancelación de consultas](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation): cómo conectar el `signal` de React Query con `fetch`.

También encontramos más ejemplos en el [bloque de React del máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react). Su recorrido es más amplio que el de esta sesión; podemos consultarlo como material complementario.
