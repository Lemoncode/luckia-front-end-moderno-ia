export { THEME_COLOR } from "./theme.constants";

/** 10 → "10" · 9.5 → "9,50" */
export const formatPrice = (price: number): string =>
  Number.isInteger(price)
    ? price.toLocaleString("es-ES")
    : price.toLocaleString("es-ES", { minimumFractionDigits: 2 });
