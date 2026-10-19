'use server';
import { revalidatePath } from 'next/cache';
import { routeConstants } from '#core/constants';
import * as api from './api';
import * as viewModel from './car.vm';
import { mapCarFromVmToApi } from './car.mappers';

export const toggleBooking = async (car: viewModel.Car) => {
  await api.bookCar(mapCarFromVmToApi({ ...car, isBooked: !car.isBooked }));
  revalidatePath(routeConstants.carList, 'layout');
};
