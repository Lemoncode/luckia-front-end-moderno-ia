// Simulamos una API externa lenta (p.ej. un servicio de financiación)
export async function fetchFinancingOffer(carId: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return `¡Financia este coche desde 199 €/mes! (oferta para ${carId})`;
}
