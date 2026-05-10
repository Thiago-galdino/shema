import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  email: z.string().email('Email inválido.'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres.'),
  role: z.enum(['admin', 'lider', 'membro']).optional(),
});
