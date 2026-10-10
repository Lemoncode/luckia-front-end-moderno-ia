# 02 · Hooks

> ⏱️ 2 horas · Qué recuerda un componente y cómo se conecta con lo que hay fuera.

| Demo | Momento de la explicación |
| --- | --- |
| [01-basicos](./demos/01-basicos) | Estado, efectos, custom hook y referencia al DOM |
| [02-memorizacion](./demos/02-memorizacion) | useMemo, useCallback, memo y refs para datos |

## Antes de la clase

Partimos de componentes, props y estado. Conviene recordar [mutabilidad](../../02-lenguajes/20-const-y-mutabilidad.md), [spread](../../02-lenguajes/21-operador-spread.md) y [closures](../../02-lenguajes/23-funciones-como-valores-y-closures.md). Usamos Node 22.12 o superior y una instalación independiente por demo.

## Recorrido de la sesión · 120 minutos

| Minutos | Explicación |
| --- | --- |
| 0–15 | Estado funcional y closures |
| 15–35 | Temporizador, efectos y limpieza |
| 35–50 | Petición, error y cancelación |
| 50–55 | Pausa |
| 55–70 | Extracción del custom hook |
| 70–80 | Ref al DOM |
| 80–100 | useMemo, useCallback y memo |
| 100–110 | Refs para datos y casos límite |
| 110–120 | Estado del Compiler y recapitulación |

Si el grupo necesita más tiempo en efectos, mostramos la demo de memorización ya montada y comentamos el resultado. Debounce y activar Compiler quedan como ampliaciones.

## Cada render vuelve a ejecutar la función

En la primera clase guardamos una lista con `useState`. Al añadir una persona, React volvía a ejecutar el componente y la pantalla cambiaba.

Vamos a detenernos en ese «volver a ejecutar». Las variables locales pertenecen a una ejecución. **El estado se conserva entre renders**, pero cada render ve sus propios valores.

Hoy vamos a trabajar con tres piezas pequeñas: un contador, un temporizador y una búsqueda. Entramos en `demos/01-basicos`, ejecutamos `npm install` la primera vez y arrancamos con `npm start`; el recorrido está en `src/app.tsx`. Al terminar pasaremos a `demos/02-memorizacion`, preparada para comparar identidad de referencias y optimizaciones.

## Vamos a verlo: sumar tres

### Paso 0: un contador

```tsx
const [count, setCount] = useState(0);
```

Mostramos `count` y añadimos un botón. Queremos que cada clic sume tres:

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

### Paso 1: calcular a partir del estado anterior

Cambiamos las tres llamadas:

```diff
- setCount(count + 1);
+ setCount(previous => previous + 1);
```

Ahora pasamos una transformación. React aplica una detrás de otra al estado pendiente:

```text
0 → 1 → 2 → 3
```

Esta es la versión que queda en el proyecto.

**Cuando el nuevo estado depende del anterior, podemos usar una función de actualización.** Esa función debe ser pura: recibe un valor y devuelve otro, sin peticiones ni cambios sobre los objetos existentes.

### ¿Y los closures?

Esto conecta con lo que vimos en JavaScript. Un callback conserva acceso a las variables de la ejecución en la que se creó. Una ejecución posterior del componente tiene otras variables; no sustituye las que ve el callback anterior.

Un temporizador hace visible ese problema. Si su callback usa un contador antiguo, puede seguir calculando desde ese valor. Con `setSeconds(previous => previous + 1)`, el incremento se aplica sobre el estado pendiente.

> El actualizador funcional resuelve **actualizaciones basadas en el estado anterior**. No hace que cualquier variable capturada por un callback se vuelva automáticamente actual.

## Un temporizador tiene que empezar… y terminar

Vamos a mostrar cuántos segundos lleva montado un componente. Para eso necesitamos un intervalo del navegador.

¿Dónde lo ponemos? Si lo creamos directamente en el cuerpo del componente, crearemos **otro intervalo en cada render**.

### Paso 2: conectar el temporizador con un efecto

_./src/app.tsx_

```tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds(previous => previous + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return <p>Segundos montado: {seconds}</p>;
}
```

El render describe el párrafo. El efecto conecta el intervalo. La función que devolvemos **lo limpia**.

En `App` tenemos un booleano y mostramos el componente de forma condicional:

```tsx
{visible && <Timer />}
```

Abrimos la consola y alternamos Montar y Desmontar. El ejemplo registra cuándo conecta y cuándo limpia.

Al desmontar, el intervalo se detiene. Al montar otra vez, el contador empieza en cero: es una nueva instancia del componente.

👉 Si después de varias alternancias el contador avanzase cada vez más rápido, tendríamos una pista: **se están acumulando intervalos**.

## Montaje, actualización y desmontaje

| Momento | Qué ocurre |
| --- | --- |
| Montaje | El componente aparece en el árbol |
| Actualización | React vuelve a calcular su salida con los datos actuales |
| Desmontaje | El componente sale del árbol y pierde su estado |

El efecto nos permite sincronizar el componente con algo externo. Sus dependencias indican cuándo hay que repetir esa sincronización:

| Dependencias | Comportamiento |
| --- | --- |
| Sin segundo argumento | Se ejecuta después de cada commit |
| `[]` | Se conecta al montar y se limpia al desmontar |
| `[filter]` | También se repite cuando cambia `filter`; primero limpia la ejecución anterior |

**Commit** es el momento en que React aplica al DOM el resultado del render.

Ojo: con `StrictMode`, en desarrollo veremos un ciclo adicional de configuración y limpieza. Es una comprobación de React. Por eso `[]` no significa «garantizado que se ejecuta una única vez».

No necesitamos un efecto para calcular el total de personas o filtrar un array que ya tenemos. Eso puede hacerse durante el render.

## Vamos a pedir datos

### Paso 3: una búsqueda que depende de un campo

Añadimos `MemberSearch`. El input guarda `filter`; la petición necesita tres estados más:

```tsx
const [members, setMembers] = useState<Member[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```

Primero desarrollamos la petición dentro del componente. Después la extraeremos.

```tsx
useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  setError("");

  fetch("/members.json", { signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
      return response.json() as Promise<Member[]>;
    })
    .then(data => {
      if (!controller.signal.aborted) {
        setMembers(data.filter(member =>
          member.name.toLowerCase().includes(filter.toLowerCase())
        ));
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

### Paso 4: hacer visibles los distintos resultados

Con la petición pendiente mostramos «Cargando…». Si falla, el error. Si termina bien, la lista o «Sin resultados».

Abrimos **Network**, desactivamos la caché y elegimos una conexión lenta. Escribimos varias letras. Vemos peticiones canceladas; el resultado que queda corresponde a la última búsqueda.

Después buscamos `zzzz`: la petición funciona, pero no hay coincidencias. **Vacío no es lo mismo que error.**

Para mostrar el error bloqueamos `/members.json` en DevTools y cambiamos el filtro. Desbloqueamos la petición y volvemos a cambiarlo para recuperar los datos.

## Dar nombre a esa lógica: un custom hook

### Paso 5: extraer `useMembers`

Ahora el componente ya tiene bastante código que no describe su aspecto. Movemos los tres estados y el efecto a `src/use-members.ts`:

```tsx
export function useMembers(filter: string) {
  // Los estados y el efecto que acabamos de construir.
  return { members, loading, error };
}
```

Este fragmento muestra la forma de la extracción; el archivo del proyecto contiene el cuerpo completo. En el componente queda:

```tsx
const { members, loading, error } = useMembers(filter);
```

**Un custom hook comparte lógica.** No crea un único estado compartido entre todas las pantallas que lo llamen.

Su nombre empieza por `use`. Como los demás hooks, se llama en el nivel superior de un componente o de otro hook, no dentro de un `if`, un bucle o un evento.

## ¿Y si necesitamos tocar el DOM?

Con el estado decidimos qué se pinta. Pero ahora queremos algo distinto: que un botón lleve el foco al campo de búsqueda.

### Paso 6: guardar la referencia del input

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Conectamos `ref={inputRef}` al input. En el botón:

```tsx
<button onClick={() => inputRef.current?.focus()}>
  Enfocar búsqueda
</button>
```

Pulsamos y escribimos: el foco está en el campo.

React guarda el nodo en `current`. Usamos `?.` porque puede ser `null`. Cambiar una ref **no solicita un render**; si el dato tiene que actualizar la pantalla, normalmente necesitamos estado.

## Dos búsquedas, ¿un estado o dos?

Terminamos montando dos `MemberSearch`. Antes de escribir, planteamos la pregunta: **si filtro Julia en el primero, qué aparecerá en el segundo?**

Cada instancia tiene su propio estado. Cambiar una no modifica la otra.

Al duplicar el componente también duplicaríamos `id="filter"`. Añadimos una prop `inputId: string`, la usamos tanto en `id` como en `htmlFor` y pasamos dos identificadores distintos. Así cada etiqueta sigue asociada a su campo.

Esta ampliación la hacemos en clase; el ejemplo guardado contiene una búsqueda.

## Cerramos la parte básica

| Herramienta | Para qué la hemos usado |
| --- | --- |
| `useState` | Recordar datos que afectan a la pantalla |
| `useEffect` | Conectar y limpiar temporizadores y peticiones |
| Custom hook | Reutilizar esa lógica con un nombre |
| `useRef` | Acceder al input para enfocarlo |

Comprobamos esta demo con `npm run build` y pasamos a la segunda. El debounce queda fuera del recorrido principal; si lo mostramos, necesita limpiar tanto el timeout como la petición anterior.

Para ampliar: [useEffect](https://react.dev/reference/react/useEffect).

## Un cálculo, una función y una caja: no son lo mismo

Pasamos a `demos/02-memorizacion` y ejecutamos allí `npm install` y `npm start`. Tenemos 2.000 personas de prueba, un filtro y dos listas que muestran las primeras ocho coincidencias. Añadimos un contador que no tiene relación con los datos.

Abrimos la consola y pulsamos **Cambio ajeno al listado**. El componente padre se ejecuta otra vez. ¿Tiene sentido repetir la búsqueda si las personas y el filtro son los mismos?

### `useMemo`: conservar el resultado de un cálculo

```tsx
const visible = useMemo(() => {
  console.count("Calculamos el filtro");
  return people.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
}, [filter]);
```

`people` es un array constante definido fuera del componente. Si llegase por props o estado, también tendría que estar en las dependencias.

Cambiar el contador no repite el filtro; cambiar el texto, sí. La primera ejecución sigue teniendo que calcularlo. `useMemo` guarda un **resultado**, no convierte el cálculo en asíncrono ni hace más barato el primer render.

> Las llamadas a `console.count` son instrumentación de la demo. Con StrictMode podemos ver ejecuciones adicionales en desarrollo: comparamos qué interacción dispara el cálculo, no un número absoluto de renders.

### `useCallback`: conservar la identidad de una función

Los dos listados usan `memo`, que puede evitar ejecutar de nuevo un componente cuando sus props conservan la misma identidad. Uno recibe una función estable y el otro una nueva función en cada render:

```tsx
const selectPerson = useCallback((person: Person) => {
  setSelected(person.name);
}, []);

<Results title="Callback estable" people={visible} onSelect={selectPerson} />
<Results title="Callback nuevo" people={visible}
  onSelect={person => setSelected(person.name)} />
```

Pulsamos el contador. El segundo listado vuelve a ejecutarse: su callback es una referencia nueva. El primero puede reutilizar su resultado porque tanto el array como el callback siguen siendo los mismos.

`useCallback` **no ejecuta** la función ni impide llamar a un evento. Conserva la referencia que entregamos a otra pieza. Sin un consumidor que aproveche esa identidad, añadirlo no aporta automáticamente una mejora.

### Los casos que suelen engañar

| Cambio que hacemos en directo | Qué ocurre y por qué |
| --- | --- |
| Sustituimos `visible` por `people.filter(...)` al pasar la prop | Creamos otro array; `memo` ya no recibe las mismas props |
| Creamos `const options = { filter }` y lo usamos como dependencia | Es otro objeto en cada render; la memorización se invalida |
| Quitamos `filter` de las dependencias del cálculo | Los resultados se quedan antiguos; una optimización no puede romper la lógica |
| Leemos `selected` dentro del callback con `[]` | El callback conserva el valor de aquel render; hay que incluir la dependencia o usar una actualización funcional cuando proceda |
| Mutamos una persona sin cambiar la referencia del array | La identidad no revela el cambio; mantenemos las actualizaciones inmutables |

Probamos cada cambio por separado y recuperamos el ejemplo correcto. No memorizamos todo: primero medimos una interacción problemática con el Profiler. Guardar valores también tiene un coste. `memo` tampoco evita actualizaciones debidas al estado propio o al contexto del hijo.

## `useRef` también guarda datos, no solo nodos

En la parte inferior pulsamos **Incrementar ref** varias veces. El contador visible no cambia. Después pulsamos **Mostrar copia en estado** y aparece el valor acumulado.

```tsx
const clicks = useRef(0);
// Dentro del evento:
clicks.current += 1;
// En otro evento, copiamos a un estado que sí se muestra:
setSnapshot(clicks.current);
```

Una ref conserva una caja mutable entre renders. Es útil para un identificador de timeout o datos de una operación; si queremos que la interfaz reaccione al cambio, usamos estado.

La demo incluye un aviso diferido. Pulsamos **Programar aviso** y cambiamos el nombre antes de que pasen dos segundos. El mensaje compara el nombre que ve el closure con una ref sincronizada después del último commit:

```tsx
const latestName = useRef(name);
useEffect(() => { latestName.current = name; }, [name]);
```

La actualización de la ref ocurre en un efecto. No leemos ni escribimos estas refs durante el render. Tampoco usamos una ref para ocultar dependencias de un efecto: aquí queremos comparar expresamente dos comportamientos distintos.

El identificador del timeout vive en otra ref. Antes de programar uno nuevo cancelamos el anterior; al desmontar también lo limpiamos. Una ref no hace esa limpieza por nosotros.

| Herramienta | Conserva | Cambiarla provoca un render |
| --- | --- | --- |
| Estado | Datos de la interfaz | Solicita una actualización |
| `useMemo` | Resultado de un cálculo según dependencias | No por sí mismo |
| `useCallback` | Identidad de una función según dependencias | No por sí mismo |
| `useRef` | Una caja mutable | No |

## ¿Y React Compiler?

React Compiler automatiza parte de esta memorización durante la compilación. Lo comentamos después de los ejemplos para entender qué trabajo intenta ahorrarnos. No corrige efectos incorrectos ni convierte una mutación en una actualización válida.

**Estado comprobado el 10 de octubre de 2026:** React Compiler 1.0 es estable. La integración nativa basada en Rust está disponible mediante `oxc-transform-react` y `@vitejs/plugin-react` 6.1; la documentación de esa integración todavía la marca como experimental. Por tanto, no lo presentamos como un proyecto parado ni decimos que el soporte Rust aún no exista.

Fuentes: [React Compiler](https://react.dev/learn/react-compiler/introduction), [soporte de Oxc](https://oxc.rs/blog/2026-08-18-react-compiler-support) y [plugin oficial de Vite](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#react-compiler).

En las demos está **desactivado** para que la comparación manual sea visible. Si sobra tiempo, desde `demos/02-memorizacion` instalamos `npm install -D oxc-transform-react` y cambiamos `react()` por `react({ compiler: true })` en Vite. Es una ampliación, no un requisito de los proyectos entregados. Reiniciamos Vite y repetimos la comparación; los conteos pueden cambiar porque ahora otra herramienta está optimizando.

Para ampliar: [useMemo](https://react.dev/reference/react/useMemo), [useCallback](https://react.dev/reference/react/useCallback) y [useRef](https://react.dev/reference/react/useRef).

## Material de partida

Adaptamos los ejemplos de hooks 01–07, 12 y 14 y los de memorización. El ejemplo 12 trata actualizaciones funcionales; montaje, actualización y desmontaje se apoyan en 03–05.

[React en el máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react).
