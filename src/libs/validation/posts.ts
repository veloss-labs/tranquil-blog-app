import * as z from "zod";

export const schema = {
  create: z.object({
    title: z.string(),
    subTitle: z.string().optional().nullish(),
    content: z.string(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional().nullish(),
    published: z.boolean().default(false),
    tags: z.array(z.string()),
    categoryId: z.number().int().positive().optional().nullish(),
  }),
  update: z.object({
    id: z.number().int().positive(),
    title: z.string().optional().nullish(),
    subTitle: z.string().optional().nullish(),
    content: z.string().optional().nullish(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional().nullish(),
    published: z.boolean().optional().nullish(),
    tags: z.array(z.string()).optional().nullish(),
    categoryId: z.number().int().positive().optional().nullish(),
  }),
  byId: z.object({
    id: z.number().int().positive(),
  }),
};

export type CreateData = z.infer<typeof schema.create>;

export type UpdateData = z.infer<typeof schema.update>;
