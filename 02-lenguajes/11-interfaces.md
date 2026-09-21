# Interfaces

En el apartado anterior vimos que el tipo `object` no describe qué propiedades tiene un objeto y por eso no nos deja acceder a ellas. Una interfaz resuelve justo eso: es un contrato que describe la forma de un objeto, es decir, cómo se llaman sus propiedades y de qué tipo es cada una.

Además de tipar objetos, las interfaces nos permiten dar nombre a esas estructuras y reutilizarlas en cualquier parte del código.

## Declarar una interfaz

Se declara con la palabra clave `interface` y, por convención, el nombre en PascalCase. Dentro indicamos cada propiedad con su tipo.

```ts
interface Coord {
  lat: number;
  lon: number;
}

const pos: Coord = {
  lat: 36.7213,
  lon: -4.4214,
};

console.log(pos.lat); // 36.7213. Ahora sí podemos acceder a las propiedades
```

Como el resto de anotaciones, la interfaz desaparece al compilar: no genera ningún objeto en JavaScript, a diferencia de los enumerados.

Si el objeto no cumple el contrato, TypeScript nos avisa. Tanto si falta una propiedad, como si el tipo no coincide, como si sobra alguna.

```ts
const missing: Coord = {
//    ^^^^^^^ [ts] Property 'lon' is missing in type '{ lat: number; }' but required in type 'Coord'.
  lat: 36.7213,
};

const wrongType: Coord = {
  lat: "36.7213",
//^^^ [ts] Type 'string' is not assignable to type 'number'.
  lon: -4.4214,
};

const extra: Coord = {
  lat: 36.7213,
  lon: -4.4214,
  alt: 11,
//^^^ [ts] Object literal may only specify known properties, and 'alt' does not exist in type 'Coord'.
};
```

## Interfaces en funciones

El uso más habitual de las interfaces es tipar los parámetros de una función. Así sabemos qué propiedades podemos utilizar dentro, y TypeScript comprueba que cada llamada nos pasa un objeto válido.

```ts
interface User {
  id: number;
  name: string;
}

const printUserName = (user: User): void => {
  console.log(user.name);
};

printUserName({ id: 31, name: "Julia" }); // "Julia"

printUserName({ id: 31 });
//            ^^^^^^^^^^ [ts] Property 'name' is missing in type '{ id: number; }' but required in type 'User'.
```

También podemos utilizarlas para tipar arrays, combinándolas con lo que vimos en destructuring.

```ts
const users: User[] = [
  { id: 31, name: "Julia" },
  { id: 32, name: "Evan" },
];

for (const { name } of users) {
  console.log(name); // "Julia", "Evan"
}
```

## Propiedades opcionales

Por defecto todas las propiedades de una interfaz son obligatorias. Con el símbolo `?` a continuación del nombre indicamos que una propiedad es opcional: el objeto puede tenerla o no.

```ts
interface Coord {
  lat: number;
  lon: number;
  alt?: number;
}

const summit: Coord = {
  lat: 37.0531,
  lon: -3.3117,
  alt: 3479,
};

const beach: Coord = {
  lat: 36.7213,
  lon: -4.4214,
};

console.log(summit.alt); // 3479
console.log(beach.alt);  // undefined
```

Al leer una propiedad opcional, TypeScript recuerda que su valor puede ser `undefined` y no nos deja utilizarla como si fuera un número. Aquí encajan los operadores optional chaining y nullish coalescing que vimos en JavaScript.

```ts
console.log(beach.alt.toFixed(0));
//          ^^^^^^^^^ [ts] 'beach.alt' is possibly 'undefined'.

console.log(beach.alt?.toFixed(0)); // undefined
console.log(beach.alt ?? 0);        // 0
```

## Propiedades de sólo lectura

Con el modificador `readonly` delante de una propiedad impedimos que se reasigne una vez creado el objeto.

```ts
interface Coord {
  readonly lat: number;
  readonly lon: number;
}

const pos: Coord = {
  lat: 36.7213,
  lon: -4.4214,
};

pos.lat = 37.0531;
//  ^^^ [ts] Cannot assign to 'lat' because it is a read-only property.
```

Es importante no confundirlo con `const`: `const` impide reasignar la variable `pos`, mientras que `readonly` impide reasignar la propiedad `lat`. Y como el resto de tipos, la protección sólo existe al compilar: en ejecución el objeto es un objeto normal y sus propiedades se pueden modificar. Veremos cómo conseguir objetos realmente inmutables en el módulo de inmutabilidad.

## Interfaces anidadas

Una propiedad puede ser de un tipo definido por otra interfaz. Es una forma de componer estructuras de forma jerárquica.

```ts
interface Address {
  street: string;
  zip: number;
  city: string;
}

interface Place {
  lat: number;
  lon: number;
  address: Address;
}

const office: Place = {
  lat: 36.7213,
  lon: -4.4214,
  address: {
    street: "Héroes de Sostoa",
    zip: 29002,
    city: "Málaga",
  },
};

console.log(office.address.city); // "Málaga"
```

## Extender interfaces

En el ejemplo anterior `Place` repite las propiedades `lat` y `lon` que ya teníamos en `Coord`. En lugar de duplicarlas, una interfaz puede extender de otra con `extends`: hereda todas sus propiedades y añade las suyas.

```ts
interface Place extends Coord {
  address: Address;
}

// El objeto debe cumplir las propiedades de `Coord` y las de `Place`
const office: Place = {
  lat: 36.7213,
  lon: -4.4214,
  address: {
    street: "Héroes de Sostoa",
    zip: 29002,
    city: "Málaga",
  },
};
```

Una interfaz puede extender de varias a la vez, separándolas por comas.

```ts
interface Place extends Coord, Address {}

const office: Place = {
  lat: 36.7213,
  lon: -4.4214,
  street: "Héroes de Sostoa",
  zip: 29002,
  city: "Málaga",
};
```

Como `Place` tiene todo lo que `Coord` exige, un `Place` es válido en cualquier sitio donde se espere un `Coord`.

```ts
const printCoord = (coord: Coord): void => {
  console.log(`${coord.lat}, ${coord.lon}`);
};

printCoord(office); // "36.7213, -4.4214"
```

Esto no es una característica de `extends`, sino la regla general con la que TypeScript compara tipos, y la vemos a continuación.

## Duck typing

TypeScript no comprueba que un objeto "sea" de un tipo concreto, sino que su estructura encaje con el contrato. Es lo que se conoce como tipado estructural o, de forma más coloquial, _duck typing_: "si camina como un pato, nada como un pato y hace cuac, probablemente sea un pato".

Veámoslo con dos interfaces distintas que comparten la misma estructura.

```ts
interface User {
  id: number;
  name: string;
}

interface Dog {
  id: number;
  name: string;
}

const julia: User = { id: 31, name: "Julia" };
const laika: Dog = { id: 119, name: "Laika" };

const printUserName = (user: User): void => {
  console.log(user.name);
};

printUserName(julia); // "Julia"
printUserName(laika); // "Laika". Es un `Dog`, pero tiene la misma estructura que `User`
```

A `printUserName` no le importa el nombre de la interfaz: sólo comprueba que el argumento tiene un `id` de tipo `number` y un `name` de tipo `string`. Si falta alguna propiedad, el objeto no encaja.

```ts
interface Cat {
  name: string;
}

const garfield: Cat = { name: "Garfield" };

printUserName(garfield);
//            ^^^^^^^^ [ts] Property 'id' is missing in type 'Cat' but required in type 'User'.
```

En cambio, si tiene todas las propiedades necesarias encaja, aunque tenga más.

```ts
interface Cat {
  id: number;
  name: string;
  color: string;
}

const garfield: Cat = { id: 43, name: "Garfield", color: "orange" };

printUserName(garfield); // "Garfield". Tiene `id` y `name`, y `color` no molesta
```

Puede parecer que esto contradice el error que vimos al principio al añadir una propiedad de más. La diferencia está en que aquella comprobación sólo se aplica a los objetos literales escritos directamente donde se espera el tipo, porque en ese caso una propiedad desconocida casi siempre es un error de escritura.

```ts
printUserName({ id: 43, name: "Garfield", color: "orange" });
//                                        ^^^^^ [ts] Object literal may only specify known properties, and 'color' does not exist in type 'User'.
```
