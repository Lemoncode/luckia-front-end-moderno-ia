# CORS

Currently orur set up is working, because assets (html, css and javascript) and HTTP API are living on the same domain. This a basic security set up, provide by browsers.

We can do requests between different origins, but we need to set up the server to allow requests from other domains. 

## Debugging CORS

Open DevTools (**F12** or **Cmd + Option + I**) and check the **Console** and **Network** tabs to isolate whether the failure stems from a missing header, an invalid preflight (`OPTIONS`) response, or a credential mismatch.

---

### 1. Read the Specific Console Error

The browser's console error message specifies the exact rule that was violated:

| Console Error Message | What It Means | Fix |
| --- | --- | --- |
| `No 'Access-Control-Allow-Origin' header is present...` | The server never sent the CORS header, or crashed before adding it. | Ensure the server includes `Access-Control-Allow-Origin: <origin>` or `*`. |
| `Response to preflight request doesn't pass access control check: It does not have HTTP ok status.` | The browser sent an `OPTIONS` request, but the backend returned a `404`, `403`, or `500`. | Configure your backend/router to handle HTTP `OPTIONS` methods and return a `200` or `204`. |
| `Request header field [name] is not allowed by Access-Control-Allow-Headers...` | You sent a custom header (e.g., `Authorization`, `x-api-key`) not whitelisted by the server. | Add the header name to the server's `Access-Control-Allow-Headers` response. |
| `The value of the 'Access-Control-Allow-Origin' header ... must not be the wildcard '*' when the request's credentials mode is 'include'.` | You sent cookies or authorization credentials (`credentials: 'include'`), but the server sent `*`. | Server must echo the exact client origin (e.g., `http://localhost:3000`) instead of `*`, and add `Access-Control-Allow-Credentials: true`. |

---

### 2. Inspect the Network Tab

1. Open **Network** tab and filter by **Fetch/XHR**.
2. Look for two requests to the same URL:
* **`OPTIONS` request (Preflight):** Triggered automatically if using methods other than `GET`/`HEAD`/`POST`, or when sending custom headers / JSON payloads.
* **The actual request (`GET`, `POST`, etc.):** Will fail immediately if the `OPTIONS` request does not return a `200`/`204` status with valid CORS headers.


3. Select the failed request, go to **Headers**, and verify both sides:

#### Request Headers (Sent by Browser)

* `Origin`: Indicates the calling domain (e.g., `http://localhost:3000`).
* `Access-Control-Request-Method`: The method your app wants to run (e.g., `PUT`).
* `Access-Control-Request-Headers`: Headers your app wants to send (e.g., `content-type, authorization`).

#### Response Headers (Returned by Server)

* `Access-Control-Allow-Origin`: Must match `Origin` or be `*`.
* `Access-Control-Allow-Methods`: Must include your HTTP method.
* `Access-Control-Allow-Headers`: Must list all headers requested in `Access-Control-Request-Headers`.
* `Access-Control-Allow-Credentials`: Must be `true` if authentication/cookies are used.

---

### 3. Common Hidden Causes

* **Unhandled Server Exceptions (500 errors masking as CORS):**
If an uncaught exception occurs in your backend route handler, the server might send back a default HTML 500 error page without running the CORS middleware. The browser flags this as a CORS error instead of showing the server error.
* **Redirects (301 / 302):**
Browsers will not follow a redirect across origins during a preflight request. If your backend enforces trailing slashes (e.g., redirecting `/api/users` to `/api/users/`), the redirect will cause a CORS failure.
* **Reverse Proxies & Gateways:**
Nginx, Apache, or Cloudflare may intercept requests and return a `403 Forbidden` or `502 Bad Gateway` before the request reaches your app server.

---

### 4. Isolate Outside the Browser with cURL

Simulate the browser's preflight request in your terminal to see raw server headers without browser interference:

```bash
curl -I -X OPTIONS https://api.example.com/data \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization"

```

Look at the response status and ensure the required `Access-Control-Allow-*` headers are present in the output.

---

What backend framework (e.g., Express, FastAPI, Spring Boot) and exact error message are you seeing in your console?

---

# Exercise

Update `client-cors` to replace the mock data and use the hotels-server, usiing `fetch` or `axios`


## Update `getHotelCollection` API method

### Fetch version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];
+ const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- return hotelCollection;
+ const response = await fetch(url);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
+ import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
import { mockHotelCollection } from './hotel-collection.mock-data';

let hotelCollection = [...mockHotelCollection];
+ const url = '/api/hotels';

export const getHotelCollection = async (): Promise<HotelEntityApi[]> => {
- return hotelCollection;
+ const { data } = await axios.get<HotelEntityApi[]>(url);
+ return data;
};

...

```

## Update `deleteHotel` API method

### Fetch version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import { HotelEntityApi } from './hotel-collection.api-model';
- import { mockHotelCollection } from './hotel-collection.mock-data';

- let hotelCollection = [...mockHotelCollection];
const url = '/api/hotels';

...

export const deleteHotel = async (id: string): Promise<boolean> => {
- hotelCollection = hotelCollection.filter((h) => h.id !== id);
- return true;
+ const response = await fetch(`${url}/${id}`, { method: 'DELETE' });
+ return response.ok;
};

```

### Axios version

_./src/pods/hotel-collection/api/hotel-collection.api.ts_

```diff
import axios from 'axios';
import { HotelEntityApi } from './hotel-collection.api-model';
- import { mockHotelCollection } from './hotel-collection.mock-data';

- let hotelCollection = [...mockHotelCollection];
const url = '/api/hotels';

...

export const deleteHotel = async (id: string): Promise<boolean> => {
- hotelCollection = hotelCollection.filter((h) => h.id !== id);
+ await axios.delete(`${url}/${id}`);
  return true;
};

```

Delete `./src/pods/hotel-collection/api/hotel-collection.mock-data.ts`, not used.

## Update `getHotel` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities, mockHotelCollection } from './hotel.mock-data';
+ import { mockCities } from './hotel.mock-data';

+ const hotelListUrl = '/api/hotels';

export const getHotel = async (id: string): Promise<Hotel> => {
- return mockHotelCollection.find((h) => h.id === id);
+ const response = await fetch(`${hotelListUrl}/${id}`);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
+ import axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities, mockHotelCollection } from './hotel.mock-data';
+ import { mockCities } from './hotel.mock-data';

+ const hotelListUrl = '/api/hotels';

export const getHotel = async (id: string): Promise<Hotel> => {
- return mockHotelCollection.find((h) => h.id === id);
+ const { data } = await axios.get<Hotel>(`${hotelListUrl}/${id}`);
+ return data;
};

...

```

## Update `getCities` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities } from './hotel.mock-data';

const hotelListUrl = '/api/hotels';
+ const cityListUrl = '/api/cities';

...

export const getCities = async (): Promise<Lookup[]> => {
- return mockCities;
+ const response = await fetch(cityListUrl);
+ if (response.ok) {
+   return await response.json();
+ } else {
+   throw Error(response.statusText);
+ }
};

...

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
import axios from 'axios';
import { Hotel } from './hotel.api-model';
import { Lookup } from 'common/models';
- import { mockCities } from './hotel.mock-data';

const hotelListUrl = '/api/hotels';
+ const cityListUrl = '/api/cities';

...

export const getCities = async (): Promise<Lookup[]> => {
- return mockCities;
+ const { data } = await axios.get<Lookup[]>(cityListUrl);
+ return data;
};

...

```

## Update `saveHotel` API method

### Fetch version

_./src/pods/hotel/api/hotel.api.ts_

```diff
...

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await fetch(`${hotelListUrl}/${hotel.id}`, {
+     method: 'PUT',
+     headers: {
+       'Content-Type': 'application/json',
+     },
+     body: JSON.stringify(hotel),
+   });
+ } else {
+   await fetch(hotelListUrl, {
+     method: 'POST',
+     headers: {
+       'Content-Type': 'application/json',
+     },
+     body: JSON.stringify(hotel),
+   });
+ }
  return true;
};

```

### Axios version

_./src/pods/hotel/api/hotel.api.ts_

```diff
...

export const saveHotel = async (hotel: Hotel): Promise<boolean> => {
+ if (hotel.id) {
+   await axios.put<Hotel>(`${hotelListUrl}/${hotel.id}`, hotel);
+ } else {
+   await axios.post<Hotel>(hotelListUrl, hotel);
+ }
  return true;
};

```

Delete `./src/pods/hotel/api/hotel.mock-data.ts`, not used.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend