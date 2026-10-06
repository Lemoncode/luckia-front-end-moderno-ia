import type { CollectionEntry } from "astro:content";
import type { GlassType, LiquidColor } from "#common/components";
import { formatPrice } from "#common/utils";

export interface MenuLineVm {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  price: string;
  glass: GlassType;
  liquid: LiquidColor;
}

export const mapCocktailToMenuLineVm = (
  entry: CollectionEntry<"cocktails">,
): MenuLineVm => ({
  slug: entry.id,
  number: String(entry.data.order).padStart(2, "0"),
  name: entry.data.name,
  tagline: entry.data.tagline,
  price: formatPrice(entry.data.price),
  glass: entry.data.glass,
  liquid: entry.data.liquid,
});
