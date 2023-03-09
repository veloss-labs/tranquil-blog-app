import * as z from "zod";
import { schema as common } from "~/libs/validation/common";

export const schema = {
  create: z.object({
    name: z
      .string({
        required_error: "카테고리명을 입력해주세요.",
      })
      .min(2, "카테고리명은 2자 이상이어야 합니다."),
    description: z.string().optional(),
    thumbnail: z.string().url().optional(),
  }),
  byId: z.object({
    id: z.number().int().positive(),
  }),
  update: z.object({
    id: z.number().int().positive(),
    name: z
      .string({
        required_error: "카테고리명을 입력해주세요.",
      })
      .min(2, "카테고리명은 2자 이상이어야 합니다."),
    description: z.string().optional(),
    thumbnail: z.string().url().optional(),
  }),
  list: z
    .object({
      keyword: z.string().optional().nullish(),
    })
    .merge(common.list),
};

export type CreateData = z.infer<typeof schema.create>;

export type ByIdData = z.infer<typeof schema.byId>;

export type UpdateData = z.infer<typeof schema.update>;

export type ListData = z.infer<typeof schema.list>;
