import { routeConstants } from '#core/constants';
import { CarList, api, mapCarListFromApiToVm } from '#pods/car-list';
import { Metadata } from 'next';
import Form from 'next/form';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

interface Props {
  searchParams: Promise<{ name?: string }>;
}

const CarListPage = async (props: Props) => {
  const { name = '' } = await props.searchParams;
  const carList = await api.getCarList();
  console.log('Car list on request:', { name });

  const filteredCarList = carList.filter((car) =>
    car.name.toLowerCase().includes(name.toLowerCase())
  );

  return (
    <>
      <Form action={routeConstants.carList} style={{ marginBottom: '2rem' }}>
        <input
          name="name"
          defaultValue={name}
          placeholder="Search by name"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </Form>
      <CarList carList={mapCarListFromApiToVm(filteredCarList)} />
    </>
  );
};

export default CarListPage;
