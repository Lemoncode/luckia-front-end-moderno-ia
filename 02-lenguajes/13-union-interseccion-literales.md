# Unión, intersección y tipos literales

Hasta ahora cada valor tenía un único tipo. TypeScript permite combinar tipos con dos operadores: la unión (`|`), que admite un tipo u otro, y la intersección (`&`), que exige un tipo y otro. El resultado es un tipo nuevo que, como cualquier otro, podemos nombrar con un alias.

## Unión

Una unión indica que un valor puede ser de cualquiera de los tipos que la forman. Se escribe con `|` entre los tipos.

Imaginemos una función que busca un pedido por su identificador. El identificador llega como número desde la base de datos, pero como string desde la URL. Sin unión tendríamos que recurrir a `any` y perder la comprobación de tipos.

```ts
const findOrder = (id: string | number): void => {
  console.log(`Looking for order ${id}`);
};

findOrder(31);   // OK
findOrder("31"); // OK
findOrder(true);
//        ^^^^ [ts] Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
```

### Sólo lo que tienen en común

Dentro de la función TypeScript no sabe cuál de los dos tipos ha llegado, así que sólo nos deja hacer lo que sea válido para todos los miembros de la unión.

```ts
const formatId = (id: string | number): string => id.toFixed(2);
//                                                   ^^^^^^^ [ts] Property 'toFixed' does not exist on type 'string | number'.
```

`toFixed` existe en `number` pero no en `string`, así que no está permitido. Con uniones de objetos ocurre lo mismo: sólo podemos usar las propiedades comunes a todos.

Para usar lo específico de un tipo hay que comprobar primero cuál tenemos. Ya lo hicimos con `unknown` mediante `typeof`: dentro de cada rama TypeScript reduce la unión al tipo comprobado.

```ts
const normalizeId = (id: string | number): number => {
  if (typeof id === "string") {
    return parseInt(id, 10); // Aquí `id` es string
  }
  return id; // Aquí `id` es number
};

console.log(normalizeId("31")); // 31
console.log(normalizeId(31));   // 31
```

### Unión con `null`

La unión más habitual es con `null` o `undefined`: un valor que puede no existir. Es lo que vimos al hablar de `strictNullChecks`. Si una función puede no encontrar lo que busca, lo declaramos en el tipo de retorno.

```ts
interface Order {
  id: number;
  total: number;
}

const getOrder = (id: number): Order | null =>
  id === 1 ? { id: 1, total: 99.9 } : null;

const order = getOrder(2);

console.log(order.total);
//          ^^^^^ [ts] 'order' is possibly 'null'.

console.log(order?.total ?? 0); // 0
```

TypeScript nos obliga a contemplar el caso `null` antes de acceder, y los operadores `?.` y `??` son la forma más directa de hacerlo.

### Uniones y arrays

Los paréntesis importan: `(string | number)[]` es un array cuyos elementos pueden ser de cualquiera de los dos tipos; `string[] | number[]` es o un array de strings o un array de números, sin mezclar.

```ts
const mixed: (string | number)[] = ["1", 2, "3"];

const wrong: string[] | number[] = ["1", 2];
//    ^^^^^ [ts] Type '(string | number)[]' is not assignable to type 'string[] | number[]'.
```

## Intersección

Una intersección exige que el valor cumpla todos los tipos a la vez. Se escribe con `&`. Con tipos de objeto, el resultado tiene las propiedades de todos ellos, lo que la convierte en una forma de componer tipos parecida a `extends` en las interfaces.

```ts
type Entity = { id: number };
type Timestamps = { createdAt: string; updatedAt: string };

type Product = Entity & Timestamps & { name: string; price: number };

const laptop: Product = {
  id: 1,
  name: "Laptop",
  price: 999,
  createdAt: "2026-09-22",
  updatedAt: "2026-09-22",
};
```

`Entity` y `Timestamps` se pueden reutilizar en cualquier otro tipo, y un `Product` tiene que cumplir los tres contratos.

```ts
const incomplete: Product = {
//    ^^^^^^^^^^ [ts] Type '{ id: number; name: string; price: number; }'
//                    is missing the following properties from type 'Timestamps': createdAt, updatedAt
  id: 2,
  name: "Mouse",
  price: 25,
};
```

### Propiedades en conflicto

Si dos tipos de la intersección declaran la misma propiedad con tipos distintos no hay error al declararla: la propiedad pasa a ser `never`, y el error aparece al intentar crear un valor, porque ninguno puede ser número y string a la vez.

```ts
type Conflict = { id: number } & { id: string }; // `id` es never

const bad: Conflict = { id: 1 };
//                      ^^ [ts] Type 'number' is not assignable to type 'never'.
```

Con `extends` el conflicto se detecta antes, en la propia declaración.

```ts
interface Base {
  id: number;
}

interface Wrong extends Base {
//        ^^^^^ [ts] Interface 'Wrong' incorrectly extends interface 'Base'.
  id: string;
}
```

Por eso lo habitual es componer interfaces con `extends` y reservar la intersección para los alias, que no tienen `extends`.

### Intersección de primitivos

La intersección sólo tiene sentido con objetos. Entre primitivos no hay ningún valor que sea de los dos tipos, así que el resultado es `never`.

```ts
type Impossible = string & number; // never

const value: Impossible = "hello";
//    ^^^^^ [ts] Type '"hello"' is not assignable to type 'never'.
```

## Unión de tipos literales

Un tipo literal es un valor concreto usado como tipo: `"pending"` en lugar de `string`, o `5` en lugar de `number`. Por sí solo no sirve de mucho, pero unido a otros literales limita un valor a un conjunto cerrado de opciones.

```ts
type OrderStatus = "pending" | "shipped" | "delivered";

const orderStatus: OrderStatus = "cancelled";
//    ^^^^^^^^^^^ [ts] Type '"cancelled"' is not assignable to type 'OrderStatus'.

type Rating = 1 | 2 | 3 | 4 | 5;

const stars: Rating = 6;
//    ^^^^^ [ts] Type '6' is not assignable to type 'Rating'.
```

Es la alternativa a los enumerados que mencionamos en el apartado de tipos: no genera código, no hay que importar nada y el editor autocompleta las opciones igual.

Un detalle con la inferencia. Con `const` TypeScript infiere el literal, pero con `let` infiere `string`, porque el valor puede cambiar.

```ts
const setStatus = (value: OrderStatus): void => {
  console.log(`Status: ${value}`);
};

const initial = "pending"; // Tipo "pending"
setStatus(initial);        // OK

let current = "pending";   // Tipo string
setStatus(current);
//        ^^^^^^^ [ts] Argument of type 'string' is not assignable to parameter of type 'OrderStatus'.
```

Basta con anotar la variable, `let current: OrderStatus = "pending"`, para que conserve el tipo.

### `keyof`: las claves como unión de literales

Hasta ahora hemos escrito las uniones de literales a mano. Cuando los valores posibles son los nombres de las propiedades de un tipo, el operador `keyof` construye esa unión por nosotros, y la mantiene al día si el tipo cambia.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User; // "id" | "name" | "email"

const key: UserKey = "age";
//    ^^^ [ts] Type '"age"' is not assignable to type 'keyof User'.
```

En el mensaje de error aparece `keyof User` en lugar de la unión, pero es lo mismo.

Su uso más habitual es en funciones que reciben el nombre de una propiedad. Si lo tipamos como `string`, TypeScript no nos deja acceder a la propiedad, porque cualquier string podría llegar.

```ts
const getField = (user: User, field: string) => user[field];
//                                              ^^^^^^^^^^^ [ts] Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'User'.
```

Con `keyof User` sólo se admiten nombres de propiedades que existen.

```ts
const getField = (user: User, field: keyof User): User[keyof User] => user[field];

const julia: User = { id: 31, name: "Julia", email: "julia@mail.com" };

console.log(getField(julia, "name")); // "Julia"
console.log(getField(julia, "id"));   // 31

getField(julia, "age");
//              ^^^^^ [ts] Argument of type '"age"' is not assignable to parameter of type 'keyof User'.
```

Fíjate en el tipo de retorno: `User[keyof User]` es el `Tipo["propiedad"]` del apartado de alias con todas las claves a la vez, es decir, la unión de los tipos de todas las propiedades: `string | number`.

`getField` sólo sirve para `User`. Hacerla válida para cualquier tipo requiere genéricos, que veremos más adelante.

También nos lo vamos a encontrar al recorrer un objeto con `for...in`, como hicimos en JavaScript. TypeScript tipa `key` como `string`, así que acceder con ella da el mismo error. Como sabemos que las claves son las de `Car`, se lo indicamos con una aserción.

```ts
interface Car {
  brand: string;
  model: string;
  year: number;
}

const car: Car = { brand: "Toyota", model: "Corolla", year: 2022 };

for (const key in car) {
  console.log(car[key]);
//            ^^^^^^^^ [ts] Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Car'.
}

for (const key in car) {
  console.log(car[key as keyof Car]); // "Toyota", "Corolla", 2022
}
```
