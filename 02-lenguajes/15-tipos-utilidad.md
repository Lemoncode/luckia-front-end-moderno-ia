# Tipos de utilidad

TypeScript incluye de serie las definiciones de tipos de toda la API de JavaScript: `Array<T>`, `Promise<T>`, `Date`, el DOM… Junto a ellas trae un conjunto de tipos de utilidad: genéricos ya escritos que construyen un tipo nuevo a partir de otro. Se usan como cualquier genérico, pasando el tipo entre `<>`, no hay que importar nada, y están escritos en TypeScript.

Veremos los cinco más habituales sobre esta interfaz.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const julia: User = { id: 31, name: "Julia", email: "julia@mail.com" };
```

## Partial

`Partial<T>` crea un tipo con las mismas propiedades que `T`, pero todas opcionales. Es el tipo natural de una modificación parcial: queremos cambiar algunos campos de un usuario sin tener que pasar los demás.

Sin `Partial`, un objeto con sólo los cambios no cumple `User`.

```ts
const changes: User = { email: "julia@new.com" };
//    ^^^^^^^ [ts] Type '{ email: string; }' is missing the following properties from type 'User': id, name
```

Con `Partial<User>`, cada propiedad puede venir o no.

```ts
const updateUser = (user: User, changes: Partial<User>): User => ({
  id: changes.id ?? user.id,
  name: changes.name ?? user.name,
  email: changes.email ?? user.email,
});

console.log(updateUser(julia, { email: "julia@new.com" })); // { id: 31, name: "Julia", email: "julia@new.com" }
console.log(updateUser(julia, {}));                         // { id: 31, name: "Julia", email: "julia@mail.com" }

updateUser(julia, { nickname: "ju" });
//                  ^^^^^^^^ [ts] Object literal may only specify known properties, and 'nickname' does not exist in type 'Partial<User>'.
```

Fíjate en el `??` de la implementación: como cada propiedad de `changes` es opcional, su valor puede ser `undefined`, y TypeScript no nos deja usarlo sin contemplarlo.

```ts
const partial: Partial<User> = { email: "julia@new.com" };

const upper: string = partial.email.toUpperCase();
//                    ^^^^^^^^^^^^^ [ts] 'partial.email' is possibly 'undefined'.
```

## Pick

`Pick<T, K>` crea un tipo con sólo las propiedades `K` de `T`. Sirve para describir una vista reducida sin duplicar la interfaz: si `User` cambia, la vista cambia con ella.

```ts
type UserPreview = Pick<User, "id" | "name">;

const preview: UserPreview = { id: 31, name: "Julia" };
```

`K` es una unión de literales restringida a `keyof T`, así que sólo admite claves que existen.

```ts
type Wrong = Pick<User, "nickname">;
//                      ^^^^^^^^^^ [ts] Type '"nickname"' does not satisfy the constraint 'keyof User'.
```

## Omit

`Omit<T, K>` es el contrario: todas las propiedades de `T` menos las `K`.

```ts
type NewUser = Omit<User, "id">;

const createUser = (data: NewUser): User => ({ id: 32, name: data.name, email: data.email });

console.log(createUser({ name: "Evan", email: "evan@mail.com" })); // { id: 32, name: "Evan", email: "evan@mail.com" }

createUser({ id: 32, name: "Evan", email: "evan@mail.com" });
//           ^^ [ts] Object literal may only specify known properties, and 'id' does not exist in type 'NewUser'.
```

A diferencia de `Pick`, `Omit` no comprueba que las claves existan: `Omit<User, "nickname">` compila y devuelve `User` tal cual, así que un error de escritura en la clave pasa desapercibido.

## Record

`Record<K, V>` crea un tipo de objeto cuyas claves son `K` y cuyos valores son `V`. Con una unión de literales como clave obliga a cubrir todos los casos.

```ts
type Role = "admin" | "editor" | "viewer";

const roleLabel: Record<Role, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Lector",
};

console.log(roleLabel.admin); // "Administrador"

const incomplete: Record<Role, string> = {
//    ^^^^^^^^^^ [ts] Property 'viewer' is missing in type '{ admin: string; editor: string; }' but required in type 'Record<Role, string>'.
  admin: "Administrador",
  editor: "Editor",
};
```

Con `string` como clave describe un diccionario abierto, al que podemos añadir entradas.

```ts
const stock: Record<string, number> = { laptop: 5, mouse: 0 };
stock.keyboard = 12;
```

## ReturnType

`ReturnType<T>` extrae el tipo que devuelve una función. Es útil cuando una función construye un objeto cuyo tipo no hemos declarado en ninguna interfaz y queremos nombrarlo sin duplicarlo.

Para pasarle una función necesitamos su tipo, no su valor: `typeof` en posición de tipo nos lo da.

```ts
const buildSummary = (user: User) => ({
  id: user.id,
  label: `${user.name} <${user.email}>`,
});

type UserSummary = ReturnType<typeof buildSummary>; // { id: number; label: string; }

const summary: UserSummary = buildSummary(julia);
console.log(summary.label); // "Julia <julia@mail.com>"
```

Sólo admite tipos de función.

```ts
type NotAFunction = ReturnType<User>;
//                             ^^^^ [ts] Type 'User' does not satisfy the constraint '(...args: any) => any'.
```

## Los demás

Hay más tipos de utilidad, todos con la misma mecánica: `Required<T>` (el contrario de `Partial`), `Readonly<T>`, `Exclude`, `Extract`, `NonNullable<T>` o `Parameters<T>`. La lista completa está en la [documentación oficial](https://www.typescriptlang.org/docs/handbook/utility-types.html).
