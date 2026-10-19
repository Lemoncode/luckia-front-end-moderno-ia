import { CarList, api, mapCarListFromApiToVm } from '#pods/car-list';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

const CarListPage = async () => {
  // Since Next 15 fetch is NOT cached by default.
  // This route is static because it doesn't use request data (cookies, headers, searchParams).
  const carList = await api.getCarList({ next: { revalidate: 10 } }); // In seconds
  console.log('Car list at build time:', { carList });

  return <CarList carList={mapCarListFromApiToVm(carList)} />;
};

export default CarListPage;
