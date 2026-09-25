# Destructuring

El destructuring (desestructuración) es una sintaxis de JavaScript que permite extraer valores de arrays u objetos y asignarlos a variables directamente, en una sola expresión, en lugar de acceder a cada valor uno por uno.

## Destructuring en objetos

Generalmente cuando no usamos destructuring solemos crear variables en cada línea.

```js
// Ejemplo a mano, sin "destructuring":
const student = {
  name: "Evan",
  surname: "Smith",
  country: {
    id: 21,
    name: "Spain",
    iso: "ES",
  },
};
const name = student.name;
const surname = student.surname;
console.log(name);    // "Evan"
console.log(surname); // "Smith"
```

Con destructuring podemos simplificar la extracción de propiedades de un objeto.

```js
// El orden de izquierda a derecha es `propertyName: variableName`
const { name: name, surname: surname } = student;
console.log(name);    // "Evan"
console.log(surname); // "Smith"

// Usando la notación shorthand
const { name, surname } = student;
```

Supón que necesitamos sacar el nombre del país también y la propiedad `iso`. No podemos utilizar el nombre de variable `name` por lo que tenemos que usar otro nombre de variable. Si intentamos utilizar el mismo nombre obtendremos un error por declarar dos veces la misma variable.

```js
// Desestructuramos `country` y asignamos a `countryName` el valor de la propiedad `name` sin shorthand. La propiedad `iso` la extraemos tal cual.
const { name, country: { name: countryName, iso } } = student;
console.log(countryName); // "Spain"
console.log(iso);         // "ES"
console.log(name);        // "Evan"

const { name, country: { name: name, iso } } = student;
//                             ^^^^ SyntaxError al utilizar dos veces `name`

// Sin embargo si utilizamos `var` funciona porque permite redeclaración
var { name, country: { name: name, iso } } = student;
console.log(name); // "Spain". La última asignación pisa la anterior sin aviso.
```

También podemos extraer `country` en el caso anterior además de sus propiedades.

```js
const { name, country: { name: countryName, iso }, country } = student;
console.log(countryName); // "Spain"
console.log(iso);         // "ES"
console.log(country);     // object
```

Incluso podemos aplicar destructuring en parámetros de una función.

```js
const showFullName = ({ name, surname }) => {
  console.log(`${name} ${surname}`);
};

showFullName(student); // "Evan Smith"
```

## Destructuring en arrays

En arrays también podemos aplicar destructuring (desestructuración) para extraer elementos desde el primer índice.
Primero veamos cómo lo haríamos sin destructuring.

```js
const rgb = [255, 100, 50];

const red = rgb[0];
const green = rgb[1];
const blue = rgb[2];
const other = rgb[3];

console.log(red);   // 255
console.log(green); // 100
console.log(blue);  // 50
console.log(other); // undefined
```

Ahora aplicamos la sintaxis de destructuring para extraer elementos. Es importante tener en cuenta que el orden de las declaraciones de variables importa y afecta al elemento extraído.

```js
const [red, green, blue, other] = rgb;

console.log(red);    // 255
console.log(green);  // 100
console.log(blue);   // 50
console.log(other);  // undefined
```

Incluso podemos aplicar destructuring en el parámetro de una función. Utilizando la coma podemos omitir elementos intermedios.

```js
const getGreen = ([, second]) => second;
console.log(getGreen(rgb)); // 100
```

También podemos aplicar destructuring anidado.

```js
const matrix = [
  [0, 0, 0],
  [0, 10, 0],
  [0, 0, 0],
];

const [, [, center]] = matrix;
console.log(center); // 10
```

Recordemos que los arrays son también objetos. Podemos utilizar la sintaxis de objeto literal para extraer índices específicos.

```js
const users = [
  { id: 1, name: "Emma" },
  { id: 2, name: "James" },
  { id: 3, name: "Olivia" },
];

const { 0: { name: firstPersonName }, 2: { name: thirdPersonName } } = users;

console.log(firstPersonName);  // "Emma"
console.log(thirdPersonName);  // "Olivia"
```

## Valores por defecto

Cuando aplicamos destructuring es posible que al acceder a una propiedad de un objeto que no exista o a un índice no ocupado
de un array devuelva `undefined`. En estos casos podemos utilizar el símbolo `=` para aplicar un valor por defecto.

```js
const user = {
  age: 36,
};

const { age, name = "Unknown" } = user;
console.log(name); // "Unknown"

// También podemos utilizar otro nombre para la variable
const { name: username = "Unknown" } = user;
console.log(username); // "Unknown"

// Ejemplo con array
const rgb = [255, 100, 50];

const [red, green, blue, alpha = 1] = rgb;
console.log(alpha); // 1

// Si el elemento existe, se respeta su valor
const rgba = [255, 100, 50, 0.5];
const [, , , opacity = 1] = rgba;
console.log(opacity); // 0.5
```

Este valor por defecto sólo se activa con `undefined`. Si tenemos un valor `null` seguirá utilizando `null`.

```js
const draft = {
  id: null,
};

const { id = 0 } = draft;
console.log(id); // null
```

Los valores por defecto también se pueden usar al aplicar destructuring en los parámetros de una función.

```js
const showUser = ({ name, age = 18 }) => {
  console.log(`${name} (${age})`);
};

showUser({ name: "Eva" });          // "Eva (18)"
showUser({ name: "Leo", age: 40 }); // "Leo (40)"
```

## Destructuring en bucles

En un bucle "for of" podemos aplicar destructuring directamente sobre cada elemento.

```js
const products = [
  { name: "Laptop", price: 999, stock: 5 },
  { name: "Mouse", price: 25, stock: 0 },
  { name: "Keyboard", price: 75, stock: 12 },
];

for (const { name, price } of products) {
  console.log(name, price);
}
```

## Destructuring sobre `null` y `undefined`

Si una propiedad no existe obtenemos `undefined`, pero si intentamos aplicar destructuring sobre un valor que es `null` o `undefined` obtendremos un error, ya que no tienen propiedades que extraer.

```js
const student = {
  name: "Evan",
};

const { surname } = student;
console.log(surname); // undefined. La propiedad no existe, pero no hay error

const { country: { iso } } = student;
//                 ^^^ TypeError: `student.country` es `undefined` y no se puede desestructurar

// Lo mismo ocurre si desestructuramos directamente `null` o `undefined`
const { id } = null;      // TypeError
const { id } = undefined; // TypeError
```

Un valor por defecto evita el error cuando el valor es `undefined`, pero no cuando es `null`.

```js
const { country: { iso } = {} } = student;
console.log(iso); // undefined

const draft = {
  country: null,
};

const { country: { iso } = {} } = draft;
//                 ^^^ TypeError: el valor por defecto no se activa con `null`
```
