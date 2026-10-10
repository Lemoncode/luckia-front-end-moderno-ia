# 01 · De JavaScript a React

> ⏱️ 2 horas · De actualizar el DOM a describir la interfaz.

| Demo | Momento de la explicación |
| --- | --- |
| [01-javascript](./demos/01-javascript) | Datos, DOM y sincronización manual |
| [02-react](./demos/02-react) | La misma pantalla con componentes y estado |

## Antes de la clase

Partimos de HTML, CSS, JavaScript y de lo aprendido sobre [React con Vite](../../03-bundling/07-react/README.md) y [Tailwind](../../03-bundling/09-tailwindcss/README.md). Usamos Node 22.12 o superior. Cada demo tiene su propia instalación: no instalamos dependencias en la raíz del módulo.

## Recorrido de la sesión · 120 minutos

| Minutos | Explicación |
| --- | --- |
| 0–45 | DOM, lista y problema de sincronización |
| 45–50 | Pausa |
| 50–100 | JSX, props, estado, eventos y claves |
| 100–120 | Eliminar personas y recapitulación |

## La página ya no es solo HTML y CSS

Hasta ahora hemos dado estructura a una página con HTML, la hemos colocado con CSS y hemos usado Vite para trabajar con los archivos. Pero vamos a añadir algo que cambia mientras usamos la página: **una lista de personas**.

Tenemos un campo para escribir un nombre, un botón para añadirlo y un contador. Al pulsar el botón tienen que pasar tres cosas:

- Aparece una persona nueva en la lista.
- El contador aumenta.
- El campo vuelve a quedar vacío.

Todo eso se puede hacer con JavaScript. La pregunta es **quién se encarga de mantenerlo coordinado** cuando la pantalla empieza a crecer.

## Vamos a verlo: primero con JavaScript

Tenemos la base de Vite y Tailwind en `demos/01-javascript`. Desde esa carpeta ejecutamos `npm install` la primera vez y después `npm start`. Abrimos `src/main.ts`.

### Paso 0: los datos y la pantalla

Partimos de dos personas:

```ts
let members = [
  { id: 1, name: "Julia" },
  { id: 2, name: "Evan" },
];
```

En el HTML tenemos un input, un botón, un párrafo para el total y una lista vacía. Guardamos las referencias a esos elementos. Hasta aquí, DOM: lo que ya conocemos.

### Paso 1: pintar lo que hay en el array

_./demos/01-javascript/src/main.ts_

```ts
function render() {
  total.textContent = `Personas: ${members.length}`;

  list.replaceChildren(...members.map(member => {
    const item = document.createElement("li");
    item.className = "rounded bg-white p-3";
    item.textContent = member.name;
    return item;
  }));
}

render();
```

La función recorre el array y construye una fila por persona. El total sale de `members.length`. Los nombres entran con `textContent`: son texto, no HTML que queramos interpretar.

**Los datos están en un sitio y su representación en otro.** Esta función es la que los conecta.

### Paso 2: añadir una persona

En el evento del botón leemos el nombre y actualizamos el array:

```ts
const name = input.value.trim();
if (!name) return;

members = [...members, { id: Date.now(), name }];
render();
input.value = "";
```

Pulsamos Añadir. Aparecen la fila y el nuevo total. Funciona.

Ahora comentamos **solo** la llamada a `render()` del evento y volvemos a pulsar.

👉 **¿Ha cambiado el array? ¿Ha cambiado la pantalla?** Ponemos un breakpoint después de la asignación: la persona está en los datos, pero no aparece en la lista.

El navegador no sabe que ese array representa nuestra lista. Cambiar una variable no modifica el DOM. Tenemos que hacerlo nosotros.

Recuperamos `render()`. Si mañana añadimos otro contador en la cabecera, un resumen o un botón que se desactive cuando no haya personas, tendremos que acordarnos de actualizar cada pieza.

> No estamos demostrando que JavaScript «no pueda». Estamos viendo el trabajo que hay que organizar: **estado, eventos y pantalla**.

## Qué aporta React

React nos permite describir **cómo debe ser la interfaz con los datos actuales**. Cuando actualizamos el estado, React vuelve a calcular esa descripción y aplica los cambios necesarios al DOM.

```text
Evento → actualizamos el estado → React calcula la interfaz → actualiza el DOM
```

Además, podemos dividir esa descripción en piezas: los **componentes**.

React es una biblioteca de interfaces. El bloque se llama frameworks, pero React por sí solo no incluye las rutas ni una API. Eso lo iremos incorporando cuando lo necesitemos.

## La misma pantalla con React

Pasamos a `demos/02-react`, instalamos con `npm install` en esa carpeta y arrancamos con `npm start`. Conservamos Vite y Tailwind: esa parte ya la vimos en bundling. El archivo `main.tsx` monta `<App />` dentro del elemento raíz.

### Paso 3: una fila se convierte en un componente

_./demos/02-react/src/app.tsx_

```tsx
interface Member {
  id: string;
  name: string;
}

function MemberItem({ member }: { member: Member }) {
  return <li className="rounded bg-white p-3">{member.name}</li>;
}
```

Parece HTML, pero es **JSX**: una sintaxis que usamos dentro de JavaScript para describir elementos.

| Lo que vemos | Qué significa |
| --- | --- |
| `MemberItem` | Nuestro componente; empieza por mayúscula |
| `member` | Un dato de entrada: una **prop** |
| `{member.name}` | Una expresión JavaScript dentro del JSX |
| `className` | Las clases CSS; aquí seguimos usando Tailwind |
| `.tsx` | TypeScript con JSX |

Una prop es una entrada de la función. El componente la recibe y la usa; no modifica la persona que le han pasado.

Para mostrar una fila escribimos `<MemberItem member={member} />`. React se encarga de ejecutar el componente.

### Paso 4: una variable que React recuerda

Vamos a guardar lo que escribimos en el campo:

```tsx
const [name, setName] = useState("");
```

Aquí hay dos piezas:

- **`name`**: el valor que tenemos en este render.
- **`setName`**: la función con la que solicitamos actualizarlo.

`useState` es nuestro primer **hook**. Permite conservar estado entre ejecuciones del componente.

Una variable local normal no hace ese trabajo: cambiarla no solicita otro render y, al ejecutar de nuevo la función, volvemos a declararla.

Conectamos el estado al input:

```tsx
<label htmlFor="name">Nombre</label>
<input
  id="name"
  value={name}
  onChange={event => setName(event.target.value)}
/>
```

Escribimos una letra. Se ejecuta `onChange`, actualizamos el estado y React vuelve a mostrar el input con ese valor. Lo llamamos **input controlado** porque su valor lo decide el estado.

Ojo con otro cambio respecto al HTML: `for` se escribe `htmlFor`.

### Paso 5: el evento actualiza el estado

La lista también vive en un estado. Para añadir una persona:

```tsx
const addMember = () => {
  const trimmed = name.trim();
  if (!trimmed) return;

  const member = { id: crypto.randomUUID(), name: trimmed };
  setMembers(previous => [...previous, member]);
  setName("");
};
```

Aquí reaparece el spread del bloque de lenguajes: creamos un array nuevo, no hacemos `push` sobre el anterior. La función de actualización recibe el estado pendiente y devuelve el siguiente.

Conectamos el botón:

```tsx
<button onClick={addMember}>Añadir</button>
```

👉 **¿Por qué no ponemos `addMember()`?** Porque eso ejecutaría la función mientras pintamos el componente. Sin paréntesis pasamos la función para que se ejecute al hacer clic. Es lo mismo que vimos con los callbacks.

### Paso 6: lista y contador salen del mismo dato

```tsx
<p>Personas: {members.length}</p>

<ul className="space-y-2">
  {members.map(member => (
    <MemberItem key={member.id} member={member} />
  ))}
</ul>
```

Añadimos una persona: cambian la lista y el contador. **Ya no llamamos nosotros a `render()`.**

El total no necesita otro estado. Si ya tenemos el array, podemos calcular su longitud.

La `key` identifica cada fila entre renders. Usamos el identificador de la persona, que se mantiene aunque cambie su posición. El nombre podría repetirse; el índice cambia al borrar; un número aleatorio generado en cada render no conservaría la identidad.

## Vamos a añadir también Eliminar

La lista pertenece a `App`, pero el botón estará dentro de `MemberItem`. ¿Cómo avisamos al padre?

Pasamos otra prop, esta vez una función:

```tsx
function MemberItem({
  member,
  onRemove,
}: {
  member: Member;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="rounded bg-white p-3">
      {member.name}{" "}
      <button onClick={() => onRemove(member.id)}>Eliminar</button>
    </li>
  );
}
```

En `App` definimos la acción y la pasamos a cada fila:

```tsx
const removeMember = (id: string) => {
  setMembers(previous => previous.filter(member => member.id !== id));
};

// Dentro del map:
<MemberItem key={member.id} member={member} onRemove={removeMember} />
```

Borramos la primera persona. Desaparece su fila y baja el contador. El hijo no ha necesitado otra copia de la lista.

👉 **Los datos bajan por props; las acciones avisan al dueño del estado.** Este recorrido lo vamos a repetir mucho.

Esta última ampliación la desarrollamos en clase; el proyecto guardado contiene la versión de añadir personas.

## Con qué nos quedamos

| Concepto | En nuestro ejemplo |
| --- | --- |
| Componente | Una fila o la aplicación |
| Props | La persona y la acción de eliminar |
| Estado | La lista y el nombre que estamos escribiendo |
| Evento | El clic o el cambio del input |
| Dato derivado | El total de personas |

Terminamos ejecutando `npm run build`. En la siguiente sesión veremos qué ocurre cuando el componente tiene que coordinarse con algo que está fuera de React: un temporizador o una petición.

## Material de partida

Adaptamos el ejemplo previo: empezamos con JavaScript para observar la coordinación entre datos y DOM y pasamos después a componentes y estado.

[React en el máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react).
