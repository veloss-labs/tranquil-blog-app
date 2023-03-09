import * as z from "zod";

export const schema = {
  list: z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.number().nullish(),
    initialCursor: z.number().nullish(),
  }),
};

export type ListData = z.infer<typeof schema.list>;
