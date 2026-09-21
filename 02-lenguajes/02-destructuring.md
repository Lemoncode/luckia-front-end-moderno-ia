# Destructuring

El destructuring (desestructuración) es una sintaxis de JavaScript que permite extraer valores de arrays u objetos y asignarlos a variables directamente, en una sola expresión, en lugar de acceder a cada valor uno por uno.

## Destructuring en objetos

Generalmente cuando no usamos destructuring solemos crear variables en cada línea.

```js
// Ejemplo a mano, sin "destructuring":
const student = {
  name: "Evan",
  surname: "Smith",
  country: "USA",
};
const name = student.name;
const surname = student.surname;
console.log(name);    // "Evan"
console.log(surname); // "Smith"
```

Con destructuring podemos simplificar la extracción de propiedades de un objeto. El orden de izquierda a derecha es: `nombrePropiedad: nombreVariable`.

```js
const student = {
  name: "Evan",
  surname: "Smith",
  country: {
    id: 21,
    name: "Spain",
    iso: "ES",
  },
};
const { name, surname } = student;
console.log(name);    // "Evan"
console.log(surname); // "Smith"
```

Supón que necesitamos sacar el nombre del país también y la propiedad `iso`. No podemos utilizar el nombre de variable `name` por lo que tenemos que usar otro nombre de variable.

```js
// Desestructuramos `country` y asignamos a `countryName` el valor de la propiedad `name` sin shorthand. La propiedad `iso` la extraemos tal cual.
const { name, country: { name: countryName, iso } } = student;
console.log(countryName); // "Spain"
console.log(iso);         // "ES"
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

El arrays también podemos aplicar destructuring (desestructuración) para extraer elementos desde el primer índice. Primero veamos cómo lo haríamos sin destructuring.

```js
const rgb = [255, 100, 50];

const red  = rgb[0];
const green  = rgb[1];
const blue  = rgb[2];
const other = rgb[3];

console.log(red);    // 255
console.log(green);  // 100
console.log(blue);   // 50
console.log(other);  // undefined
```

Ahora aplicamos la sintaxis de destructuring para extraer elementos. Es importante tener en cuenta que el orden de las declaraciones de variables importa y afecta al elemento extraído.

```js
const [red, green, blue, other] = rgb;

console.log(red);    // 255
console.log(green);  // 100
console.log(blue);   // 50
console.log(other);  // undefined
```

Incluso podemos aplicar destructuring en el parámetro de una función. Utilizando el operador comma podemos omitir elementos intermedios.

```js
const getGreen = ([, second]) => second;
console.log(getGreen(rgb));
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

const { 0: { name: firstPersonName }, 2: { name: secondPersonName } } = users;

console.log(firstPersonName);  // "Emma"
console.log(secondPersonName); // "Olivia"
```
