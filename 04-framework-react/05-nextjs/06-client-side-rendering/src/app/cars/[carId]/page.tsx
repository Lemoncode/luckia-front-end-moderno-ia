import { Car, api, mapCarFromApiToVm } from '#pods/car';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ carId: string }>;
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params;
  const car = await api.getCar(params.carId);
  return {
    title: `Rent a car - Car ${car.name} details`,
  };
};

const CarPage = async (props: Props) => {
  const params = await props.params;
  const car = await api.getCar(params.carId);
  console.log('Car page', car);

  return <Car car={mapCarFromApiToVm(car)} />;
};

export default CarPage;
