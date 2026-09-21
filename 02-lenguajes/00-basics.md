# Expresiones básicas

## Variables

Javascript es un lenguaje dinámico y débilmente tipado, lo que significa que las variables no están
asociadas a ningún tipo concreto. Por tanto, no tengo que declararlas especificando ningún tipo.
Puedo asignar el valor que quiera, del tipo que quiera.

Tenemos varios operadores para declarar variables: `let`, `const` y `var`.
Actualmente `var` está desaconsejado debido a un concepto llamado "Hoisting" que veremos más
adelante.

Utilizaremos `let` cuando queramos declarar una variable a la que, posteriormente, podamos ser capaces de reasignar su valor

```js
let a = 3;
a = 14;
let b = 10, c = "hello";
```

```js
let a = 3;
let a = 14; // ¡Error! La variable `a` ya ha sido redeclarada
```

Utilizaremos `const` cuando queramos declarar una variable que nunca queramos volver a reasignar.
Es importante entender que una vez que declaremos la variable no podemos volver a reasignar su valor.
Es por esto que una variable declarada con `const` debe incluir la asignación.

```js
// Esto lanzará un error de ejecución
const a;

// Hay que incluir el valor
const a = 3;

// Reasignar su valor lanzará un error de ejecución
a = 14;
```

Al igual que las variables `let` y `const` no podemos redeclararlas con el mismo nombre en el mismo ámbito.

```js
const a = 3;
const a = 14; // Error! La variable `a` ya ha sido redeclarada

let b = 3;
let b = 14; // Error! La variable `b` ya ha sido redeclarada

console.log(c); // Error! La variable `c` todavía no está inicializada.
let c = 10;
```

## Tipos de datos

Distinguimos dos grandes grupos de tipos de datos en Javascript:

- Tipos PRIMITIVOS (representan un único dato simple).
- Tipos estructurales (representan estructuras de datos) u OBJETOS.

7 PRIMITIVOS (2 de nueva incorporación) + OBJETOS

### Primitivos

#### string

Representan cadenas de texto.

```js
"hello world"; // dobles comillas
'hello world'  // comillas simples
`hello world`; // backticks.
''
""
``
```

Los strings creados con backticks también son llamados template literals. Permiten interpolar expresiones.

```js
const person = "Edward";
const message = `How are you, ${person}?`;
console.log(message); // "How are you, Edward?"
```

#### number

Representan valores numéricos tanto enteros como decimales como indeterminados.

```js
101       // entero positivo
-200;     // entero negativo
1220.31;  // flotante
1e6;      // notación exponencial (1 x 10^6)
Infinity; // infinito
NaN;      // not a number
```

#### boolean

Representan verdadero o falso

```js
true;
false;
```

#### null

Representa la ausencia intencional de un valor. Es algo que asignas explícitamente para decir "aquí no hay nada, a propósito".

```js
null
```

#### undefined

Representa la ausencia de un valor, algo que no está definido o no existe. Es el valor por defecto cuando algo no se ha inicializado.

```js
undefined;
```

#### symbol

Representa un identificador único. Se utiliza generalmente como clave en los objetos o como token único e indistinguible.

```js
Symbol("hello");
```

#### bigint

Representan valores enteros de precisión arbitraria

```js
103n; // notación literal
BigInt(103); // notación con casting
```

#### typeof

El operador typeof nos permite conocer el tipo de dato de una variable.

```js
console.log(typeof "");              // string
console.log(typeof 0);               // number
console.log(typeof 10n);             // bigint
console.log(typeof false);           // boolean
console.log(typeof undefined);       // undefined
console.log(typeof null);            // object
console.log(typeof Symbol("hello")); // symbol
```

### OBJETOS

Se utilizan para representar datos estructurados.

### Objetos literales

Es una estructura de datos no ordenada que representa un diccionario clave-valor. Las claves pueden ser string, number o symbol. Los valores son cualquier otro primitivo u objeto.

```js
const emptyObject = {};
const user = {
  name: "John",
  surname: "Smith",
  country: {
    name: "Spain",
    iso: "ES",
  },
};

console.log(typeof user); // object
```

CRUD básico con objetos.

```js
// Leer propiedad
console.log(user.name);
console.log(user["name"]);

// Añadir propiedad
user.age = 25;
user["age"] = 25;

// Modificar propiedad (igual que añadir)
user.age = 35;
user["age"] = 35;

// Borrar propiedad
delete user.age;
delete user["age"];
```

### Arrays

Es una estructura de datos ordenada. Es también un objeto en esencia con claves indexadas. Puede contener cualquier valor primitivo u objeto.

```js
const emptyArray = [];
const users = ["John", "Eva", "Anna"];
const mixed = [1, "hello", undefined, ["nested"], {}, false];
console.log(typeof mixed); // object
```

CRUD básico con arrays.

```js
// Leer un índice
console.log(users[0]);
console.log(users.at(0));

// Añadir un elemento al final
users.push("Pablo");

// Modificar un elemento
users[2] = "Antonio";

// Eliminar el último elemento
const extracted = users.pop();
console.log(extracted);

// Ver la longitud del array
console.log(users.length);
```

El array es una de las estructuras de datos con más métodos. Tiene métodos para filtrar, ordenar, combinar, extraer trozos, insertar/eliminar al principio o al final, etc.

### Funciones

Las funciones son un tipo especial de objeto que permite ser invocada y ejecutar una serie de instrucciones. Pueden declarar entre 0 y n parámetros y opcionalmente un valor de retorno.

```js
// Función como declaración
function applyIva(price) {
  console.log(price);
  const iva = 0.21;   // declaración interna
  return price * iva; // valor de retorno
}

const result = applyIva(200);
console.log(result);

// Función anónima como expresión
const applyIva = function (price) {
  return price * 0.21;
};

// Múltiples parámetros
function doSomething(param1, param2, param3) {
  console.log(param1);
  console.log(param2);
  console.log(param3);
  console.log(arguments); // sólo existe en funciones `function`.
}

doSomething("arg 1", "arg 2", "arg3");
doSomething(); // argumentos undefined
doSomething("arg1", "arg2", "arg3", "arg4"); // argumentos en exceso
```

Tenemos otro tipo de función denominadas arrow functions.

```js
// El ejemplo anterior transformado en arrow function
const applyIva = (price) => {
  return price * 0.21;
};

// Arrow function simplificada.
// - Si sólo existe un parámetro opcionalmente podemos eliminar los paréntesis
// - Si sólo tiene una sentencia de retorno podemos eliminar las llaves y el return.
const applyIva = price => price * 0.21;

// Devolviendo un objeto en base a los parámetros.
const toObject = (name, surname, age) => {
  return { name, surname, age };
};

// Hay que tener cuidado cuando devolvemos objetos sin `return` con arrow functions
// ya que puede confundirse las llaves de cuerpo de función con las de objeto literal.
// Para devolver objetos encerraremos la variable entre paréntesis.
const toObject = (name, surname, age) => ({ name, surname, age });

```

## Operadores

### Aritméticos

| Operador       | Ejemplo  |
| -------------- | -------- |
| Suma           | `5 + 4`  |
| Resta          | `10 - 3` |
| Multiplicación | `8 * 10` |
| División       | `10 / 5` |
| Resto          | `15 % 3` |
| Exponencial    | `2 ** 3` |

El operador `+` también se utiliza para concatenar cadenas de texto.

```js
const message = "hello " + "world";
console.log(message);
```

Los operadores aritméticos también se pueden combinar con asignación. Es importante que los valores NO estén asignados como `const`.

```js
let num = 10;
num += 10; // num = num + 10
console.log(num);
num /= 5; // num = num / 5
console.log(num);

num = 10;
// Post incremento. Incrementa su valor en uno DESPUÉS del console.log
console.log(num++);
// Post decremento. Reduce su valor en uno DESPUÉS del console.log
console.log(num--);
// Pre incremento. Incrementa su valor en uno ANTES del console.log
console.log(++num);
// Pre decremento. Reduce su valor en uno ANTES del console.log
console.log(--num);
```

### Lógicos

#### && AND

```js
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false
```

#### || OR

```js
console.log(true || true);    // true
console.log(true || false);   // true
console.log(false || true);   // true
console.log(false || false);  // false
```

Debido a la naturaleza dinámica del lenguaje es posible utilizar los operadores lógicos AND y OR sobre valores no booleanos. En este caso el valor se evalúa a su representación _truthy_ o _falsy_ antes de ejecutar la lógica del operador. Un valor es falsy si es uno de los siguientes: `0`, `NaN`, `false`, `""`, `null`, `undefined`. Cualquier otro valor es considerado truthy.

```js
let a;
a = 3 || 20;          // 3. El 3 es el primer valor "truthy" que se encuentra el OR.
a = 0 || 20;          // 20. El 20 es el primer valor "truthy" que se encuentra el OR.
a = Boolean(0 || 20); // true
a = 3 && 20;          // 20
a = 0 && 20;          // 0
a = Boolean(0 && 20); // false
a = 2 > 0 && "hello"; // "hello"
a = 2 < 0 && "hello"; // false
```

### Comparación

| Operador          | Ejemplo   |
| ----------------- | --------- |
| Mayor que         | `5 > 3`   |
| Mayor o igual que | `5 >= 5`  |
| Menor que         | `2 < 0`   |
| Menor o igual que | `2 <= 2`  |

Tenemos dos operadores de comparación de igualdad: igualdad débil e igualdad estricta/fuerte.

```js
// Igualdad débil
console.log(5 == 5);
console.log(5 == "5");

// Igualdad fuerte
console.log(5 === 5);
console.log(5 === "5");

// Desigualdad débil
console.log(5 != 5);
console.log(5 != "5");

// Desigualdad fuerte
console.log(5 !== 5);
console.log(5 !== "5");

// Comparación de objetos (referencia)
const nums1 = [1, 2, 3];
const nums2 = [1, 2, 3];
const nums3 = nums1;

console.log(nums1 === nums2); // false, distintas referencias en memoria
console.log(nums1 === nums3); // true, misma referencia en memoria
```

El hecho de que tengamos dos operadores de igualdad es debido a la naturaleza dinámica del lenguaje. Cuando utilizamos la igualdad débil con dos elementos de distinto tipo son internamente transformados a un tipo en común (type coercion) antes de realizar la comparación por su valor. Se recomienda siempre utilizar la igualdad estricta.

## Directivas de control de flujo

### Directivas condicionales

Estructura if/else. Permite ejecutar bloques de código de manera condicional.

```js
// 1 sola rama
const batteryLevel = 15;

if (batteryLevel < 20) {
  console.log("Low battery");
}

// 2 ramas
const password = "hunter2";

if (password.length >= 8) {
  console.log("Password accepted");
} else {
  console.log("Password must be at least 8 characters long");
}

// n ramas
const hour = 15;
if (hour < 12) {
  console.log("Good morning");
} else if (hour < 18) {
  console.log("Good afternoon");
} else {
  console.log("Good evening");
}

// 1 sola rama sin llaves
if (hour < 12) console.log("Good morning");
else if (hour < 18) console.log("Good afternoon");
else console.log("Good evening");
```

Estructura switch. Similar al if/else pero comparamos un valor con diferentes opciones. En una estructura switch es muy importante el uso de break para evitar ejecutar ramas posteriores.

```js
const orderStatus = "shipped";

switch (orderStatus) {
  case "pending":
    console.log("Your order is being processed");
    break;
  case "shipped":
    console.log("Your order is on its way");
    break;
  case "delivered":
    console.log("Your order has arrived");
    break;
  case "cancelled":
    console.log("Your order was cancelled");
    break;
  default:
    console.log("Unknown order status");
    break;
}

// Reutilizando cases
const fileExtension = "png";

switch (fileExtension) {
  case "jpg":
  case "png":
  case "gif":
    console.log("Image file");
    break;
  case "mp4":
    console.log("Video file");
    break;
  case "pdf":
    console.log("Document");
    break;
  default:
    console.log("Unknown file type");
}
```

Expresión ternaria. Como su nombre indica es una expresión y es similar a la estructura if/else pero utiliza valores.

```js
// Operador ternario dos ramas
const isOnline = false;
const status = isOnline ? "Available" : "Offline";

console.log(status);

// Operador ternario varias ramas
const temperature = 22;

const weather =
  temperature < 10 ? "Cold" :
  temperature < 25 ? "Mild" :
  "Hot";

console.log(weather);
```

### Directivas iterativas

Las directivas iterativas se utilizan para ejecutar una serie de instrucciones mientras se cumpla una condición.

Bucle "for". Tiene tres secciones, inicialización, condición y actualización, junto a un cuerpo de bucle.

```js
const limit = 10;
for (let i = 0; i < limit; i++) {
  console.log(i);
}

// múltiples asignaciones en bucle "for"
for (let i = 0, limit = 10; i < limit; i++) {
  console.log(i);
}
```

Bucle "while". Tiene un elemento de condición y cuerpo de bucle.

```js
const limit = 10;
let i = 0;
while (i < limit) {
  console.log(i);
  // No debemos olvidar modificar el valor de `i` o quedaremos en un bucle infinito
  i++;
}
```

Bucle "do while". Similar al bucle "while" pero garantiza una primera ejecución.

```js
const limit = 10;
let i = 0;
do {
  console.log(i);
  // No debemos olvidar modificar el valor de `i` o quedaremos en un bucle infinito
  i++;
} while (i < limit);
```

El bucle "for of" itera por cada elemento de una estructura iterable.

```js
const products = [
  { name: "Laptop", price: 999, stock: 5 },
  { name: "Mouse", price: 25, stock: 0 },
  { name: "Keyboard", price: 75, stock: 12 },
];

for (const p of products) {
  console.log(p.name, p.price);
}
```

Fíjate que en este bucle podemos declarar la variable como `const`. Esto es debido a que durante la ejecución la declaración de la variable permanece aislada en un ámbito diferente en cada ejecución del bucle.

El bucle "for in" permite iterar sobre las claves de un objeto propias y heredadas del prototipo mientras sean enumerables.

```js
const car = {
  brand: "Toyota",
  model: "Corolla",
  year: 2022,
};

for (const key in car) {
  console.log(`${key}: ${car[key]}`);
}
```

## Hoisting


Mencionamos anteriormente el desuso de `var` debido al hoisting. El hoisting es una característica del lenguaje que registra las declaraciones
antes de ejecutar el código. Para visualizarlo de una manera más sencilla, digamos que mueve las declaraciones a la parte superior del ámbito.

Esto puede chocar de frente con la intuición: uno espera que una variable no exista hasta la línea donde se declara, pero con `var` ya existe desde
antes, solo que con el valor `undefined`. Podemos acceder a ella sin que salte un error, y eso esconde bugs que deberían haberse detectado de inmediato.

Hoisting con `function`.

```js
// Habitualmente, en cualquier lenguaje, seguimos un orden lógico donde declaramos primero funciones
// y despues las usamos, algo como esto:
function shout(value) {
  console.log(value.toUpperCase() + "!!");
}

shout("hi guys"); // "HI GUYS!!"


// Sin embargo, en JS ¡podemos usar funciones antes de declararlas!
shout("hi guys"); // "HI GUYS!!"

function shout(value) {
  console.log(value.toUpperCase() + "!!");
}
```

Hoisting con `var`.


```js
// Cuando declarábamos variables con var, aparentemente esto debería dar error:
console.log(a); // undefined
var a = 5;
console.log(a); // 5

// Sin embargo, gracias al "hoisting", a está declarada arriba del todo, aunque su asignación
// ocurre en la segunda línea. Esto sería equivalente a:
var a;
console.log(a); // undefined
a = 5;
console.log(a); // 5
```

El hoisting con var también afecta a declaraciones dentro de estructuras de control de flujo.

```js
// Hoisting con if/else
if (true) {
  var name = "Lara";
  console.log(name); // "Lara"
}
console.log(name); // "Lara"

// equivalente a:
var name;
if (true) {
  name = "Lara";
  console.log(name); // "Lara"
}
console.log(name); // "Lara"


// Hoisting con bucle for
var collection = ["lorem", "ipsum", "dolor"];
var message = "No one says nothing";
for (var i = 0; i < collection.length; i++) {
  var message = "Someone says: " + collection[i];
  console.log(message);   // "Someone says: lorem"
}                         // "Someone says: ipsum"
                          // "Someone says: dolor"
console.log(i); // 3
console.log(message); // "Someone says: dolor"
```

Con `let` y `const` JavaScript también conoce la variable desde el inicio del bloque, pero a diferencia de var no le da el valor `undefined`: la deja bloqueada hasta llegar a la línea donde se declara. Si accedemos antes, obtenemos un `ReferenceError`. Ese tramo se llama Temporal Dead Zone (TDZ).
