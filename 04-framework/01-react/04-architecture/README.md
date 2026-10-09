# 04 · Arquitectura

> ⏱️ 2 horas · La aplicación funciona. Ahora queremos entender dónde cambiarla.

## El problema aparece cuando hay que tocar algo

Terminamos la sesión anterior con lista, detalle y navegación. Ahora llegan tres cambios:

- La dirección del listado deja de ser `/members`.
- Queremos otro aspecto para las tarjetas.
- El servidor cambia el nombre de un campo.

**Son tres motivos de cambio diferentes.** Si para cualquiera tenemos que recorrer el mismo archivo enorme, la estructura empieza a estorbar.

Hoy vamos a reorganizar esa aplicación. Partimos de una copia de `03-basic-app`; `04-architecture` contiene el resultado del refactor. Conservamos Vite, Tailwind, las rutas y los datos.

## Primero las responsabilidades; después las carpetas

Abrimos `app.tsx`. Ahí aparecen la tabla de rutas, el marco común, las pantallas, el filtro y la lectura de parámetros.

Antes de mover nada, situamos cada decisión:

| Decisión | A qué pertenece |
| --- | --- |
| Qué componente corresponde a una dirección | Router |
| Qué cabecera comparten las pantallas | Layout |
| Qué parámetro necesita esta pantalla | Escena |
| Cómo se cargan y preparan sus datos | Lógica de la funcionalidad |
| Cómo se muestran | Presentación |
| A qué URL pedimos el JSON | API |

No hay una única estructura válida. Vamos a usar esta para que esas responsabilidades se reconozcan en el código.

## Vamos a verlo

Arrancamos la aplicación con `npm start`. Haremos las extracciones una a una y volveremos a navegar después de cada cambio.

### Paso 1: dar nombre a las rutas

_./src/core/router/routes.ts_

```ts
export const routes = {
  members: "/members",
  memberPattern: "/members/:id",
  member: (id: number) => `/members/${id}`,
};
```

El patrón `/members/:id` sirve para declarar la ruta. La función `member(1)` construye un enlace concreto.

Ahora router y enlaces usan estos nombres. Si cambiamos una dirección, tenemos un sitio donde hacerlo.

Ojo: **ruta de pantalla** y **dirección de datos** son cosas distintas. `/members/1` muestra una pantalla; `/members/1.json` devuelve los datos de nuestra demo.

### Paso 2: sacar el marco común

Movemos el `main` y la navegación a un layout:

_./src/layouts/app-layout.tsx_

```tsx
export function AppLayout() {
  return (
    <main>
      <nav aria-label="Principal">
        <Link to={routes.members}>Directorio</Link>
      </nav>
      <p>Datos ficticios para la clase.</p>
      <Outlet />
    </main>
  );
}
```

Este archivo importa `Link` y `Outlet` desde `react-router`, y `routes` desde `../core/router/routes`.

**`Outlet` es el hueco de la pantalla.** En el router agrupamos las rutas bajo ese layout:

```tsx
<Route element={<AppLayout />}>
  <Route path={routes.members} element={<MemberListScene />} />
  <Route path={routes.memberPattern} element={<MemberDetailScene />} />
</Route>
```

Comentamos un momento `<Outlet />`: sigue apareciendo la navegación, pero desaparece el contenido. Lo recuperamos.

👉 El layout decide lo que comparten las pantallas; la ruta hija decide qué aparece en ese hueco.

### Paso 3: una entrada por pantalla

La escena conecta la navegación con la funcionalidad. En el detalle lee el identificador:

_./src/scenes/member-detail.scene.tsx_

```tsx
export function MemberDetailScene() {
  const { id = "" } = useParams();

  return (
    <>
      <h1>Detalle del equipo</h1>
      <Link to={routes.members}>Volver al listado</Link>
      <MemberDetailContainer id={id} />
    </>
  );
}
```

La escena importa las piezas del router y el container. El container recibe `id` como prop: ya no necesita saber de dónde ha salido.

La escena de lista es muy pequeña. En una aplicación diminuta podríamos prescindir de esa capa; aquí nos sirve para mantener una entrada clara por pantalla.

## La funcionalidad junta: un pod

Un **pod** es una carpeta que agrupa una funcionalidad. En este ejemplo tenemos `pods/members`: lista y detalle pertenecen al mismo directorio y comparten sus datos.

Dentro distinguimos quién coordina y quién presenta.

### Paso 4: separar container y component

El componente del listado recibe lo necesario para dibujar la pantalla:

```tsx
interface Props {
  members: Member[];
  filter: string;
  onFilterChange: (value: string) => void;
}
```

No hace peticiones. Recibe personas, muestra el campo y comunica sus cambios.

El container se queda con el estado y la coordinación:

```tsx
const { members, loading, error } = useMembers();
const [filter, setFilter] = useState("");

const visible = members.filter(member =>
  member.name.toLowerCase().includes(filter.toLowerCase())
);

if (loading) return <><h1>Equipo</h1><Loading /></>;
if (error) return <><h1>Equipo</h1><ErrorMessage message={error} /></>;

return (
  <MemberListComponent
    members={visible}
    filter={filter}
    onFilterChange={setFilter}
  />
);
```

**Es el mismo flujo que vimos al eliminar una persona:** datos hacia el hijo; un callback para avisar al dueño del estado.

El componente sigue usando `Link`. No estamos construyendo una biblioteca visual independiente de esta aplicación. Si necesitásemos reutilizarlo fuera de ella, revisaríamos también esa dependencia.

### Paso 5: lo que ya comparten varias pantallas

Lista y detalle muestran carga y errores. Esas piezas no saben nada de personas, así que las movemos a `common/components`.

Cambiamos el texto de `Loading`. Se modifica tanto en lista como en detalle.

👉 **Primero aparece una necesidad compartida y después extraemos.** No llenamos `common` de piezas «por si algún día» se reutilizan.

En esta versión, el container devuelve carga o error antes de mostrar el formulario. Por eso el filtro aparece al terminar la carga. Si necesitáramos conservarlo visible, el componente recibiría también esos estados y mantendría el formulario montado.

## El acceso a datos tiene otra responsabilidad

### Paso 6: colocar la API junto a la funcionalidad

Movemos `getMembers` y `getMember` a `pods/members/api/index.ts`.

Estas funciones conocen las direcciones de los JSON y cómo leer las respuestas. No importan React ni actualizan estado. El hook decide cuándo llamarlas y cuándo cancelar.

```text
Escena → Container → Hook → API
             ↓
         Component
```

El container coordina el resultado del hook con lo que presenta el componente.

La estructura queda así:

```text
src/
  core/router/        direcciones y composición del router
  layouts/            marco común
  scenes/             entrada de cada pantalla
  pods/members/
    api/              lectura de datos
    hooks.ts          estado, efectos y limpieza
    model.ts          Member
    *.container.tsx   coordinación
    *.component.tsx   presentación
    index.ts          entrada pública del pod
  common/components/  carga y error
```

El `index.ts` del pod exporta sus containers. Las escenas importan desde ahí. Dentro del pod usamos imports directos, para no pasar por su propia entrada pública y crear dependencias circulares.

## ¿Hace falta un modelo para cada capa?

Ahora mismo el JSON tiene `id`, `name`, `role` y `email`. La pantalla usa esos mismos datos. Nuestro tipo `Member` nos sirve.

Crear otros dos tipos idénticos y una función que copie los cuatro campos no nos aporta mucho todavía.

Pero vamos a provocar un cambio.

### Paso 7: el servidor ahora devuelve `full_name`

En la copia de la demo cambiamos `name` por `full_name`, tanto en `members.json` como en los tres detalles.

La pantalla sigue esperando `member.name`.

👉 **¿Tenemos que cambiar todos los componentes porque el servidor ha renombrado un campo?**

Podemos traducir la respuesta al entrar. Esa función es un **mapper**.

_./src/pods/members/api/member.api-model.ts_

```ts
export interface MemberApiModel {
  id: number;
  full_name: string;
  role: string;
  email: string;
}
```

_./src/pods/members/api/member.mapper.ts_

```ts
import type { Member } from "../model";
import type { MemberApiModel } from "./member.api-model";

export const mapMember = (data: MemberApiModel): Member => ({
  id: data.id,
  name: data.full_name,
  role: data.role,
  email: data.email,
});
```

En `api/index.ts` importamos ambos. Tras comprobar la respuesta del listado:

```ts
const data: MemberApiModel[] = await response.json();
return data.map(mapMember);
```

En el detalle, después de las guardas de error y no encontrado:

```ts
const data: MemberApiModel = await response.json();
return mapMember(data);
```

Volvemos a la lista, filtramos y entramos en un detalle. Los componentes siguen usando `name`. El cambio externo se ha resuelto en la entrada de datos.

**El mapper es una función pura**, como las del bloque de lenguajes. Transforma datos; no hace peticiones ni maneja estado.

> El tipo TypeScript no valida el JSON en ejecución. En una API externa podríamos añadir validación en esa entrada. Aquí estamos mostrando dónde traducir un cambio de contrato.

Esta última demostración se desarrolla en clase. El proyecto guardado conserva el contrato original para compararlo con la sesión 3.

## Volvemos a los tres cambios del principio

| Si cambia… | Empezamos por… |
| --- | --- |
| La dirección del listado | `core/router` |
| El aspecto de las tarjetas | El component del listado |
| El nombre de un campo externo | API model y mapper |

Recorremos otra vez lista, detalle, Atrás, Siguiente, error y no encontrado. Después ejecutamos `npm run build`.

La arquitectura nos tiene que ayudar a encontrar y limitar los cambios. Si para una pantalla pequeña estamos saltando entre carpetas que no aportan ninguna decisión distinta, también podemos simplificar.

Context, estado global o una librería de peticiones pueden llegar después. Para organizar esta aplicación no los hemos necesitado.
