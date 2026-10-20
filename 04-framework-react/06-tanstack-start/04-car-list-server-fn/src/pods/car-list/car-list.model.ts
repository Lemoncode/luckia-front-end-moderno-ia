// View-model del pod `car-list`: lo MÍNIMO que necesita una tarjeta del listado.
//
// No es el coche completo (eso es cosa del pod `car-detail`): la tarjeta solo pinta
// una foto, la marca/modelo, año, km y el precio. Modelar solo lo que la UI usa
// mantiene el pod enfocado y desacoplado de la forma de la fuente de datos.
export interface CarSummary {
  id: string;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  photo: string; // una sola foto para la tarjeta (la primera del coche)
}
