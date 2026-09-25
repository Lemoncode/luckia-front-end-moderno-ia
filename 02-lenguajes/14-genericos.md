# Genéricos

Un genérico es un parámetro de tipo. Igual que una función recibe valores como parámetros y trabaja con ellos sin saber de antemano cuáles serán, una función, una interfaz o un alias pueden recibir un tipo como parámetro y utilizarlo en su definición. El tipo concreto se decide en cada uso, y TypeScript lo comprueba como si lo hubiéramos escrito a mano. Así podemos escribir código que vale para cualquier tipo sin renunciar al tipado.

## El problema

Supongamos que queremos una función que devuelva el primer elemento de una lista. En JavaScript una implementación es tan sencilla como la siguiente:

```js
function first(items) {
  return items[0];
}

const s = first(["zero", "one", "two"]);
console.log(s);
const n = first([0, 1, 2]);
console.log(n);
```

Cuando trasladamos este ejemplo a TypeScript nos encontramos con el dilema de qué tipo utilizar en los parámetros. Si intentamos atar el parámetro a un tipo como `string` o `number` no podemos reutilizar la función con otros tipos de datos.

```ts
function first(items: string[]): string {
  return items[0];
}

const s = first(["zero", "one", "two"]);
console.log(s);
const n = first([0, 1, 2]);
//               ^  ^  ^ [ts] Type 'number' is not assignable to type 'string'.
```

Crear una función por cada tipo de dato con la misma implementación es inviable por duplicidad y la infinidad de tipos que pueden existir.
Podemos estar tentados a usar `any` como tipo pero ya hemos visto que sería como volver al mundo de JavaScript sin tipos.

```ts
function first(items: any[]): any {
  return items[0];
}

// Ahora sí podemos utilizar diferentes tipos de datos
const s = first(["zero", "one", "two"]);
const n = first([0, 1, 2]);

// Provocamos un 'typo' silencioso
console.log(s.toUperCase()); // TypeError: s.toUperCase is not a function
```

Es por ello que existen los genéricos: nos permiten escribir una única implementación válida para múltiples tipos de datos, sin atarla a un tipo concreto y sin renunciar al tipado.

## Genéricos en funciones

El parámetro de tipo se declara entre `<>` antes de los paréntesis y se utiliza dentro de la firma como si fuera un tipo más.

```ts
function first<T>(items: T[]): T {
  return items[0];
}
```

`T` es un hueco que se rellena en cada llamada. Lo importante es la relación que expresa la firma: si entra un array de `T`, sale un `T`. Eso es justo lo que `any` perdía.

No hace falta indicar el tipo al llamar: TypeScript lo infiere del argumento.

```ts
const n = first([1, 2, 3]);      // number
const s = first(["a", "b"]);     // string
const m = first([1, "a", true]); // string | number | boolean

console.log(n);         // 1
console.log(first([])); // undefined
```

También podemos indicarlo de forma explícita. Entonces TypeScript comprueba que el argumento encaje con el tipo indicado.

```ts
const e = first<string>(["a", "b"]); // string | undefined

first<number>(["a"]);
//             ^^^ [ts] Type 'string' is not assignable to type 'number'.
```

Y como el tipo de salida depende del de entrada, el error que con `any` sólo veíamos en ejecución ahora lo ve el compilador.

```ts
first([1, 2, 3])?.toUpperCase();
//                ^^^^^^^^^^^ [ts] Property 'toUpperCase' does not exist on type 'number'.
```

En una función flecha el parámetro de tipo va delante de los paréntesis.

```ts
const last = <T>(items: T[]): T | undefined => items[items.length - 1];

console.log(last([1, 2, 3])); // 3
```

En los ficheros `.tsx` de React esta sintaxis no compila, porque `<T>` se confunde con una etiqueta JSX. La solución habitual es añadir una coma: `<T,>(items: T[]) => …`.

Puede haber varios parámetros de tipo, separados por comas. Aquí cada uno captura el tipo de un argumento y el retorno es una tupla con ambos.

```ts
const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

const entry = pair("age", 36); // [string, number]
console.log(entry);            // ["age", 36]
```

Por convención los parámetros de tipo se nombran con una letra mayúscula: `T` en general, `K` y `V` para claves y valores. Cuando hay varios, también son habituales nombres descriptivos como `TItem`.

## Genéricos en interfaces

Una interfaz también puede recibir un parámetro de tipo. Es el caso típico de una API que devuelve siempre la misma envoltura, cambie lo que cambie dentro.

```ts
interface ApiResponse<T> {
  data: T;
  status: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const julia: User = { id: 31, name: "Julia", email: "julia@mail.com" };

const one: ApiResponse<User> = { data: julia, status: 200 };
const many: ApiResponse<User[]> = { data: [julia], status: 200 };
```

A diferencia de las funciones, aquí no hay argumento del que inferir: el tipo hay que indicarlo siempre, y `data` tiene que cumplirlo.

```ts
const wrongData: ApiResponse<User> = {
  data: "julia",
//^^^^ [ts] Type 'string' is not assignable to type 'User'.
  status: 200,
};

const noArg: ApiResponse = { data: julia, status: 200 };
//           ^^^^^^^^^^^ [ts] Generic type 'ApiResponse<T>' requires 1 type argument(s).
```

El `Array<string>` del apartado de tipos es exactamente esto: la interfaz `Array<T>` con `T` igual a `string`.

## Genéricos en alias

Los alias admiten parámetros de tipo con la misma sintaxis. En el apartado de alias, `Formatter` sólo servía para números; con un parámetro de tipo vale para cualquier valor.

```ts
type Formatter<T> = (value: T) => string;

const toUpper: Formatter<string> = (value) => value.toUpperCase();
const toEuros: Formatter<number> = (value) => `${value.toFixed(2)} €`;

console.log(toUpper("hi")); // "HI"
console.log(toEuros(3));    // "3.00 €"

const bad: Formatter<number> = (value) => value.toUpperCase();
//                                              ^^^^^^^^^^^ [ts] Property 'toUpperCase' does not exist on type 'number'.
```

Y sirven para dar nombre a combinaciones que se repiten, como la unión con `null` que vimos en el apartado anterior.

```ts
type Nullable<T> = T | null;

let nickname: Nullable<string> = null;
nickname = "santi";
nickname = 3; // [ts] Type '3' is not assignable to type 'Nullable<string>'.
```

## Restricciones: `extends`

Un parámetro de tipo admite cualquier tipo, y eso a veces es demasiado. Si queremos comparar longitudes, `T` podría ser un `number`, que no tiene `length`, así que TypeScript no nos deja usarla.

```ts
const longest = <T>(a: T, b: T): T => (a.length > b.length ? a : b);
//                                       ^^^^^^ [ts] Property 'length' does not exist on type 'T'.
//                                                  ^^^^^^ [ts] Property 'length' does not exist on type 'T'.
```

Con `extends` limitamos los tipos admitidos: `T` puede ser cualquiera que cumpla el contrato indicado.

```ts
const longest = <T extends { length: number }>(a: T, b: T): T =>
  a.length > b.length ? a : b;

console.log(longest("hello", "hi"));  // "hello", de tipo string
console.log(longest([1, 2, 3], [4])); // [1, 2, 3], de tipo number[]

longest(10, 20);
//      ^^ [ts] Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.
```

Fíjate en que el resultado conserva el tipo concreto: `string` con strings y `number[]` con arrays. Si en lugar del genérico hubiéramos tipado los parámetros directamente como `{ length: number }`, la función devolvería `{ length: number }` y habríamos perdido el tipo.

La restricción más útil combina genéricos con `keyof`. En el apartado anterior dejamos `getField` funcionando sólo para `User` y devolviendo la unión de todos sus tipos. Con un parámetro de tipo para el objeto y otro restringido a sus claves, vale para cualquier objeto y el retorno es exacto.

```ts
const getField = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

const userName = getField(julia, "name"); // string
const userId = getField(julia, "id");     // number

getField(julia, "age");
//              ^^^^^ [ts] Argument of type '"age"' is not assignable to parameter of type 'keyof User'.
```

`T` captura el tipo del objeto, `K` sólo puede ser una de sus claves y `T[K]` es el tipo de esa propiedad concreta.
