import { z } from 'zod';

export const appealStatusSchema = z.enum([
  'new',
  'in_progress',
  'resolved',
  'closed',
]);

export const appealPatchSchema = z.object({
  title: z.string().min(1, 'Укажите заголовок').max(200),
  description: z.string().max(5000),
  status: appealStatusSchema,
});

export type AppealPatchInput = z.infer<typeof appealPatchSchema>;
