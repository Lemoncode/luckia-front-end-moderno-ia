# 01 CRUD

In this example we are going to call the API using [fetch API]().

> `fetch()` API does **not** treat HTTP error status codes (like `404` or `500`) as promise rejections.

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

## Create `client/src/fetch.client.ts` API method

```ts
import { type HotelEntityApi } from "./model.ts";

const url = "/api/hotels";
```

_client/src/fetch.client.ts_

```diff
# ....
+
+export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
+ const response = await fetch(url);
+
+ if (!response.ok) {
+   throw new Error(`Error: ${response.statusText}`);
+ }
+
+ const { data } = await response.json();
+
+ return data;
+};
+
```

```bash
npm run build
```

## Update `client/src/fetch.client.ts` with `delete` API method

_./src/fetch.client.ts_

```diff
# ....
export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};
+
+export const deleteHotel = async (id: string): Promise<boolean> => {
+ const response = await fetch(`${url}/${id}`, {
+   method: "DELETE",
+ });
+
+ if (!response.ok) {
+   throw new Error(`Error: ${response.statusText}`);
+ }
+
+ const { data } = await response.json();
+
+ return Boolean(data);
+};
```

## Update `client/src/fetch.client.ts` with `getHotel` API method

_./src/fetch.client.ts_

```diff
export const deleteHotel = async (id: string): Promise<boolean> => {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return Boolean(data);
};

+export const getHotel = async (id: string): Promise<HotelEntityApi> => {
+ const response = await fetch(`${url}/${id}`);
+
+ if (!response.ok) {
+   throw new Error(`Error: ${response.statusText}`);
+ }
+
+ const { data } = await response.json();
+
+ return data;
+};
```

## Update `client/src/fetch.client.ts` with `saveHotel` API method

_./src/fetch.client.ts_

```ts
// .....
export const saveHotel = async (hotel: HotelEntityApi): Promise<boolean> => {
  let response;

  if (hotel.id) {
    response = await fetch(`${url}/${hotel.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    });
  } else {
    response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    });
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};
```

Update `client/src/main.ts`

```diff
import "./style.css";
import { setupAction } from "./action.ts";
import { selectManager } from "./select.ts";
import {
  getHotelCollection,
  getHotel,
  deleteHotel,
  saveHotel,
-} from "./axios.client.ts";
+} from "./fetch.client.ts";
```

## Issue

Is NOT working, explain why and fix the error.

### Solution

> Add Accept Header

```ts
import { type HotelEntityApi } from "./model.ts";

const url = "/api/hotels";

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};

export const deleteHotel = async (id: string): Promise<boolean> => {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return Boolean(data);
};

export const getHotel = async (id: string): Promise<HotelEntityApi> => {
  const response = await fetch(`${url}/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};

export const saveHotel = async (hotel: HotelEntityApi): Promise<boolean> => {
  let response;

  if (hotel.id) {
    response = await fetch(`${url}/${hotel.id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    });
  } else {
    response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(hotel),
    });
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const { data } = await response.json();

  return data;
};
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
