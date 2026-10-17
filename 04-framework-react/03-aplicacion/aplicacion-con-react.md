# 03 · Una aplicación: rutas, componentes, Context y formularios

> ⏱️ 2 horas · Una primera aplicación con TanStack Router, preparada para enlazar después con TanStack Start.

## Cuatro momentos de la misma aplicación

Cada demo es un proyecto independiente. Entramos en su carpeta, ejecutamos `npm install` la primera vez y arrancamos con `npm start`.

| Demo                                     | Qué mostramos                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| [01-rutas](./demos/01-rutas)             | Listado con router preparado; añadimos la ruta de detalle y los enlaces          |
| [02-componentes](./demos/02-componentes) | Rutas completas, sin componentes extraídos ni Context; los construimos en clase  |
| [03-formulario](./demos/03-formulario)   | Componentes y Context terminados; construimos el formulario y la ruta de alta    |
| [04-css-modules](./demos/04-css-modules) | Comparación final preparada con CSS Modules, sin la ampliación de vista compacta |

Cada demo parte del bloque anterior completado, pero deja pendiente la novedad que vamos a explicar. Los hooks de lectura, los datos y la persistencia se entregan preparados. La variante CSS Modules es una comparación final opcional.

## Hasta ahora solo teníamos una pantalla

Podríamos mostrar el detalle con un booleano. Pero ¿cómo enviamos un enlace directo a Julia? ¿Qué debe pasar al pulsar Atrás?

Necesitamos una dirección por pantalla. Usaremos **TanStack Router** por su tipado y sus rutas por archivos, y porque esas ideas reaparecerán en la sesión de TanStack Start. Es una elección para este curso; no hace falta presentarlo como el único estándar del ecosistema.

Router resuelve navegación en esta SPA. No estamos configurando Start, SSR, acciones de servidor ni TanStack Query.

## Vamos a verlo: rutas que salen de los archivos

### Paso 0 · TanStack Router: reconocer la base preparada

En `demos/01-rutas/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
});
```

El plugin del router va **antes** que el de React. Observa `src/routes` y genera `src/routeTree.gen.ts`. Ese árbol es un resultado generado: no lo escribimos ni lo arreglamos a mano.

Las dependencias ya están incluidas. Para agregarlo a un proyecto nuevo necesitaríamos instalar `@tanstack/react-router` y, para desarrollo, `@tanstack/router-plugin`.

### Paso 1 · Rutas por archivos: añadir el detalle

La demo arranca con el listado y el router configurados, pero sin la ruta de detalle ni enlaces desde las tarjetas. La configuración y los hooks de lectura se entregan preparados para centrarnos en la navegación. Creamos src/routes/members/$memberId.tsx con este contenido; MemberDetail ya está preparado en screens.tsx:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { MemberDetail } from "../../screens";
export const Route = createFileRoute("/members/$memberId")({
  component: DetailPage,
});
function DetailPage() {
  const { memberId } = Route.useParams();
  return <MemberDetail key={memberId} id={memberId} />;
}
```

Con Vite arrancado, el plugin genera el árbol. La estructura resultante será:

```text
src/routes/
  __root.tsx
  index.tsx
  members/
    index.tsx
    $memberId.tsx
```

| Archivo                 | Papel                                |
| ----------------------- | ------------------------------------ |
| `__root.tsx`            | Marco común y hueco de la pantalla   |
| `index.tsx`             | Entrada `/`, que redirige al listado |
| `members/index.tsx`     | Listado `/members`                   |
| `members/$memberId.tsx` | Detalle `/members/1`, `/members/2`…  |

`$` señala un parámetro dinámico. El nombre `memberId` será también el nombre que TypeScript espera al construir el enlace.

Abrimos `members/index.tsx`:

```tsx
export const Route = createFileRoute("/members/")({
  component: MemberList,
});
```

La llamada vincula ese archivo con su ruta y su componente. El plugin mantiene esa relación al generar el árbol.

### Paso 2 · RouterProvider: entender el registro preparado

_./src/app.tsx_

```tsx
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}
```

La declaración `Register` conecta los tipos de **nuestro árbol** con las APIs del router. Así el editor conoce las direcciones y sus parámetros.

En la raíz tenemos `Link`, la navegación y un `Outlet`. Ese es el hueco donde se muestra la ruta hija. Una ruta desconocida muestra «Página no encontrada».

### Paso 3 · Link: un enlace que conoce su parámetro

En src/screens.tsx, dentro del listado, sustituimos el span que muestra el nombre por este enlace. Link ya está importado porque el detalle lo usa para volver:

```tsx
<Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
  {member.name}
</Link>
```

👉 Quitamos temporalmente `params` o escribimos `memberID`. TypeScript señala el problema. Recuperamos el nombre correcto.

Ya no construimos una cadena arbitraria para cada enlace. El patrón y sus parámetros forman un contrato comprobable. Ese tipado no demuestra que la persona exista en los datos: eso lo comprobará la lectura del detalle.

Navegamos y usamos Atrás y Adelante. Abrimos directamente `/members/2` y recargamos. La pantalla corresponde a la dirección.

### Paso 4 · useParams: leer el identificador del detalle

_./src/routes/members/$memberId.tsx_

```tsx
function DetailPage() {
  const { memberId } = Route.useParams();
  return <MemberDetail key={memberId} id={memberId} />;
}
```

Abrimos `/members/2`. El archivo `$memberId.tsx` define el nombre del parámetro y `Route.useParams()` nos entrega su valor: `memberId` es el texto `"2"`.

`DetailPage` pasa ese identificador a `MemberDetail` mediante la prop `id`. Hasta aquí solo hemos leído la dirección: **el router no ha buscado a la persona**.

### Del identificador a los datos de la persona

Seguimos el recorrido abriendo `src/screens.tsx`. Al principio de `MemberDetail` encontramos:

```tsx
const { member, loading, error } = useMember(id);
```

El componente pide los datos de la persona cuyo identificador acaba de recibir. `useMember` es un custom hook que ya viene preparado con el patrón de la sesión anterior: estado, efecto y limpieza.

Abrimos `src/hooks.ts` y localizamos `useMember`. Su efecto llama a `getMember(id, controller.signal)`. Mientras espera, mantiene `loading` a `true`; cuando llega la respuesta, guarda la persona y termina la carga. Si falla, guarda un mensaje en `error`.

Por último, abrimos `src/api.ts`. `getMember` lee la lista mediante `getMembers` y busca la persona por su identificador:

```tsx
const members = await getMembers(signal);
return members.find((member) => member.id === Number(id)) ?? null;
```

En esta demo, `getMembers` hace un `fetch` a `/members.json`, el archivo que Vite sirve desde `public/members.json`. No tenemos un servidor que consulte una base de datos: descargamos la lista y buscamos en ella. Convertimos `id` a número porque llega como texto desde la URL, mientras que el JSON contiene identificadores numéricos.

El recorrido completo es:

```text
/members/2
  → DetailPage lee "2" de la URL
  → MemberDetail recibe id="2"
  → useMember("2") gestiona la carga
  → getMember busca en los datos de members.json
  → MemberDetail muestra el resultado
```

### Qué mostramos mientras esperamos y cuando termina

Volvemos al JSX de `MemberDetail`, en `src/screens.tsx`, y localizamos sus condiciones:

- Si `loading` es `true`, mostramos «Cargando…».
- Si hay `error`, mostramos el mensaje del fallo.
- Si la lectura termina sin error pero no hay `member`, mostramos «Persona no encontrada».
- Si tenemos la persona, mostramos su nombre, puesto y correo.

Probamos `/members/999`. La dirección encaja con la ruta, pero no existe esa persona en el JSON. Por eso vemos «Persona no encontrada» y no un error de navegación.

Nos queda un detalle de la llamada inicial: `key={memberId}`. Al pasar de una persona a otra, esa clave cambia y React monta una nueva instancia de `MemberDetail`, con su estado inicial de carga. Así no conservamos en pantalla los datos de la persona anterior mientras empieza la nueva lectura.

## Volvemos al listado: filtrar los datos ya cargados

Entramos en `/members` y abrimos `MemberList`, también en `src/screens.tsx`. Aquí usamos `useMembers()` para cargar la lista completa. Una vez recibida, el campo de búsqueda filtra ese array:

```tsx
const visible = members.filter((member) =>
  member.name.toLowerCase().includes(filter.toLowerCase()),
);
```

No necesitamos otro estado ni un efecto para `visible`. Con Network abierto, cambiar el filtro no provoca otra petición.

Probamos un nombre que exista y después `zzzz`. En el segundo caso mostramos «Sin resultados»: tenemos datos, pero ninguno coincide con el filtro. El listado también contempla la carga y los errores de la petición inicial.

> TanStack Router ofrece otras formas de cargar datos, como los loaders. En esta sesión mantenemos los hooks que ya conocemos para centrarnos en las rutas. Retomaremos esas alternativas al trabajar con TanStack Start.

Hasta aquí, la aplicación funciona. **Ahora tiene sentido decidir qué partes merecen un componente.**

## La componentizamos: aquí encaja Tailwind

Pasamos a demos/02-componentes. Contiene el resultado de rutas, pero las tarjetas y los mensajes siguen dentro de src/pages/screens.tsx. Todavía no hay componentes extraídos ni Context. Primero reorganizamos sin cambiar el comportamiento; después añadimos una preferencia de vista.

### Paso 5: la tarjeta se lleva su estructura y sus clases

Creamos src/components/member-card.tsx. Añadimos los imports de Link y Member y movemos el contenido de la tarjeta:

```tsx
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";

export function MemberCard({ member }: { member: Member }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      <p>{member.role}</p>
    </li>
  );
}
```

En src/pages/screens.tsx importamos MemberCard desde ../components/member-card y sustituimos todo el li del map. El listado queda así:

```diff
{
  visible.map((member) => <MemberCard key={member.id} member={member} />)
}
```

Cambiamos `p-4` por `p-6` en la tarjeta. Todas las filas cambian a la vez.

👉 Las clases no se han ido a un catálogo de cadenas ni se repiten en cada pantalla: **viajan con el componente que reutilizamos**. Esta es una de las formas de trabajar con Tailwind en React.

La cuadrícula sigue en el listado: decide cómo se distribuyen las tarjetas, no cómo es una tarjeta por dentro. También extraemos los mensajes de carga y error porque aparecen en ambas pantallas.

Creamos también src/components/request-status.tsx:

```tsx
export function Loading() {
  return <p role="status">Cargando…</p>;
}
export function ErrorMessage({ message }: { message: string }) {
  return <p role="alert">{message}</p>;
}
```

En src/pages/screens.tsx importamos Loading y ErrorMessage desde ../components/request-status. En ambas pantallas sustituimos el párrafo de carga por `<Loading />` y el de error por `<ErrorMessage message={error} />`.

No extraemos cada `div`. Buscamos piezas con un nombre y una responsabilidad reconocibles.

## Context y `useContext`: compartir una preferencia de vista

### Paso 5A · Props: pasar la preferencia por el listado

Queremos alternar entre tarjetas completas y compactas. Primero lo resolvemos con props. En `MemberList`, dentro de `src/pages/screens.tsx`, añadimos:

```tsx
const [compact, setCompact] = useState(false);
```

Después del título del listado añadimos:

```tsx
<button
  onClick={() => setCompact((previous) => !previous)}
  aria-pressed={compact}
>
  Vista compacta
</button>
```

En `src/components/member-card.tsx`, añadimos la prop `compact` y la usamos para decidir el espacio y si mostramos el puesto:

```tsx
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";

export function MemberCard({
  member,
  compact,
}: {
  member: Member;
  compact: boolean;
}) {
  return (
    <li
      className={
        compact
          ? "rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      }
    >
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      {!compact && <p>{member.role}</p>}
    </li>
  );
}
```

Creamos `src/components/member-grid.tsx` para extraer la cuadrícula:

```tsx
import type { Member } from "../model";
import { MemberCard } from "./member-card";

export function MemberGrid({
  members,
  compact,
}: {
  members: Member[];
  compact: boolean;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} compact={compact} />
      ))}
    </ul>
  );
}
```

En `src/pages/screens.tsx`, cambiamos el import de `MemberCard` por `MemberGrid` desde `../components/member-grid`. Sustituimos todo el `<ul>` del listado por:

```tsx
<MemberGrid members={visible} compact={compact} />
```

Pulsamos el botón: las tarjetas cambian. **Esta solución con props es válida.** La cuadrícula recibe `compact`, pero solo lo entrega a las tarjetas. Este paso intermedio nos permite mostrar qué resuelve Context cuando hay más niveles o más consumidores.

```text
MemberList (estado compact) → MemberGrid (lo pasa) → MemberCard (lo utiliza)
```

### Paso 5B · `createContext` y Provider: ofrecer el valor

Creamos `src/compact-context.ts`:

```tsx
import { createContext } from "react";

interface ViewContextValue {
  compact: boolean;
  toggleCompact: () => void;
}

export const ViewContext = createContext<ViewContextValue | null>(null);
```

`ViewContextValue` define el contrato: compartimos un objeto con la preferencia `compact` y una función `toggleCompact` para cambiarla. TypeScript comprueba tanto el valor que ofrece el provider como lo que leen los consumidores.

El respaldo `null` indica que falta un provider. Al consumir el contexto comprobaremos ese caso antes de acceder al objeto. No ponemos una función vacía de respaldo: podría ocultar que hemos colocado el componente fuera del provider.

Creamos también `src/view-provider.tsx`. Aquí dejamos el estado y la acción, separados de la pantalla:

```tsx
import { useState, type ReactNode } from "react";
import { ViewContext } from "./compact-context";

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const [compact, setCompact] = useState(false);

  function toggleCompact() {
    setCompact((previous) => !previous);
  }

  return (
    <ViewContext.Provider value={{ compact, toggleCompact }}>
      {children}
    </ViewContext.Provider>
  );
}
```

`children` representa el contenido que envolvemos. `ViewProvider` conserva el estado y ofrece el objeto tipado a ese contenido. Declaramos este componente fuera de `MemberList`, en su propio archivo.

Usamos `.Provider` para reconocer el concepto. El contexto define qué compartimos; `ViewProvider` gestiona el estado y lo ofrece mediante `value`. React 19 también permite escribir `<ViewContext value={...}>`.

En los pasos 5C y 5D adaptamos los consumidores y conectamos este provider en `MemberList`. Completamos esos cambios antes de probar la vista compacta, para no mezclar el estado anterior con el nuevo.

### Paso 5C · `useContext`: leer el valor en la tarjeta

Sustituimos `src/components/member-card.tsx` por:

```tsx
import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
import { ViewContext } from "../compact-context";

export function MemberCard({ member }: { member: Member }) {
  const view = useContext(ViewContext);
  if (view === null)
    throw new Error("MemberCard necesita un ViewContext.Provider.");
  const { compact } = view;
  return (
    <li
      className={
        compact
          ? "rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      }
    >
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      {!compact && <p>{member.role}</p>}
    </li>
  );
}
```

Quitamos ahora la prop `compact` de `MemberGrid` y de la llamada que hace a `MemberCard`. El archivo `src/components/member-grid.tsx` queda:

```tsx
import type { Member } from "../model";
import { MemberCard } from "./member-card";

export function MemberGrid({ members }: { members: Member[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </ul>
  );
}
```

En `MemberList`, la llamada queda `<MemberGrid members={visible} />`. A continuación adaptamos el botón y conectamos `ViewProvider`.

### Paso 5D · Context: un consumidor que cambia la preferencia

La tarjeta solo necesita leer `compact`. Ahora extraemos el botón a `src/components/view-toggle.tsx` para que otro componente utilice también la acción:

```tsx
import { useContext } from "react";
import { ViewContext } from "../compact-context";

export function ViewToggle() {
  const view = useContext(ViewContext);
  if (view === null)
    throw new Error("ViewToggle necesita un ViewContext.Provider.");
  const { compact, toggleCompact } = view;

  return (
    <button onClick={toggleCompact} aria-pressed={compact}>
      Vista compacta
    </button>
  );
}
```

En `src/pages/screens.tsx` importamos `ViewToggle` desde `../components/view-toggle`. Sustituimos el botón por `<ViewToggle />`. Lo envolveremos con el provider al completar este paso. Ya no le pasamos props: obtiene del contexto el valor y la acción.

La comprobación de `null` permite detectar un provider ausente y que TypeScript sepa que, a partir de ahí, tenemos un `ViewContextValue`. `useContext` debe seguir llamándose antes de cualquier retorno condicional.

Para conectar el provider que creamos en el paso 5B, añadimos este import en `src/pages/screens.tsx`:

```tsx
import { ViewProvider } from "../view-provider";
```

Quitamos de `MemberList` el estado `compact` del paso 5A y sustituimos su fragmento exterior `<>...</>` por `<ViewProvider>...</ViewProvider>`. Conservamos el estado del filtro y los hooks de lectura; `useState` sigue siendo necesario en este archivo. Su JSX queda:

```tsx
return (
  <ViewProvider>
    <h1>Equipo</h1>
    <ViewToggle />
    <label htmlFor="filter">Buscar por nombre</label>
    <input
      id="filter"
      value={filter}
      onChange={(event) => setFilter(event.target.value)}
    />
    {loading ? (
      <Loading />
    ) : error ? (
      <ErrorMessage message={error} />
    ) : visible.length === 0 ? (
      <p>Sin resultados.</p>
    ) : (
      <MemberGrid members={visible} />
    )}
  </ViewProvider>
);
```

Volvemos a pulsar: el resultado es el mismo, pero la cuadrícula ya no transporta esa preferencia. `useContext` lee el valor del provider más cercano por encima del componente. Cuando cambia ese valor, React actualiza los componentes que lo consumen.

Solo usamos `ViewProvider` en el listado. `ViewToggle` y `MemberCard` siguen consumiendo el mismo contexto sin cambios; el detalle queda fuera de este provider.

```text
MemberList
└── ViewProvider (estado y acción)
    ├── ViewToggle (lee el valor y ejecuta la acción)
    └── MemberGrid
        └── MemberCard (lee el valor)
```

👉 **¿Dónde está ahora el estado?** En el `useState` de `ViewProvider`. Context distribuye el valor, no sustituye al estado ni guarda datos en `localStorage`.

Al salir del listado y volver, se monta otra instancia y la preferencia vuelve a su valor inicial. Para conservarla durante la navegación tendríamos que situar el estado y el provider en un antecesor que permanezca montado, por ejemplo el layout.

Retomamos `RouterProvider`: también ofrece información a componentes descendientes, en este caso para que funcionen la navegación y los enlaces. En la ampliación de React Query, `QueryClientProvider` hace accesible su cliente.

Las props siguen siendo la opción más directa para datos como `member`. Context resulta útil para valores que necesitan varios descendientes, como preferencias o información de sesión. No convertimos todos los datos en contexto.

## Ahora vamos a añadir personas

Pasamos a demos/03-formulario. El listado, el detalle, los componentes y la preferencia con Context ya están preparados como resultado del bloque anterior. No hay formulario ni ruta de alta: los añadimos ahora. Las dependencias de TanStack Form y Zod, el esquema y las funciones de persistencia están incluidos para centrarnos en conectar el formulario.

`new` es un segmento estático; el router lo distingue de `$memberId`. No se interpreta como el identificador de una persona.

### Paso 6: quién guarda el valor de cada campo

Con tres inputs podríamos usar tres estados. Pero también queremos saber si se han tocado, si son válidos y si se está enviando el formulario.

TanStack Form organiza ese estado. Zod describe las reglas:

_./src/member.schema.ts_

```ts
import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().trim().min(2, "El nombre necesita al menos dos caracteres."),
  role: z
    .string()
    .trim()
    .min(2, "Indica un puesto de al menos dos caracteres."),
  email: z.email("Introduce un correo válido."),
});
```

`trim()` evita que dos espacios cuenten como un nombre válido. Esto es validación de datos en ejecución, algo que una interfaz TypeScript no hace.

### Paso 7: conectar Form y Zod

Vamos a crear el componente, conectarlo con la ruta y añadir sus campos. Trabajamos en `demos/03-formulario`.

#### 7A · Crear `MemberForm`: imports, props y envío

Creamos **`src/member-form.tsx`** con este contenido inicial. Todavía no tiene inputs: los añadiremos en el punto 7C, dentro del `<form>`.

`onSave` es una **prop que recibe una función**. El formulario le entregará los datos cuando sean válidos. En el siguiente punto escribiremos la pantalla que proporciona esa función y decide cómo guardar y adónde navegar.

`MemberInput` ya está definido en `src/model.ts`: contiene `name`, `role` y `email`, sin el identificador. `initialValues` permite recibir valores iniciales; para añadir una persona usamos los valores vacíos por defecto.

```tsx
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { memberSchema } from "./member.schema";
import type { MemberInput } from "./model";
interface Props {
  initialValues?: MemberInput;
  onSave: (values: MemberInput) => Promise<void>;
}
const emptyValues: MemberInput = { name: "", role: "", email: "" };
export function MemberForm({ initialValues = emptyValues, onSave }: Props) {
  const [saveError, setSaveError] = useState("");
  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: memberSchema, onSubmit: memberSchema },
    onSubmit: async ({ value }) => {
      setSaveError("");
      try {
        await onSave(value);
      } catch {
        setSaveError(
          "No se ha podido guardar. Los datos siguen en el formulario.",
        );
      }
    },
  });
  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      {/* Aquí añadiremos los campos. */}
      {saveError && <p role="alert">{saveError}</p>}
      <button type="submit">Guardar persona</button>
    </form>
  );
}
```

`useForm` organiza los valores y el envío. En `validators` conectamos el esquema del paso 6: validamos al cambiar los datos y al enviar. Zod se integra directamente mediante Standard Schema, sin añadir un adaptador.

Tenemos dos `onSubmit` con responsabilidades distintas:

- El del `<form>` HTML evita la recarga con `preventDefault()` y llama a `form.handleSubmit()`.
- El de `useForm` se ejecuta si la validación permite el envío. Recibe los valores y llama a la prop `onSave`. Si guardar falla, mostramos `saveError` y conservamos los datos.

El atributo `noValidate` desactiva la validación nativa del navegador para poder mostrar los mensajes de Zod.

#### 7B · Crear la ruta que proporciona `onSave`

Creamos **`src/routes/members/new.tsx`** con este contenido:

```tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MemberForm } from "../../member-form";
import { saveMember } from "../../api";
export const Route = createFileRoute("/members/new")({ component: NewMember });
function NewMember() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Añadir persona</h1>
      <Link to="/members">Cancelar</Link>
      <MemberForm
        onSave={async (values) => {
          const member = await saveMember(values);
          await navigate({
            to: "/members/$memberId",
            params: { memberId: String(member.id) },
          });
        }}
      />
    </>
  );
}
```

Aquí vemos de dónde sale `onSave`: pasamos una función que llama a `saveMember`, ya disponible en `src/api.ts`, y después navega al detalle de la persona creada. `MemberForm` no necesita conocer la API ni las rutas.

En **`src/routes/__root.tsx`**, dentro del `<nav>` existente, añadimos:

```tsx
<Link to="/members/new">Añadir persona</Link>
```

Con Vite en marcha se regenera el árbol de rutas. Entramos en «Añadir persona»: veremos el título, «Cancelar» y el botón de guardar. Aún faltan los campos, así que todavía no probamos el alta.

#### 7C · Añadir el primer `form.Field` dentro del formulario

Volvemos a **`src/member-form.tsx`**. Dentro del `return`, sustituimos **solo** el comentario `{/* Aquí añadiremos los campos. */}` por este bloque. Queda dentro del `<form>`, antes de `saveError` y del botón:

```tsx
<form.Field name="name">
  {(field) => (
    <div className="grid gap-1">
      <label htmlFor={field.name}>Nombre</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    </div>
  )}
</form.Field>
```

`form.Field` pertenece al formulario creado con `useForm`. Su `name="name"` lo conecta con la propiedad `name` de `defaultValues`.

Dentro escribimos una función que recibe `field` y devuelve el JSX del campo. `field.state.value` es su valor actual; `field.handleChange` lo actualiza y `field.handleBlur` registra que hemos salido del input.

Comprobamos que podemos escribir en Nombre. Todavía no podemos completar el alta: el esquema también exige puesto y correo, y aún no mostramos los errores.

#### 7D · Añadir puesto, correo y mensajes de validación

Seguimos en **`src/member-form.tsx`**. Los tres campos comparten estructura, así que vamos a describir sus diferencias en una lista.

Añadimos esta constante **fuera del componente**, después de `emptyValues` y antes de `export function MemberForm`:

```tsx
const fields = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "role", label: "Puesto", type: "text" },
  { name: "email", label: "Correo", type: "email" },
] as const;
```

`as const` conserva los nombres literales (`"name"`, `"role"` y `"email"`), para que TypeScript compruebe que son campos del formulario.

Ahora **sustituimos el bloque `<form.Field name="name">...</form.Field>` del punto 7C** por este `map`. No añadimos otro `<form>`: seguimos dentro del que ya tenemos, antes de `saveError` y del botón.

```tsx
{
  fields.map((config) => (
    <form.Field key={config.name} name={config.name}>
      {(field) => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <div className="grid gap-1">
            <label htmlFor={field.name}>{config.label}</label>
            <input
              id={field.name}
              name={field.name}
              type={config.type}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={invalid}
              aria-describedby={invalid ? `${field.name}-error` : undefined}
            />
            {invalid && (
              <p id={`${field.name}-error`} role="alert">
                {field.state.meta.errors
                  .map((error) => error?.message)
                  .join(" ")}
              </p>
            )}
          </div>
        );
      }}
    </form.Field>
  ));
}
```

Cada `form.Field` controla uno de los tres valores. Mostramos el error cuando el campo está tocado y no es válido. Los errores de Zod son objetos: usamos su propiedad `message` para mostrar el texto.

`aria-invalid` indica que el valor es incorrecto y `aria-describedby` relaciona el input con su mensaje de error.

Probamos a escribir un nombre de una letra y salir del campo: aparece su error. Al corregirlo, desaparece. Repetimos con un correo incorrecto.

### Paso 8: desactivar el botón mientras guardamos

El envío ya está conectado en el punto 7A. Ahora evitamos que se vuelva a pulsar el botón mientras `onSave` está pendiente.

En **`src/member-form.tsx`**, sustituimos únicamente `<button type="submit">Guardar persona</button>` por:

```tsx
<form.Subscribe selector={(state) => state.isSubmitting}>
  {(isSubmitting) => (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Guardando…" : "Guardar persona"}
    </button>
  )}
</form.Subscribe>
```

`form.Subscribe` observa `isSubmitting` y actualiza el botón cuando cambia. No necesitamos copiar ese dato a otro `useState`. Como el `onSubmit` de `useForm` espera a `onSave`, el estado de envío dura hasta que termina esa operación. En esta demo el guardado local puede ser tan rápido que apenas veamos «Guardando…».

El orden final dentro del `<form>` es: los tres campos generados por `fields.map`, el mensaje `saveError` y el botón dentro de `form.Subscribe`.

Probamos nombre vacío, espacios y correo incorrecto: no navegamos ni añadimos una fila. Después introducimos datos válidos: aparece el nuevo detalle y la persona está en el listado.

### ¿Dónde estamos guardando?

`saveMember` combina los datos iniciales con cambios en `localStorage`. Cada demo tiene una clave distinta. Al recargar, la persona sigue ahí; en otro navegador no aparecerá.

No escribimos en el JSON ni simulamos una respuesta de un servidor. Es una persistencia local para la clase. Podemos borrar la clave de esa demo desde Application → Local Storage para recuperar los datos iniciales.

TanStack Form valida con Zod, pero no entrega automáticamente el resultado transformado del esquema. Por eso `saveMember` usa `memberSchema.parse(input)`: el nombre guardado queda sin espacios externos.

Si falla la lectura inicial o el almacenamiento, mostramos el error y conservamos los campos. La validación del cliente tampoco sustituiría la del servidor en una aplicación real.

## Solo si hay tiempo: la misma aplicación con CSS Modules

Tenemos preparada `demos/04-css-modules`, con las mismas rutas, el mismo formulario y las mismas validaciones. No depende de Tailwind. Cada componente importa su propio archivo `.module.css`.

Desde la carpeta de esta demo ejecutamos `npm install` si todavía no hemos instalado sus dependencias y arrancamos:

```bash
npm start
```

### Paso 1 · Relacionar el componente con su archivo de estilos

Empezamos por la tarjeta. Abrimos juntos estos dos archivos:

- `src/components/member-card.tsx`: el JSX de la tarjeta.
- `src/components/member-card.module.css`: sus estilos.

En `member-card.tsx` encontramos:

```tsx
import styles from "./member-card.module.css";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";

export function MemberCard({ member }: { member: Member }) {
  return (
    <li className={styles.card}>
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      <p>{member.role}</p>
    </li>
  );
}
```

En `member-card.module.css`, la clase empieza así:

```css
.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 1px 2px #0000000d;
}
```

El nombre `.module.css` indica a Vite que ese archivo es un módulo CSS. Al importarlo, `styles` contiene un mapa de nombres: `styles.card` devuelve el nombre de clase generado para nuestra `.card`. Ese es el valor que ponemos en `className`.

No necesitamos una clase contenedora para activar el módulo ni instalar otro plugin.

### Paso 2 · Ver qué aporta la clase en el navegador

La demo está terminada para poder compararla con Tailwind. Para mostrar cómo se aplica el estilo, quitamos temporalmente `className={styles.card}` del `<li>` y observamos el resultado. La tarjeta pierde su fondo, borde y espaciado; la lista y la navegación conservan sus estilos.

Volvemos a poner `className={styles.card}`. Después cambiamos el `padding` de `.card` a `1.5rem`: todas las tarjetas cambian porque todas usan `MemberCard`.

Inspeccionamos una tarjeta en DevTools. La clase del HTML tiene un nombre generado, en lugar de llamarse simplemente `card`. Otro archivo `.module.css` puede definir su propia `.card` sin compartir esta clase.

Los selectores `.card > a` y `.card > p` del mismo archivo dan estilo al enlace y al texto de la tarjeta. CSS Modules hace locales los nombres de clase.

### Paso 3 · Localizar los estilos de cada componente

Seguimos la misma organización en el resto de la demo:

| Componente                                | Archivo de estilos situado a su lado |
| ----------------------------------------- | ------------------------------------ |
| `components/member-card.tsx`              | `member-card.module.css`             |
| `components/request-status.tsx`           | `request-status.module.css`          |
| `pages/member-list.tsx`                   | `member-list.module.css`             |
| `pages/member-detail.tsx`                 | `member-detail.module.css`           |
| `member-form.tsx`                         | `member-form.module.css`             |
| `routes/__root.tsx` (componente `Layout`) | `layout.module.css`                  |

Abrimos `member-form.tsx`: importa `./member-form.module.css` y aplica `styles.form` al formulario y `styles.field` al contenedor de cada campo. Sus reglas de inputs y botones están dentro de `.form`, de modo que no afectan al filtro del listado.

`layout.module.css` organiza el ancho de la página y la navegación. Su clase `container` es solo un nombre elegido para ese contenedor; no activa los estilos de los otros componentes.

En `styles.css` dejamos la base compartida: tipografía, fondo, títulos, enlaces y foco visible. Los estilos de tarjetas, campos, mensajes y pantallas están en sus respectivos módulos.

Con Tailwind cambiábamos las utilidades en el JSX. Aquí cambiamos reglas CSS en el archivo del componente. En ambos casos, reutilizar `MemberCard` permite mantener todas las tarjetas con la misma apariencia.

## Para ampliar

Para repasar la sesión, podemos consultar estos recursos de la documentación oficial siguiendo el recorrido de la aplicación. La documentación de React está en español; la de TanStack, Zod y Vite, en inglés.

1. [Rutas por archivos en TanStack Router](https://tanstack.com/router/latest/docs/routing/file-based-routing): cómo se relacionan las carpetas y los archivos con las direcciones de la aplicación. Útil para repasar el listado, el detalle y la ruta de alta.
2. [Navegación en TanStack Router](https://tanstack.com/router/latest/docs/guide/navigation): cómo navegar con `Link` y desde código, como hacemos después de guardar una persona.
3. [Pasar datos en profundidad con Context](https://es.react.dev/learn/passing-data-deeply-with-context): cuándo tiene sentido compartir información sin pasarla por cada componente intermedio. Podemos relacionarlo con la preferencia de vista compacta y su provider.
4. [Inicio de TanStack Form](https://tanstack.com/form/latest/docs/framework/react/quick-start): repaso de `useForm`, los campos y el envío. Un punto de apoyo para reconstruir el formulario paso a paso.
5. [Validación en TanStack Form](https://tanstack.com/form/latest/docs/framework/react/guides/validation): cuándo validar y cómo mostrar los errores. Para profundizar en las opciones `onChange` y `onSubmit` que usamos en clase.
6. [Primeros pasos con Zod](https://zod.dev/basics): cómo definir un esquema y comprobar datos con `parse` y `safeParse`. Ayuda a distinguir el tipado de TypeScript de la validación durante la ejecución.
7. [CSS Modules en Vite](https://vite.dev/guide/features#css-modules): cómo importar un archivo `.module.css` y utilizar sus clases en un componente. Para repasar la alternativa a Tailwind de la última demo.

Si queremos montar las rutas desde un proyecto Vite nuevo, podemos seguir también la [instalación de TanStack Router con Vite](https://tanstack.com/router/latest/docs/installation/with-vite). En nuestras demos esa configuración ya estaba preparada.

También encontramos más ejemplos en el [bloque de React del máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react). Su recorrido es más amplio que el de esta sesión; podemos consultarlo como material complementario.
