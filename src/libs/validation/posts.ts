import * as z from "zod";
import { schema as common } from "~/libs/validation/common";

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
  pages: z
  .object({
    keyword: z.string().optional().nullish(),
  })
  .merge(common.pages),
};

export type CreateData = z.infer<typeof schema.create>;

export type UpdateData = z.infer<typeof schema.update>;
