# 03 · Una aplicación: rutas, lista y detalle

> ⏱️ 2 horas · La dirección del navegador también forma parte de la interfaz.

## Hasta ahora solo teníamos una pantalla

Ya sabemos mostrar una lista y cargar datos. Ahora queremos pulsar sobre una persona y ver su detalle.

Podríamos guardar un booleano y alternar dos componentes. Pero aparece una pregunta: **¿cómo enviamos a otra persona un enlace directo al detalle de Julia?** ¿Y qué debería hacer el botón Atrás del navegador?

Necesitamos que cada pantalla tenga una dirección. Para eso vamos a incorporar **React Router**.

## Las direcciones que vamos a tener

| URL | Qué mostramos |
| --- | --- |
| `/` | Redirigimos al listado |
| `/members` | Lista de personas |
| `/members/1` | Detalle de Julia |
| `/members/999` | Persona no encontrada |
| `/otra-ruta` | Página no encontrada |

El `1` no es el nombre de una pantalla distinta: es **un parámetro** de la pantalla de detalle.

## Vamos a verlo

Arrancamos `03-basic-app` con `npm start`. La base sigue siendo Vite, React, TypeScript y Tailwind; este proyecto añade `react-router`.

La sesión parte de los hooks de la clase anterior. Quitamos los controles del laboratorio y nos quedamos con el directorio. Las pantallas estarán juntas en `app.tsx`: en la siguiente clase organizaremos ese código.

### Paso 0: dos componentes sencillos

Empezamos con dos pantallas que solo devuelven un título:

```tsx
function MemberList() {
  return <h1>Equipo</h1>;
}

function MemberDetail() {
  return <h1>Detalle del equipo</h1>;
}
```

Primero resolvemos la navegación. Después añadiremos los datos.

### Paso 1: relacionar direcciones con componentes

Importamos las piezas de React Router:

```tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
```

_./src/app.tsx_

```tsx
export function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/members" replace />} />
          <Route path="/members" element={<MemberList />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="*" element={<h1>Página no encontrada</h1>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
```

| Pieza | Su trabajo |
| --- | --- |
| `BrowserRouter` | Conecta la navegación con la dirección y el historial |
| `Routes` | Selecciona la rama de rutas que corresponde |
| `Route` | Relaciona un patrón con un elemento |
| `Navigate` | Cambia la dirección; aquí redirige al listado |
| `*` | Recoge las direcciones que no coinciden |

Abrimos `/members` y después `/members/1`. Cambia el título. Escribimos `/otra-ruta`: aparece el mensaje de página no encontrada.

`replace` hace que la redirección desde `/` no deje un paso innecesario en el historial.

### Paso 2: navegar con enlaces

Añadimos `Link` a los imports y ponemos un enlace:

```tsx
<Link to="/members">Volver al listado</Link>
```

No es un botón que ejecuta una acción: es un enlace a otra dirección. React Router permite seguirlo sin recargar el documento.

👉 Navegamos y usamos **Atrás y Adelante**. La aplicación tiene que acompañar al navegador, no mantener una pantalla distinta de la que indica la URL.

## Recuperamos los datos

### Paso 3: describir una persona

_./src/model.ts_

```ts
export interface Member {
  id: number;
  name: string;
  role: string;
  email: string;
}
```

Tenemos la lista en `public/members.json` y un archivo de detalle por persona, como `public/members/1.json`.

Vite los sirve como `/members.json` y `/members/1.json`. **`public` no aparece en la URL.**

Separamos dos funciones en `api.ts`: `getMembers` y `getMember`. Los hooks conectan esas lecturas con el estado y la limpieza. Ya conocemos ese patrón de la sesión anterior.

El listado se lee así:

```ts
export async function getMembers(signal: AbortSignal): Promise<Member[]> {
  const response = await fetch("/members.json", { signal });
  if (!response.ok) throw new Error("No se ha podido cargar el equipo.");
  return response.json();
}
```

La señal viene del efecto: quien inicia la lectura también puede cancelarla.

### Paso 4: lista y filtro

En `MemberList` recuperamos los datos y añadimos el campo de búsqueda:

```tsx
const { members, loading, error } = useMembers();
const [filter, setFilter] = useState("");

const visible = members.filter(member =>
  member.name.toLowerCase().includes(filter.toLowerCase())
);
```

👉 **¿Hace falta un estado para `visible`?** No: ya tenemos todos los datos necesarios para calcularlo.

Aquí cargamos la lista al montar y filtramos en memoria. Abrimos Network y escribimos: no hay una nueva petición por cada letra. Es la diferencia con la búsqueda remota que simulamos en hooks.

Cada fila enlaza con su detalle:

```tsx
{visible.map(member => (
  <li key={member.id} className="rounded bg-white p-4 shadow-sm">
    <Link to={`/members/${member.id}`}>{member.name}</Link>
    <p>{member.role}</p>
  </li>
))}
```

## Una petición no siempre acaba en una lista

Antes de las filas resolvemos qué estado tiene la pantalla:

| Situación | Lo que mostramos |
| --- | --- |
| La petición sigue en curso | Cargando… |
| La petición ha fallado | Mensaje de error |
| Ha terminado, pero no hay coincidencias | Sin resultados |
| Hay personas | Las tarjetas |

Buscamos `zzzz`. No aparece nadie, pero la petición no ha fallado. **Una lista vacía es un resultado válido.**

El proyecto usa `role="status"` para la carga y `role="alert"` para el error. Estos mensajes también deben poder percibirse sin depender solo del aspecto visual.

## El detalle depende de la dirección

### Paso 5: leer el identificador

En `MemberDetail`:

```tsx
const { id = "" } = useParams();
const { member, loading, error } = useMember(id);
```

`useParams` devuelve los parámetros como texto. La función `getMember` comprueba aquí que el identificador sea un número entero positivo.

El efecto de `useMember` depende de **`[id]`**. Cuando cambia, limpiamos la petición anterior e iniciamos otra. Reiniciamos carga, error y persona para representar la nueva lectura.

### Paso 6: cambiar de persona sin salir del detalle

Pulsamos **Siguiente persona**. La dirección cambia de `/members/1` a `/members/2`.

👉 **¿Se tiene que desmontar el componente?** No necesariamente. Sigue siendo la pantalla de detalle, con otro parámetro.

Por eso no bastaría un efecto con `[]`: seguiría mostrando los datos de la primera persona. La dependencia `id` conecta el contenido con la dirección actual.

El enlace Siguiente recorre las tres personas de esta demo mediante sus identificadores consecutivos. Si los datos vinieran de una API, el siguiente identificador tendría que salir de esos datos o de su paginación.

### Paso 7: una persona que no existe

Abrimos `/members/999`. La ruta de detalle sí existe; lo que no existe es esa persona.

Son dos casos distintos:

- `/otra-ruta` → **Página no encontrada**.
- `/members/999` → **Persona no encontrada**.

`getMember` devuelve `null` para el segundo caso. El hook conserva el error para un fallo de la petición.

> Particularidad de los JSON locales: Vite puede responder con el HTML de la aplicación cuando falta un archivo. Por eso `api.ts` reconoce también una respuesta `text/html`. En una API real usaríamos su contrato y sus códigos HTTP.

## Vamos a salir del recorrido cómodo

Mostramos estos casos en el navegador:

| Demostración | Qué esperamos |
| --- | --- |
| Abrir directamente `/members/2` y recargar | El detalle de Evan |
| Buscar `zzzz` | Sin resultados |
| Abrir `/members/abc` | Persona no encontrada |
| Bloquear `/members/1.json` en DevTools y entrar a Julia | Mensaje de error |
| Desbloquear y volver a entrar | Recuperamos el detalle |
| Cambiar de persona con red lenta | La respuesta anterior no sobrescribe la nueva |

Volvemos desde detalle al listado. Se vuelve a montar y el filtro queda vacío: su estado pertenecía a esa instancia. Si quisiéramos conservarlo, tendríamos que decidir dónde guardarlo; por ejemplo, en la URL.

## Ya tenemos una aplicación pequeña

Hay navegación, datos y varias situaciones que representar. Ejecutamos `npm run build`.

Al publicarla, `BrowserRouter` necesita que el hosting sirva `index.html` para direcciones de la aplicación como `/members/2`. Vite ya resuelve ese fallback durante la clase.

En la siguiente sesión abriremos `app.tsx` con otra pregunta: **¿dónde tendríamos que tocar para cambiar solo una de estas responsabilidades?**

Para ampliar: [React Router en modo declarativo](https://reactrouter.com/start/declarative/installation).
