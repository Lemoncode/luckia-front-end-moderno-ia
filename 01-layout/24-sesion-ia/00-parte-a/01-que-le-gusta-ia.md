# ¿Qué tecnologías le gustan a la IA?

⏱️ **5–8 minutos.** Al grano, y con el navegador abierto.

---

## 0. El gancho (1 min)

Abre con una pregunta:

> «¿Por qué ChatGPT te monta una landing en React y Tailwind en 20 segundos… y con la librería interna de tu empresa se inventa la mitad de las funciones?»

Deja que contesten. Luego suelta la idea clave:

> **La IA no tiene gustos: tiene estadística.** «Le gusta» lo que ha visto millones de veces. Donde ha visto poco, se lo inventa, y además con mucha seguridad.

---

## 1. Cuándo juega en casa la IA (2 min)

Cuatro reglas. Si se cumplen, la IA vuela; si no, sufre.

| Regla                  | En cristiano                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| **Lo ha visto mucho**  | Tecnología popular = mil ejemplos en su cabeza. Lo tuyo, interno o recién salido = tiene que adivinar. |
| **Trozos pequeños**    | Un botón, una card, un hero. No «hazme la app».                                                        |
| **Se puede comprobar** | «3 columnas en escritorio, 1 en móvil» se ve o no se ve. «Hazlo bonito» no se puede comprobar.         |
| **Feedback rápido**    | Genera → lo abro en el navegador → «esto no» → corrige. En frontend el ciclo dura segundos.            |

**Ejemplo en vivo (léelo en voz alta):**

❌ _«Créame la web de una universidad privada.»_

✅ _«Crea el hero de una universidad privada: titular, subtítulo, dos botones y una imagen. Dos columnas en escritorio y una en móvil. Te paso el branding de la universidad, y los estudios que ofrece»_

> El primero es una lotería. El segundo es un encargo.

---

## 2. Tailwind y React: el combo favorito (2 min)

### Tailwind: el estilo va pegado al elemento

```tsx
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Ver cursos
</button>
```

- «Más espacio a los lados» → `px-4` pasa a `px-8`. Fin.
- No hay que ir a buscar el CSS a otro archivo ni pelearse con la cascada.
- Pedido y código se corresponden casi palabra por palabra. Eso a la IA le encanta.

### React o Astro: piezas de LEGO

```tsx
<Header />
<Hero />
<CourseList />
<Footer />
```

- Pides, revisas y rehaces **una pieza** sin romper el resto.
- Es lo más usado del planeta frontend, así que la IA lo tiene más que visto.

> ⚠️ **Aviso rápido:** que a la IA le resulte cómodo no significa que sea lo mejor para tu proyecto. Una web de tres páginas no necesita React.

Si es un sitio de Contenido otra alternativa muy buena es `Astro`.

---

## 3. Demo: npm trends (2 min)

Abre **[npmtrends.com](https://npmtrends.com)** y escribe:

```text
react  @angular/core  vue
```

**Pregunta a la sala:** «¿Cuál gana? ¿Y eso significa que es el mejor?»

Dos trampas para que piensen:

1. **Angular es `@angular/core`, no `angular`** (ese es el viejo AngularJS). Si comparas mal, sale mal.
2. **Descargas ≠ desarrolladores.** Cuentan los servidores de CI, las reinstalaciones y las dependencias indirectas. Sirve para ver órdenes de magnitud, no para proclamar un ganador.

Ahora añade:

```text
tailwindcss
```

> «Ojo: Tailwind no compite con React, **van juntos**. Lo añado para que veáis cuántísimo se usa… y, por tanto, cuántísimo lo ha visto la IA.»

---

## 4. Cierre y salto a la demo (30 s)

> **React + Tailwind = el terreno donde la IA juega en casa.**
> Pero ojo: **plausible no es lo mismo que correcto.** Te dará algo que _parece_ bueno. Decidir si es accesible, mantenible y fiel al diseño te toca a ti.

**Frase de transición:**

> «Vale, ya sabemos dónde se siente cómoda. Vamos a pedirle a Claude que nos monte una web… y a ver en qué acierta y en qué tenemos que ponerla firme.»
