import { z } from "zod";
export const memberSchema = z.object({
  name: z.string().trim().min(2, "El nombre necesita al menos dos caracteres."),
  role: z.string().trim().min(2, "Indica un puesto de al menos dos caracteres."),
  email: z.email("Introduce un correo válido."),
});
