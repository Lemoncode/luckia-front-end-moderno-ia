# 00 Creando el proyecto de semilla

## Objetivo

Vamos a crear un proyecto de semilla que nos servirá de punto de arranque del proyecto.

En nuestro caso vamos a trabajar con Tan Stack Start, Tailwind y ShadCN.

## Pasos

Lo primero, usamos el cli de Tan Stack Start para crear el proyecto:

```bash
pnpx @tanstack/cli@latest create miproyecto
```

Elegimos como framework `React`.

Cómo toolchain `None`

Deployment adapter (Esto nos servirá para poder ejecutar código en servidor): Nitro (corre con node y no dependemos de proveedor concreto).

En cuanto a páginas demo le decimos que no.

De add-ons elegimos ninguno:

**Elegimos shadcn**

Y de inicializar nuevo repo de Git, si partimos de proyecto en blacno, decimos que si.

OJO ¿Ya está tailwind por defecto? **LA LECHE**

# Apendice

Como se instalan manualmente Tailwind y Shadcn

Para meter Tailwind, seguir la guía oficial

https://tanstack.com/start/latest/docs/framework/react/guide/tailwind-integration

Y si queremos instalar shadCN

https://ui.shadcn.com/docs/installation/tanstack
