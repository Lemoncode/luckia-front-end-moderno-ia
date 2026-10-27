# 01 CRUD

In this example we are going to call the API using Axios.

# Steps to build it

- `cd client`
- `npm install` to install previous sample packages:


```bash
npm install
```

Run server:

- Open a new terminal
- `cd hotels-server`

```bash
npm run dev
```

## Install Axios

```bash
cd client
```

```bash
npm i axios
```

## Create `client/src/models.ts` API method

```ts
export interface HotelEntityApi {
  id: string;
  type: string;
  name: string;
  created: Date;
  modified: Date;
  address1: string;
  airportCode: string;
  amenityMask: number;
  city: string;
  confidenceRating: number;
  countryCode: string;
  deepLink: string;
  highRate: number;
  hotelId: number;
  hotelInDestination: boolean;
  hotelRating: number;
  location: {
    latitude: number;
    longitude: number;
  };
  locationDescription: string;
  lowRate: number;
  metadata: {
    path: string;
  };
  postalCode: number;
  propertyCategory: number;
  proximityDistance: number;
  proximityUnit: string;
  rateCurrencyCode: string;
  shortDescription: string;
  stateProvinceCode: string;
  thumbNailUrl: string;
  tripAdvisorRating: number;
  tripAdvisorRatingUrl: string;
}

```

## Create `client/src/axios.client.ts` API method

```ts
import { type HotelEntityApi } from './model.ts'
import axios from "axios";

const url = "/api/hotels";

```

_client/src/axios.client.ts_

```diff
# ....

+export const getHotelCollection =  async (): Promise<HotelEntityApi[]> => {
+   const { data } = await axios.get<HotelEntityApi[]>(url);
+   return data;
+}; 

```

_client/src/action.ts_

```diff
-import { getHotels } from './xml.client';
+import { getHotelCollection } from './axios.client';

export function setupAction(element: HTMLButtonElement) {
  const action = "action is not set";
  element.innerHTML = `${action}`;

- const setAction = () => {
+ const setAction = async () => {
-   getHotels();
+   const result = await getHotelCollection();
+   console.log('result', result);
    const action = "action triggered";
    element.innerHTML = `${action}`;
  };

  element.addEventListener("click", () => setAction());
}
```

```bash
npm run build
```

## Update `client/src/axios.client.ts` with `delete` API method

_./src/axios.client.ts_

```diff
# ....
export const getHotelCollection =  async (): Promise<HotelEntityApi[]> => {
    const { data } = await axios.get<HotelEntityApi[]>(url);
    return data;
}; 
+
+export const deleteHotel = async (id: string): Promise<boolean> => {
+   await axios.delete(`${url}/${id}`);
+   return true;
+};
```

## Update `client/src/axios.client.ts` with `getHotel` API method

_./src/axios.client.ts_

```diff
export const deleteHotel = async (id: string): Promise<boolean> => {
    await axios.delete(`${url}/${id}`);
    return true;
};
+
+export const getHotel = async (id: string): Promise<HotelEntityApi> => {
+   const { data } = await axios.get<HotelEntityApi>(`${url}/${id}`);
+   return data;
+};

```

## Update `client/src/axios.client.ts` with `saveHotel` API method

_./src/axios.client.ts_

```diff
...

+export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
+ } else {
+   await axios.post<Hotel>(hotelListUrl, hotel);
+ }
+ return true;
+};

```

Update `client/src/model.ts`

```diff
# ....
+export type SelectedAction = 'hotels' | 'hotel' | 'delete_hotel' | 'update_hotel';
```

Create `client/src/select.ts`

```ts
import type { SelectedAction } from "./model.ts";

export const selectManager = (element: HTMLSelectElement) => {
  element.addEventListener("change", (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value as SelectedAction;

    document.dispatchEvent(
      new CustomEvent("action", {
        detail: value,
      }),
    );
  });
};
```

Update `client/src/main.ts`

```diff
# ....
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div>
    <h1>API RESTful benchmark</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>
  <button id="action" type="button"></button>
+ <div>
+   <label for="action-select">Choose an action:</label>
+   <select id="action-select">
+     <option value="" disabled selected>-- Select an action --</option>
+     <option value="hotels">Get Hotels</option>
+     <option value="hotel">Get Hotel</option>
+     <option value="delete_hotel">Delete Hotel</option>
+     <option value="update_hotel">Update Hotel</option>
+   </select>
+ </div>
</section>
`;

setupAction(document.querySelector<HTMLButtonElement>("#action")!);
+selectManager(document.querySelector<HTMLSelectElement>("#action-select")!);
```

```ts
import "./style.css";
import { setupAction } from "./action.ts";
import { selectManager } from "./select.ts";
/* diff */
import {
  getHotelCollection,
  getHotel,
  deleteHotel,
  saveHotel,
} from "./axios.client.ts";
/* diff */

/* ........ */

setupAction(document.querySelector<HTMLButtonElement>("#action")!);
selectManager(document.querySelector<HTMLSelectElement>("#action-select")!);

/* diff */
document.addEventListener("action", async (event: Event) => {
  const { detail } = event as CustomEvent;

  let result;

  if (detail === "hotels") {
    result = await getHotelCollection();
  }

  if (detail === "hotel") {
    result = await getHotel("1");
  }

  if (detail === "delete_hotel") {
    result = await deleteHotel("1");
  }

  if (detail === "update_hotel") {
    const hotel = await getHotel("1");
    await saveHotel(hotel);
  }

  console.log(result);
});
/* diff */

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
