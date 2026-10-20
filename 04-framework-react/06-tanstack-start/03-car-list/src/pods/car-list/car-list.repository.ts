import type { CarSummary } from "./car-list.model";

export const carListRepository = {
  async getCarList(): Promise<CarSummary[]> {
    return [
      {
        id: "seat-leon",
        make: "Seat",
        model: "León 1.5 TSI",
        price: 18900,
        year: 2021,
        km: 42000,
        photo: "http://localhost:9000/car-photos/seat-leon.jpg",
      },
      {
        id: "volkswagen-golf",
        make: "Volkswagen",
        model: "Golf 2.0 TDI",
        price: 21500,
        year: 2020,
        km: 68000,
        photo: "http://localhost:9000/car-photos/volkswagen-golf.jpg",
      },
      {
        id: "toyota-corolla",
        make: "Toyota",
        model: "Corolla Hybrid",
        price: 23900,
        year: 2022,
        km: 31000,
        photo: "http://localhost:9000/car-photos/toyota-corolla.webp",
      },
      {
        id: "tesla-model-3",
        make: "Tesla",
        model: "Model 3 Standard Range",
        price: 34900,
        year: 2021,
        km: 55000,
        photo: "http://localhost:9000/car-photos/tesla-model-3.jpg",
      },
      {
        id: "renault-clio",
        make: "Renault",
        model: "Clio 1.0 TCe",
        price: 13500,
        year: 2020,
        km: 49000,
        photo: "http://localhost:9000/car-photos/renault-clio.jpg",
      },
      {
        id: "bmw-serie-3",
        make: "BMW",
        model: "Serie 3 320d",
        price: 29900,
        year: 2019,
        km: 82000,
        photo: "http://localhost:9000/car-photos/bmw-serie-3.jpg",
      },
    ];
  },
};
