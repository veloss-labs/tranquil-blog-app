import { schema } from "~/libs/validation/auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { RESULT_CODE } from "~/server/errors/code";
import { ForbiddenError } from "~/server/errors/httpException";
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
        throw new ForbiddenError("AlreadyExists", {
          http: {
            instance: "[trpc]: usersRouter.create",
            extra: {
              email: input.email,
              errorCode: RESULT_CODE.ALREADY_EXISTS,
            },
          },
        });
      }

      const salt = generateSalt();
      const hash = generateHash(input.password, salt);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hash,
          salt,
        },
      });

      // 유저 프로필 및 권한 생성
      await Promise.all([
        ctx.prisma.userProfile.create({
          data: {
            userId: user.id,
            username: input.nickname,
          },
        }),
        ctx.prisma.userRole.create({
          data: {
            userId: user.id,
            authority: "CREATOR",
          },
        }),
      ]);

      return {
        userId: user.id,
      };
    }),
});
