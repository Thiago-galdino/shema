import { z } from 'zod';

const cellBase = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres.'),
  description: z.string().optional(),
  leader: z.string().optional(),
  meetingDay: z.enum(['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']).optional(),
  meetingTime: z.string().optional(),
  location: z.string().optional(),
  ministry: z.string().optional(),
});

export const createCellSchema = cellBase;
export const updateCellSchema = cellBase.partial();

export const frequencySchema = z.object({
  date: z.string().min(1, 'Data é obrigatória.'),
  attendees: z.array(z.string()).optional(),
  notes: z.string().optional(),
});
