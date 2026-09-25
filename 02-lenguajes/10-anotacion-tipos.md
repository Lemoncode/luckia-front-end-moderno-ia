# Anotación de tipos en TypeScript

Al comienzo del módulo vimos que JavaScript es un lenguaje dinámico: las variables no están asociadas a ningún tipo. TypeScript añade sobre JavaScript un sistema de tipos estático. Nosotros anotamos de qué tipo es cada valor y el compilador comprueba, antes de ejecutar el código, que lo utilizamos correctamente.

Los tipos sólo existen mientras desarrollamos. Al compilar se eliminan y lo que finalmente se ejecuta es JavaScript.

## Anotación de variables

Para anotar un tipo utilizamos los dos puntos (`:`) a continuación del nombre de la variable.

```ts
const city: string = "Málaga";
const num: number = 3;
```

TypeScript comprueba los tipos al compilar y nos informa de los errores. Además, editores como VS Code incorporan TypeScript y nos muestran estos errores mientras escribimos, sin necesidad de compilar. A lo largo del apartado los marcaremos con `[ts]`.

```ts
const text: string = 3;
//    ^^^^ [ts] Type 'number' is not assignable to type 'string'.

const pi: number = "3.1415";
//    ^^ [ts] Type 'string' is not assignable to type 'number'.
```

También detecta antes de ejecutar errores que en JavaScript sólo veríamos en ejecución, como reasignar una constante.

```ts
const label: string = "original";
label = "reassigned"; // [ts] Cannot assign to 'label' because it is a constant.
```

## Inferencia de tipos

No es necesario anotar todas las variables. Cuando declaramos una variable con un valor inicial, TypeScript deduce su tipo. Es lo que se conoce como inferencia de tipos.

```ts
let count = 3;   // TypeScript infiere el tipo `number`
count = "three"; // [ts] Type 'string' is not assignable to type 'number'.
```

En los siguientes ejemplos anotamos los tipos de forma explícita para practicar la sintaxis. En la práctica lo habitual es dejar que TypeScript infiera el tipo y anotar sólo cuando no puede hacerlo, por ejemplo en los parámetros de una función.

## Tipos básicos

### Primitivos de JavaScript

Los tipos primitivos se anotan con el mismo nombre que devuelve el operador `typeof`, siempre en minúscula: `string`, no `String`.

```ts
// boolean
const fake: boolean = true;

// number
let num: number = 13;
num = 13.13;
num = 0xd;      // 13 en hexadecimal
num = 0b1101;   // 13 en binario
num = 0o15;     // 13 en octal
num = Infinity; // infinito
num = NaN;      // not a number

// string
let phrase: string = "How is the weather?";
phrase = "Not very good";

// bigint
const bignum: bigint = 193n;

// symbol
const sym: symbol = Symbol("token");

// null
const n: null = null;

// undefined
const u: undefined = undefined;
```

#### null y undefined

En TypeScript `null` y `undefined` tienen su propio tipo. Por sí solos no resultan muy útiles, ya que sólo admiten su propio valor. Con la opción del compilador `strictNullChecks` desactivado podemos utilizarlos como valores en otros tipos. Activar la opción `strict` del compilador implícitamente activa `strictNullChecks` entre otros. Es recomendable mantener `strict` activo; de hecho, es el valor predeterminado desde TypeScript 6.0.

```ts
// Con `strictNullChecks` = false esto es válido.
const total: number = null;
const surname: string = undefined;

// Con `strictNullChecks` = true esto da error
const total: number = null;
//    ^^^^^ [ts] Type 'null' is not assignable to type 'number'.
const surname: string = undefined;
//    ^^^^^^^ [ts] Type 'undefined' is not assignable to type 'string'.
```

### object

Representa cualquier valor que no sea primitivo, es decir, todo lo que no sea `string`, `number`, `boolean`, `bigint`, `symbol`, `null` o `undefined`.

```ts
const obj: object = {};
const list: object = [1, 2, 3];

const wrong: object = "text";
//    ^^^^^ [ts] Type 'string' is not assignable to type 'object'.
```

En la práctica se utiliza poco, ya que no describe qué propiedades tiene el objeto y por tanto no nos deja acceder a ellas. Para eso utilizaremos las interfaces, que veremos más adelante.

```ts
const student: object = { name: "Evan" };

console.log(student.name);
//                  ^^^^ [ts] Property 'name' does not exist on type 'object'.
```

### Arrays

Podemos anotar un array de dos formas: con corchetes `[]` a continuación del tipo de sus elementos o mediante el tipo genérico `Array`. Ambas son equivalentes.

```ts
const coins: number[] = [1, 2, 0.5];

const words: Array<string> = [];
words.push("hello");
words.push("world");
words.push({});
//         ^^ [ts] Argument of type '{}' is not assignable to parameter of type 'string'.
```

### Funciones

Anotar una función no es más que añadir los tipos a sus parámetros y al valor de retorno.

```ts
// Tipado de una declaración function
function shout(text: string, upperCase: boolean): string {
  return (upperCase ? text.toUpperCase() : text) + "!!!";
}

console.log(shout("hi")); // [ts] Expected 2 arguments, but got 1.
console.log(shout("hi", true)); // "HI!!!"

// Tipado de una función flecha
const shoutArrow = (text: string, upperCase: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shoutArrow("hi")); // [ts] Expected 2 arguments, but got 1.
console.log(shoutArrow("hi", true)); // "HI!!!"
```

Como estamos viendo, en TypeScript, cuando invocamos una función tenemos que utilizar tantos argumentos como parámetros estén declarados.
Si hay algún parámetro que es opcional podemos indicarlo utilizando el signo `?` detrás del parámetro. Es importante entender que sólo podemos añadir el operador opcional a los últimos parámetros.

```ts
// Declaramos `uppercase` como opcional
const shout = (text: string, upperCase?: boolean): string =>
  (upperCase ? text.toUpperCase() : text) + "!!!";

console.log(shout("hi"));       // "hi!!!"
console.log(shout("hi", true)); // "HI!!!"

// Un parámetro con valor por defecto ya es opcional, así que no se le puede añadir el `?`. TypeScript infiere el tipo a partir del valor.
const shoutArrow = (text: string, upperCase? = true): string => (upperCase ? text.toUpperCase() : text) + "!!!";
//                                ^^^^^^^^^ [ts] Parameter cannot have question mark and initializer.

// La versión correcta sería:
const shoutArrow = (text: string, upperCase = true): string => (upperCase ? text.toUpperCase() : text) + "!!!";
```

En el caso de pasar funciones como argumentos de otras, podemos tipar en línea dichos argumentos del siguiente modo:

```ts
const shout = (text: string, suffixCallback: () => string) =>
  text.toUpperCase() + suffixCallback();

const exclamationGenerator = () => "!!!"; // Callback

console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));
console.log(shout("WoooW", exclamationGenerator));
```

### Tuplas

Una tupla es un array con un número fijo de elementos en el que cada posición tiene su propio tipo.

```ts
const quantity: [number, string] = [5, "pieces"];

console.log(quantity[1].toUpperCase()); // "PIECES"
console.log(quantity[0].toUpperCase());
//                      ^^^^^^^^^^^ [ts] Property 'toUpperCase' does not exist on type 'number'.
```

Las tuplas combinan muy bien con el destructuring de arrays, ya que cada variable recibe el tipo de su posición.

```ts
const [amount, unit] = quantity; // `amount` es de tipo number y `unit` de tipo string
```

### Enumerados

Es un tipo que no existe en JavaScript. Permite dar nombres descriptivos a un conjunto de valores que representan algo en común. Si no indicamos nada, los valores empiezan en 0.

```ts
// Por convención, los tipos que creamos nosotros se escriben en PascalCase
enum WeekDay {
  Monday,    // 0
  Tuesday,   // 1
  Wednesday, // 2
  Thursday,  // 3
  Friday,    // 4
  Saturday,  // 5
  Sunday,    // 6
}

const day: WeekDay = WeekDay.Wednesday;
console.log(day); // 2
```

Podemos indicar el primer valor, o incluso todos. Los miembros sin valor continúan la numeración del anterior.

```ts
enum WeekDayUSA {
  Monday = 1,
  Tuesday,   // 2
  Wednesday, // 3
  Thursday,  // 4
  Friday,    // 5
  Saturday,  // 6
  Sunday = 0,
}

const dayUSA: WeekDayUSA = WeekDayUSA.Sunday;
console.log(dayUSA); // 0
```

A diferencia del resto de anotaciones, que desaparecen al compilar, un enumerado genera un objeto JavaScript real. Gracias a ello los enumerados numéricos se pueden utilizar como un diccionario en ambos sentidos: del nombre al valor y del valor al nombre.

```ts
enum Release {
  Beta = 0.1,
  ProductLaunch = 1.0,
  ImprovedSupport = 1.4,
  NewYearPackage = 2.0,
}

const release: Release = Release.ImprovedSupport;
console.log(release);          // 1.4
console.log(Release[1.4]);     // "ImprovedSupport"
console.log(Release[release]); // "ImprovedSupport"
```

También podemos crear enumerados con valores string.

```ts
enum MediaType {
  JSON = "application/json",
  XML = "application/xml",
  PLAIN = "text/plain",
}

const jsonMedia: MediaType = MediaType.JSON;
console.log(jsonMedia); // "application/json"
```

En este caso no podemos obtener el nombre a partir del valor.

```ts
console.log(MediaType[MediaType.JSON]);
//          ^^^^^^^^^^^^^^^^^^^^^^^^^ [ts] Property '[MediaType.JSON]' does not exist on type 'typeof MediaType'.
```

Tiene su lógica: las claves de un objeto son strings, así que el valor de un miembro podría coincidir con el nombre de otro y se sobrescribirían.

```ts
enum MediaType {
  JSON = "application/json",
  XML = "application/xml",
  PLAIN = "text/plain",
  OTHER = "PLAIN", // Su valor coincide con el nombre de otro miembro
}

// Con mapeo inverso, MediaType["PLAIN"] tendría que valer "text/plain" y "OTHER" a la vez
```

Si utilizamos la palabra clave `const` delante de `enum`, TypeScript no crea el objeto y sustituye cada referencia directamente por su valor.

```ts
const enum Direction {
  Up,
  Down,
}

const move: Direction = Direction.Down; // Se compila como `const move = 1`
```

Al ser una característica que genera código y que no existe en JavaScript, es habitual encontrar proyectos que la sustituyen por uniones de tipos literales, que veremos más adelante.

### void

Representa la ausencia de valor. Su uso más habitual es como tipo de retorno de las funciones que no devuelven nada.

```ts
function noReturn(): void {
  console.log("I am not going to return anything");
}
```

A una variable de tipo `void` sólo le podemos asignar `undefined`, por lo que fuera de las funciones no tiene utilidad.

```ts
const notAssigned: void = undefined;
```

### never

Representa valores que nunca van a ocurrir. Es útil para tipar funciones que nunca llegan a devolver nada.

```ts
// Siempre lanza un error, por lo que nunca se alcanza el retorno
const throwError = (message: string): never => {
  throw new Error(message);
};

// Bucle infinito, tampoco se alcanza nunca el retorno
const neverEndingFunction = (): never => {
  while (true) {}
};
```

La diferencia con `void` es que una función `void` termina sin devolver nada, mientras que una función `never` no llega a terminar. TypeScript también utiliza `never` internamente cuando detecta que un caso es imposible.

### any

¿Y si no sabemos de qué tipo es un valor? Ocurre, por ejemplo, con datos que vienen de un servidor. El tipo `any` admite cualquier valor y nos deja hacer cualquier cosa con él.

```ts
const getServerData = (): any => {
  // Imaginemos una llamada a un servidor
};

let myData: any = getServerData();
myData = "Maybe it is a string";
myData = false;
myData = {};
myData = () => console.log("I am a function now");

// TypeScript no se queja: `myData` podría ser un array o un número
myData.push(3);
myData.toExponential(2);
```

Pero que compile no significa que funcione. En ese punto `myData` es una función, así que al ejecutar el código obtenemos `TypeError: myData.push is not a function`, justo el tipo de error que TypeScript debería evitarnos.

También podemos utilizarlo en arrays con valores de distintos tipos.

```ts
const falsyValues: any[] = [0, undefined, null, NaN, false];
falsyValues.push("");
```

`any` es potente y a la vez peligroso: desactiva la comprobación de tipos allí donde lo usamos. Es lo más parecido a volver a JavaScript, por lo que conviene evitarlo.

### unknown

Es la alternativa segura a `any`. También admite cualquier valor, pero TypeScript no nos deja utilizarlo hasta que comprobemos de qué tipo es.

```ts
let myData: unknown = getServerData();
myData = "hello"; // Podemos asignar cualquier valor, igual que con `any`

console.log(myData.toUpperCase());
//          ^^^^^^ [ts] 'myData' is of type 'unknown'.
```

Una vez comprobado el tipo, TypeScript nos deja utilizar el valor dentro de esa rama.

```ts
if (Array.isArray(myData)) {
  // Aquí `myData` es un array
  myData.push(3);
} else if (typeof myData === "string") {
  // Aquí `myData` es un string
  console.log(myData.toUpperCase());
} else {
  // Aquí `myData` sigue siendo `unknown`
  console.log(myData);
}
```

Estas comprobaciones se llaman guardas de tipo.

## Type assertion

Hay ocasiones en las que conocemos el tipo de un valor mejor que TypeScript. En esos casos podemos aseverar el tipo con la palabra clave `as`, que viene a decir: "confía en mí, sé lo que hago".

```ts
const data: unknown = getServerData();

console.log(data.substring(0, 3));
//          ^^^^ [ts] 'data' is of type 'unknown'.

// Supongamos que alguien nos garantiza que el servidor siempre devuelve un string
console.log((data as string).substring(0, 3));
```

Existe una sintaxis alternativa con los símbolos `<>`. No funciona en los ficheros `.tsx` que utilizaremos con React, porque se confunde con las etiquetas de JSX, así que es preferible utilizar siempre `as`.

```ts
console.log((<string>data).substring(0, 3));
```

A esta operación se le suele llamar también _casting_, pero es importante entender que no se trata de una conversión. Los tipos desaparecen al compilar, por lo que en ejecución el valor sigue siendo el que era. Si nos equivocamos, TypeScript ya no puede avisarnos.

```ts
const price: unknown = 42;

// Compila, pero al ejecutarlo obtenemos TypeError: price.toUpperCase is not a function
console.log((price as string).toUpperCase());
```
