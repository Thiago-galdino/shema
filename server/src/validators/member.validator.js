import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
}).optional();

const memberBase = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.union([z.string().email('Email inválido.'), z.literal('')]).optional(),
  address: addressSchema,
  birthDate: z.string().optional(),
  baptismDate: z.string().optional(),
  ministry: z.string().optional(),
  status: z.enum(['visitante', 'membro', 'lider', 'discipulado']).optional(),
  cell: z.string().optional(),
  notes: z.string().optional(),
});

export const createMemberSchema = memberBase;
export const updateMemberSchema = memberBase.partial();
