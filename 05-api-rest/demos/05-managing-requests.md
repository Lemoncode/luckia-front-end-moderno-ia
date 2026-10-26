# Managing Requests

## Sequential Requests

Create `client/src/managing-requests.ts`

### 1. `for...of` Loop

```ts
const delayTask = (id: number, ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`Finished task ${id}`);
      resolve(`Result ${id}`);
    }, ms),
  );

export const tasks = [
  () => delayTask(1, 1000),
  () => delayTask(2, 500),
  () => delayTask(3, 800),
];

export const runSequantially = async (tasks: Function[]) => {
  const results = [];

  for (const task of tasks) {
    // Await pauses the loop until this specific promise resolves
    const result = await task();
    results.push(result);
  }

  return results;
};
```

Update `src/main.ts`

```diff
-import "./style.css";
-import { setupAction } from "./action.ts";
-import { selectManager } from "./select.ts";
-import {
- getHotelCollection,
- getHotel,
- deleteHotel,
- saveHotel,
-} from "./fetch.client.ts";
+ import { runSequantially, tasks } from './managing-requests.ts';

# .....

-setupAction(document.querySelector<HTMLButtonElement>("#action")!);
-selectManager(document.querySelector<HTMLSelectElement>("#action-select")!);
-
-document.addEventListener("action", async (event: Event) => {
- const { detail } = event as CustomEvent;
-
- let result;
-
- if (detail === "hotels") {
-   result = await getHotelCollection();
- }
-
- if (detail === "hotel") {
-   result = await getHotel("1");
- }
-
- if (detail === "delete_hotel") {
-   result = await deleteHotel("1");
- }
-
- if (detail === "update_hotel") {
-   const hotel = await getHotel("1");
-   await saveHotel(hotel);
- }
-
- console.log(result);
-});

+ await runSequantially(tasks);
```

```bash
npm run dev
```

> Open dev tools to see reults

### 2. Functional Approach `reduce()`

Update `client/src/managing-requests.ts`

```ts
// ....
export const runWithReduce = (tasks: Function[]) => {
  return tasks.reduce<Promise<any[]>>(async (prev, curr) => {
    const acc = await prev;
    const result = await curr();
    return [...acc, result];
  }, Promise.resolve([]));
};
```

Update `main.ts`

```diff
-import { runSequantially, tasks } from './managing-requests.ts';
+import { runSequantially, tasks, runWithReduce } from './managing-requests.ts';
# ....
+await runSequantially(tasks);
+await runWithReduce(tasks);
```

```bash
npm run dev
```

### Critical Pitfalls to Avoid

- **Do not use `Array.prototype.forEach` or `map**`:

```javascript
// ❌ INCORRECT: forEach does not await promises; tasks run concurrently
items.forEach(async (item) => {
  await doSomething(item);
});
```

- **Do not pre-invoke functions into an array**:

```javascript
// ❌ INCORRECT: Both requests fire immediately at creation time
const tasks = [fetch("/api/1"), fetch("/api/2")];

// ✅ CORRECT: Wrap each in a function so it only runs when invoked
const tasks = [() => fetch("/api/1"), () => fetch("/api/2")];
```

## Parallel Requests

### 1. `Promise.all` (Fails Fast)

```js
const p1 = Promise.resolve("User data loaded");
const p2 = Promise.reject(new Error("Failed to load profile pic"));
const p3 = Promise.resolve("Permissions loaded");

Promise.all([p1, p2, p3])
  .then((results) => {
    // Never reached because p2 rejected
    console.log(results);
  })
  .catch((error) => {
    // Triggers immediately when p2 fails
    console.error("Operation failed:", error.message);
  });
```

### 2. `Promise.allSettled` (Captures All Results)

```js
const p1 = Promise.resolve("User data loaded");
const p2 = Promise.reject(new Error("Failed to load profile pic"));
const p3 = Promise.resolve("Permissions loaded");

Promise.allSettled([p1, p2, p3]).then((results) => {
  console.log(results);
  /* Output:
    [
      { status: 'fulfilled', value: 'User data loaded' },
      { status: 'rejected', reason: Error: Failed to load profile pic },
      { status: 'fulfilled', value: 'Permissions loaded' }
    ]
    */

  // Separate successes and failures
  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = results
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);
});
```

## Cancelling Requests

### Manual Cancellation

```js
fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => response.json())
  .then((json) => console.log(json));
```

Update `main.ts`

```ts
const controller = new AbortController();
const { signal } = controller;

const manualCancellation = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      signal,
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    if ((error as unknown as any).name === "AbortError") {
      console.log("Fetch request was cancelled");
    } else {
      console.error("Fetch failed:", error);
    }
  }
};

manualCancellation();
controller.abort();
```

### Automtic Timeout with `AbortSignal.timeout()`

> NOTE: Just show

```js
async function fetchWithTimeout() {
  try {
    // Automatically aborts if the request takes longer than 5 seconds
    const response = await fetch("https://api.example.com/data", {
      signal: AbortSignal.timeout(5000),
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    // In timeout scenarios, modern browsers often throw a 'TimeoutError'
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      console.error("Request timed out and was aborted.");
    } else {
      console.error("Network or parsing error:", error);
    }
  }
}
```

### Cancelling Previous Requests

Update `managing-requests.ts`

```js
let currentController = null;

async function handleSearch(searchTerm) {
  // Cancel the previous in-flight request if a new one starts
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(searchTerm)}`,
      {
        signal: currentController.signal,
      },
    );
    const results = await response.json();
    renderResults(results);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Search failed:", error);
    }
  }
}
```

Update `main.ts`

```diff
-import { runSequantially, tasks, runWithReduce } from "./managing-requests.ts";
+import { runSequantially, tasks, runWithReduce, switchFetch } from "./managing-requests.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  # ....
+ <button id="fetch" type="button">Fetch</button>
</section>
`;
```

```ts
// ....
manualCancellation();
controller.abort();

document.getElementById("fetch")?.addEventListener("click", async () => {
  const results = await switchFetch();
  console.log(results);
});
```

## References

- https://jsonplaceholder.typicode.com/#list
