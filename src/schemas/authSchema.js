import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string({
    required_error: 'El nombre de usuario es requerido',
  }).min(6, {
    message: 'Ingrese un nombre de usuario válido',
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
});

export const loginSchema = z.object({
  email: z.string({
    required_error: 'El correo electrónico es requerido',
  }).email({
    message: 'El correo electrónico no es válido',
  }),
  password: z.string({
    required_error: 'La contraseña es requerida',
  }).min(6, {
    message: 'La contraseña debe tener al menos 6 caracteresssss',
  })
});