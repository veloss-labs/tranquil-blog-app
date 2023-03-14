import * as z from "zod";

export const schema = {
  create: z.object({
    title: z.string(),
    content: z.string(),
  }),
  update: z.object({
    id: z.number().int().positive(),
    title: z.string().optional().nullish(),
    content: z.string().optional().nullish(),
  }),
  byId: z.object({
    id: z.number().int().positive(),
  }),
};

export type CreateData = z.infer<typeof schema.create>;

export type UpdateData = z.infer<typeof schema.update>;
