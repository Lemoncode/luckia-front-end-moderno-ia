# Tipos alias

Hasta ahora hemos escrito cada tipo en el sitio donde lo necesitábamos. Un alias es un nombre que damos a un tipo, sea cual sea, para reutilizarlo sin repetir su definición. Se declara con la palabra clave `type`, el nombre en PascalCase, un `=` y el tipo al que da nombre.

A diferencia de una interfaz, que sólo describe la forma de un objeto, un alias puede nombrar cualquier tipo: un primitivo, una función, un objeto, una tupla...

## Alias de un primitivo

```ts
type Celsius = number;

const temperature: Celsius = 21.5;
```

Un alias es sólo un nombre, no un tipo nuevo. Donde pone `Celsius`, TypeScript ve `number`: cualquier `number` es válido y dos alias del mismo tipo son intercambiables, aunque para nosotros signifiquen cosas distintas.

```ts
type Celsius = number;
type Fahrenheit = number;

const boilingPoint: Celsius = 100;
const forecast: Fahrenheit = boilingPoint; // Válido: para TypeScript los dos son `number`
```

Su utilidad está en la legibilidad: `Celsius` dice más que `number`. Y si algún día cambia el tipo, lo cambiamos en un único sitio.

## Alias de una función

Hasta ahora el tipo de una función iba en su propia definición. Con un alias lo extraemos y lo reutilizamos en todas las funciones que compartan la misma firma.

```ts
type Formatter = (value: number) => string;

const toEuros: Formatter = (value) => `${value.toFixed(2)} €`;
const toPercent: Formatter = (ratio) => `${ratio * 100} %`;

console.log(toEuros(19.999)); // "20.00 €"
console.log(toPercent(0.25)); // "25 %"
```

Dos detalles. No hemos anotado el parámetro en ninguna de las dos: TypeScript ya sabe por el alias que es un `number`. Y el nombre del parámetro en el alias (`value`) es sólo documentación: cada implementación lo llama como quiere, como hace `toPercent` con `ratio`.

Lo que sí comprueba TypeScript es que cada implementación respete la firma.

```ts
const double: Formatter = (value) => value * 2;
//                                   ^^^^^^^^^ [ts] Type 'number' is not assignable to type 'string'.
```

## Alias de un objeto

Un alias también puede describir la forma de un objeto, con la misma sintaxis que una interfaz pero con `=`. Admite los mismos modificadores `?` y `readonly`.

```ts
type Coord = {
  readonly lat: number;
  readonly lon: number;
  alt?: number;
};

const pos: Coord = {
  lat: 36.7213,
  lon: -4.4214,
};
```

Para describir objetos tenemos entonces dos opciones. Cuál usar lo vemos al final del apartado.

## Alias en parámetros de una función

Un alias se utiliza igual que cualquier otro tipo, también en los parámetros y en el retorno de una función. Es donde más se nota la legibilidad.

```ts
type Celsius = number;
type Fahrenheit = number;

const toFahrenheit = (degrees: Celsius): Fahrenheit => (degrees * 9) / 5 + 32;

console.log(toFahrenheit(100)); // 212
console.log(toFahrenheit(37));  // 98.6
```

Compara la firma con `(degrees: number): number`: hace lo mismo, pero ahora dice qué representa cada número.

## Extraer el tipo de una propiedad

Con la sintaxis `Tipo["propiedad"]` creamos un alias con el tipo de una propiedad concreta de una interfaz. Si el tipo de la propiedad cambia, el alias cambia con ella.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  country: {
    id: number;
    name: string;
    iso: string;
  };
}

type Country = User["country"]; // { id: number; name: string; iso: string; }
const country: Country = {
  id: 21,
  name: "Spain",
  iso: "ES",
};

const getCountryIso = ({ iso }: Country): string => iso;
console.log(getCountryIso(country)); // "ES"
```

También podríamos tipar el valor de retorno accediendo al tipo de `iso` en vez de escribir `string` a mano.
Así si el día de mañana el tipo de `iso` cambia se actualiza solo.

```ts
const getCountryIso = ({ iso }: Country): Country["iso"] => iso;
```

## Un alias no se puede redeclarar

Si declaramos dos interfaces con el mismo nombre, TypeScript las fusiona en una sola.

```ts
interface Person {
  name: string;
}

interface Person {
  age: number;
}

// Las dos declaraciones se fusionan: `Person` tiene `name` y `age`
const me: Person = { name: "John", age: 30 };
```

Con un alias no: sólo se puede declarar una vez.

```ts
type Person = { name: string };
//   ^^^^^^ [ts] Duplicate identifier 'Person'.
type Person = { age: number };
//   ^^^^^^ [ts] Duplicate identifier 'Person'.
```

## Alias o interfaz

Para describir objetos las dos opciones son casi equivalentes, y en la práctica se puede elegir por preferencia. La diferencia de fondo es la que acabamos de ver: una interfaz está abierta, se puede extender con `extends` y admite nuevas declaraciones; un alias es cerrado. La documentación oficial da una heurística: usar interfaces hasta necesitar algo que sólo un alias puede hacer. En el curso la seguiremos: interfaces para los objetos y alias para el resto, como primitivos, funciones y otros tipos que veremos más adelante.

Diferencias entre alias e interfaces en la [documentación oficial](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces).
