# Optional chaining y nullish coalescing

Estos dos operadores llegaron juntos en ES2020. Resuelven dos situaciones muy habituales cuando trabajamos con datos que pueden no existir, como los que recibimos de un servidor: acceder a propiedades de forma segura y asignar valores por defecto.

## Optional chaining

En el apartado de destructuring vimos que extraer propiedades de `null` o `undefined` lanza un `TypeError`. Lo mismo ocurre cuando accedemos a una propiedad con la notación punto.

```js
const user = {
  name: "Javi",
  stats: {
    likes: 38,
    rt: 56,
  },
  friends: ["Santi", "Ana"],
  greet: () => console.log("Hey there! What's up"),
};

const guest = {
  name: "Guest",
};

console.log(user.stats.likes); // 38
console.log(guest.stats);      // undefined. La propiedad no existe, pero no hay error

console.log(guest.stats.likes);
//                      ^^^^^ TypeError: `guest.stats` es `undefined` y no tiene propiedades
```

La forma clásica de resolverlo es comprobar que cada nivel existe antes de acceder al siguiente. Con varios niveles de profundidad resulta muy engorroso.

```js
// Comprobaciones encadenadas con el operador AND
console.log(guest.stats && guest.stats.likes); // undefined

// Todavía más tedioso con estructuras if
if (guest.stats) {
  console.log(guest.stats.likes);
}
```

Con el operador optional chaining (`?.`) el acceso es seguro sin necesidad de comprobaciones explícitas.

```js
console.log(user.stats?.likes);  // 38
console.log(guest.stats?.likes); // undefined
```

El operador comprueba si lo que tiene a su izquierda es `null` o `undefined`, lo que se conoce como un valor _nullish_. Si lo es, deja de evaluar la expresión y devuelve `undefined`. En caso contrario continúa con el acceso.

Por eso es importante colocarlo en el sitio correcto: cada `?.` sólo protege lo que tiene justo a su izquierda.

```js
console.log(guest?.stats.likes);
//                       ^^^^^ TypeError: `?.` comprueba `guest`, pero lo que no existe es `guest.stats`
```

Podemos encadenar tantos `?.` como valores puedan no existir.

```js
const getLikes = (someUser) => someUser?.stats?.likes;

console.log(getLikes(user));  // 38
console.log(getLikes(guest)); // undefined. No existe `stats`
console.log(getLikes(null));  // undefined. No existe el propio usuario
```

Aun así conviene utilizarlo sólo donde un valor puede realmente no existir. Si lo ponemos en todos los accesos "por si acaso", ocultamos errores que deberíamos detectar cuanto antes.

## Optional chaining en arrays y funciones

También podemos utilizarlo para acceder a un índice de un array o para invocar una función. En estos casos la sintaxis es `?.[]` y `?.()`, manteniendo el punto.

```js
console.log(user.friends?.[1]);  // "Ana"
console.log(guest.friends?.[1]); // undefined

user.greet?.();  // "Hey there! What's up"
guest.greet?.(); // No hace nada, pero tampoco lanza un error
```

Un despiste habitual es olvidar el punto.

```js
console.log(guest.friends?[1]);
//                       ^ SyntaxError: sin el punto se interpreta como un operador ternario
```

## Nullish coalescing

En el apartado de operadores lógicos vimos que `||` devuelve el primer valor _truthy_ que encuentra. Durante años se ha utilizado este comportamiento para asignar valores por defecto.

```js
let quantity;
console.log(quantity || "unknown"); // "unknown"

quantity = 43;
console.log(quantity || "unknown"); // 43
```

El problema es que `||` descarta cualquier valor _falsy_, y valores como `0`, `""` o `false` muchas veces son válidos.

```js
quantity = 0;
console.log(quantity || "unknown"); // "unknown". ¡Pero 0 es una cantidad válida!
```

El operador nullish coalescing (`??`) devuelve el operando derecho sólo cuando el izquierdo es _nullish_, es decir, `null` o `undefined`.

```js
console.log(quantity ?? "unknown"); // 0
```

Veamos la diferencia entre ambos operadores con distintos valores.

```js
// Con `||` cualquier valor falsy activa el valor por defecto
console.log(0 || "default");     // "default"
console.log("" || "default");    // "default"
console.log(false || "default"); // "default"

// Con `??` sólo lo activan `null` y `undefined`
console.log(0 ?? "default");         // 0
console.log("" ?? "default");        // ""
console.log(false ?? "default");     // false
console.log(null ?? "default");      // "default"
console.log(undefined ?? "default"); // "default"
```

Recordemos que los valores por defecto de parámetros y destructuring sólo se activan con `undefined`. El operador `??` se activa también con `null`.

```js
const draft = {
  id: null,
};

const { id = 0 } = draft;
console.log(id); // null

console.log(draft.id ?? 0); // 0
```

## Combinando ambos operadores

Es muy habitual combinar ambos operadores: optional chaining para acceder de forma segura y nullish coalescing para dar un valor por defecto cuando el dato no existe.

```js
console.log(user.stats?.likes ?? "Not available");  // 38
console.log(guest.stats?.likes ?? "Not available"); // "Not available"
```

## Asignación con operadores lógicos

Al igual que los operadores aritméticos, a partir de ES2021 los operadores lógicos y el nullish coalescing también se pueden combinar con asignación.

```js
let a = true;
a &&= false;    // a = a && false
console.log(a); // false

a ||= true;     // a = a || true
console.log(a); // true

let b = null;
b ??= "unavailable"; // b = b ?? "unavailable"
console.log(b);      // "unavailable"
```

El operador `??=` es útil para inicializar un valor sólo si todavía no existe.

```js
const settings = {
  theme: "dark",
};

settings.theme ??= "light"; // No cambia, ya tiene un valor
settings.language ??= "es"; // Se asigna, la propiedad no existía
console.log(settings);      // { theme: "dark", language: "es" }
```
