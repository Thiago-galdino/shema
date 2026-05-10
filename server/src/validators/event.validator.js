import { z } from 'zod';

const eventBase = z.object({
  title: z.string().min(2, 'Título deve ter ao menos 2 caracteres.'),
  description: z.string().optional(),
  type: z.enum(['culto', 'conferencia', 'reuniao', 'celula', 'treinamento', 'outro']).optional(),
  date: z.string().min(1, 'Data é obrigatória.'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  isRecurring: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
});

export const createEventSchema = eventBase;
export const updateEventSchema = eventBase.partial();
