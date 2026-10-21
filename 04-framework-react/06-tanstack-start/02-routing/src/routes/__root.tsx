import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: AppLayout,
  shellComponent: RootDocument,
});

function AppLayout() {
  return (
    <>
      <header className="border-b bg-white/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
          <Link to="/" className="text-lg font-bold">
            Compra Coches
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="hover:underline"
              activeProps={{ className: "font-semibold underline" }}
            >
              Inicio
            </Link>
            <Link
              to="/cars/$carId"
              params={{ carId: "demo" }}
              className="hover:underline"
              activeProps={{ className: "font-semibold underline" }}
            >
              Ficha demo
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
      <footer>SOY EL FOOTER</footer>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
