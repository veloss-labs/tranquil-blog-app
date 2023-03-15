import { schema } from "~/libs/validation/categories";
import {
  createTRPCRouter,
  creatorProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { RESULT_CODE } from "~/server/errors/code";
import { ForbiddenError, NotFoundError } from "~/server/errors/httpException";
import { responseWith } from "~/server/utils/response";

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

      return responseWith({
        data: category.id,
      });
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
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "카테고리가 존재하지 않습니다.",
            }),
          },
        });
      }

      // 내가 등록한 카테고리가 아니면 수정 불가
      if (category.userId !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: categoriesRouter.update",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
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
      return responseWith({
        data: category.id,
      });
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
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.NOT_FOUND,
              resultMessage: "카테고리가 존재하지 않습니다.",
            }),
          },
        });
      }

      // 내가 등록한 카테고리가 아니면 삭제 불가
      if (category.userId !== session.id) {
        throw new ForbiddenError("Forbidden", {
          http: {
            instance: "[trpc]: categoriesRouter.delete",
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.FORBIDDEN,
              resultMessage: "권한이 없습니다.",
            }),
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
            extra: responseWith({
              ok: false,
              resultCode: RESULT_CODE.CATEGORY_USED_BY_POST,
              resultMessage:
                "이미 포스트가 등록된 카테고리는 삭제할 수 없습니다.",
            }),
          },
        });
      }

      await ctx.prisma.postCategory.delete({
        where: {
          id: input.id,
        },
      });

      return responseWith({
        data: undefined,
      });
    }),
  pages: creatorProcedure.input(schema.pages).query(async ({ input, ctx }) => {
    const session = ctx.session;

    const limit = input.pageSize ?? 20;
    const page = input.page ?? 1;

    const [categories, totalCount] = await Promise.all([
      ctx.prisma.postCategory.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          userId: session.id,
          name: {
            contains: input.keyword ?? undefined,
          },
        },
      }),
      ctx.prisma.postCategory.count({
        where: {
          userId: session.id,
          name: {
            contains: input.keyword ?? undefined,
          },
        },
      }),
    ]);

    return responseWith({
      data: {
        list: categories,
        totalCount,
      },
    });
  }),
  infinity: publicProcedure
    .input(schema.infinity)
    .query(async ({ input, ctx }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */
      const limit = input.limit ?? 20;
      const cursor = input.cursor ?? input.initialCursor;

      const items = await ctx.prisma.postCategory.findMany({
        take: limit + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          name: {
            contains: input.keyword ?? undefined,
          },
        },
      });
      let nextCursor: number | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastItem = items.pop()!;
        nextCursor = lastItem.id;
      }

      return responseWith({
        data: {
          items: items,
          nextCursor,
        },
      });
    }),
});
