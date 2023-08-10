import { z } from 'zod';

export const categoriaSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre es requerido',
  }).min(3, {
    message: 'El nombre debe contener al menos 3 caracteres',
  }).max(20, {
    message: 'El nombre no debe exceder los 20 caracteres',
  }),
}).partial();