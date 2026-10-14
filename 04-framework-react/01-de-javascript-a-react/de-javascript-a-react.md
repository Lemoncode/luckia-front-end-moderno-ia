# 01 · De JavaScript a React

> ⏱️ 2 horas · De actualizar el DOM a describir la interfaz.

| Demo                                   | Momento de la explicación                  |
| -------------------------------------- | ------------------------------------------ |
| [01-javascript](./demos/01-javascript) | Datos, DOM y sincronización manual         |
| [02-react](./demos/02-react)           | La misma pantalla con componentes y estado |

## La página ya no es solo HTML y CSS

Hasta ahora hemos dado estructura a una página con HTML, la hemos colocado con CSS y hemos usado Vite para trabajar con los archivos. Pero vamos a añadir algo que cambia mientras usamos la página: **una lista de personas**.

Tenemos un campo para escribir un nombre, un botón para añadirlo y un contador. Al pulsar el botón tienen que pasar tres cosas:

- Aparece una persona nueva en la lista.
- El contador aumenta.
- El campo vuelve a quedar vacío.

Todo eso se puede hacer con JavaScript. La pregunta es **quién se encarga de mantenerlo coordinado** cuando se pulsa el botón.

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

En el HTML tenemos un input, un botón, un párrafo para el total y una lista vacía. Guardamos las referencias a esos elementos. Hasta aquí, todo controlado por el DOM lo que ya conocemos.

### Paso 1: pintar lo que hay en el array

_./demos/01-javascript/src/main.ts_

```ts
function render() {
  total.textContent = `Personas: ${members.length}`;

  list.replaceChildren(
    ...members.map((member) => {
      const item = document.createElement("li");
      item.className = "rounded bg-white p-3";
      item.textContent = member.name;
      return item;
    }),
  );
}

render();
```

La función recorre el array y construye una fila por persona. El total sale de `members.length`.

Una vez creado el <li>, asignamos el nombre a su propiedad textContent. Esta propiedad sustituye el contenido del elemento por el texto indicado. Usamos texto porque queremos mostrar el nombre tal como se ha escrito, aunque contenga caracteres como < o >

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

En React podemos separar la interfaz en componentes. Por ejemplo, un componente para el formulario y otro para la lista de personas. Cada uno contiene el código que define esa parte de la pantalla, y los combinamos para construir la aplicación.

React es una librería para construir interfaces de usuario. No se trata de un framework completo. El bloque se llama frameworks, pero React por sí solo no incluye las rutas ni una API. Eso lo iremos incorporando cuando lo necesitemos.

## La misma pantalla con React

Pasamos a `demos/02-react`, instalamos con `npm install` en esa carpeta y arrancamos con `npm start`. Conservamos Vite y Tailwind: esa parte ya la vimos. El archivo `main.tsx` monta `<App />` dentro del elemento raíz.

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

| Lo que vemos    | Qué significa                                 |
| --------------- | --------------------------------------------- |
| `MemberItem`    | Nuestro componente; empieza por mayúscula     |
| `member`        | Un dato de entrada: una **prop**              |
| `{member.name}` | Una expresión JavaScript dentro del JSX       |
| `className`     | Las clases CSS; aquí seguimos usando Tailwind |
| `.tsx`          | TypeScript con JSX                            |

Una prop es una entrada de la función. El componente la recibe y la usa; no modifica la persona que le han pasado.

Para mostrar una fila escribimos `<MemberItem member={member} />`. React se encarga de ejecutar el componente.

### Paso 4: una variable que React recuerda

Seguimos en el formulario de nuestra lista de personas. Queremos que el botón **Añadir** esté desactivado mientras el nombre esté vacío. Así podemos ver si cambiar el nombre también actualiza otra parte de la pantalla.

Primero probamos con una variable local dentro de `App`:

```tsx
let name = "";
```

En el JSX del formulario escribimos:

```tsx
<label htmlFor="name">Nombre</label>
<input
  id="name"
  onChange={(event) => {
    name = event.target.value;
    console.log(name);
  }}
/>
<button disabled={!name.trim()}>Añadir</button>
```

Abrimos la consola y escribimos un nombre.

👉 **El nombre aparece en el input y en la consola. ¿Por qué el botón sigue desactivado?**

El navegador actualiza el contenido del input. Nuestro `onChange` también cambia la variable, pero **esa asignación no solicita un nuevo render**. React calculó `disabled={!name.trim()}` cuando el nombre estaba vacío y no ha vuelto a ejecutar el componente para calcularlo con el nuevo valor.

El input todavía no tiene `value`: su contenido lo gestiona el navegador. Por eso podemos escribir aunque React no esté actualizando la pantalla.

Ahora sustituimos la variable por estado. Añadimos al principio del archivo:

```tsx
import { useState } from "react";
```

Dentro de `App`, sustituimos `let name = ""` por:

```tsx
const [name, setName] = useState("");
```

Y cambiamos solo el manejador del input:

```diff
<label htmlFor="name">Nombre</label>
<input
  id="name"
+ onChange={(event) => setName(event.target.value)}
/>
<button disabled={!name.trim()}>Añadir</button>
```

Volvemos a escribir. **Ahora el botón se activa**. Si borramos el nombre o dejamos solo espacios, se desactiva.

`setName` solicita un nuevo render: React vuelve a ejecutar `App`, recupera el estado actualizado y calcula de nuevo si el botón debe estar desactivado.

Aquí hay dos piezas:

- **`name`**: el valor que tenemos en este render.
- **`setName`**: la función con la que solicitamos actualizarlo.

`useState` es nuestro primer **hook**. Permite conservar estado entre ejecuciones del componente. Una variable local normal no hace ese trabajo: cambiarla no solicita otro render y, al ejecutar de nuevo `App`, `let name = ""` vuelve a inicializarla.

Damos un paso más: añadimos `value={name}` para que el estado también determine el contenido del input. El formulario queda así:

```diff
<label htmlFor="name">Nombre</label>
<input
  id="name"
+ value={name}
  onChange={(event) => setName(event.target.value)}
/>
<button disabled={!name.trim()}>Añadir</button>
```

Lo llamamos **input controlado** porque su valor lo decide el estado. El mismo dato controla ahora el texto del campo y si podemos pulsar Añadir. En el siguiente paso, `setName("")` nos permitirá vaciar el campo después de añadir una persona.

Ojo con otro cambio respecto al HTML: `for` se escribe `htmlFor`.

### Paso 5: el evento actualiza el estado

Ahora hacemos lo mismo con la lista. Sustituimos la declaración `const members: Member[] = [...]` por:

```tsx
const [members, setMembers] = useState<Member[]>([
  { id: "1", name: "Julia" },
  { id: "2", name: "Evan" },
]);
```

Dentro de `App`, antes del `return`, añadimos la función para dar de alta una persona:

```tsx
const addMember = () => {
  const trimmed = name.trim();
  if (!trimmed) return;

  const member = { id: crypto.randomUUID(), name: trimmed };
  setMembers((previous) => [...previous, member]);
  setName("");
};
```

Aquí reaparece el spread del bloque de lenguajes: creamos un array nuevo, no hacemos `push` sobre el anterior. La función de actualización recibe el estado pendiente y devuelve el siguiente.

Conectamos el botón:

```tsx
<button onClick={addMember} disabled={!name.trim()}>
  Añadir
</button>
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

Al mostrar una lista con `map`, ponemos una `key` en cada elemento para que React pueda reconocerlo entre renders. Usamos member.id, que asignamos al crear la persona y conservamos durante toda su vida en la lista.

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
  setMembers((previous) => previous.filter((member) => member.id !== id));
};

// Dentro del map:
<MemberItem key={member.id} member={member} onRemove={removeMember} />;
```

Borramos la primera persona. Desaparece su fila y baja el contador.

👉 **Los datos bajan por props; las acciones avisan al dueño del estado.** Este recorrido lo vamos a repetir mucho.

El proyecto guardado contiene el punto de partida con variables. La incorporación del estado, el alta y esta última ampliación de eliminar las desarrollamos juntos en clase.

## Con qué nos quedamos

| Concepto      | En nuestro ejemplo                           |
| ------------- | -------------------------------------------- |
| Componente    | Una fila o la aplicación                     |
| Props         | La persona y la acción de eliminar           |
| Estado        | La lista y el nombre que estamos escribiendo |
| Evento        | El clic o el cambio del input                |
| Dato derivado | El total de personas                         |

## Para ampliar

La documentación oficial de React en español incluye explicaciones y ejemplos que podemos modificar en el navegador. Para repasar esta sesión, proponemos este orden:

1. [Inicio rápido](https://es.react.dev/learn): una primera visión de componentes, JSX, eventos y estado.
2. [Tu primer componente](https://es.react.dev/learn/your-first-component): cómo definir componentes y combinarlos para construir una pantalla.
3. [El estado: la memoria de un componente](https://es.react.dev/learn/state-a-components-memory): por qué una variable local no basta y qué aporta `useState`.
4. [Renderizado de listas](https://es.react.dev/learn/rendering-lists): cómo mostrar arrays con `map` y elegir una `key` para cada elemento.

También encontramos más ejemplos en el [bloque de React del máster de Lemoncode](https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/01-react). Su recorrido es más amplio que el de esta sesión; podemos consultarlo como material complementario.
