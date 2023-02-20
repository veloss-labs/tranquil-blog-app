import { signupSchema } from "~/libs/validation/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  signup: publicProcedure.input(signupSchema).query(({ ctx, input }) => {
    return {
      greeting: `Hello`,
    };
  }),
});
