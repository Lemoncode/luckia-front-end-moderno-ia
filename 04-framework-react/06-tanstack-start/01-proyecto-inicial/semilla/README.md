# Arrancar el proyecto y cargar los datos de ejemplo

Estos pasos asumen que ya están preparados `docker-compose.yml`, `.env`, el script `scripts/seed.ts` y las fotos de `scripts/fotos/`.

## 1. Instalar dependencias

Desde la carpeta raíz del proyecto —donde está `package.json`— ejecuta:

```bash
pnpm install
```

## 2. Arrancar MongoDB y MinIO

Vamos a crear las carpetas locales para guardar los datos de los volumenes de imagwes docker y minio:

```bash
mkdir -p ./voldata/mongo ./voldata/minio
```
> En window lo puede crear manual


Asegúrate de que Docker Desktop está abierto y en marcha. Desde la carpeta que contiene `docker-compose.yml`, ejecuta:

```bash
docker compose up -d
```

Comprueba el estado:

```bash
docker compose ps -a
```

MongoDB y MinIO deben estar activos `Up`. El contenedor `createbuckets` aparecerá como `Exited (0)`: es normal, porque solo crea el bucket `car-photos`, lo deja preparado para servir las fotos y termina.

> Sin `-a`, `docker compose ps` solo muestra los contenedores en marcha, así que `createbuckets` no aparece.

### Si aparece `container name ... is already in use`

Elimina el contenedor indicado por el error y vuelve a ejecutar `docker compose up -d`. Por ejemplo:

```bash
docker compose rm -sf mongo
docker compose up -d
```

Para los otros contenedores, usa el nombre correspondiente:

```bash
docker compose rm -sf minio
docker compose rm -sf createbuckets
```

Estos comandos eliminan solo contenedores, no los volúmenes con los datos. No añadas `-v`.

## 3. Cargar los datos de ejemplo

Con MongoDB y MinIO en marcha, ejecuta desde la raíz del proyecto:

```bash
pnpm seed
```

El resultado debería indicar que se han insertado 6 coches y subido 6 fotos. El seed vacía primero la colección `cars` y la vuelve a rellenar con los datos de ejemplo; al repetirlo, deja esos mismos seis coches.

## 4. Comprobar los datos y las fotos

Cuenta los coches insertados:

```bash
docker compose exec -T mongo mongosh --quiet compra-coches --eval 'db.cars.countDocuments()'
```

Debe mostrar `6`. Para comprobar una foto, abre esta dirección en el navegador:

```text
http://localhost:9000/car-photos/seat-leon.jpg
```

## 5. Arrancar el frontend

Desde la raíz del proyecto frontend, ejecuta:

```bash
pnpm dev
```

Abre la dirección que indique el terminal; normalmente:

```text
http://localhost:3000
```
