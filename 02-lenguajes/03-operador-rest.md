# Rest operator

El operador rest (`...`) agrupa "el resto" de valores en un único array u objeto. Llegó en ES6 (2015) para parámetros de función y arrays, y a partir de ES2018 también funciona con propiedades de objetos.

## Rest en parámetros de función

En el apartado de funciones vimos que la variable especial `arguments` sólo existe en funciones `function`. El operador rest es la alternativa actual: agrupa en un array todos los argumentos que recibe la función, y funciona también en funciones flecha.

```js
const sum = (...nums) => {
  console.log(nums);

  let total = 0;
  for (const num of nums) {
    total += num;
  }
  return total;
};

console.log(sum(1, 2, 3)); // [1, 2, 3]
                           // 6
console.log(sum());        // []
                           // 0
```

A diferencia de `arguments`, el parámetro rest es un array de verdad, por lo que podemos utilizar todos sus métodos.

También podemos aislar los parámetros iniciales y agrupar los restantes.

```js
const greetAll = (greeting, ...names) => {
  for (const name of names) {
    console.log(`${greeting}, ${name}!`);
  }
};

greetAll("Hello", "Emma", "James"); // "Hello, Emma!"
                                    // "Hello, James!"
greetAll("Hello");                  // No muestra nada, `names` es un array vacío
```

El parámetro rest siempre debe ser el último, y sólo puede haber uno.

```js
const greetAll = (...names, greeting) => {};
//                ^^^^^^^^ SyntaxError: el parámetro rest debe ser el último
```

## Rest en destructuring de arrays

Al aplicar destructuring en un array podemos extraer los primeros elementos y agrupar los restantes en un nuevo array.

```js
const numbers = ["one", "two", "three"];

const [first, ...others] = numbers;
console.log(first);  // "one"
console.log(others); // ["two", "three"]

// Si no quedan elementos obtenemos un array vacío
const [one, two, three, ...nothing] = numbers;
console.log(nothing); // []
```

## Rest en destructuring de objetos

En objetos funciona igual: extraemos las propiedades que nos interesan y agrupamos las restantes en un nuevo objeto.

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

const { country, ...others } = student;
console.log(country); // { id: 21, name: "Spain", iso: "ES" }
console.log(others);  // { name: "Evan", surname: "Smith" }
```

El objeto original no se modifica: `others` es un objeto nuevo.

```js
console.log(student); // { name: "Evan", surname: "Smith", country: { ... } }
```

## Rest y destructuring en parámetros

Una combinación muy habitual es aplicar destructuring y rest al mismo tiempo en los parámetros de una función.

```js
const excludeCountry = ({ country, ...others }) => others;

const nameAndSurname = excludeCountry(student);
console.log(nameAndSurname); // { name: "Evan", surname: "Smith" }
```

Esto es útil para eliminar propiedades de un objeto sin modificar el original o, dicho de forma llana, para quedarnos "con lo que nos interesa".

## Rest y spread

La misma sintaxis `...` se utiliza para la operación contraria, llamada spread, que veremos en otra sección. Para distinguirlas basta con fijarse en dónde aparece:

- Donde se **declaran** variables o parámetros es rest: agrupa varios valores en uno.
- Donde se **crean** valores o se invoca una función es spread: expande un valor en varios.
