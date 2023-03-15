import * as z from "zod";

export const schema = {
  list: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.number().nullish(),
    initialCursor: z.number().nullish(),
  }),
  pages: z.object({
    page: z.number().min(1).nullish(),
    pageSize: z.number().min(1).max(100).nullish(),
  }),
};

export type ListData = z.infer<typeof schema.list>;

export type PagesData = z.infer<typeof schema.pages>;