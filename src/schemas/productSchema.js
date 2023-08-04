import { z } from 'zod';

export const productoSchema = z.object({
  nombre: z.string({
    required_error: 'El nombre es requerido',
  }).min(3, {
    message: 'El nombre debe contener al menos 3 caracteres',
  }).max(100, {
    message: 'El nombre no debe exceder los 100 caracteres',
  }),
  descripcion: z.string().optional(),
  precio: z.number({
    required_error: 'El precio es requerido',
  }).min(1, {
    message: 'El precio debe ser mayor o igual a 0',
  }).max(1000000, { message: 'El precio no debe exceder los 1000000' }),
  ingredientes: z.array(z.string({
    required_error: 'Se requiere al menos un ingrediente',
  })).min(1, {
    message: 'Debes proporcionar al menos un ingrediente',
  }),
  imagen: z.object({
    public_id: z.string().optional(),
    secure_url: z.string().optional(),
  }).optional(),
  categoria: z.string({
    required_error: 'La categoría es requerida',
  }).min(3, {
    message: 'La categoría debe contener al menos 3 caracteres',
  }).trim(),
  subcategoria: z.string().optional(),
  disponible: z.boolean().optional(),
}).partial();
