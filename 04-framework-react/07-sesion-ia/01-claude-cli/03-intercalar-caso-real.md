# Un caso Real

En un proyecto de complejidad, una incidencia que teníamos intermitente, el servidor de MongoDB entraba en problemas, y teníamos notifición del logger de un error.

¿Qué hicimos?

- Enganchar Rollbar con un MCP de solo lectura.
- Enganchar MongoDB los log con un MCP de solo lectura.
- Poner a trabajar a Lemony sobre la base de código y con permiso para leer esta información.

Resultado:
  - Bug encontrado, en una consulta agregada.
  - Fix propuesto.
  - Test de regresión para ver que funcionaba bien.