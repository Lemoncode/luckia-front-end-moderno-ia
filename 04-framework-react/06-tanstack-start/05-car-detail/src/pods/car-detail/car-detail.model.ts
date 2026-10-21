// Esto se podría promocionar a `common`
export type FuelType = "diesel" | "gasolina" | "hibrido" | "electrico";
export type Transmission = "manual" | "automatico";

export interface Car {
  id: string;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  fuelType: FuelType;
  transmission: Transmission;
  power: number; // CV
  color: string;
  description: string;
  photos: string[]; // URLs públicas de MinIO
  seller: { name: string; phone: string; email: string };
}
