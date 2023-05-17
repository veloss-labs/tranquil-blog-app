import { z } from 'zod';
import { createTRPCRouter } from '~/server/api/trpc';

const byIdSchema = z.object({
  id: z.string(),
});

export type ByIdInput = z.infer<typeof byIdSchema>;

export const commonRouter = createTRPCRouter({});
