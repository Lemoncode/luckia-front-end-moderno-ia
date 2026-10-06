import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const cocktails = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/cocktails" }),
  schema: z.object({
    name: z.string(),
    order: z.number(),
    price: z.number(),
    /** Una línea para la carta */
    tagline: z.string(),
    /** Párrafo para el detalle */
    description: z.string(),
    /** Tipo de vaso: decide qué copa SVG se dibuja */
    glass: z.enum(["rocks", "martini", "coupe", "highball"]),
    /** Color del líquido: nombre de un token de @theme */
    liquid: z.enum(["tomate", "yema", "lima", "tinta"]),
    garnish: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
});

export const collections = { cocktails };
