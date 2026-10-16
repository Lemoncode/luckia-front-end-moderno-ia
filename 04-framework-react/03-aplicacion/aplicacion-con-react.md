# 03 · Una aplicación: rutas, componentes, Context y formularios

> ⏱️ 2 horas · Una primera aplicación con TanStack Router, preparada para enlazar después con TanStack Start.

## Antes de la clase

Partimos de componentes, estado, efectos y custom hooks. Usamos Node 22.12 o superior y una instalación independiente por demo. Las lecturas usan JSON local servido por Vite; filtramos la lista ya cargada.

## Recorrido de la sesión · 120 minutos

| Minutos | Explicación |
| --- | --- |
| 0–10 | URLs y alcance: Router ahora, Start después |
| 10–30 | Archivos, generación y tipado de las rutas |
| 30–40 | Lista, detalle y estados de petición preparados |
| 40–45 | Pausa |
| 45–60 | Extracción de componentes y Tailwind |
| 60–80 | Props, Context, provider y useContext |
| 80–110 | TanStack Form, Zod y alta |
| 110–115 | Validaciones y persistencia preparada |
| 115–120 | Recapitulación |

CSS Modules queda preparado **solo si hay tiempo**. No sumamos otra práctica obligatoria a las dos horas: podemos mostrar brevemente la comparación o reservarla para otra ocasión.

## Cuatro momentos de la misma aplicación

Cada demo es un proyecto independiente. Entramos en su carpeta, ejecutamos `npm install` la primera vez y arrancamos con `npm start`.

| Demo | Qué mostramos |
| --- | --- |
| [01-rutas](./demos/01-rutas) | Listado con router preparado; añadimos la ruta de detalle y los enlaces |
| [02-componentes](./demos/02-componentes) | Rutas completas, sin componentes extraídos ni Context; los construimos en clase |
| [03-formulario](./demos/03-formulario) | Componentes y Context terminados; construimos el formulario y la ruta de alta |
| [04-css-modules](./demos/04-css-modules) | Comparación final preparada con CSS Modules, sin la ampliación de vista compacta |

Cada demo parte del bloque anterior completado, pero deja pendiente la novedad que vamos a explicar. Los hooks de lectura, los datos y la persistencia se entregan preparados. La variante CSS Modules es una comparación final opcional, no otro ejercicio obligatorio.

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

Las dependencias ya están incluidas. Al partir de otro proyecto necesitaríamos `@tanstack/react-router` y, para desarrollo, `@tanstack/router-plugin`.

### Paso 1 · Rutas por archivos: añadir el detalle

La demo arranca con el listado y el router configurados, pero sin la ruta de detalle ni enlaces desde las tarjetas. La configuración y los hooks de lectura se entregan preparados para centrarnos en la navegación. Creamos src/routes/members/$memberId.tsx con este contenido; MemberDetail ya está preparado en screens.tsx:
~~~tsx
import { createFileRoute } from "@tanstack/react-router";
import { MemberDetail } from "../../screens";
export const Route = createFileRoute("/members/$memberId")({ component: DetailPage });
function DetailPage() {
  const { memberId } = Route.useParams();
  return <MemberDetail key={memberId} id={memberId} />;
}
~~~

Con Vite arrancado, el plugin genera el árbol. La estructura resultante será:

```text
src/routes/
  __root.tsx
  index.tsx
  members/
    index.tsx
    $memberId.tsx
```

| Archivo | Papel |
| --- | --- |
| `__root.tsx` | Marco común y hueco de la pantalla |
| `index.tsx` | Entrada `/`, que redirige al listado |
| `members/index.tsx` | Listado `/members` |
| `members/$memberId.tsx` | Detalle `/members/1`, `/members/2`… |

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
<Link
  to="/members/$memberId"
  params={{ memberId: String(member.id) }}
>
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

`Route.useParams()` conoce los parámetros de ese archivo. La `key` reinicia el estado de la pantalla cuando cambia la persona para no mostrar momentáneamente el detalle anterior.

Dentro de `MemberDetail` usamos `useMember(id)`, que ya sigue el patrón de estado, efecto y limpieza de la sesión de hooks.

**TanStack Router también dispone de loaders y otras herramientas de carga.** Aquí conservamos los hooks para introducir una sola novedad: navegación y tipado. La integración de cargas, caché y servidor queda para Start.

## Datos y estados de la pantalla

La lista inicial sale de `public/members.json`. Las funciones de `api.ts` la leen por HTTP y buscan el detalle por identificador. Es una simplificación local, no una API de producción.

El listado filtra en memoria:

```tsx
const visible = members.filter(member =>
  member.name.toLowerCase().includes(filter.toLowerCase())
);
```

No necesitamos otro estado ni un efecto para `visible`. Con Network abierto, cambiar el filtro no provoca otra petición.

Mostramos carga, error, vacío y resultados. `/members/999` muestra «Persona no encontrada»: el patrón de ruta existe, pero ese dato no.

Hasta aquí, la aplicación funciona. **Ahora tiene sentido decidir qué partes merecen un componente.**

## La componentizamos: aquí encaja Tailwind

Pasamos a demos/02-componentes. Contiene el resultado de rutas, pero las tarjetas y los mensajes siguen dentro de src/pages/screens.tsx. Todavía no hay componentes extraídos ni Context. Primero reorganizamos sin cambiar el comportamiento; después añadimos una preferencia de vista.

### Paso 5: la tarjeta se lleva su estructura y sus clases

Creamos src/components/member-card.tsx. Añadimos los imports de Link y Member y movemos el contenido de la tarjeta:
~~~tsx
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
~~~


```tsx
export function MemberCard({ member }: { member: Member }) {
  return (
    <li className="rounded bg-white p-4 shadow-sm">
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      <p>{member.role}</p>
    </li>
  );
}
```

En src/pages/screens.tsx importamos MemberCard desde ../components/member-card y sustituimos todo el li del map. El listado queda así:

```tsx
{visible.map(member => (
  <MemberCard key={member.id} member={member} />
))}
```

Cambiamos `p-4` por `p-6` en la tarjeta. Todas las filas cambian a la vez.

👉 Las clases no se han ido a un catálogo de cadenas ni se repiten en cada pantalla: **viajan con el componente que reutilizamos**. Esta es una de las formas de trabajar con Tailwind en React.

La cuadrícula sigue en el listado: decide cómo se distribuyen las tarjetas, no cómo es una tarjeta por dentro. También extraemos los mensajes de carga y error porque aparecen en ambas pantallas.

Creamos también src/components/request-status.tsx:
~~~tsx
export function Loading() { return <p role="status">Cargando…</p>; }
export function ErrorMessage({ message }: { message: string }) { return <p role="alert">{message}</p>; }
~~~

En src/pages/screens.tsx importamos Loading y ErrorMessage desde ../components/request-status. En ambas pantallas sustituimos el párrafo de carga por `<Loading />` y el de error por `<ErrorMessage message={error} />`.

No extraemos cada `div`. Buscamos piezas con un nombre y una responsabilidad reconocibles.

## Context y `useContext`: compartir una preferencia de vista

> ⏱️ 15–20 minutos. Seguimos en `demos/02-componentes`, sobre los componentes que acabamos de extraer.

### Paso 5A · Props: pasar la preferencia por el listado

Queremos alternar entre tarjetas completas y compactas. Primero lo resolvemos con props. En `MemberList`, dentro de `src/pages/screens.tsx`, añadimos:

```tsx
const [compact, setCompact] = useState(false);
```

Después del título del listado añadimos:

```tsx
<button onClick={() => setCompact((previous) => !previous)} aria-pressed={compact}>
  Vista compacta
</button>
```

En `src/components/member-card.tsx`, añadimos la prop `compact` y la usamos para decidir el espacio y si mostramos el puesto:

```tsx
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";

export function MemberCard({ member, compact }: { member: Member; compact: boolean }) {
  return (
    <li className={compact ? "rounded bg-white p-2 shadow-sm" : "rounded bg-white p-4 shadow-sm"}>
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

export function MemberGrid({ members, compact }: { members: Member[]; compact: boolean }) {
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

export const CompactContext = createContext(false);
```

`createContext` crea el contexto. `false` es el valor de respaldo para un componente que lo lea sin tener un provider por encima; no crea un estado.

En `src/pages/screens.tsx`, importamos `CompactContext` desde `../compact-context`. Solo en `MemberList`, sustituimos el fragmento exterior `<>...</>` por:

```tsx
return (
  <CompactContext.Provider value={compact}>
    {/* Aquí mantenemos el título, el botón, el filtro y los resultados. */}
  </CompactContext.Provider>
);
```

El comentario indica dónde conservar el JSX existente, no sustituirlo. El provider ofrece `compact` a sus descendientes sin añadir una etiqueta al DOM. Usamos la escritura explícita `.Provider` para reconocer el concepto; React 19 también permite `<CompactContext value={compact}>`.

### Paso 5C · `useContext`: leer el valor en la tarjeta

Sustituimos `src/components/member-card.tsx` por:

```tsx
import { useContext } from "react";
import { Link } from "@tanstack/react-router";
import type { Member } from "../model";
import { CompactContext } from "../compact-context";

export function MemberCard({ member }: { member: Member }) {
  const compact = useContext(CompactContext);
  return (
    <li className={compact ? "rounded bg-white p-2 shadow-sm" : "rounded bg-white p-4 shadow-sm"}>
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
      {members.map((member) => <MemberCard key={member.id} member={member} />)}
    </ul>
  );
}
```

En `MemberList`, la llamada queda `<MemberGrid members={visible} />`. Conservamos su estado `compact`, el botón y el provider.

Volvemos a pulsar: el resultado es el mismo, pero la cuadrícula ya no transporta esa preferencia. `useContext` lee el valor del provider más cercano por encima del componente. Cuando cambia ese valor, React actualiza los componentes que lo consumen; `memo` no bloquea esa actualización.

👉 **¿Dónde sigue estando el estado?** En el `useState` de `MemberList`. Context distribuye el valor, no sustituye al estado ni guarda datos en `localStorage`.

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
  role: z.string().trim().min(2, "Indica un puesto de al menos dos caracteres."),
  email: z.email("Introduce un correo válido."),
});
```

`trim()` evita que dos espacios cuenten como un nombre válido. Esto es validación de datos en ejecución, algo que una interfaz TypeScript no hace.

### Paso 7: conectar Form y Zod

_./src/member-form.tsx_

```tsx
const form = useForm({
  defaultValues: { name: "", role: "", email: "" },
  validators: {
    onChange: memberSchema,
    onSubmit: memberSchema,
  },
  onSubmit: async ({ value }) => {
    // En el proyecto: limpiamos el error, guardamos y capturamos fallos.
    await onSave(value);
  },
});
```

El formulario que vamos a construir usa `useForm` para mostrar el mecanismo directamente. Zod se integra mediante Standard Schema; no añadimos un adaptador.

Dentro de `form.Field` conectamos un campo:

```tsx
<form.Field name="name">
  {field => (
    <>
      <label htmlFor={field.name}>Nombre</label>
      <input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={event => field.handleChange(event.target.value)}
      />
    </>
  )}
</form.Field>
```

Mostramos primero un campo y repetimos el patrón para puesto y correo. La solución usa una pequeña lista de configuración para no copiar tres bloques iguales.

`onBlur` marca el campo como tocado. El formulario mostrará sus errores cuando procede y los enlaza al input con `aria-describedby` y `aria-invalid`. Los errores de Zod son objetos: mostramos su `message`.

El `form` HTML lleva `noValidate` para que en esta demostración podamos observar los mensajes de Zod. Conservamos los tipos de input y las etiquetas.

### Paso 8: enviar sin recargar y sin duplicar

```tsx
<form noValidate onSubmit={event => {
  event.preventDefault();
  event.stopPropagation();
  void form.handleSubmit();
}}>
```

El envío pasa por las validaciones. Un `form.Subscribe` observa `isSubmitting` y desactiva el botón mientras se guarda. No copiamos ese estado a otro `useState`.

Creamos src/member-form.tsx con la versión completa que reúne los fragmentos anteriores. Podemos empezar por el campo nombre y añadir los otros dos después:
~~~tsx
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { memberSchema } from "./member.schema";
import type { MemberInput } from "./model";
interface Props { initialValues?: MemberInput; onSave: (values: MemberInput) => Promise<void> }
const emptyValues: MemberInput = { name: "", role: "", email: "" };
const fields = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "role", label: "Puesto", type: "text" },
  { name: "email", label: "Correo", type: "email" },
] as const;
export function MemberForm({ initialValues = emptyValues, onSave }: Props) {
  const [saveError, setSaveError] = useState("");
  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: memberSchema, onSubmit: memberSchema },
    onSubmit: async ({ value }) => {
      setSaveError("");
      try { await onSave(value); }
      catch { setSaveError("No se ha podido guardar. Los datos siguen en el formulario."); }
    },
  });
  return <form className="space-y-4" noValidate onSubmit={event => {
    event.preventDefault();
    event.stopPropagation();
    void form.handleSubmit();
  }}>
    {fields.map(config => <form.Field key={config.name} name={config.name}>
      {field => {
        const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
        return <div className="grid gap-1">
          <label htmlFor={field.name}>{config.label}</label>
          <input id={field.name} name={field.name} type={config.type}
            value={field.state.value} onBlur={field.handleBlur}
            onChange={event => field.handleChange(event.target.value)}
            aria-invalid={invalid} aria-describedby={invalid ? `${field.name}-error` : undefined} />
          {invalid && <p id={`${field.name}-error`} role="alert">
            {field.state.meta.errors.map(error => error?.message).join(" ")}
          </p>}
        </div>;
      }}
    </form.Field>)}
    {saveError && <p role="alert">{saveError}</p>}
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : "Guardar persona"}
      </button>}
    </form.Subscribe>
  </form>;
}
~~~

Creamos ahora src/routes/members/new.tsx:
~~~tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MemberForm } from "../../member-form";
import { saveMember } from "../../api";
export const Route = createFileRoute("/members/new")({ component: NewMember });
function NewMember() {
  const navigate = useNavigate();
  return <>
    <h1>Añadir persona</h1>
    <Link to="/members">Cancelar</Link>
    <MemberForm onSave={async values => {
      const member = await saveMember(values);
      await navigate({ to: "/members/$memberId", params: { memberId: String(member.id) } });
    }} />
  </>;
}
~~~

En src/routes/__root.tsx, dentro de nav, añadimos el enlace:
~~~tsx
<Link to="/members/new">Añadir persona</Link>
~~~

Vite regenera las rutas. La ruta decide adónde navegar después:

```tsx
const member = await saveMember(values);
await navigate({
  to: "/members/$memberId",
  params: { memberId: String(member.id) },
});
```

Probamos nombre vacío, espacios y correo incorrecto. No navegamos ni añadimos una fila. Después introducimos datos válidos: aparece el nuevo detalle y la persona está en el listado.

### ¿Dónde estamos guardando?

`saveMember` combina los datos iniciales con cambios en `localStorage`. Cada demo tiene una clave distinta. Al recargar, la persona sigue ahí; en otro navegador no aparecerá.

No escribimos en el JSON ni simulamos una respuesta de un servidor. Es una persistencia local para la clase. Podemos borrar la clave de esa demo desde Application → Local Storage para recuperar los datos iniciales.

TanStack Form valida con Zod, pero no entrega automáticamente el resultado transformado del esquema. Por eso `saveMember` usa `memberSchema.parse(input)`: el nombre guardado queda sin espacios externos.

Si falla la lectura inicial o el almacenamiento, mostramos el error y conservamos los campos. La validación del cliente tampoco sustituiría la del servidor en una aplicación real.

## Solo si hay tiempo: la misma aplicación con CSS Modules

Tenemos preparada `demos/04-css-modules`, con las mismas rutas, el mismo formulario y las mismas validaciones. No depende de Tailwind.

Arrancamos primero:

```bash
npm run start:sin-estilos
```

Mostramos la aplicación en el navegador. Ese modo quita la clase raíz que activa los estilos del módulo; solo queda la base mínima de tipografía. La lógica del formulario sigue funcionando.

Detenemos Vite y arrancamos normalmente:

```bash
npm start
```

### Las clases son locales al módulo

_./src/components/member-card.tsx_

```tsx
import styles from "../app.module.css";

// En la tarjeta:
<li className={styles.card}>...</li>
```

_./src/app.module.css_

```css
.shell .card {
  background: white;
  border-radius: .25rem;
  padding: 1rem;
  box-shadow: 0 1px 3px #0002;
}
```

Vite reconoce `.module.css` sin otro plugin. El import devuelve el mapa de nombres que usamos en JSX. En DevTools vemos el nombre generado: una `card` de otro módulo puede coexistir sin compartir esa clase.

Los selectores de esta demo cuelgan de `.shell` para poder apagar el estilo completo en el primer arranque. Ese alcance es una decisión nuestra; CSS Modules no requiere un selector raíz ni usa Shadow DOM.

Cambiamos el padding y observamos todas las tarjetas. Con Tailwind editábamos las utilidades en el componente; aquí editamos una regla del módulo. Ambos enfoques permiten reutilizar el componente.

## Cerramos el recorrido

Comprobamos entrada directa a detalle, Atrás/Adelante, filtro vacío, persona inexistente, alta válida e inválida y un fallo de lectura bloqueando `members.json` en Network. Ejecutamos `npm run build`.

El plugin genera las rutas antes de la comprobación de tipos del script de build. El hosting de una SPA debe servir `index.html` para direcciones como `/members/2`; Vite ya resuelve esa parte durante la clase.

La siguiente sesión separa responsabilidades y añade un pod de edición. La de TanStack Start podrá partir de este conocimiento de rutas, parámetros y formularios.

Referencias: [Router con Vite](https://tanstack.com/router/latest/docs/installation/with-vite), [rutas por archivos](https://tanstack.com/router/latest/docs/routing/file-based-routing), [TanStack Form](https://tanstack.com/form/latest/docs/framework/react/quick-start), [validación](https://tanstack.com/form/latest/docs/framework/react/guides/validation) y [CSS Modules en Vite](https://vite.dev/guide/features#css-modules).

## Para ampliar

- [Compartir datos con Context](https://react.dev/learn/passing-data-deeply-with-context): props, providers y consumo de valores desde componentes descendientes.

[React en el máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react).
