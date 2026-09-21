# Immer

Ya sabemos actualizar sin mutar: spread en cada nivel del camino. Con dos niveles se lee bien; con cuatro, cada cambio son cuatro spreads anidados y olvidar uno significa mutar sin querer. Immer es una librería que resuelve exactamente eso: escribimos el cambio como si mutáramos, sobre un borrador, y ella construye el valor nuevo sin tocar el original.

Como es una librería externa, antes necesitamos saber cómo se importa código en JavaScript.

## Módulos: `import` y `export`

Cada fichero es un módulo: lo que declara es privado, salvo lo que marque con `export`. Otro fichero lo recupera con `import`, indicando la ruta del fichero.

```js
// tax.js
export const VAT = 0.21;

export const withVat = (price) => price * (1 + VAT);

export default function double(price) {
  return price * 2;
}
```

Los `export` con nombre se importan entre llaves, con el mismo nombre. Cada módulo puede tener además un `export default`, que se importa sin llaves y con el nombre que queramos.

```js
// main.js
import double, { VAT, withVat } from "./tax.js";

console.log(withVat(100)); // 121
console.log(VAT);          // 0.21
console.log(double(4));    // 8
```

Cuando la ruta no empieza por `./`, es el nombre de un paquete instalado con npm, y se busca en `node_modules`.

```js
import { produce } from "immer";
```

Dónde funciona: en Node, con `"type": "module"` en el `package.json`; en el navegador, con `<script type="module">`; con Vite, por defecto. Los módulos se ejecutan siempre en modo estricto.

Para lo que sigue, instala Immer en el proyecto de pruebas:

```
npm install immer
```

## Qué hace Immer

`produce` recibe el estado actual y una función, la receta, que recibe un borrador del estado. Dentro de la receta escribimos los cambios como mutaciones. `produce` devuelve un objeto nuevo con esos cambios aplicados.

```js
import { produce } from "immer";

const julia = {
  name: "Julia",
  address: { city: "Málaga", zip: 29002 },
  tags: ["vip"],
};

const moved = produce(julia, (draft) => {
  draft.address.city = "Sevilla"; // Escribimos como si mutáramos
});

console.log(moved.address.city); // "Sevilla"
console.log(julia.address.city); // "Málaga". El original no cambia
console.log(moved === julia);    // false. Es un objeto nuevo
```

Es el mismo resultado que `{ ...julia, address: { ...julia.address, city: "Sevilla" } }`, pero la profundidad ya no importa: cambiar algo a cinco niveles se escribe igual que a uno, y no hay ningún spread que olvidar.

El borrador no es el objeto original: es un intermediario que anota lo que hacemos con él. Al terminar la receta, Immer aplica esas anotaciones creando copias sólo donde hace falta.

## Sólo cambia lo que cambia

Immer sigue la misma regla que aplicábamos a mano: copia el camino hasta el cambio y comparte todo lo demás. Y si la receta no cambia nada, devuelve el mismo objeto.

```js
console.log(moved.address === julia.address); // false. Esta rama cambió
console.log(moved.tags === julia.tags);       // true. Esta no: se comparte

const same = produce(julia, () => {});
console.log(same === julia); // true. Sin cambios, mismo objeto
```

Es lo que en el apartado de funciones puras conseguimos con `user.name === name ? user : { ...user, name }`, pero aplicado automáticamente a toda la estructura: la comparación de referencias dice la verdad en los dos sentidos.

## Arrays en el borrador

Los arrays del borrador (draft) admiten los métodos que mutan. Actúan sobre el borrador, y el array original queda intacto.

```js
const tagged = produce(julia, (draft) => {
  draft.tags.push("new");
  draft.tags.sort();
});

console.log(tagged.tags); // ["new", "vip"]
console.log(julia.tags);  // ["vip"]. Intacto
```

Existe un plugin dentro de Immer, `enableArrayMethods()`, que optimiza las operaciones de acceso y modificación de los arrays evitando crear proxies innecesarios durante la iteración, esto aumenta el rendimiento con arrays grandes. Por defecto los plugins no están activados y se tienen que invocar una vez para activarlos.

También existe `enableMapSet()` que da soporte y permite usar las estructuras `Map` y `Set`.

## Devolver un valor en lugar de mutar

Si el callback devuelve algo, ese valor sustituye al estado entero. Es la forma de reemplazarlo del todo, por ejemplo para vaciar un carrito.

```js
const cart = ["laptop", "mouse"];

const emptied = produce(cart, () => []);

console.log(emptied); // []
console.log(cart);    // ["laptop", "mouse"]. Intacto
```

Lo que no se puede es hacer las dos cosas a la vez: mutar el borrador y además devolver un valor. Immer no sabría cuál de los dos resultados quieres y lanza un error.

```js
produce(julia, (draft) => {
  draft.name = "Evan";
  return { ...draft };
}); // Error: [Immer] An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.
```

## `produce` currificado

Si a `produce` le pasamos sólo la receta, devuelve una función que espera el estado. Es la función configurada del apartado de closures: definimos la operación una vez y la aplicamos a cualquier estado. Los argumentos extra llegan a la receta después del borrador.

```js
const setCity = produce((draft, city) => {
  draft.address.city = city;
});

const inBilbao = setCity(julia, "Bilbao");

console.log(inBilbao.address.city); // "Bilbao"
console.log(julia.address.city);    // "Málaga". Intacto
```

## Inspeccionar el borrador: `current`

Si hacemos `console.log(draft)` dentro de la receta, vemos el intermediario de Immer, no nuestros datos. `current(draft)` devuelve una copia normal del estado del borrador en ese momento.

```js
import { produce, current } from "immer";

const julia = { name: "Julia", address: { city: "Málaga", zip: 29002 }, tags: ["vip"] };

produce(julia, (draft) => {
  draft.name = "Julia M.";
  console.log(current(draft)); // { name: "Julia M.", address: { city: "Málaga", zip: 29002 }, tags: ["vip"] }
});
```

## Congelado automático

Immer congela en profundidad todo lo que forma parte del resultado. Es la inmutabilidad real que dejamos pendiente en el apartado de interfaces: `readonly` sólo existía al compilar; esto ocurre en ejecución.

```js
console.log(Object.isFrozen(moved));         // true
console.log(Object.isFrozen(moved.address)); // true

moved.address.city = "Madrid"; // TypeError: Cannot assign to read only property 'city' of object '#<Object>'
```

En modo estricto, y por tanto en cualquier módulo, mutar un objeto congelado lanza un error; fuera de él, la mutación se ignora en silencio. Como las partes que no cambian se comparten con el original, también quedan congeladas allí: después del primer `produce`, `julia.tags` ya no admite un `push`.

Con esto tenemos las dos formas de trabajar sin mutar: spread cuando el cambio es superficial, e Immer cuando el estado es un árbol y el cambio está dentro.
