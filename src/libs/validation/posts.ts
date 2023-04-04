import * as z from "zod";
import { schema as common } from "~/libs/validation/common";

export const schema = {
  create: z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    content: z.string(),
    dsecription: z.string().optional().nullable(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional().nullish(),
    tags: z.array(z.string()).optional(),
    categoryId: z.number().int().positive().optional().nullish(),
  }),
  update: z.object({
    id: z.number().int().positive(),
    title: z.string().optional(),
    subTitle: z.string().optional(),
    content: z.string().optional(),
    dsecription: z.string().optional().nullable(),
    thumbnailId: z.number().int().positive().optional().nullish(),
    issueDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
    categoryId: z.number().int().positive().optional().nullish(),
  }),
  byId: z.object({
    id: z.number().int().positive().optional(),
  }),
  pages: z
    .object({
      keyword: z.string().optional().nullish(),
    })
    .merge(common.pages),
  infinity: z
    .object({
      keyword: z.string().optional().nullish(),
      categoryId: z.number().int().positive().optional().nullish(),
      sorting: z.string().optional().nullish(),
      isDraft: z.boolean().optional().nullish(),
    })
    .merge(common.list),
};

export type CreateData = z.infer<typeof schema.create>;

export type UpdateData = z.infer<typeof schema.update>;

export type ByIdData = z.infer<typeof schema.byId>;

export type PagesData = z.infer<typeof schema.pages>;
