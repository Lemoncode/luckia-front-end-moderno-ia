import type { CollectionEntry } from "astro:content";
import type { GlassType, LiquidColor } from "#common/components";
import { formatPrice } from "#common/utils";

export interface IngredientVm {
  name: string;
  amount: string;
}

export interface CocktailDetailVm {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  glass: GlassType;
  glassName: string;
  liquid: LiquidColor;
  garnish: string;
  ingredients: IngredientVm[];
  steps: string[];
}

const glassNames: Record<GlassType, string> = {
  rocks: "Vaso bajo (rocks)",
  martini: "Copa de cóctel",
  coupe: "Copa coupe",
  highball: "Vaso alto (highball)",
};

export const mapCocktailToDetailVm = (
  entry: CollectionEntry<"cocktails">,
): CocktailDetailVm => ({
  slug: entry.id,
  number: String(entry.data.order).padStart(2, "0"),
  name: entry.data.name,
  tagline: entry.data.tagline,
  description: entry.data.description,
  price: formatPrice(entry.data.price),
  glass: entry.data.glass,
  glassName: glassNames[entry.data.glass],
  liquid: entry.data.liquid,
  garnish: entry.data.garnish,
  ingredients: entry.data.ingredients,
  steps: entry.data.steps,
});
