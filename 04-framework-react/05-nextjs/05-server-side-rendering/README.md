# 05 Server side rendering

Let's works with Nextjs using server side rendering.

We will start from `04-static-site-generation`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
cd api-server
npm install
cd ..
```

# Server Side Rendering

If we can't pre-render a page ahead of a user's request but we need SEO. For example: search results, shopping cart.

- The page is generated on each request.
- Only available on Server Components.
- [More about dynamic data fetching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#dynamic-data-fetching)

A page becomes dynamic as soon as it reads request data: `searchParams`, `cookies` or `headers`. Next can't render it at build time because it doesn't know the request yet.

Let's add a search by name to the `car list`. The search term travels in the url (`/cars?name=audi`), so the page reads it from [searchParams](https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional):

_./src/app/cars/page.tsx_

```diff
import { CarList, api, mapCarListFromApiToVm } from '#pods/car-list';
import { Metadata } from 'next';
+ import { routeConstants } from '#core/constants';
+ import Form from 'next/form';

export const metadata: Metadata = {
  title: 'Rent a car - Car list',
};

+ interface Props {
+   searchParams: Promise<{ name?: string }>;
+ }

- const CarListPage = async () => {
-   // Since Next 15 fetch is NOT cached by default.
-   // This route is static because it doesn't use request data (cookies, headers, searchParams).
-   const carList = await api.getCarList({ next: { revalidate: 10 } }); // In seconds
-   console.log('Car list at build time:', { carList });
+ const CarListPage = async (props: Props) => {
+   const { name = '' } = await props.searchParams;
+   const carList = await api.getCarList();
+   console.log('Car list on request:', { name });

-   return <CarList carList={mapCarListFromApiToVm(carList)} />;
+   const filteredCarList = carList.filter((car) =>
+     car.name.toLowerCase().includes(name.toLowerCase())
+   );
+
+   return (
+     <>
+       <Form action={routeConstants.carList} style={{ marginBottom: '2rem' }}>
+         <input
+           name="name"
+           defaultValue={name}
+           placeholder="Search by name"
+           autoComplete="off"
+         />
+         <button type="submit">Search</button>
+       </Form>
+       <CarList carList={mapCarListFromApiToVm(filteredCarList)} />
+     </>
+   );
};

export default CarListPage;

```

> [next/form](https://nextjs.org/docs/app/api-reference/components/form) is a `<form>` that navigates to `/cars?name=...` on the client, like a `Link`. It's still a Server Component: there's no `'use client'`.

Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> The build table shows `ƒ /cars`: it's rendered on each request. Check `.next` folder, it doesn't have `cars.html` file.
>
> Search `audi` and view the page source: the HTML already contains the filtered list. That's why a search results page needs SSR: it can be indexed and shared.
>
> Navigating to a car and back with a link renders `/cars` again on the server: since Next 15, dynamic pages aren't reused from the client router cache. Only the browser back/forward buttons reuse it.

We can migrate `car details` too. If we remove `generateStaticParams`, Next doesn't know the `carId` values at build time, so the page is rendered on each request:

_./src/app/cars/\[carId\]/page.tsx_

```diff
...

- export async function generateStaticParams() {
-   return [{ carId: '1' }, { carId: '2' }, { carId: '3' }];
- }

const CarPage = async (props: Props) => {
...
```

Run:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> The build table shows `ƒ /cars/[carId]` and there are no `.next/server/app/cars/1.html` files.
>
> Rendering on each request doesn't mean fetching on each request. Since Next 15 `fetch` isn't cached by default, but we could cache only the data with `api.getCar(id, { cache: 'force-cache' })` or `{ next: { revalidate: 10 } }`: the page would still be rendered on each request, but the API would be called once (or once every 10 seconds).
>
> An advanced option is to use [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components) to decide what is cached per component.

## Loading UI and streaming

With SSR the server waits for the data before sending the page. Let's simulate a slow API:

_./src/app/cars/page.tsx_

```diff
const CarListPage = async (props: Props) => {
+ await new Promise((resolve) => setTimeout(resolve, 2000)); // Slow API
  const { name = '' } = await props.searchParams;
...
```

Run it and open `http://localhost:8080/cars`: the browser shows nothing for two seconds.

Add a [loading.tsx](https://nextjs.org/docs/app/api-reference/file-conventions/loading) file next to the page:

_./src/app/cars/loading.tsx_

```tsx
const CarsLoading = () => <p>Loading cars…</p>;

export default CarsLoading;
```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

> `Loading cars…` is shown immediately, and the car list arrives two seconds later **in the same HTML response**: Next streams the page.
>
> This is the base of [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components): a static shell sent instantly and dynamic parts streamed later.

Remove the delay:

_./src/app/cars/page.tsx_

```diff
const CarListPage = async (props: Props) => {
- await new Promise((resolve) => setTimeout(resolve, 2000)); // Slow API
  const { name = '' } = await props.searchParams;
...
```
