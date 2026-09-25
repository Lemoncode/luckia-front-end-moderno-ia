# Métodos de arrays

Los arrays tienen una gran cantidad de métodos, y conviene separarlos en dos grupos. Unos **mutan** el array sobre el que se llaman: lo cambian en el sitio y suelen devolver otra cosa, como la nueva longitud o el elemento quitado. Son los que en el apartado de `const` vimos modificar un array declarado como constante. Los otros no tocan el array: devuelven uno nuevo, o un valor calculado a partir de él. Vamos a recorrer las operaciones habituales viendo primero cómo se hacen mutando y después su contraparte inmutable.

Para los ejemplos con objetos usaremos este catálogo.

```js
const products = [
  { name: "Laptop", price: 999, stock: 5 },
  { name: "Mouse", price: 25, stock: 0 },
  { name: "Keyboard", price: 75, stock: 12 },
];
```

## Añadir: `push` y `unshift` → spread y `concat`

`push` añade al final y `unshift` al principio. Los dos mutan el array y devuelven la nueva longitud.

```js
const cart = ["laptop"];

console.log(cart.push("mouse"));       // 2. Muta y devuelve la nueva longitud
console.log(cart.unshift("keyboard")); // 3
console.log(cart);                     // ["keyboard", "laptop", "mouse"]
```

La contraparte inmutable ya la conocemos: spread en un array nuevo. `concat` hace lo mismo y además desempaqueta los arrays que recibe (un nivel).

```js
const cart = ["laptop"];

const withMouse = [...cart, "mouse"];
const withKeyboard = ["keyboard", ...cart];
const combined = cart.concat("mouse", ["webcam", "monitor"]);

console.log(withMouse);    // ["laptop", "mouse"]
console.log(withKeyboard); // ["keyboard", "laptop"]
console.log(combined);     // ["laptop", "mouse", "webcam", "monitor"]
console.log(cart);         // ["laptop"]. Intacto
```

## Quitar: `pop`, `shift` y `splice` → `slice` y `toSpliced`

`pop` quita el último elemento y `shift` el primero. Mutan y devuelven el elemento quitado.

```js
const cart = ["keyboard", "laptop", "mouse"];

console.log(cart.pop());   // "mouse". Muta y devuelve el elemento quitado
console.log(cart.shift()); // "keyboard"
console.log(cart);         // ["laptop"]
```

`splice(inicio, cantidad)` quita elementos en cualquier posición, y con más argumentos inserta otros en su lugar. Muta y devuelve lo quitado.

```js
const cart = ["keyboard", "laptop", "mouse"];

console.log(cart.splice(1, 1)); // ["laptop"]. Muta y devuelve lo quitado
console.log(cart);              // ["keyboard", "mouse"]
```

Sin mutar: `slice(inicio, fin)` devuelve una copia de un tramo (el índice `fin` no entra, y los negativos cuentan desde el final), y `toSpliced` recibe lo mismo que `splice` pero devuelve el array resultante.

```js
const cart = ["keyboard", "laptop", "mouse"];

console.log(cart.slice(0, -1));              // ["keyboard", "laptop"]. Todo menos el último
console.log(cart.slice(1));                  // ["laptop", "mouse"]. Todo menos el primero
console.log(cart.toSpliced(1, 1));           // ["keyboard", "mouse"]. Sin el del índice 1
console.log(cart.toSpliced(1, 0, "webcam")); // ["keyboard", "webcam", "laptop", "mouse"]. Insertar sin quitar
console.log(cart);                           // ["keyboard", "laptop", "mouse"]. Intacto
```

## Reemplazar: `cart[i] = x` → `with`

Asignar por índice muta el array. `with(índice, valor)` devuelve un array nuevo con ese elemento cambiado.

```js
const cart = ["keyboard", "laptop", "mouse"];

const replaced = cart.with(0, "monitor");

console.log(replaced); // ["monitor", "laptop", "mouse"]
console.log(cart);     // ["keyboard", "laptop", "mouse"]. Intacto

cart[0] = "monitor";   // Muta
console.log(cart);     // ["monitor", "laptop", "mouse"]
```

## Ordenar e invertir: `sort` y `reverse` → `toSorted` y `toReversed`

`sort` es el más traicionero: muta el array y además lo devuelve, así que guardar el resultado en otra variable no protege el original. Y sin comparador ordena como texto.

```js
const prices = [10, 9, 1];

const sorted = prices.sort();
console.log(sorted);            // [1, 10, 9]. Ordena como texto: "10" va antes que "9"
console.log(prices === sorted); // true. `prices` también está ordenado: es el mismo array
```

El comparador recibe dos elementos y devuelve un número: negativo si el primero va antes, positivo si va después. Para números, restar. `toSorted` y `toReversed` hacen lo mismo que `sort` y `reverse` devolviendo un array nuevo.

```js
const prices = [10, 9, 1];

console.log(prices.toSorted((a, b) => a - b)); // [1, 9, 10]
console.log(prices.toSorted((a, b) => b - a)); // [10, 9, 1]
console.log(prices.toReversed());              // [1, 9, 10]
console.log(prices);                           // [10, 9, 1]. Intacto
```

## Transformar todos los elementos: bucle → `map`

Queremos los precios con IVA. La forma mutable es recorrer y cambiar cada objeto.

```js
for (const product of products) {
  product.price = product.price * 1.21; // Muta cada objeto del catálogo
}

console.log(products[0]); // { name: "Laptop", price: 1208.79, stock: 5 }. El original ha cambiado
```

`map` recorre el array, aplica una función a cada elemento y devuelve un array nuevo con los resultados. El original no se toca.

```js
const withVat = (price) => price * 1.21;

const prices = products.map((product) => withVat(product.price));

console.log(prices);            // [1208.79, 30.25, 90.75]
console.log(products[0].price); // 999. Intacto
```

Por dentro no tiene misterio: es el bucle de antes construyendo un array local. Mutarlo es seguro porque nadie más lo conoce hasta que se devuelve.

```js
const map = (collection, transform) => {
  const result = [];
  for (const element of collection) {
    result.push(transform(element));
  }
  return result;
};

console.log(map([1, 2, 3], (n) => n * 2)); // [2, 4, 6]
```

El callback recibe también el índice como segundo argumento.

```js
const numbered = products.map((product, index) => `${index + 1}. ${product.name}`);

console.log(numbered); // ["1. Laptop", "2. Mouse", "3. Keyboard"]
```

### La trampa: un callback que muta

`map` crea un array nuevo, pero los elementos que recibe el callback son los objetos originales. Si el callback los modifica, hemos mutado el catálogo aunque el array sea otro. Es la copia superficial del apartado de spread.

```js
const updated = products.map((product) => {
  product.price = product.price * 1.21; // Muta el objeto original
  return product;
});

console.log(updated === products);       // false. El array es nuevo...
console.log(updated[0] === products[0]); // true. ...pero los objetos son los mismos
console.log(products[0].price);          // 1208.79. El catálogo ha cambiado
```

La versión correcta devuelve un objeto nuevo por cada elemento. Recuerda los paréntesis para devolver un objeto literal desde una función flecha.

```js
const updated = products.map((product) => ({ ...product, price: product.price * 1.21 }));

console.log(updated[0].price);  // 1208.79
console.log(products[0].price); // 999. Intacto
```

## Quedarse con algunos: bucle con `if` → `filter`

`filter` recibe un predicado, una función que devuelve `true` o `false`, y devuelve un array nuevo con los elementos que lo cumplen.

```js
const inStock = (product) => product.stock > 0;

const available = products.filter(inStock);

console.log(available.map((product) => product.name)); // ["Laptop", "Keyboard"]
console.log(products.length);                          // 3. Intacto
```

Su implementación es el mismo bucle que `map` con un `if`.

```js
const filter = (collection, predicate) => {
  const result = [];
  for (const element of collection) {
    if (predicate(element)) {
      result.push(element);
    }
  }
  return result;
};

console.log(filter([1, 2, 3, 4], (n) => n % 2 === 0)); // [2, 4]
```

## Calcular un valor a partir de todos: acumulador → `reduce`

Para sumar el catálogo, la forma imperativa es un acumulador que el bucle va reasignando.

```js
let total = 0;
for (const product of products) {
  total += product.price; // Reasigna una variable externa al bucle
}

console.log(total); // 1099
```

`reduce` encapsula ese patrón. Recibe una función con dos parámetros, el acumulador y el elemento actual, y el valor inicial del acumulador. Lo que devuelve la función en cada vuelta es el acumulador de la siguiente.

```js
const total = products.reduce((sum, product) => sum + product.price, 0);

console.log(total); // 1099
```

El resultado no tiene por qué ser un número: puede ser un objeto, un array o cualquier otra cosa. Si no pasamos valor inicial, el primer elemento hace de acumulador y el recorrido empieza en el segundo.

```js
const mostExpensive = products.reduce((best, product) => (product.price > best.price ? product : best));

console.log(mostExpensive.name); // "Laptop"
```

## Comprobar condiciones: `some` y `every`

`some` devuelve `true` si algún elemento cumple el predicado; `every`, si lo cumplen todos. Con un array vacío, `some` es `false` (no hay ninguno que cumpla) y `every` es `true` (no hay ninguno que incumpla).

```js
const outOfStock = (product) => product.stock === 0;

console.log(products.some(outOfStock));  // true. Al menos uno sin stock
console.log(products.every(outOfStock)); // false. No todos
console.log([].some(outOfStock));        // false
console.log([].every(outOfStock));       // true
```

## Encadenar

Como cada método inmutable devuelve un array nuevo, se pueden encadenar: cada uno trabaja sobre el resultado del anterior y el catálogo sigue intacto.

```js
const inStock = (product) => product.stock > 0;
const byPrice = (a, b) => a.price - b.price;
const toLabel = (product) => `${product.name}: ${product.price} €`;

const labels = products.filter(inStock).toSorted(byPrice).map(toLabel);

console.log(labels);                                  // ["Keyboard: 75 €", "Laptop: 999 €"]
console.log(products.map((product) => product.name)); // ["Laptop", "Mouse", "Keyboard"]. Intacto
```

`forEach` es el impuro de la familia: recorre el array sin devolver nada, así que sólo sirve para efectos secundarios y no se puede encadenar. Si el objetivo es obtener un valor nuevo, hay un método que lo devuelve.
