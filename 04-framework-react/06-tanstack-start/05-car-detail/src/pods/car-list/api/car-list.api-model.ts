import type { ObjectId } from "mongodb";

export interface CarListDoc {
  _id: ObjectId;
  make: string;
  model: string;
  price: number;
  year: number;
  km: number;
  photos: string[];
}
