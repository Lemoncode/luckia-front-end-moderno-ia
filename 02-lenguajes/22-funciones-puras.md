# Funciones puras

Una función es pura cuando cumple dos condiciones:

1. **Con la misma entrada devuelve siempre la misma salida.** Su resultado depende sólo de sus argumentos, no de nada externo.
2. **No tiene efectos secundarios.** No cambia nada fuera de ella: ni sus argumentos, ni variables externas, ni el mundo exterior (consola, red, disco).

Es el mismo concepto que una función matemática: `f(2)` vale lo mismo hoy, mañana y en cualquier orden de llamadas, y calcularla no cambia nada.

```js
const applyIva = (price) => price * 1.21;

console.log(applyIva(100)); // 121
console.log(applyIva(100)); // 121. Siempre
```

Una consecuencia de las dos condiciones es que cualquier llamada a una función pura se puede sustituir por su resultado sin que el programa cambie: `applyIva(100)` y `121` son intercambiables en cualquier punto del código. Esta propiedad se llama **transparencia referencial**, y es la prueba más rápida para saber si una función es pura: si sustituir la llamada por su valor cambia algo, la función no es pura.

## Cómo se rompe la pureza

La primera condición se rompe cuando la función lee algo externo que puede cambiar.

```js
let taxRate = 0.21;

const applyTax = (price) => price * (1 + taxRate); // Depende de `taxRate`, que no es un argumento

console.log(applyTax(100)); // 121
taxRate = 0.5;
console.log(applyTax(100)); // 150. Misma entrada, distinta salida
```

La segunda se rompe cuando la función modifica algo externo. El caso más habitual es mutar el argumento que recibe, como el `addYear` del apartado de `const`.

```js
const addItem = (cart, item) => {
  cart.push(item); // Muta el array que recibe
  return cart;
};

const cart = ["laptop"];
const newCart = addItem(cart, "mouse");

console.log(cart);             // ["laptop", "mouse"]. El original ha cambiado
console.log(cart === newCart); // true. Es el mismo array
```

También la rompen escribir en una variable externa, escribir en consola o depender de `Math.random()` o de la fecha actual. Todo eso hace que la función tenga "memoria" o "contexto" que no está en sus argumentos.

## La versión pura

Con spread, la función devuelve un valor nuevo y deja el original intacto. Fuera de la función no ha cambiado nada.

```js
const addItem = (cart, item) => [...cart, item];

const cart = ["laptop"];
const newCart = addItem(cart, "mouse");

console.log(cart);             // ["laptop"]. Intacto
console.log(newCart);          // ["laptop", "mouse"]
console.log(cart === newCart); // false. Es un array nuevo
```

Con objetos, igual.

```js
const rename = (user, name) => ({ ...user, name });

const julia = { name: "Julia", age: 30 };
const renamed = rename(julia, "Julia M.");

console.log(julia);   // { name: "Julia", age: 30 }. Intacto
console.log(renamed); // { name: "Julia M.", age: 30 }
```

## Qué ganamos con la inmutabilidad

**Entender la función sin salir de ella.** Para saber qué hace `rename` basta con leer `rename`. Nada de lo que reciba va a cambiar por debajo, y nada de lo que devuelva va a cambiar después. Con mutación, entender una función obliga a buscar quién más tiene esa referencia, que es el problema de "dos variables, un mismo objeto" del apartado de `const`.

**Probar sin preparar nada.** Una función pura se prueba con una llamada: entrada conocida, salida esperada. No hay estado que montar antes ni que limpiar después.

**Compartir sin miedo.** Un valor que nadie va a mutar se puede pasar a cualquier parte sin hacer copias defensivas. Es lo que ya hacen los primitivos: nadie copia un string "por si acaso".

**Saber si algo ha cambiado comparando referencias.** Si los valores no se mutan, una referencia distinta significa que hay un valor nuevo, y la misma referencia significa que no ha cambiado nada. Basta un `===`, en lugar de comparar propiedad a propiedad.

```js
const rename = (user, name) => (user.name === name ? user : { ...user, name });

const julia = { name: "Julia", age: 30 };

const renamed = rename(julia, "Julia M.");
console.log(julia === renamed); // false. Referencia nueva: algo ha cambiado

const unchanged = rename(julia, "Julia");
console.log(julia === unchanged); // true. Misma referencia: no hay nada nuevo
```

Fíjate en el detalle: cuando no hay cambio, la función devuelve el mismo objeto en lugar de una copia. Así la comparación de referencias cuenta la verdad en los dos sentidos. Esta idea, "misma referencia, mismo valor", es la base sobre la que se construyen las herramientas que veremos después.

**Historial gratis.** Si cada cambio produce un valor nuevo y los anteriores no se tocan, guardar versiones es guardar referencias: deshacer es volver a la anterior.

```js
const julia = { name: "Julia", age: 30 };
const older = { ...julia, age: 31 };
const history = [julia, older];

console.log(history[0]); // { name: "Julia", age: 30 }. La versión anterior sigue existiendo
```

## Lo que cuesta

**Memoria y tiempo.** Cada cambio crea un objeto nuevo, y copiar tiene un coste proporcional al tamaño de lo copiado. Un `push` añade un elemento; un spread copia todos los que había. Hacerlo dentro de un bucle es el error clásico.

```js
const N = 20000;

let list = [];
for (let i = 0; i < N; i++) {
  list = [...list, i]; // Copia i elementos en cada vuelta: unos 200 millones de copias en total
}

const mutable = [];
for (let i = 0; i < N; i++) {
  mutable.push(i); // Añade un elemento en cada vuelta
}

// En la misma máquina: más de un segundo el primer bucle, menos de un milisegundo el segundo
```

Dos cosas atenúan el coste. La copia es superficial: al cambiar una propiedad de un objeto grande sólo se copia ese nivel, y todo lo anidado que no cambia se comparte, como vimos en el apartado anterior. Y el recolector de basura de JavaScript está diseñado para objetos pequeños de vida corta, que es justo lo que generan estas copias.

**Más código en las estructuras anidadas.** Cambiar algo a tres niveles de profundidad exige un spread por nivel. Es el precio de escribir a mano lo que la copia superficial no cubre, y es lo que resuelve la última herramienta de la sesión.

## Mutar dentro es aceptable

La pureza se mide desde fuera. Una función que crea un objeto, lo muta mientras lo construye y lo devuelve es pura: nadie más tiene esa referencia hasta que sale.

```js
const doubleAll = (numbers) => {
  const result = [];        // Objeto local: nadie más lo conoce todavía
  for (const n of numbers) {
    result.push(n * 2);     // Mutar aquí es seguro
  }
  return result;
};

const numbers = [1, 2, 3];
console.log(doubleAll(numbers)); // [2, 4, 6]
console.log(numbers);            // [1, 2, 3]. Intacto
```

Lo que rompe la pureza no es mutar, es mutar algo que llegó de fuera o que ya se ha compartido.
