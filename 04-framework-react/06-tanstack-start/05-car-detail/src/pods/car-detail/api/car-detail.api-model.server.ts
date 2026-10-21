import type { ObjectId } from "mongodb";

// Esto se podría promocionar a `common`
export type FuelType = "diesel" | "gasolina" | "hibrido" | "electrico";
export type Transmission = "manual" | "automatico";

export interface CarDoc {
  _id: ObjectId;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  fuelType: FuelType;
  transmission: Transmission;
  power: number;
  color: string; // hex (#8e44ad), tal cual lo guarda el seed
  description: string;
  photos: string[];
  seller: { name: string; phone: string; email: string };
  createdAt: Date; // la ficha no lo usa (el mapper lo descarta)
}
