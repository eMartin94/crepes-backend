import { z } from 'zod';

export const usuarioSchema = z.object({
  username: z.string({
    required_error: 'El nombre de usuario es requerido',
  }).min(6, {
    message: 'El nombre de usuario debe tener al menos 6 caracteres',
  }).max(20, {
    message: 'El nombre de usuario no debe exceder los 20 caracteres',
  }),
  email: z.string({
    required_error: 'El correo electrónico es requerido',
  }).email({
    message: 'El correo electrónico no es válido',
  }),
  password: z.string({
    required_error: 'La contraseña es requerida',
  }).min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  }),
  role: z.enum(['administrator', 'customer', 'seller', 'delivery']).optional(),
});