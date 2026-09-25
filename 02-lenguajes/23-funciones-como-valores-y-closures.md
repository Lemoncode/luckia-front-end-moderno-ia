# Funciones como valores y closures

En JavaScript una función es un valor más. Ya lo hemos usado sin darle nombre cada vez que guardamos una función flecha en una variable. Lo que falta por ver es lo que eso permite: pasar funciones como argumento, devolverlas desde otras funciones, y lo que ocurre con las variables que una función "ve" cuando sale del sitio donde se creó.

## Funciones como valores

Una función guardada en una variable se puede pasar como argumento a otra función, igual que un número o un objeto. La función que la recibe la invoca cuando le conviene. A esa función que pasamos se la llama _callback_.

```js
const repeat = (times, action) => {
  for (let i = 0; i < times; i++) {
    action(i);
  }
};

repeat(3, (i) => console.log(`Vuelta ${i}`)); // "Vuelta 0", "Vuelta 1", "Vuelta 2"
```

`repeat` no sabe qué hace `action`: sólo sabe que puede invocarla. Quien llama decide el comportamiento.

Ojo con los paréntesis. Sin ellos pasamos la función; con ellos la ejecutamos y pasamos lo que devuelve.

```js
const sayHi = () => console.log("Hi");

const run = (action) => action();

run(sayHi);   // "Hi". Pasamos la función y `run` la ejecuta
run(sayHi()); // "Hi" y después TypeError: action is not a function. Se ejecutó al pasarla y `run` recibió `undefined`
```

Una función también puede devolver otra función.

```js
const operationFor = (symbol) => {
  if (symbol === "+") {
    return (a, b) => a + b;
  }
  return (a, b) => a - b;
};

const add = operationFor("+");
console.log(add(2, 3)); // 5
```

## Ámbito léxico: qué ve una función

Una función puede leer las variables del ámbito donde está escrita, aunque no se las pasen como argumentos.

```js
const prefix = "+34";

const formatPhone = (number) => `${prefix} ${number}`;

console.log(formatPhone("600123456")); // "+34 600123456"
```

En el otro sentido no: las variables declaradas dentro de una función no existen fuera de ella.

```js
const buildLabel = () => {
  const separator = " - ";
  return `a${separator}b`;
};

console.log(buildLabel()); // "a - b"
console.log(separator);    // ReferenceError: separator is not defined
```

## Qué es un closure

Juntemos las dos cosas: una función que devuelve otra función, y que la función devuelta use variables de la función que la creó. Cuando la función exterior termina, sus variables no desaparecen: la función interior las sigue viendo. A esa función, junto con las variables que retiene, se le llama closure (cierre).

```js
const createCounter = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  };
};

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
console.log(count);     // ReferenceError: count is not defined
```

`createCounter` ya ha terminado cuando llamamos a `counter`, y sin embargo `count` sigue existiendo y conserva su valor entre llamadas. El motor mantiene vivas esas variables mientras exista alguna función que las use.

Cada llamada a `createCounter` crea sus propias variables, así que cada closure es independiente.

```js
const createCounter = () => {
  let count = 0;
  return () => {
    count++;
    return count;
  };
};

const first = createCounter();
const second = createCounter();

first();
first();

console.log(first());  // 3
console.log(second()); // 1. Cada closure tiene su propio `count`
```

## Estado encapsulado

Si en lugar de una función devolvemos un objeto con varias funciones, todas comparten las mismas variables y nadie más puede tocarlas.

```js
const createCounter = () => {
  let count = 0;
  return {
    increase: () => { count++; },
    decrease: () => { count--; },
    value: () => count,
  };
};

const counter = createCounter();

counter.increase();
counter.increase();
counter.decrease();

console.log(counter.value()); // 1
console.log(counter.count);   // undefined. `count` no es una propiedad, sólo existe dentro del closure
```

Estas funciones no son puras: dependen de un estado que no reciben como argumento. Pero es estado mutable con un único dueño. Nadie fuera tiene la referencia a `count`, así que no existe el problema de "dos variables, un mismo objeto". Es la forma de tener estado en JavaScript sin exponerlo.

## Funciones configuradas

Si lo que captura el closure no cambia nunca, la función devuelta sí es pura: siempre hace lo mismo con la misma entrada. Es una forma de crear funciones especializadas a partir de una general.

```js
const withTax = (rate) => (price) => price * (1 + rate);

const withSpanishVat = withTax(0.21);
const withLuxembourgVat = withTax(0.17);

console.log(withSpanishVat(100));    // 121
console.log(withLuxembourgVat(100)); // 117
```

`withTax(0.21)` no calcula nada: devuelve una función que recuerda `rate` y espera el precio. A esta técnica de recibir los argumentos en varias llamadas se la conoce como currificación, y la forma `configurar(opciones)(datos)` la volveremos a ver en la última herramienta de la sesión.

## Un closure captura la variable, no el valor

Un closure no guarda una copia del valor que tenía la variable cuando se creó la función: guarda la variable, y lee su valor en el momento de ejecutarse. Es lo que hace funcionar a `createCounter`, y también lo que provoca la sorpresa más clásica de JavaScript.

```js
let greeting = "Hola";

const greet = (name) => `${greeting}, ${name}`;

greeting = "Buenas";
console.log(greet("Julia")); // "Buenas, Julia". Ve el valor actual, no el que había al crear la función
```

En un bucle con `var` hay una única variable `i` para toda la función. Los callbacks de `setTimeout` se ejecutan cuando el bucle ya ha terminado, y los tres leen la misma variable, que vale `3`.

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3
}
```

Con `let`, cada vuelta del bucle crea una variable `i` nueva, y cada callback se queda con la suya. Es el ámbito por vuelta que mencionamos al ver `for...of`.

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 0, 1, 2
}
```

Que con `var` haya una sola variable es porque su ámbito es la función entera; es lo que en el apartado de hoisting vimos como "la declaración se mueve arriba del todo". Pero la causa de la trampa no es el hoisting, es compartir una variable entre los callbacks: con `let` declarada fuera del bucle, sin `var` de por medio, pasa exactamente lo mismo.

```js
let k;

for (k = 0; k < 3; k++) {
  setTimeout(() => console.log(k)); // 3, 3, 3. Una sola variable `k` para los tres callbacks
}
```
