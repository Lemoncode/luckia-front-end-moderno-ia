# Funciones

## Funciones clásicas

Las funciones son un tipo especial de objeto que puede ser invocado y ejecutar una serie de instrucciones. Pueden declarar entre 0 y n parámetros y opcionalmente un valor de retorno.

```js
// Función como declaración
function applyIva(price) {
  console.log(price);
  const iva = 0.21;   // declaración interna
  return price * (1 + iva); // valor de retorno
}

const result = applyIva(200);
console.log(result); // 242

// Función anónima como expresión
const applyIva = function (price) {
  const iva = 0.21;   // declaración interna
  return price * (1 + iva);
};

// Múltiples parámetros
function doSomething(param1, param2, param3) {
  console.log(param1);
  console.log(param2);
  console.log(param3);
  console.log(arguments); // sólo existe en funciones `function`.
}

doSomething("arg 1", "arg 2", "arg3");
doSomething(); // sin argumentos
doSomething("arg1", "arg2", "arg3", "arg4"); // argumentos en exceso
```

Una nota respecto al _hoisting_ es que las funciones creadas como expresión no se pueden invocar antes
de la línea donde se asignan, a diferencia de las declaraciones `function`.

```js
const result = applyIva(200);
//             ^^^^^^^^ ReferenceError: applyIva no es accesible antes de ser declarada

const applyIva = function (price) {
  const iva = 0.21;   // declaración interna
  return price * (1 + iva);
};
```

## Funciones flecha

Tenemos otro tipo de función denominadas arrow functions.

```js
// El ejemplo anterior transformado en arrow function
const applyIva = (price) => {
  const iva = 0.21;   // declaración interna
  return price * (1 + iva);
};

// Arrow function simplificada.
// - Si sólo existe un parámetro opcionalmente podemos eliminar los paréntesis
// - Si sólo tiene una sentencia de retorno podemos eliminar las llaves y el return.
const applyIva = price => price * 1.21;

// Devolviendo un objeto en base a los parámetros.
const toObject = (name, surname, age) => {
  return { name, surname, age };
};
console.log(toObject("John", "Smith", 35));

// Hay que tener cuidado cuando devolvemos objetos sin `return` con arrow functions
// ya que puede confundirse las llaves de cuerpo de función con las de objeto literal.
// Para devolver objetos encerraremos el objeto entre paréntesis.
const toObject = (name, surname, age) => ({ name, surname, age });
```

Las funciones flecha no tienen variable especial `arguments` durante su invocación. Para conseguir un efecto equivalente
se utiliza el operador rest que veremos más adelante.

## Parámetros por defecto

Las funciones pueden tener parámetros por defecto que se activan cuando no le pasamos un argumento o cuando explícitamente le pasamos `undefined`.

```js
// En declaraciones de función
function greet(name = "Unknown") {
  console.log(`Hello, ${name}!`);
}

greet("Jake");    // "Hello, Jake!"
greet();          // "Hello, Unknown!"
greet(undefined); // "Hello, Unknown!"
greet(null);      // "Hello, null!"

// En funciones flecha funciona igual
const greet = (name = "Unknown") => console.log(`Hello, ${name}!`);
```
