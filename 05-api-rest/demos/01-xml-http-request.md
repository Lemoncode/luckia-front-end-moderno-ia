# XMLHttpRequest

## Server 

```bash
npm run dev
```

> The server is running on port 3000

## Client

Create `client/src/xml.client.ts`.

Let's see how to create a request with the `XMLHttpRequest` object:

```js
export const getHotels = () => {
    const url = '/api/hotels';
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.send();
};
```

Update `client/src/action.ts`

```diff
+import { getHotels } from './xml.client';

export function setupAction(element: HTMLButtonElement) {
  const action = "action is not set";
  element.innerHTML = `${action}`;

  const setAction = () => {
+   getHotels();
    const action = "action triggered";
    element.innerHTML = `${action}`;
  };

  element.addEventListener("click", () => setAction());
}

```

Now we have to build the client:

```bash
npm run build
```

> In the Network tab of the browser's developer tools, you can see the request and response.

How can I recover the data or see if an error has occurred?

Update `client/src/xml.client.ts`.

```diff
const xhr = new XMLHttpRequest();
+
+xhr.onreadystatechange = () => {
+   console.log(xhr.readyState, xhr.status);
+};
+
xhr.open('GET', url);

xhr.send();

```

```bash
npm run build
```

> [readyState official docs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState)

To get the data, we can use, for example, `responseText`:

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
-   console.log(xhr.readyState, xhr.status);
+   console.log(xhr.readyState, xhr.status, xhr.responseText);
};

xhr.open('GET', url);

xhr.send();

```

```bash
npm run build
```

So to know that everything has gone well, we can wait for the `readyState` to be 4 and the `status` to be 2xx

```diff
# ....
    xhr.onreadystatechange = () => {
-       console.log(xhr.readyState, xhr.status, xhr.responseText);
+       if (xhr.readyState === 4 && xhr.status === 200) {
+           console.log(xhr.responseText)
+       }
    };
# ....
```

What if we want to keep the first hotel from server, which is the first one?

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
-   console.log(xhr.responseText);
+   const first = xhr.responseText[0];
+   console.log("first", first);
  }
};

xhr.open("GET", url);

xhr.send();

```

> What do you think? What appears in the console.log of the first?

Why does a bracket appear? Because we are using the `responseText` method, even if we use the default `response`, it will give us the same result:

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
-   const first = xhr.responseText[0];
+   const first = xhr.response[0];
    console.log("first", first);
  }
};

xhr.open("GET", url);

xhr.send();
```

And this is because the response comes as plain text, so we have to parse it to JSON:

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
-   const first = xhr.response[0];
+   const { data } = JSON.parse(xhr.response);
+   const first = data[0];
    console.log("first", first);
  }
};

xhr.open("GET", url);

xhr.send();
```

> If you look, there is an `responseXML` but not an `responseJSON` and this is because at that time it was more common to work with data in XML format instead of JSON as now.

One thing to keep in mind in a communication using HTTP, are the headers, specifically the `Content-Type` (in the response, look at the Network tab) that tells us the type of content that we want to receive.

But we can decide what type of content we want to receive, for example, if we want to receive a JSON, we can do the following:

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const { data } = JSON.parse(xhr.response);
    const first = data[0];
    console.log("first", first);
  }
};

xhr.open("GET", url);

+xhr.setRequestHeader("Accept", "application/json")

xhr.send();

```

> It works exactly the same as before

But what if we want to receive the data in XML format?

```diff
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
-   const { data } = JSON.parse(xhr.response);
-   const first = data[0];
-   console.log("first", first);
+   const result = xhr.response;
+   console.log("result", result);
  }
};

xhr.open("GET", url);

- xhr.setRequestHeader("Accept", "application/json");
+ xhr.setRequestHeader("Accept", "application/xml");

xhr.send();


```

> It gives us an error that this endpoint does not support this format.
>
> It is the responsibility of the backend developer to parse the response in XML format if it receives the Accept header with that format.

To avoid having to repeat so much code every time we want to make a call to any endpoint, this was usually refactored into a function:

```ts
const getJSON = (url: string) => {
    const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const result = xhr.response;
      console.log("result", result);
    }
  };

  xhr.open("GET", url);

  xhr.setRequestHeader("Accept", "application/json");

  xhr.send();
};

export const getHotels = () => {
  const url = "/api/hotels";
  getJSON(url);
};


```

> This is becoming more like a fetch

But now, how can I return the data when I receive the response? I need to use a callback (or a promise) like this:

```diff
-const getJSON = (url: string) => {
+const getJSON = (url: string, onSucces: Function) => {
    const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
-     const result = xhr.response;
-     console.log("result", result);
+     onSucces(JSON.parse(xhr.response));
    }
  };

  xhr.open("GET", url);

  xhr.setRequestHeader("Accept", "application/json");

  xhr.send();
};

export const getHotels = () => {
  const url = "/api/hotels";
- getJSON(url);
+ getJSON(url, console.log);
};

```

But of course, here are a lot of things missing:

- For example, what happens if the call fails (we need an error callback).
- This could be improved and use promises instead of callbacks.
- But even so, what happens if we want to make a call with another method POST, PUT, DELETE, etc.
- What if we want to add several headers.
- Or configure other concepts, such as Cache, CORS, etc.

Here is [another example of XMLHttpRequest](https://codepen.io/Lemoncode/pen/MWyYbOp?editors=1111) with this more elaborate getJSON:
