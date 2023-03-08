import { schema } from "~/libs/validation/categories";
import { createTRPCRouter, creatorProcedure } from "~/server/api/trpc";
import { ForbiddenError, NotFoundError } from "~/server/errors/httpException";

export const categoriesRouter = createTRPCRouter({
  create: creatorProcedure
    .input(schema.create)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      const category = await ctx.prisma.postCategory.create({
        data: {
          name: input.name,
          description: input.description,
          thumbnail: input.thumbnail,
          userId: session.id,
        },
      });

      return {
        dataId: category.id,
      };
    }),
  update: creatorProcedure
    .input(schema.update)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      const category = await ctx.prisma.postCategory.findUnique({
        where: {
          id: input.id,
        },
      });

      // 카테고리가 없으면 수정 불가
      if (!category) {
        throw new NotFoundError("CategoryNotFound", {
          http: {
            instance: "[trpc]: categoriesRouter.update",
          },
        });
      }

      // 내가 등록한 카테고리가 아니면 수정 불가
      if (category.userId !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: categoriesRouter.update",
          },
        });
      }

      await ctx.prisma.postCategory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          thumbnail: input.thumbnail,
        },
      });

      return {
        dataId: input.id,
      };
    }),
  delete: creatorProcedure
    .input(schema.byId)
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;

      const category = await ctx.prisma.postCategory.findUnique({
        where: {
          id: input.id,
        },
      });

      // 카테고리가 없으면 삭제 불가
      if (!category) {
        throw new NotFoundError("CategoryNotFound", {
          http: {
            instance: "[trpc]: categoriesRouter.delete",
          },
        });
      }

      // 내가 등록한 카테고리가 아니면 삭제 불가
      if (category.userId !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: categoriesRouter.delete",
          },
        });
      }

      // 이미 포스트가 등록된 카테고리는 삭제 불가
      const post = await ctx.prisma.post.findFirst({
        where: {
          categoryId: input.id,
        },
      });
      if (post) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: categoriesRouter.delete",
          },
        });
      }

      await ctx.prisma.postCategory.delete({
        where: {
          id: input.id,
        },
      });

      return {
        ok: true,
      };
    }),
});
