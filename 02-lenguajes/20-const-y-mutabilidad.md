# `const` y la mutabilidad

Al principio del módulo definimos `const` como "una variable que no se puede reasignar". Es exacto, pero se suele leer como "un valor que no cambia, una constante", y no es lo mismo. La diferencia entre reasignar y mutar es la base de toda esta sesión.

- **Reasignar** es hacer que la variable apunte a otro valor: `user = otroObjeto`.
- **Mutar** es modificar el contenido del valor al que apunta: `user.age = 31`.

## `const` protege la variable, no el valor

`const` sólo impide lo primero, la reasignación.

```js
const user = { name: "Julia", age: 30 };

user = { name: "Evan", age: 25 }; // TypeError: Assignment to constant variable.
```

El objeto al que apunta sigue siendo un objeto normal, y se puede modificar.

```js
const user = { name: "Julia", age: 30 };

user.age = 31;        // Modificamos el objeto, no la variable
user.city = "Málaga"; // Añadir propiedades también es mutar
console.log(user);    // { name: "Julia", age: 31, city: "Málaga" }
```

Con los arrays pasa exactamente lo mismo: `push`, la asignación por índice o `sort` mutan el array, y `const` no lo impide. Lo único que impide es cambiar la variable de array.

```js
const numbers = [1, 2, 3];

numbers.push(4);      // Mutación
numbers[0] = 10;      // Mutación
console.log(numbers); // [10, 2, 3, 4]

numbers = [];         // TypeError: Assignment to constant variable.
```

Esto es JavaScript puro. TypeScript no cambia nada en ejecución: `const` y el `readonly` que vimos en interfaces son comprobaciones del compilador, y el objeto sigue siendo mutable cuando el código corre.

## Los primitivos son inmutables

Un primitivo (string, number, boolean…) no se puede modificar. No existe ninguna operación que cambie un string o un número "por dentro": todas devuelven un valor nuevo.

```js
const word = "julia";

const shout = word.toUpperCase();
console.log(shout); // "JULIA"
console.log(word);  // "julia". El original sigue igual

word[0] = "J"; // TypeError: Cannot assign to read only property '0' of string 'julia'
```

En un script sin modo estricto esa última línea no lanza error, pero tampoco hace nada: el string sigue siendo `"julia"`.

### `i++` es una reasignación

Con los números la confusión es habitual, porque `++` o `+=` parecen modificar el valor. Lo que hacen es calcular un valor nuevo y reasignar la variable.

```js
let counter = 0;

counter++;            // Equivale a counter = counter + 1
counter += 5;         // Equivale a counter = counter + 5
console.log(counter); // 6
```

La prueba es que con `const` fallan con el mismo error que cualquier otra reasignación.

```js
const total = 0;

total++; // TypeError: Assignment to constant variable.
```

Con los strings ocurre lo mismo: concatenar crea un string nuevo y lo asigna a la variable.

```js
let greeting = "hola";

greeting += " mundo";  // Equivale a greeting = greeting + " mundo"
console.log(greeting); // "hola mundo"
```

## Dos variables, un mismo objeto

La diferencia entre primitivos y objetos también se nota al asignar una variable a otra. Con un primitivo, la segunda variable recibe una copia del valor.

```js
let a = 1;
let b = a; // `b` recibe una copia del valor

b = 2;
console.log(a); // 1
```

Con un objeto, la segunda variable recibe la misma referencia: no hay dos objetos, hay dos nombres para el mismo.

```js
const julia = { name: "Julia", age: 30 };
const copy = julia; // No es una copia: las dos variables apuntan al mismo objeto

copy.age = 31;
console.log(julia.age);      // 31. Ha cambiado también a través de `julia`
console.log(julia === copy); // true, misma referencia
```

Y lo mismo pasa al pasar un objeto a una función: el parámetro es otra referencia al mismo objeto, así que la función puede modificar el original.

```js
const julia = { name: "Julia", age: 30 };

const addYear = (person) => {
  person.age++; // Reasigna una propiedad, es decir, muta el objeto que recibe
};

addYear(julia);
console.log(julia.age); // 31. La función ha modificado el objeto original
```

Esta es la raíz del problema con la mutación: cualquier parte del programa que tenga la referencia puede cambiar el objeto, y el resto se entera tarde o nunca.
