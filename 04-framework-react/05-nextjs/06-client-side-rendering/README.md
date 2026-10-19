# 06 Client side rendering

Let's works with Nextjs using client side rendering.

We will start from `05-server-side-rendering`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
cd api-server
npm install
cd ..
```

Create the environment variables file from the example (`.env.local` is not committed):

```bash
cp .env.example .env.local
```

# Client Side Rendering

If we don't need to pre-render the data and frequently updating data.

- Enable you to add client-side interactivity.
- Need to use `'use client'` directive.
- You cannot use Server Components inside a client-side component but you can use Server Components as children of a client-side component.
- [More info about Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

We already have a Client Component: the car details.

_./src/pods/car/car.component.tsx_

```tsx
'use client';
...
import { toggleBooking } from './car.actions';
...
  const handleBook = async () => {
    try {
      await toggleBooking(car);
      router.push(routeConstants.carList);
    } catch (error) {
      console.error({ error });
    }
  };
...
```

> It needs `'use client'` because it uses `onClick` and `useRouter`.
>
> It's a leaf of the tree: the page `src/app/cars/[carId]/page.tsx` is still a Server Component that fetches the car and passes it as a prop.
>
> It calls `toggleBooking`, a Server Function (`'use server'`) that we added in `04-static-site-generation`: the click happens in the browser, but the request to the API is sent by the Next server.

Environment variables without prefix only exist on the server. That's why `BASE_API_URL` works inside the Server Function, but it would be `undefined` if we called `api.bookCar` directly from the Client Component.

> If a Client Component really needs a value, the variable must start with [NEXT_PUBLIC_](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser). Its value is written into the browser bundle at build time (like `VITE_` in Vite), so use it only for public values.

On the other hand, we cannot use client-side interactivity in a Server Component but how can we implement a global `React context`?:

_./src/app/layout.tsx_

```diff
import 'normalize.css';
import './material-icons.css';
import React from 'react';
import { Inter } from 'next/font/google';

+ const ThemeContext = React.createContext(null);

+ const ThemeProvider = ({ children }) => {
+   const darkTheme = {
+     primary: '#001e3c',
+     contrastText: '#ffffff',
+   };
+   const lightTheme = {
+     primary: '#ffffff',
+     contrastText: '#000000',
+   };
+   const [theme, setTheme] = React.useState(lightTheme);

+   const onToggleThemeMode = () => {
+     const newTheme =
+       theme.primary === lightTheme.primary ? darkTheme : lightTheme;
+     setTheme(newTheme);
+   };
+
+   return (
+     <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
+       {children}
+     </ThemeContext.Provider>
+   );
+ };

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

interface Props {
  children: React.ReactNode;
}

const RootLayout = (props: Props) => {
  const { children } = props;
  return (
    <html lang="en" className={inter.className}>
      <body>
+       <ThemeProvider>
          <main>{children}</main>
+       </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

```

It throws the error: `TypeError: createContext only works in Client Components. Add the "use client" directive`. But we can use like:

_./src/core/theme.context.tsx_

```tsx
'use client';
import React from 'react';

interface Context {
  theme: {
    primary: string;
    contrastText: string;
  };
  onToggleThemeMode: () => void;
}

export const ThemeContext = React.createContext<Context>(null);

export const ThemeProvider = ({ children }) => {
  const darkTheme = {
    primary: '#001e3c',
    contrastText: '#ffffff',
  };
  const lightTheme = {
    primary: '#ffffff',
    contrastText: '#000000',
  };
  const [theme, setTheme] = React.useState(lightTheme);

  const onToggleThemeMode = () => {
    const newTheme =
      theme.primary === lightTheme.primary ? darkTheme : lightTheme;
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

You cannot use a ServerComponent inside Client Component but you can pass a Server Component as prop:

_./src/app/layout.tsx_

```diff
import 'normalize.css';
import './material-icons.css';
import React from 'react';
import { Inter } from 'next/font/google';
+ import { ThemeProvider } from '#core/theme.context';

- const ThemeContext = React.createContext({});

- const ThemeProvider = ({ children }) => {
-   const darkTheme = {
-     primary: '#001e3c',
-     contrastText: '#ffffff',
-   };
-   const lightTheme = {
-     primary: '#ffffff',
-     contrastText: '#000000',
-   };
-   const [theme, setTheme] = React.useState(lightTheme);

-   const onToggleThemeMode = () => {
-     const newTheme =
-       theme.primary === lightTheme.primary ? darkTheme : lightTheme;
-     setTheme(newTheme);
-   };
-
-   return (
-     <ThemeContext.Provider value={{ theme, onToggleThemeMode }}>
-       {children}
-     </ThemeContext.Provider>
-   );
- };

...
```

Run again:

```bash
npm run start:api-server
npm run build
npm run start:prod
```

Using theme:

_./src/pods/car-list/components/nav.component.tsx_

```tsx
'use client';
import { ThemeContext } from '#core/theme.context';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Nav: React.FC<Props> = (props) => {
  const { children, className } = props;
  const { theme, onToggleThemeMode } = React.useContext(ThemeContext);
  return (
    <nav
      className={className}
      style={{ backgroundColor: theme.primary, color: theme.contrastText }}
    >
      {children}
      <button style={{ marginLeft: 'auto' }} onClick={onToggleThemeMode}>
        Toggle theme
      </button>
    </nav>
  );
};
```

_./src/pods/car-list/components/index.ts_

```diff
export * from './car-item.component';
+ export * from './nav.component';

```

_./src/app/cars/layout.tsx_

```diff
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
+ import { Nav } from '#pods/car-list';
import classes from './layout.module.css';

interface Props {
  children: React.ReactNode;
}

const CarsLayout = (props: Props) => {
  const { children } = props;
  return (
    <>
-     <nav className={classes.nav}>
+     <Nav className={classes.nav}>
        <Link href="/" className={classes.link}>
          <Image src="/home-logo.png" alt="logo" width="32" height="23" />
        </Link>
        <h1 className={classes.title}>Rent a car</h1>
-     </nav>
+     </Nav>
      <main className={classes.content}>{children}</main>
    </>
  );
};

export default CarsLayout;

```
