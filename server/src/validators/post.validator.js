import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1, 'Conteúdo é obrigatório.'),
  isPinned: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
});

export const updatePostSchema = z.object({
  content: z.string().min(1, 'Conteúdo não pode ser vazio.').optional(),
  isPinned: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional(),
});

export const commentSchema = z.object({
  text: z.string().min(1, 'Comentário não pode ser vazio.'),
});
