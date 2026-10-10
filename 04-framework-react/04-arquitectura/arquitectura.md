# 04 · Arquitectura: directorio y edición

> ⏱️ 2 horas · Dos funcionalidades que comparten datos sin depender una de la otra.

## Antes de la clase

Partimos de la aplicación con rutas, componentes y formulario de alta de la sesión anterior. Usamos Node 22.12 o superior; la demo tiene su propia instalación.

## Recorrido de la sesión · 120 minutos

| Minutos | Explicación |
| --- | --- |
| 0–10 | Nuevas necesidades y responsabilidades |
| 10–30 | Router, layout y escenas |
| 30–50 | Pod de directorio |
| 50–55 | Pausa |
| 55–80 | Pod de edición y reutilización del formulario |
| 80–95 | Contratos y repositorio compartidos |
| 95–110 | Cambio de contrato si hay tiempo; si no, recorrido guiado de edición |
| 110–120 | Comprobaciones y cierre |

## La aplicación ya tiene piezas que cambian por motivos distintos

Partimos de `03-aplicacion/demos/03-formulario`: lista, detalle y alta. Hoy añadimos edición y organizamos el código para que ese crecimiento tenga un sitio claro.

La demo final está en [demos/01-pods](./demos/01-pods). Desde esa carpeta ejecutamos `npm install` la primera vez y después `npm start`. Trabajamos con TanStack Router, TanStack Form, Zod y Tailwind, igual que en la clase anterior.

Primero mostramos el recorrido completo: entramos en Julia, pulsamos **Editar persona**, cambiamos el puesto y guardamos. Volvemos al detalle y después al listado. Sigue siendo la misma persona.

👉 ¿Dónde debería vivir el formulario? ¿Tiene sentido que el listado tenga que conocer sus campos y validaciones?

## Dos pods con una responsabilidad reconocible

Un pod agrupa una funcionalidad. Vamos a tener dos:

| Pod | Lo que resuelve |
| --- | --- |
| `directorio` | Consultar la lista y el detalle |
| `edicion` | Dar de alta o editar una persona |

El directorio enlaza a una ruta de edición. **No importa el formulario ni sus containers.** La navegación conecta ambas funcionalidades.

Los dos necesitan leer personas, así que el contrato y el repositorio viven en `core/members`. No están escondidos dentro de un pod que el otro tenga que atravesar.

## Vamos a organizarlo

### Paso 0: el mapa del código

```text
src/
  routes/                 entradas de TanStack Router
    __root.tsx
    index.tsx
    members/
      index.tsx
      new.tsx
      $memberId/
        index.tsx
        edit.tsx
  core/
    router/router.ts      creación y registro tipado del router
    members/
      model.ts            contrato Member y MemberInput
      member.schema.ts    reglas de entrada
      api.ts              lectura y guardado local
      hooks.ts            estado, carga, error y limpieza
  layouts/
    app-layout.tsx
  scenes/
    directorio.scene.tsx
    detalle.scene.tsx
    edicion.scene.tsx
  pods/
    directorio/
    edicion/
  common/components/
    request-status.tsx
  routeTree.gen.ts         generado por el plugin; no se edita
```

Los nombres técnicos `src`, `routes` o `pods` son convenciones del código. Las carpetas de las clases mantienen el mismo patrón: un documento con el nombre del tema y una carpeta de demos.

### Paso 1: las rutas se quedan con la navegación

El árbol sale de los archivos, igual que en la sesión anterior. No añadimos una segunda tabla manual de rutas.

Para la edición:

_./src/routes/members/$memberId/edit.tsx_

```tsx
export const Route = createFileRoute("/members/$memberId/edit")({
  component: EditPage,
});

function EditPage() {
  const { memberId } = Route.useParams();
  return <EdicionScene id={memberId} />;
}
```

El archivo de ruta conoce sus parámetros tipados y los entrega a la escena. El formulario no tiene por qué leer la URL.

Movemos el marco común a `AppLayout`: navegación, texto de la demo y `Outlet`. La raíz del router lo usa como componente.

👉 Quitamos un momento `Outlet`. Queda el marco pero desaparece la pantalla. Lo recuperamos: esa pieza es el hueco de las rutas hijas.

### Paso 2: las escenas componen una pantalla

La escena de detalle añade el título, el enlace de vuelta y el container del directorio. La de edición decide si estamos creando o modificando:

```tsx
{id
  ? <EdicionContainer key={id} id={id} onSaved={onSaved} />
  : <AltaContainer onSaved={onSaved} />}
```

`onSaved` pertenece a la escena. Recibe la persona guardada y navega a su detalle con el parámetro tipado.

Así el pod de edición recibe una acción de salida; no necesita decidir la siguiente pantalla.

La `key` evita que, al cambiar de identificador, un formulario conserve accidentalmente el borrador de otra persona.

## El pod de directorio

### Paso 3: separar coordinación y presentación

El container decide qué datos y qué estado debe mostrar. El componente recibe props y presenta la lista.

_./src/pods/directorio/directorio.container.tsx_

```tsx
const { members, loading, error } = useMembers();
const [filter, setFilter] = useState("");

if (loading) return <Loading />;
if (error) return <ErrorMessage message={error} />;

const visible = members.filter(member =>
  member.name.toLowerCase().includes(filter.toLowerCase())
);

return (
  <DirectorioComponent
    members={visible}
    filter={filter}
    onFilterChange={setFilter}
  />
);
```

Los hooks se llaman antes de los returns condicionales. El filtrado sigue siendo un cálculo, no otro estado.

El component conserva el input y las tarjetas. Las utilidades Tailwind siguen junto a la estructura del componente. Un cambio de aspecto no requiere tocar la petición.

Carga y error pasan a `common/components`, porque ya los necesitan directorio y edición y no contienen reglas de personas.

> En este refactor el filtro se muestra al terminar la carga. Si quisiéramos que permaneciese visible, pasaríamos esos estados al component en lugar de hacer los returns antes. Es una decisión de presentación, no una obligación de los containers.

### Paso 4: una entrada pública del pod

`pods/directorio/index.ts` exporta sus dos containers. Las escenas importan desde ahí.

Dentro del pod usamos imports directos. No exportamos cada detalle interno «por si acaso». La entrada pública deja claro qué puede utilizar el resto de la aplicación.

## El pod de edición

### Paso 5: un formulario para dos casos

El alta empieza con valores vacíos. La edición necesita leer una persona antes de montar el formulario:

_./src/pods/edicion/edicion.container.tsx_

```tsx
const { member, loading, error } = useMember(id);

if (loading) return <Loading />;
if (error) return <ErrorMessage message={error} />;
if (!member) return <p>Persona no encontrada.</p>;

return (
  <EdicionComponent
    key={member.id}
    initialValues={member}
    onSave={async values =>
      onSaved(await saveMember(values, member.id))
    }
  />
);
```

El formulario se monta cuando ya tenemos datos. Así sus valores iniciales no son un objeto vacío que llega antes que la petición.

La versión de alta llama a `saveMember(values)` sin identificador. La de edición pasa el identificador existente.

**Crear asigna una identidad; editar conserva esa identidad.** No añadimos otra Julia al array cada vez que cambia su puesto.

### Paso 6: el component no decide dónde guardar

`EdicionComponent` conserva la integración con TanStack Form y Zod de la clase anterior. Recibe:

```tsx
interface Props {
  initialValues?: MemberInput;
  onSave: (values: MemberInput) => Promise<void>;
}
```

La promesa permite mantener el botón desactivado durante el guardado. Si rechaza, el formulario muestra el error y conserva lo escrito.

No copiamos el formulario del alta para crear otro de edición. Reutilizamos el comportamiento que ya teníamos; el container aporta el caso de uso.

👉 Cambiamos la validación del nombre en un sitio y probamos alta y edición. Ambas aplican la misma regla.

## Qué comparten y qué no

```text
Rutas → Escenas → Pod directorio ─┐
                   Pod edición ─┼→ core/members → JSON + localStorage
                                └→ common/components
```

Ningún pod importa al otro. Comparten contratos y lectura de datos de esta aplicación.

| Pieza | Por qué está ahí |
| --- | --- |
| `core/members` | El dominio común a las dos funcionalidades |
| `common/components` | Mensajes genéricos sin conocimiento de personas |
| `pods/edicion` | Formulario, alta y edición |
| `pods/directorio` | Listado, filtro y detalle |
| `scenes` | Composición y navegación después de una acción |

No hemos añadido Context para compartir el estado. Al volver al detalle, se monta su lectura y recupera los datos guardados. Una caché de datos introduciría también decisiones de invalidación; eso queda para un paso posterior.

## La persistencia sigue siendo una demo local

`core/members/api.ts` lee las personas iniciales y aplica las altas o cambios guardados bajo `luckia-architecture-members`.

Guardamos solo los cambios de esta demo en `localStorage`. La recarga los conserva, pero no hay servidor, usuarios concurrentes ni sincronización entre dispositivos. Si cambiamos de demo, cambiamos también de clave.

Al guardar, el repositorio valida y transforma con `memberSchema.parse`. Antes de editar comprueba que exista el identificador. Un fallo de lectura o almacenamiento se convierte en un error del formulario.

Las fixtures y el almacenamiento local están controlados para la clase. Si esta entrada pasase a ser una API externa, tendríamos que validar también las respuestas y aplicar las reglas del lado servidor.

## Si queda tiempo: un contrato externo distinto

El nombre que usa la vista no tiene por qué ser el que usa una API. Si una respuesta pasa a enviar `full_name`, introducimos un modelo externo y un mapper:

```ts
type MemberApiModel = Omit<Member, "name"> & { full_name: string };

const mapMember = (data: MemberApiModel): Member => ({
  id: data.id,
  name: data.full_name,
  role: data.role,
  email: data.email,
});
```

En la copia de la demo cambiamos el nombre del campo de las fixtures iniciales y aplicamos `data.map(mapMember)` después de leerlas. Los cambios locales siguen usando el modelo interno `Member`; no aplicamos el mapper de la API sobre ellos.

No hace falta ejecutar esta ampliación para entender los dos pods. El ejemplo entregado conserva el contrato inicial.

## Volvemos al navegador

1. Damos de alta una persona y abrimos su detalle.
2. Entramos en edición: los campos ya tienen sus valores.
3. Cambiamos el puesto, guardamos y volvemos al listado.
4. La persona aparece una sola vez; conserva su identificador.
5. Recargamos: el cambio sigue ahí.
6. Probamos un correo inválido: no salimos del formulario.
7. Cancelamos una edición: el borrador no se guarda.
8. Abrimos `/members/999/edit`: mostramos que no existe.
9. Bloqueamos `members.json` después de cargar el formulario: el guardado falla y el borrador se conserva.

Ejecutamos `npm run build`. Cerramos preguntando dónde cambiaríamos la navegación, una tarjeta o una regla de validación. La estructura debería ayudar a encontrar esas respuestas.

## Material de partida

Partimos de 05b-architecture: organizamos escenas, componentes y dos pods, directorio y edición, con contratos compartidos.

[React en el máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react).
