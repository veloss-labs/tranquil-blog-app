import * as z from "zod";

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
};

export type CreateData = z.infer<typeof schema.create>;
