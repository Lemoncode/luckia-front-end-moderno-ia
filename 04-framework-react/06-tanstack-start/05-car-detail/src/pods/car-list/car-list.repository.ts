import { createServerFn } from "@tanstack/react-start";
import type { CarSummary } from "./car-list.model";
import { fetchCarList } from "./api/car-list.api.server";
import { mapCarSummary } from "./car-list.mapper";


const getCarListFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CarSummary[]> => {
    const docs = await fetchCarList();
    return docs.map(mapCarSummary);
  });

export const carListRepository = {
  getCarList(): Promise<CarSummary[]> {
    return getCarListFn();
  },
};