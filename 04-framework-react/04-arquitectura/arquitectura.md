# 04 · Arquitectura: directorio y edición

> ⏱️ 2 horas · Organizar una aplicación que ya funciona y añadir edición sin duplicar el formulario.

## Paso 0 · Identificar qué queremos separar

Primero mostramos la aplicación: filtramos por Julia, abrimos su ficha y damos de alta una persona. Todavía no aparece «Editar persona».

Abrimos `src/screens.tsx`: reúne las pantallas de listado, detalle y alta. En el mismo archivo aparecen lectura de datos, estado del filtro, JSX y navegación después de guardar.

La aplicación funciona. El problema que vamos a resolver es **dónde cambiar cada cosa cuando añadimos una nueva funcionalidad**.

| Archivo inicial                                      | Qué contiene                              |
| ---------------------------------------------------- | ----------------------------------------- |
| `screens.tsx`                                        | Listado, detalle y pantalla de alta       |
| `member-form.tsx`                                    | Campos, validación y envío del formulario |
| `components/member-card.tsx`                         | Tarjeta de una persona                    |
| `components/request-status.tsx`                      | Mensajes de carga y error                 |
| `api.ts`, `hooks.ts`, `model.ts`, `member.schema.ts` | Datos y reglas de personas                |
| `router.ts`                                          | Creación y registro tipado del router     |
| `routes/__root.tsx`                                  | Marco visual compartido                   |
| `routes/members/`                                    | Rutas de listado, detalle y alta          |

Vamos a agrupar el código en tres **pods**. En esta organización, un pod es una carpeta que reúne una funcionalidad; no es una API de React ni una estructura obligatoria.

- `directorio`: listado, filtro y tarjetas.
- `detalle`: ficha de una persona y acceso a edición.
- `edicion`: añadir y editar personas con el mismo formulario.

Cada pod tendrá sus modelos de datos y de vista. Empezamos colocando el código junto a la funcionalidad que lo necesita; no llevamos las personas a `core` de entrada. Al terminar compararemos los contratos y decidiremos qué tendría sentido compartir. Los mensajes genéricos irán a `common/components` y las escenas compondrán las pantallas.

El diseño ya está preparado: tarjetas con iniciales, filtro, ficha y formulario. Conservamos ese aspecto y dejamos el correo en la ficha, para que se vea la diferencia entre el VM del listado y el del detalle. Las clases Tailwind permanecen junto al JSX que presentan.

## Paso 1 · Extraer las piezas generales

Movemos `src/components/request-status.tsx` a `src/common/components/request-status.tsx` y `src/router.ts` a `src/core/router/router.ts`.

En `src/screens.tsx` cambiamos solo el import de los mensajes:

```tsx
import { Loading, ErrorMessage } from "./common/components/request-status";
```

Los archivos de personas se quedan por ahora en la raíz de `src`. Los iremos trasladando a los pods que los utilizan. `core` no es una carpeta donde deba acabar cualquier modelo.

El router está dos carpetas más abajo: dejamos estos dos archivos así:

**`src/core/router/router.ts`**

```ts
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../../routeTree.gen";
export const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
```

**`src/app.tsx`**

```tsx
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./core/router/router";
export function App() {
  return <RouterProvider router={router} />;
}
```

**Comprobamos:** listado, detalle y alta siguen funcionando. Solo ha cambiado la ubicación del código. `routeTree.gen.ts` permanece en `src`: lo genera el plugin y no lo editamos.

## Paso 2 · Extraer `AppLayout`: el marco de las pantallas

Creamos `src/layouts/app-layout.tsx` y trasladamos aquí el JSX del componente `Layout` de `routes/__root.tsx`. El archivo completo queda así:

**`src/layouts/app-layout.tsx`**

```tsx
import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <main>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-700">
          Personas · Equipo
        </p>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
          Directorio interno
        </span>
      </header>
      <nav aria-label="Principal">
        <Link to="/members" activeOptions={{ exact: true }}>
          Directorio
        </Link>
        <Link to="/members/new">Añadir persona</Link>
      </nav>
      <Outlet />
      <footer className="border-t border-slate-200 pt-6 text-xs text-slate-500">
        Datos ficticios. Los cambios se guardan solo en este navegador.
      </footer>
    </main>
  );
}
```

Sustituimos todo el contenido de `src/routes/__root.tsx` por:

**`src/routes/__root.tsx`**

```tsx
import { createRootRoute } from "@tanstack/react-router";
import { AppLayout } from "../layouts/app-layout";
export const Route = createRootRoute({
  component: AppLayout,
  notFoundComponent: () => <h1>Página no encontrada</h1>,
});
```

`Outlet` es el hueco donde se muestra la ruta activa. Quitamos un momento `<Outlet />`: permanecen la cabecera y la navegación, pero desaparece la pantalla. Lo recuperamos antes de continuar.

**Comprobamos:** navegar entre Directorio y Añadir persona conserva el mismo marco. No hemos añadido una segunda tabla de rutas.

## Paso 3 · Crear el pod de directorio

### Antes de extraer la tarjeta · API model, view model y mapper

Creamos `src/pods/directorio/api`. Dentro de `api/` agrupamos el acceso a datos y su contrato; en la raíz del pod dejamos `directorio.vm.ts` y `directorio.mapper.ts`. Vamos a distinguir dos representaciones de una persona:

- **API model:** describe los datos que recibimos. Aquí vienen del JSON y de los cambios locales; no necesitamos un servidor para explicar este contrato.
- **View model:** describe los datos que necesita mostrar esta funcionalidad.
- **Mapper:** función que transforma el modelo recibido en el modelo de la vista. No hace peticiones ni modifica el objeto original.

Creamos estos tres archivos completos. Los dos modelos pueden llamarse `Member` porque pertenecen a módulos distintos; en el mapper usamos alias para distinguirlos.

**`src/pods/directorio/api/api.model.ts`**

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
}
```

**`src/pods/directorio/directorio.vm.ts`**

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  initials: string;
}
```

**`src/pods/directorio/directorio.mapper.ts`**

```ts
import type { Member as ApiMember } from "./api/api.model";
import type { Member as MemberViewModel } from "./directorio.vm";

export function mapMemberToViewModel(member: ApiMember): MemberViewModel {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    initials: member.name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}
```

El JSON no contiene `initials`. El mapper prepara ese dato para la vista: «Julia Martín» se convierte en «JM». Es un cálculo de presentación, por eso no lo guardamos ni lo añadimos al API model. Definimos el view model por separado, sin derivarlo del API model con `extends` u `Omit`, para que puedan evolucionar de forma independiente.

### Preparar la lectura dentro del pod

Antes de crear los containers, copiamos `src/api.ts` a `src/pods/directorio/api/api.ts` y `src/hooks.ts` a `src/pods/directorio/directorio.hooks.ts`. Conservamos los originales temporalmente: todavía los usan las pantallas antiguas.

En **`pods/directorio/api/api.ts`**:

1. Cambiamos el primer import por `import type { Member } from "./api.model";`.
2. Quitamos el import de `memberSchema`.
3. Quitamos las funciones `saveMember` y `getMember` completas. Este pod solo necesita el listado.
4. Conservamos `storageKey`, `readChanges` y `getMembers` sin cambiar su implementación.

Sustituimos el contenido de `directorio.hooks.ts` por el siguiente. Importamos `Member` desde el **view model** y aplicamos el mapper al recibir la respuesta, antes de actualizar el estado. No guardamos otra copia del API model.

**`src/pods/directorio/directorio.hooks.ts`**

```ts
import { useEffect, useState } from "react";
import { getMembers } from "./api/api";
import type { Member } from "./directorio.vm";
import { mapMemberToViewModel } from "./directorio.mapper";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    getMembers(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setMembers(data.map(mapMemberToViewModel));
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("No se ha podido cargar el equipo.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  return { members, loading, error };
}
```

`useMembers` devuelve modelos de vista del listado. El hook pertenece al pod y prepara los datos que necesita esa pantalla. `api.ts` sigue devolviendo modelos de API; la transformación se realiza en el hook, no en la función de acceso a datos.

### 3A · Llevar la tarjeta a la funcionalidad que la usa

Creamos `src/pods/directorio/components` y movemos allí `src/components/member-card.tsx`. Esta carpeta reúne los componentes internos del pod. Como la tarjeta está un nivel más abajo, ajustamos el import del modelo a `../directorio.vm`. Queda así:

**`src/pods/directorio/components/member-card.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import type { Member } from "../directorio.vm";

export function MemberCard({ member }: { member: Member }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-indigo-300">
      <div
        aria-hidden="true"
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-700"
      >
        {member.initials}
      </div>
      <Link to="/members/$memberId" params={{ memberId: String(member.id) }}>
        {member.name}
      </Link>
      <p>{member.role}</p>
    </li>
  );
}
```

Mientras `screens.tsx` siga existiendo, cambiamos su import de `MemberCard` a `./pods/directorio/components/member-card` y sustituimos el import de sus hooks por:

```tsx
import { useMembers } from "./pods/directorio/directorio.hooks";
import { useMember } from "./hooks";
```

El listado antiguo también recibe ahora view models. Su detalle conserva temporalmente `useMember` del archivo original. Mantenemos `member={member}` en la tarjeta: no importamos ni ejecutamos el mapper en la pantalla. El import de `saveMember` del alta permanece como estaba hasta extraer edición.

### 3B · Extraer la presentación del listado

Creamos `directorio.component.tsx`. Recibe los datos que debe mostrar y una función para comunicar los cambios del filtro. No hace peticiones ni decide qué personas coinciden.

**`src/pods/directorio/directorio.component.tsx`**

```tsx
import type { Member } from "./directorio.vm";
import { MemberCard } from "./components/member-card";

interface Props {
  members: Member[];
  filter: string;
  onFilterChange: (value: string) => void;
}

export function DirectorioComponent({
  members,
  filter,
  onFilterChange,
}: Props) {
  return (
    <section className="space-y-5" aria-label="Personas del equipo">
      <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5">
        <label htmlFor="filter">Buscar por nombre</label>
        <input
          id="filter"
          placeholder="Por ejemplo, Julia"
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
        />
        <p className="text-sm text-slate-500" aria-live="polite">
          Personas encontradas: {members.length}
        </p>
      </div>
      {members.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          No hay personas con ese nombre. Prueba con otro filtro.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </ul>
      )}
    </section>
  );
}
```

El input sigue siendo controlado: recibe `filter` y comunica los cambios mediante `onFilterChange`. La lista ya llega filtrada. No necesitamos un estado adicional dentro de este componente.

### 3C · Extraer la coordinación del listado

Creamos `directorio.container.tsx` con el hook, el estado del filtro y el cálculo que antes estaban en `MemberList`:

**`src/pods/directorio/directorio.container.tsx`**

```tsx
import { useState } from "react";
import { useMembers } from "./directorio.hooks";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { DirectorioComponent } from "./directorio.component";
export function DirectorioContainer() {
  const { members, loading, error } = useMembers();
  const [filter, setFilter] = useState("");
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  const visible = members.filter((member) =>
    member.name.toLowerCase().includes(filter.toLowerCase()),
  );
  return (
    <DirectorioComponent
      members={visible}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}
```

El **container coordina datos y estado**; el **component presenta props**. Son nombres que elegimos para distinguir esas responsabilidades, no tipos especiales de componente de React.

Los hooks se llaman antes de los returns condicionales. `members` ya contiene view models y `visible` solo filtra esos datos. El container no aplica el mapper ni conoce el modelo de API. La conversión ocurre una vez por respuesta dentro del hook, no cada vez que escribimos en el filtro.

### 3D · Definir la entrada pública del pod

Creamos `src/pods/directorio/index.ts`:

**`src/pods/directorio/index.ts`**

```ts
export { DirectorioContainer } from "./directorio.container";
```

Desde fuera importaremos `DirectorioContainer`. `MemberCard` y los componentes de presentación son detalles internos: no necesitamos exportarlo todo. Dentro del pod mantenemos imports directos entre archivos.

La ruta sigue usando `screens.tsx`. Conectaremos el nuevo container mediante una escena en el paso 5.

## Paso 4 · Crear el pod de detalle

La ficha tiene su propio caso de uso. Creamos `src/pods/detalle/api` y sus modelos. El contrato recibido coincide con el del listado, pero la vista sí incluye correo e identificador. El listado no necesita mostrar el correo y no lo incluye en su VM.

**`src/pods/detalle/api/api.model.ts`**

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
}
```

**`src/pods/detalle/detalle.vm.ts`**

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
  initials: string;
}
```

**`src/pods/detalle/detalle.mapper.ts`**

```ts
import type { Member as ApiMember } from "./api/api.model";
import type { Member as MemberViewModel } from "./detalle.vm";

export function mapMemberToViewModel(member: ApiMember): MemberViewModel {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email,
    initials: member.name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}
```

Copiamos el archivo original `src/api.ts` a `src/pods/detalle/api/api.ts`. Cambiamos el primer import a `import type { Member } from "./api.model";`, quitamos el import de `memberSchema` y la función `saveMember`. Conservamos `storageKey`, `readChanges`, `getMembers` y `getMember`: este último utiliza el listado para encontrar la persona en nuestro JSON.

Creamos el hook del detalle. Su estado contiene su propio view model; el mapper se ejecuta al recibir los datos.

**`src/pods/detalle/detalle.hooks.ts`**

```ts
import { useEffect, useState } from "react";
import { getMember } from "./api/api";
import type { Member } from "./detalle.vm";
import { mapMemberToViewModel } from "./detalle.mapper";

export function useMember(id: string) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setMember(null);
    getMember(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setMember(data ? mapMemberToViewModel(data) : null);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("No se ha podido cargar la persona.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);
  return { member, loading, error };
}
```

Creamos ahora el componente y el container. Todavía no añadimos el enlace de edición: su ruta no existe.

**`src/pods/detalle/detalle.component.tsx`**

```tsx
import type { Member } from "./detalle.vm";

export function DetalleComponent({ member }: { member: Member }) {
  return (
    <article className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <header className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-700"
        >
          {member.initials}
        </div>
        <div>
          <h2>{member.name}</h2>
          <p className="text-slate-500">{member.role}</p>
        </div>
      </header>
      <dl className="grid gap-5 border-y border-slate-100 py-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-500">Correo electrónico</dt>
          <dd className="mt-1 break-all font-medium">{member.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Identificador</dt>
          <dd className="mt-1 font-medium">#{member.id}</dd>
        </div>
      </dl>
    </article>
  );
}
```

**`src/pods/detalle/detalle.container.tsx`**

```tsx
import { useMember } from "./detalle.hooks";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { DetalleComponent } from "./detalle.component";
export function DetalleContainer({ id }: { id: string }) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return <DetalleComponent member={member} />;
}
```

El container distingue carga, error y persona inexistente. El component recibe una persona ya disponible. Así podemos cambiar el aspecto de la ficha sin tocar cómo la leemos.

Creamos también la entrada pública del pod de detalle:

**`src/pods/detalle/index.ts`**

```ts
export { DetalleContainer } from "./detalle.container";
```

El directorio no importa nada de detalle. Sus tarjetas enlazan a una ruta; esa ruta se encargará de mostrar la ficha. Cada pod conserva sus modelos y su lógica.

## Paso 5 · Componer las pantallas con escenas

Una escena reúne el título, las acciones de la pantalla y el pod. Creamos `src/scenes` y estos dos archivos completos:

**`src/scenes/directorio.scene.tsx`**

```tsx
import { DirectorioContainer } from "../pods/directorio";

export function DirectorioScene() {
  return (
    <>
      <header className="space-y-2">
        <h1>Tu equipo, a mano</h1>
        <p className="text-slate-500">
          Consulta las personas del equipo y mantén sus datos al día.
        </p>
      </header>
      <DirectorioContainer />
    </>
  );
}
```

**`src/scenes/detalle.scene.tsx`**

```tsx
import { Link } from "@tanstack/react-router";
import { DetalleContainer } from "../pods/detalle";

export function DetalleScene({ id }: { id: string }) {
  return (
    <>
      <header className="space-y-2">
        <h1>Ficha de la persona</h1>
        <Link to="/members">Volver al directorio</Link>
      </header>
      <DetalleContainer key={id} id={id} />
    </>
  );
}
```

Ahora sustituimos el contenido de las dos rutas existentes:

**`src/routes/members/index.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DirectorioScene } from "../../scenes/directorio.scene";
export const Route = createFileRoute("/members/")({
  component: DirectorioScene,
});
```

**`src/routes/members/$memberId/index.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { DetalleScene } from "../../../scenes/detalle.scene";
export const Route = createFileRoute("/members/$memberId/")({
  component: DetailPage,
});
function DetailPage() {
  const { memberId } = Route.useParams();
  return <DetalleScene id={memberId} />;
}
```

La ruta obtiene el parámetro tipado con `Route.useParams()` y lo entrega a la escena. La escena monta el container. La `key` reinicia su estado si cambia la persona.

**Comprobamos:** el listado filtra, las tarjetas abren la ficha y `/members/999` muestra que la persona no existe. La pantalla de alta todavía funciona con `screens.tsx`; lo conservamos hasta terminar el siguiente paso.

No borramos `routes/members/$memberId/index.tsx`: el punto de partida ya usa esta carpeta, que nos permitirá añadir `edit.tsx` a su lado.

## Paso 6 · Crear el pod de edición y reutilizar el formulario

### Antes de mover el formulario · Los modelos del pod de edición

Creamos `src/pods/edicion/api` y sus propios modelos, siguiendo el mismo patrón: `api/api.model.ts`, `edicion.vm.ts` y `edicion.mapper.ts`. Su contrato de lectura coincide hoy con el del directorio, pero su vista necesita los campos editables, sin iniciales ni identificador.

**`src/pods/edicion/api/api.model.ts`**

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
}

export type MemberInput = Omit<Member, "id">;
```

**`src/pods/edicion/edicion.vm.ts`**

```ts
export interface MemberFormValues {
  name: string;
  role: string;
  email: string;
}
```

**`src/pods/edicion/edicion.mapper.ts`**

```ts
import type { Member, MemberInput } from "./api/api.model";
import type { MemberFormValues } from "./edicion.vm";

export function mapMemberToForm(member: Member): MemberFormValues {
  return { name: member.name, role: member.role, email: member.email };
}

export function mapFormToMemberInput(values: MemberFormValues): MemberInput {
  return { name: values.name, role: values.role, email: values.email };
}
```

Aquí mostramos las dos direcciones: datos recibidos → valores iniciales del formulario y valores del formulario → datos para guardar. Los campos coinciden hoy; el mapper hace explícito el límite. La transformación visible de esta práctica está en las iniciales del directorio. No hace falta inventar diferencias en el JSON.

Preparamos los archivos del pod con estos destinos:

| Copiamos desde         | Destino                                   |
| ---------------------- | ----------------------------------------- |
| `src/api.ts`           | `src/pods/edicion/api/api.ts`             |
| `src/hooks.ts`         | `src/pods/edicion/edicion.hooks.ts`       |
| `src/member.schema.ts` | `src/pods/edicion/edicion.validations.ts` |

En la copia `edicion.validations.ts`, renombramos la constante exportada `memberSchema` a `edicionSchema`. Conservamos las mismas reglas Zod: son las validaciones de los campos de alta y edición.

En `api/api.ts`, cambiamos el import de `"./model"` a `"./api.model"` y sustituimos el import del esquema por:

```ts
import { edicionSchema } from "../edicion.validations";
```

Dentro de `saveMember`, cambiamos `memberSchema.parse(input)` por `edicionSchema.parse(input)`. El comportamiento del guardado no cambia. El formulario y el guardado reutilizan las mismas reglas del pod; no estamos definiendo un esquema para validar respuestas de una API.

En `pods/edicion/edicion.hooks.ts` dejamos solo el hook de detalle y aplicamos el mismo criterio: el estado contiene el modelo de vista del formulario. Sustituimos su contenido completo por:

**`src/pods/edicion/edicion.hooks.ts`**

```tsx
import { useEffect, useState } from "react";
import { getMember } from "./api/api";
import type { MemberFormValues } from "./edicion.vm";
import { mapMemberToForm } from "./edicion.mapper";
export function useMember(id: string) {
  const [member, setMember] = useState<MemberFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setMember(null);
    getMember(id, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted)
          setMember(data ? mapMemberToForm(data) : null);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("No se ha podido cargar la persona.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);
  return { member, loading, error };
}
```

`member` contiene los campos editables o `null` si no existe la persona. El identificador sigue llegando desde la ruta al container; no necesitamos añadirlo al modelo del formulario.

Los tres pods leen el mismo JSON y la misma clave de almacenamiento. Esta primera separación deja repetida parte de la lectura para poder reconocer después qué contrato y comportamiento son realmente compartidos; no es una propuesta de mantener esa duplicación indefinidamente.

### 6A · Mover el formulario que ya funciona

Movemos `src/member-form.tsx` a `src/pods/edicion/edicion.component.tsx` y hacemos solo estos cambios:

1. Renombramos la función exportada `MemberForm` a `EdicionComponent`.
2. Sustituimos el import del esquema por `import { edicionSchema } from "./edicion.validations";` y cambiamos las referencias a `memberSchema` de `validators.onChange` y `validators.onSubmit` por `edicionSchema`.
3. Sustituimos el import del modelo por `import type { MemberFormValues } from "./edicion.vm";`.
4. En las props y en `emptyValues`, cambiamos todas las referencias al tipo `MemberInput` por `MemberFormValues`. El formulario trabaja con su modelo de vista.

Mantenemos los campos, `useForm`, las validaciones, el tratamiento del error y `form.Subscribe`. No reescribimos el formulario.

Para que el alta anterior siga funcionando durante este paso, sustituimos su import en `src/screens.tsx` por:

```tsx
import { EdicionComponent as MemberForm } from "./pods/edicion/edicion.component";
```

Este alias es temporal: desaparecerá al borrar `screens.tsx`. Permite seguir usando su JSX sin cambiarlo mientras conectamos la nueva pantalla.

El formulario sigue recibiendo `initialValues` y `onSave`. El alta usa los valores vacíos por defecto; la edición le entregará los valores preparados por el hook.

### 6B · Crear los containers de alta y edición

Creamos `src/pods/edicion/edicion.container.tsx` con el contenido completo:

**`src/pods/edicion/edicion.container.tsx`**

```tsx
import { saveMember } from "./api/api";
import { useMember } from "./edicion.hooks";
import { mapFormToMemberInput } from "./edicion.mapper";
import { Loading, ErrorMessage } from "../../common/components/request-status";
import { EdicionComponent } from "./edicion.component";

type OnSaved = (id: number) => Promise<void>;

export function AltaContainer({ onSaved }: { onSaved: OnSaved }) {
  return (
    <EdicionComponent
      onSave={async (values) => {
        const saved = await saveMember(mapFormToMemberInput(values));
        await onSaved(saved.id);
      }}
    />
  );
}

export function EdicionContainer({
  id,
  onSaved,
}: {
  id: string;
  onSaved: OnSaved;
}) {
  const { member, loading, error } = useMember(id);
  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!member) return <p>Persona no encontrada.</p>;
  return (
    <EdicionComponent
      key={id}
      initialValues={member}
      onSave={async (values) => {
        const saved = await saveMember(
          mapFormToMemberInput(values),
          Number(id),
        );
        await onSaved(saved.id);
      }}
    />
  );
}
```

Leemos primero `AltaContainer`: entrega al formulario una función que guarda sin identificador y avisa a `onSaved` con su identificador.

Después recorremos `EdicionContainer`: recibe un identificador, carga la persona y **solo monta el formulario cuando ya tiene sus valores**. El hook ya entrega los valores del formulario. Al guardar usamos `Number(id)`, a partir del identificador recibido por la ruta, para conservar la identidad. La consulta previa ya ha comprobado que esa persona existe.

`onSave` recibe el view model del formulario. El mapper prepara los datos para guardar. `onSaved` recibe solo el identificador guardado: la escena no necesita el modelo de API del pod. Esta segunda función la proporcionará la escena para decidir la navegación.

La promesa encadena guardado y navegación. Si falla el guardado, el error llega al formulario, que conserva el borrador y vuelve a habilitar el botón.

Creamos la entrada pública del pod:

**`src/pods/edicion/index.ts`**

```ts
export { AltaContainer, EdicionContainer } from "./edicion.container";
```

### 6C · Crear la escena que decide adónde volver

Creamos `src/scenes/edicion.scene.tsx`:

**`src/scenes/edicion.scene.tsx`**

```tsx
import { Link, useNavigate } from "@tanstack/react-router";
import { AltaContainer, EdicionContainer } from "../pods/edicion";

export function EdicionScene({ id }: { id?: string }) {
  const navigate = useNavigate();
  async function onSaved(memberId: number) {
    await navigate({
      to: "/members/$memberId",
      params: { memberId: String(memberId) },
    });
  }
  return (
    <>
      <header className="space-y-2">
        <h1>{id ? "Editar persona" : "Añadir persona"}</h1>
        <p className="text-slate-500">
          {id
            ? "Actualiza su información y guarda los cambios."
            : "Completa los datos para incorporar una persona al directorio."}
        </p>
        {id ? (
          <Link to="/members/$memberId" params={{ memberId: id }}>
            Cancelar y volver al detalle
          </Link>
        ) : (
          <Link to="/members">Cancelar y volver al directorio</Link>
        )}
      </header>
      {id ? (
        <EdicionContainer key={id} id={id} onSaved={onSaved} />
      ) : (
        <AltaContainer onSaved={onSaved} />
      )}
    </>
  );
}
```

Sin `id`, muestra el alta. Con `id`, muestra la edición. El container no necesita conocer `useNavigate`: recibe `onSaved` como acción de salida.

Cancelar vuelve al directorio en el alta y a la ficha en la edición. No ejecuta `onSave`, por lo que no guarda el borrador.

## Paso 7 · Conectar alta y edición a las rutas

Primero sustituimos la ruta de alta por:

**`src/routes/members/new.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { EdicionScene } from "../../scenes/edicion.scene";
export const Route = createFileRoute("/members/new")({
  component: () => <EdicionScene />,
});
```

Después creamos **el archivo nuevo** `src/routes/members/$memberId/edit.tsx`:

**`src/routes/members/$memberId/edit.tsx`**

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { EdicionScene } from "../../../scenes/edicion.scene";
export const Route = createFileRoute("/members/$memberId/edit")({
  component: EditPage,
});
function EditPage() {
  const { memberId } = Route.useParams();
  return <EdicionScene id={memberId} />;
}
```

Con Vite en marcha, el plugin actualiza `routeTree.gen.ts`. Si el editor todavía no reconoce la nueva ruta, esperamos a la generación o reiniciamos `npm start`; no corregimos los tipos a mano.

Ahora añadimos el acceso a la edición en `src/pods/detalle/detalle.component.tsx`:

- Añadimos `import { Link } from "@tanstack/react-router";` al comienzo del archivo.
- Dentro del `<article>`, justo después de `</dl>` y antes de `</article>`, insertamos:

```tsx
<Link
  className="inline-flex rounded-lg bg-indigo-50 px-4 py-2"
  to="/members/$memberId/edit"
  params={{ memberId: String(member.id) }}
>
  Editar persona
</Link>
```

El pod de directorio conoce una dirección a la que navegar. **No importa nada del pod de edición.** La ruta conecta la funcionalidad con su escena.

**Comprobamos:** abrimos Julia, pulsamos «Editar persona», modificamos el puesto y guardamos. Volvemos a su ficha; el identificador sigue siendo el mismo. El listado muestra una sola Julia.

## Paso 8 · Retirar el código anterior y revisar el mapa final

Las tres rutas ya usan escenas. Borramos `src/screens.tsx`, que ha dejado de tener consumidores. Podemos eliminar también la carpeta `src/components` si quedó vacía tras los movimientos.

Borramos también los originales `src/api.ts`, `src/hooks.ts`, `src/model.ts`, `src/member.schema.ts`, `src/router.ts` y `src/member-form.tsx` si todavía existen: sus responsabilidades ya están dentro de los pods y el router. Los originales de datos se conservaron solo para mantener funcionando las pantallas durante la migración.

La estructura final queda así:

```text
src/
  app.tsx
  main.tsx
  styles.css
  core/
    router/router.ts
  common/components/request-status.tsx
  layouts/app-layout.tsx
  scenes/
    directorio.scene.tsx
    detalle.scene.tsx
    edicion.scene.tsx
  pods/
    directorio/
      api/
        api.ts
        api.model.ts
      directorio.hooks.ts
      directorio.vm.ts
      directorio.mapper.ts
      index.ts
      components/
        member-card.tsx
      directorio.component.tsx
      directorio.container.tsx
    detalle/
      api/
        api.ts
        api.model.ts
      detalle.hooks.ts
      detalle.vm.ts
      detalle.mapper.ts
      detalle.component.tsx
      detalle.container.tsx
      index.ts
    edicion/
      api/
        api.ts
        api.model.ts
      edicion.hooks.ts
      edicion.vm.ts
      edicion.mapper.ts
      edicion.validations.ts
      index.ts
      edicion.component.tsx
      edicion.container.tsx
  routes/
    __root.tsx
    index.tsx
    members/
      index.tsx
      new.tsx
      $memberId/
        index.tsx
        edit.tsx
  routeTree.gen.ts
  vite-env.d.ts
```

Recorremos los dos flujos: al leer, API model → mapper dentro del hook → estado con view model → container → componente; al guardar, valores del formulario → mapper → datos de entrada → guardado → `onSaved` → navegación al detalle.

| Si queremos cambiar…                   | Buscamos en…                                 |
| -------------------------------------- | -------------------------------------------- |
| Los campos o el aspecto del formulario | `pods/edicion/edicion.component.tsx`         |
| La navegación después de guardar       | `scenes/edicion.scene.tsx`                   |
| El aspecto de una tarjeta              | `pods/directorio/components/member-card.tsx` |
| El criterio de filtrado                | `pods/directorio/directorio.container.tsx`   |
| Una regla de validación compartida     | `pods/edicion/edicion.validations.ts`        |
| La lectura o persistencia de personas  | `api/api.ts` dentro de cada pod              |
| El marco y la navegación principal     | `layouts/app-layout.tsx`                     |

Esta separación añade archivos, así que tiene un coste. La usamos para practicar responsabilidades reconocibles; no hace falta aplicar todas estas capas a cualquier componente pequeño.

## Después de comparar · ¿Qué podemos subir a core?

Ahora abrimos juntos los tres `api.model.ts`. Los tres describen el mismo contrato de persona y proceden de la misma fuente. **Esa coincidencia comprobada permite extraer un contrato compartido; no significa que todos los modelos deban vivir en core.** Que dos interfaces tengan los mismos campos no basta si representan conceptos distintos.

Como pequeño refactor opcional:

1. Creamos `src/core/members/api.model.ts` y movemos allí el contenido de `pods/edicion/api/api.model.ts` (incluye `Member` y `MemberInput`).
2. En `api/api.ts` de los tres pods, cambiamos el import de `"./api.model"` a `"../../../core/members/api.model"`. En `directorio.mapper.ts`, `detalle.mapper.ts` y `edicion.mapper.ts`, cambiamos `"./api/api.model"` por `"../../core/members/api.model"`. La ruta relativa es distinta porque `api.ts` está un nivel más abajo. Los hooks no cambian: importan modelos de vista, no modelos de API.
3. Eliminamos los tres `api.model.ts` locales. Ningún pod importa el contrato desde el otro.
4. Ejecutamos `npm run build` y repetimos el alta y la edición.

Los `directorio.vm.ts`, `detalle.vm.ts`, `edicion.vm.ts` y sus mappers **permanecen dentro de cada pod**: directorio prepara las tarjetas, detalle añade la información de la ficha y edición necesita valores editables. Compartir los datos de entrada no implica compartir las necesidades de sus pantallas.

Esta extracción solo unifica tipos; no elimina la lectura repetida de JSON y localStorage. Si continuásemos el refactor, podríamos extraer ese acceso común a un servicio compartido. Lo dejamos fuera de esta práctica básica para centrar la explicación en los dos modelos y el mapper.

El mapa anterior representa la solución antes de esta extracción opcional. En `core` solo estaba el router; `core/members` aparece cuando hemos encontrado algo concreto que compartir.

## La persistencia sigue siendo local

Abrimos los archivos `api.ts` de los tres pods. Conservamos el comportamiento del punto de partida, con la lectura en directorio y detalle, y la lectura y el guardado en edición:

- `getMembers` lee `public/members.json` por HTTP y combina sus personas con los cambios locales.
- `saveMember(values)` crea una persona con un identificador nuevo.
- `saveMember(values, id)` comprueba que exista y guarda sus cambios conservando el identificador.
- `edicionSchema.parse` valida los datos y aplica las transformaciones del esquema antes de guardarlos.

Los cambios se guardan bajo `luckia-architecture-members` en `localStorage`. No modificamos el JSON ni hacemos un POST o PUT. Al recargar recuperamos los cambios de este navegador.

La capacidad de guardar por identificador ya estaba preparada en el inicio. La novedad de esta clase es conectarla al caso de uso de edición y reutilizar el formulario.

Al volver al detalle, se monta su lectura y recupera la persona guardada. No añadimos Context ni una caché para coordinar estas pantallas. La integración con un backend se trabajará en el módulo de REST API.

## Comprobamos el recorrido completo

1. Filtramos por un nombre existente y por uno sin resultados. Julia Martín muestra «JM» en tarjeta y ficha; el JSON y el almacenamiento no incorporan `initials`.
2. Damos de alta una persona con datos válidos y abrimos su ficha.
3. Entramos en edición: los campos contienen sus valores.
4. Cambiamos el puesto y guardamos. El identificador se mantiene y no se duplica la persona.
5. Recargamos: el cambio sigue ahí.
6. Introducimos un correo inválido: vemos el mensaje y no salimos del formulario.
7. Cancelamos una edición: la ficha conserva los valores anteriores.
8. Abrimos directamente `/members/999/edit`: mostramos «Persona no encontrada».
9. Después de cargar un formulario, bloqueamos `members.json` desde Network y guardamos: aparece el error y se conserva lo escrito. Quitamos el bloqueo al terminar.
10. Estrechamos el navegador: las tarjetas pasan a una columna, la navegación se adapta y los campos caben sin desplazamiento horizontal.

Ejecutamos desde la demo:

```bash
npm run build
```

El comando genera las rutas y comprueba los tipos. Cerramos señalando en el código dónde cambiaríamos una tarjeta, una validación y la navegación después de guardar.

## Para ampliar

Para repasar, podemos volver a estos recursos oficiales y relacionarlos con las decisiones de la sesión:

- [Pensar en React](https://es.react.dev/learn/thinking-in-react): dividir una interfaz en componentes y decidir dónde vive su estado.
- [Compartir estado entre componentes](https://es.react.dev/learn/sharing-state-between-components): comunicar cambios mediante props y callbacks, como hacemos entre container y component.
- [Preservar y reiniciar el estado](https://es.react.dev/learn/preserving-and-resetting-state): entender por qué una `key` puede reiniciar el borrador al cambiar de persona.
- [Rutas por archivos en TanStack Router](https://tanstack.com/router/latest/docs/routing/file-based-routing): repasar la relación entre archivos, rutas y pantallas.

También encontramos más ejemplos en el [bloque de React del máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react), especialmente en `05b-architecture`. Es un recorrido más amplio que el de esta sesión; lo usamos como material complementario, no como requisito para completar la práctica.
