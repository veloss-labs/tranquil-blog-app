import * as z from "zod";
import { schema as common } from "~/libs/validation/common";

export const schema = {
  create: z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    content: z.string(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional().nullish(),
    published: z.boolean().default(false),
    tags: z.array(z.string()),
    categoryId: z.number().int().positive().optional().nullish(),
  }),
  update: z.object({
    id: z.number().int().positive(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    content: z.string().optional(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional(),
    published: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
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

export type ByIdData = z.infer<typeof schema.byId>;

export type PagesData = z.infer<typeof schema.pages>;
