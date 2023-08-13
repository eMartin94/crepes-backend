import { z } from 'zod';

export const productValidationSchema = z.object({
  name: z.string({
    required_error: 'El nombre es requerido',
  }).min(3, {
    message: 'El nombre debe contener al menos 3 caracteres',
  }).max(100, {
    message: 'El nombre no debe exceder los 20 caracteres',
  }),
  description: z.string().max({
    message: 'La descripción no debe exceder los 500 caracteres',
  }).optional(),
  price: z.number({
    required_error: 'El precio es requerido',
  }).min(1, {
    message: 'El precio debe ser mayor a 0',
  }).max(1000000, { message: 'El precio no debe exceder los 1000000' }),
  ingredients: z.array(z.string()).optional(),
  imagen: z.object({
    public_id: z.string(),
    secure_url: z.string(),
  }),
  category: z.string({
    required_error: 'La categoría es requerida',
  }).min(3, {
    message: 'La categoría debe contener al menos 3 caracteres',
  }).trim(),
  subcategory: z.string().optional(),
  available: z.boolean().optional(),
}).partial();
