# 06 · SSR - Precarga - Streaming

## 1. Que vamos a hacer

Vamos a pararnos y ver delo que hemos implementado:

- Cómo funciona SSR y el código isomórfico.

- Cómo funciona la precarga.

- Cómo priorizar contenido y streaming.

## 2. Manos a la obra

Hasta ahora has visto que bueno, se organiza el código bien, y eso, pero si destripamos un poco lo que ya hay te vas a sorprender.

Lo primero hemos estado haciendo SSR sin saberlo, ¿Una demo, abre un ventana de terminal de debug (para si tenías corriendo el proyecto en otro terminal).

Y pon un breakpoint desde Visual Studio Code en el fichero

_src/routes/index.tsx_

En concreto dentro del loader:

```tsx
export const Route = createFileRoute("/")({
  loader: async () => {
    // ** AQUI DEBAJO***
    const cars = await carListRepository.getCarList();
    return { cars };
  },
  component: Home,
});
```

Ahora vamos cargar la página desde el navegador, hacemos un refresh y vemos que para el breakpoint.

¿Que pasa si navegamo a detalle de un coche y volvemos a la página principal? Pues que no para el breakpoint ¿Qué está pasando aquí? Pues que ahora está trabajando en modo SPA y hacer la carga desde cliente.

Fijate que chulo, el código del loader y la página es "isomórfica" es decir se puede ejecutar tanto en cliente como en servidor.

Vamos a por otro tema interesante, si estoy en una página de detalle y pongo el mismo breakpoint en la página principal pero en el navegador:

_src/routes/index.tsx_

En concreto dentro del loader:

```tsx
export const Route = createFileRoute("/")({
  loader: async () => {
    // ** AQUI DEBAJO***
    const cars = await carListRepository.getCarList();
    return { cars };
  },
  component: Home,
});
```

Fijate que en cuanto me acerco al enlace se ejecuta el loader, esto sirve para tener los datos listo y que la página parezca que carga de forma instantanea.

Esto se puede configurar, si nos vamos a:

_./src/routes/__root.tsx_

```tsx
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <Link to="/" className="text-lg font-bold">
            Compra Coches
          </Link>
```

Podemos añadir una propiedad al link

Deshabilitar el comportamiento

```diff
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
-          <Link to="/" className="text-lg font-bold">
          <Link
             to="/"
            className="text-lg font-bold"
+            preload={false}
          >

            Compra Coches
          </Link>
```

O hacer que haga la precargue cuando el enlace entre en pantalla

```diff
function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
-          <Link to="/" className="text-lg font-bold">
          <Link
             to="/"
            className="text-lg font-bold"
+            preload="viewport"
          >

            Compra Coches
          </Link>
```

Las opciones son false, "intent", "viewport" y "render". "intent" precarga por interacción; "viewport", cuando el enlace entra en pantalla; y "render", cuando se muestra el enlace. También puedes ajustar el retraso con preloadDelay.
