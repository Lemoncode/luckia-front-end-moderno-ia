# 03 · Una aplicación: rutas, componentes y formularios

> ⏱️ 2 horas · Una primera aplicación con TanStack Router, preparada para enlazar después con TanStack Start.

## Antes de la clase

Partimos de componentes, estado, efectos y custom hooks. Usamos Node 22.12 o superior y una instalación independiente por demo. Las lecturas usan JSON local servido por Vite; filtramos la lista ya cargada.

## Recorrido de la sesión · 120 minutos

| Minutos | Explicación |
| --- | --- |
| 0–10 | URLs y alcance: Router ahora, Start después |
| 10–35 | Archivos, generación y tipado de las rutas |
| 35–55 | Lista, detalle y estados de petición |
| 55–60 | Pausa |
| 60–75 | Extracción de componentes y Tailwind |
| 75–105 | TanStack Form, Zod y alta |
| 105–115 | Validaciones, errores y persistencia |
| 115–120 | Recapitulación |

CSS Modules queda preparado **solo si hay tiempo**. No sumamos otra práctica obligatoria a las dos horas: podemos mostrar brevemente la comparación o reservarla para otra ocasión.

## Cuatro momentos de la misma aplicación

Cada demo es un proyecto independiente. Entramos en su carpeta, ejecutamos `npm install` la primera vez y arrancamos con `npm start`.

| Demo | Qué mostramos |
| --- | --- |
| [01-rutas](./demos/01-rutas) | Lista, detalle y navegación por archivos |
| [02-componentes](./demos/02-componentes) | La misma aplicación, extrayendo tarjetas y mensajes |
| [03-formulario](./demos/03-formulario) | Alta con TanStack Form y validación con Zod |
| [04-css-modules](./demos/04-css-modules) | La misma alta con CSS Modules; solo si hay tiempo |

La explicación avanza con el código: primero hacemos que funcione, después sacamos componentes y finalmente incorporamos el formulario.

## Hasta ahora solo teníamos una pantalla

Podríamos mostrar el detalle con un booleano. Pero ¿cómo enviamos un enlace directo a Julia? ¿Qué debe pasar al pulsar Atrás?

Necesitamos una dirección por pantalla. Usaremos **TanStack Router** por su tipado y sus rutas por archivos, y porque esas ideas reaparecerán en la sesión de TanStack Start. Es una elección para este curso; no hace falta presentarlo como el único estándar del ecosistema.

Router resuelve navegación en esta SPA. No estamos configurando Start, SSR, acciones de servidor ni TanStack Query.

## Vamos a verlo: rutas que salen de los archivos

### Paso 0: conectar el plugin de Vite

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

### Paso 1: dibujar las direcciones con carpetas

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

### Paso 2: registrar el router

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

### Paso 3: un enlace que conoce su parámetro

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

### Paso 4: leer el parámetro de esta ruta

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

Pasamos a `demos/02-componentes`. No añadimos funcionalidad: el comportamiento es el mismo.

### Paso 5: la tarjeta se lleva su estructura y sus clases

Antes teníamos este bloque dentro del `map` de `screens.tsx`. Ahora vive en `components/member-card.tsx`:

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

El listado queda así:

```tsx
{visible.map(member => (
  <MemberCard key={member.id} member={member} />
))}
```

Cambiamos `p-4` por `p-6` en la tarjeta. Todas las filas cambian a la vez.

👉 Las clases no se han ido a un catálogo de cadenas ni se repiten en cada pantalla: **viajan con el componente que reutilizamos**. Esta es una de las formas de trabajar con Tailwind en React.

La cuadrícula sigue en el listado: decide cómo se distribuyen las tarjetas, no cómo es una tarjeta por dentro. También extraemos los mensajes de carga y error porque aparecen en ambas pantallas.

No extraemos cada `div`. Buscamos piezas con un nombre y una responsabilidad reconocibles.

## Ahora vamos a añadir personas

Pasamos a `demos/03-formulario`. Aparece una nueva ruta, `members/new.tsx`, y un enlace «Añadir persona».

`new` es un segmento estático; el router lo distingue de `$memberId`. No se interpreta como el identificador de una persona.

### Paso 6: quién guarda el valor de cada campo

Con tres inputs podríamos usar tres estados. Pero también queremos saber si se han tocado, si son válidos y si se está enviando el formulario.

TanStack Form organiza ese estado. Zod describe las reglas:

_./src/member.schema.ts_

```ts
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

La demo usa `useForm` para mostrar el mecanismo directamente. Zod se integra mediante Standard Schema; no añadimos un adaptador.

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

`onBlur` marca el campo como tocado. La demo muestra sus errores cuando procede y los enlaza al input con `aria-describedby` y `aria-invalid`. Los errores de Zod son objetos: mostramos su `message`.

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

La ruta decide adónde navegar después:

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

## Material de partida

Partimos de 04b-basic-app: conservamos lista y detalle, usamos TanStack Router y añadimos el alta con TanStack Form y Zod.

[React en el máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react).
