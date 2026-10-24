import { readFileSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { Client as MinioClient } from 'minio'

// ---------------------------------------------------------------------------
// Modelo de datos (contrato de la Parte 1). Se define a mano en TypeScript:
// usamos el driver nativo de MongoDB, sin ORM.
//
// NOTA: `ownerId` y `status` NO se incluyen aquí. Están RESERVADOS para la
// Parte 2 (cuando un usuario pueda publicar/gestionar sus propios anuncios).
// ---------------------------------------------------------------------------
type FuelType = 'diesel' | 'gasolina' | 'hibrido' | 'electrico'
type Transmission = 'manual' | 'automatico'

interface Car {
  make: string
  model: string
  price: number
  year: number
  km: number
  fuelType: FuelType
  transmission: Transmission
  power: number // CV
  color: string
  description: string
  photos: string[] // URLs públicas de MinIO
  seller: { name: string; phone: string; email: string }
  createdAt: Date
}

// --- Configuración leída del .env -----------------------------------------
const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB ?? 'compra-coches'
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT ?? 'localhost'
const MINIO_PORT = Number(process.env.MINIO_PORT ?? 9000)
const MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true'
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY ?? 'minioadmin'
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY ?? 'minioadmin'
const MINIO_BUCKET = process.env.MINIO_BUCKET ?? 'car-photos'
const PUBLIC_MINIO_URL = process.env.PUBLIC_MINIO_URL ?? 'http://localhost:9000'

// --- Datos semilla --------------------------------------------------------
// `slug`     → identificador estable del coche (clave del objeto en MinIO).
// `photoFile`→ nombre EXACTO del fichero en `scripts/fotos/` (los nombres no
//              siguen un patrón único, por eso se mapea a mano por coche).
type CarSeed = Omit<Car, 'photos' | 'createdAt'> & {
  slug: string
  photoFile: string
}

const carsSeed: CarSeed[] = [
  {
    slug: 'seat-leon',
    photoFile: 'seatleon.jpg',
    make: 'Seat',
    model: 'León 1.5 TSI',
    price: 18900,
    year: 2021,
    km: 42000,
    fuelType: 'gasolina',
    transmission: 'manual',
    power: 150,
    color: '#c0392b',
    description:
      'Seat León en muy buen estado, único propietario, libro de mantenimiento al día.',
    seller: { name: 'Carlos Ruiz', phone: '600123456', email: 'carlos@example.com' },
  },
  {
    slug: 'volkswagen-golf',
    photoFile: 'volskwagengolf.jpg',
    make: 'Volkswagen',
    model: 'Golf 2.0 TDI',
    price: 21500,
    year: 2020,
    km: 68000,
    fuelType: 'diesel',
    transmission: 'automatico',
    power: 150,
    color: '#2c3e50',
    description:
      'Golf diésel automático, ideal para carretera, consumo muy contenido.',
    seller: { name: 'Ana López', phone: '600654321', email: 'ana@example.com' },
  },
  {
    slug: 'toyota-corolla',
    photoFile: 'toyotacorolla.webp',
    make: 'Toyota',
    model: 'Corolla Hybrid',
    price: 23900,
    year: 2022,
    km: 31000,
    fuelType: 'hibrido',
    transmission: 'automatico',
    power: 122,
    color: '#27ae60',
    description:
      'Toyota Corolla híbrido, fiabilidad japonesa y bajo consumo en ciudad.',
    seller: { name: 'Marta Gil', phone: '611222333', email: 'marta@example.com' },
  },
  {
    slug: 'tesla-model-3',
    photoFile: 'teslamodel3.jpg',
    make: 'Tesla',
    model: 'Model 3 Standard Range',
    price: 34900,
    year: 2021,
    km: 55000,
    fuelType: 'electrico',
    transmission: 'automatico',
    power: 283,
    color: '#8e44ad',
    description:
      'Tesla Model 3 eléctrico, autonomía real de 400 km, cargador incluido.',
    seller: { name: 'David Sanz', phone: '622333444', email: 'david@example.com' },
  },
  {
    slug: 'renault-clio',
    photoFile: 'renaultclio.jpg',
    make: 'Renault',
    model: 'Clio 1.0 TCe',
    price: 13500,
    year: 2020,
    km: 49000,
    fuelType: 'gasolina',
    transmission: 'manual',
    power: 100,
    color: '#e67e22',
    description:
      'Renault Clio urbano, perfecto para ciudad, muy manejable y económico.',
    seller: { name: 'Lucía Moreno', phone: '633444555', email: 'lucia@example.com' },
  },
  {
    slug: 'bmw-serie-3',
    photoFile: 'bmw-serie-3.jpg',
    make: 'BMW',
    model: 'Serie 3 320d',
    price: 29900,
    year: 2019,
    km: 82000,
    fuelType: 'diesel',
    transmission: 'automatico',
    power: 190,
    color: '#16a085',
    description:
      'BMW Serie 3 diésel, acabado deportivo, tapicería de cuero y navegador.',
    seller: { name: 'Javier Ortega', phone: '644555666', email: 'javier@example.com' },
  },
]

// Carpeta con las fotos reales (junto a este script): scripts/fotos/
const PHOTOS_DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'fotos')

// content-type de MinIO según la extensión del fichero.
function contentTypeFor(file: string): string {
  const ext = extname(file).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.webp') return 'image/webp'
  throw new Error(`Extensión de imagen no soportada: ${file}`)
}

async function main() {
  const mongo = new MongoClient(MONGODB_URI)
  const minio = new MinioClient({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: MINIO_USE_SSL,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  })

  try {
    // 1) Aseguramos el bucket (por si se ejecuta el seed sin el init de compose)
    const exists = await minio.bucketExists(MINIO_BUCKET).catch(() => false)
    if (!exists) {
      await minio.makeBucket(MINIO_BUCKET)
      console.log(`Bucket "${MINIO_BUCKET}" creado`)
    }

    await mongo.connect()
    const db = mongo.db(MONGODB_DB)
    const cars = db.collection<Car>('cars')

    // 2) RESET (idempotencia): vaciamos la colección antes de sembrar.
    //    Reejecutar el seed deja siempre el mismo estado limpio, sin duplicados.
    await cars.deleteMany({})

    // 3) Subimos las fotos REALES a MinIO y construimos los documentos.
    //    La clave del objeto es estable (mismo slug + extensión) => re-subir
    //    sobrescribe la misma imagen, sin acumular duplicados.
    const docs: Car[] = []
    for (const car of carsSeed) {
      const sourcePath = join(PHOTOS_DIR, car.photoFile)

      // Si falta el fichero esperado, avisamos con su nombre (no fallamos en
      // silencio): así el alumno sabe exactamente qué copiar a scripts/fotos/.
      let body: Buffer
      try {
        body = readFileSync(sourcePath)
      } catch {
        throw new Error(
          `Falta la foto "${car.photoFile}" del coche "${car.slug}". ` +
            `Cópiala a scripts/fotos/ (esperada en ${sourcePath}).`,
        )
      }

      const ext = extname(car.photoFile).toLowerCase() // ".jpg" | ".jpeg" | ".webp"
      const key = `${car.slug}${ext}` // p.ej. seat-leon.jpg, toyota-corolla.webp
      await minio.putObject(MINIO_BUCKET, key, body, body.length, {
        'Content-Type': contentTypeFor(car.photoFile),
      })

      const photos = [`${PUBLIC_MINIO_URL}/${MINIO_BUCKET}/${key}`]

      const { slug, photoFile, ...rest } = car
      void slug
      void photoFile
      docs.push({ ...rest, photos, createdAt: new Date() })
    }

    // 4) Insertamos los documentos en la colección `cars`.
    const result = await cars.insertMany(docs)

    console.log(`\n✅ Seed completado`)
    console.log(`   Coches insertados: ${result.insertedCount}`)
    console.log(`   Fotos subidas al bucket "${MINIO_BUCKET}": ${docs.length}`)
    console.log(`\n   Ejemplo de URL de foto (ábrela en el navegador):`)
    console.log(`   ${docs[0].photos[0]}`)
  } finally {
    await mongo.close()
  }
}

main().catch((err) => {
  console.error('❌ Error ejecutando el seed:', err)
  process.exit(1)
})