import { schema } from "~/libs/validation/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { HttpException } from "~/server/errors/exceptions";
import { generateHash, generateSalt } from "~/server/utils/password";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(schema.signup)
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (exists) {
        throw new HttpException(400, "AlreadyExists");
      }

      const salt = generateSalt();
      const hash = generateHash(input.password, salt);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.nickname,
          password: hash,
          salt,
        },
      });

      return {
        userId: user.id,
      };
    }),
});
