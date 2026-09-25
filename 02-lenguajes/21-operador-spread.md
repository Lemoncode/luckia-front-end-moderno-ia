# Operador spread

En el apartado del operador rest vimos que `...` agrupa varios valores en uno. El operador spread es la misma sintaxis haciendo lo contrario: expande los elementos de un array o las propiedades de un objeto allí donde se esperan varios valores. La regla para distinguirlos sigue siendo dónde aparece: donde se declaran variables o parámetros es rest; donde se construye un array, un objeto o se invoca una función es spread.

Es la herramienta que nos permite crear valores nuevos a partir de otros sin mutarlos.

## Spread en arrays

Dentro de un literal de array, `...original` coloca cada elemento del array original en el nuevo.

```js
const original = ["one", "two", "three"];
const copy = [...original];

console.log(copy);              // ["one", "two", "three"]
console.log(original === copy); // false. Son dos arrays distintos
```

Como el resultado es un array nuevo, podemos añadir elementos o combinar arrays sin tocar los originales. Compáralo con `push`, que en el apartado anterior mutaba el array.

```js
const numbers = [1, 2, 3];

const extended = [...numbers, 4];   // Añadir al final
const prepended = [0, ...numbers];  // Añadir al principio
const merged = [...numbers, ...[10, 20]];

console.log(extended);  // [1, 2, 3, 4]
console.log(prepended); // [0, 1, 2, 3]
console.log(merged);    // [1, 2, 3, 10, 20]
console.log(numbers);   // [1, 2, 3]. Intacto
```

## Spread en objetos

Dentro de un literal de objeto, `...julia` copia cada propiedad de `julia` en el nuevo objeto.

```js
const julia = { name: "Julia", age: 30 };
const copy = { ...julia };

console.log(copy);           // { name: "Julia", age: 30 }
console.log(copy === julia); // false. Son dos objetos distintos
```

Si después del spread escribimos una propiedad que ya existía, la nueva la sustituye. Es la forma de "modificar" un objeto sin mutarlo: creamos otro con el cambio. El comportamiento es el mismo que en CSS cuando repetimos una propiedad dentro de la misma regla: prevalece la última.

```js
const julia = { name: "Julia", age: 30 };

const older = { ...julia, age: 31 };
const withCity = { ...julia, city: "Málaga" };

console.log(older);    // { name: "Julia", age: 31 }
console.log(withCity); // { name: "Julia", age: 30, city: "Málaga" }
console.log(julia);    // { name: "Julia", age: 30 }. Intacto
```

El orden importa: gana la última propiedad escrita. Si el spread va al final, sobrescribe lo anterior.

```js
const julia = { name: "Julia", age: 30 };

const stillThirty = { age: 31, ...julia };
console.log(stillThirty); // { age: 30, name: "Julia" }. El `age` de `julia` ha ganado
```

Con dos spreads combinamos objetos. El `updateUser` del apartado de tipos de utilidad, que copiaba campo a campo, se queda en una línea.

```js
const updateUser = (user, changes) => ({ ...user, ...changes });

const julia = { id: 31, name: "Julia", email: "julia@mail.com" };
console.log(updateUser(julia, { email: "julia@new.com" })); // { id: 31, name: "Julia", email: "julia@new.com" }
```

## Spread en argumentos de función

En una llamada, `...numbers` pasa cada elemento del array como un argumento independiente.

```js
const numbers = [3, 7, 2];

console.log(Math.max(...numbers)); // 7. Equivale a Math.max(3, 7, 2)
console.log(...numbers);           // 3 7 2
```

## La copia es superficial

Spread copia un solo nivel. Si una propiedad contiene un objeto, la copia recibe la misma referencia, no un objeto nuevo. Es lo que se conoce como copia superficial o _shallow copy_.

```js
const julia = {
  name: "Julia",
  address: { city: "Málaga", zip: 29002 },
};

const copy = { ...julia };

copy.address.city = "Sevilla";
console.log(julia.address.city);             // "Sevilla". Hemos mutado el objeto anidado, que es compartido
console.log(julia.address === copy.address); // true, misma referencia
```

Para cambiar algo anidado sin mutar hay que hacer spread en cada nivel del camino.

```js
const julia = {
  name: "Julia",
  address: { city: "Málaga", zip: 29002 },
};

const moved = { ...julia, address: { ...julia.address, city: "Sevilla" } };

console.log(moved.address.city); // "Sevilla"
console.log(julia.address.city); // "Málaga". Intacto
```

Con arrays de objetos ocurre lo mismo: `[...users]` es un array nuevo, pero los usuarios que contiene son los mismos objetos.

## Otras formas de copiar

`Object.assign` es la forma anterior a spread de copiar propiedades: copia las de los objetos siguientes en el primero. Con un objeto vacío como primer argumento equivale a un spread, y también es superficial.

```js
const julia = { name: "Julia", age: 30 };

const copy = Object.assign({}, julia, { age: 31 });
console.log(copy); // { name: "Julia", age: 31 }
```

Ojo: si el primer argumento no es un objeto vacío, `Object.assign` lo muta.

```js
const julia = { name: "Julia", age: 30 };

Object.assign(julia, { age: 31 });
console.log(julia); // { name: "Julia", age: 31 }. Mutado
```

Para una copia en profundidad tenemos `structuredClone`, que recorre toda la estructura y crea objetos nuevos en cada nivel.

```js
const julia = {
  name: "Julia",
  address: { city: "Málaga", zip: 29002 },
};

const clone = structuredClone(julia);

console.log(clone.address === julia.address); // false. Objeto anidado nuevo

clone.address.city = "Sevilla";
console.log(julia.address.city); // "Málaga". Intacto
```

Tiene dos límites: es más lento que una copia superficial, y no admite funciones.

```js
const withMethod = { name: "Julia", greet() {} };

structuredClone(withMethod); // DataCloneError: greet() {} could not be cloned.
```

En la práctica, la copia superficial con spread es la habitual: casi siempre cambiamos un nivel concreto y compartimos el resto.
