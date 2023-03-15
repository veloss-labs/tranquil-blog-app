import { schema } from "~/libs/validation/common";
import { createTRPCRouter, creatorProcedure } from "~/server/api/trpc";
import { responseWith } from "~/server/utils/response";

export const imagesRouter = createTRPCRouter({
  infinity: creatorProcedure
    .input(schema.list)
    .query(async ({ input, ctx }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */
      const limit = input.limit ?? 20;
      const cursor = input.cursor ?? input.initialCursor;

      const items = await ctx.prisma.postImage.findMany({
        take: limit + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: "desc",
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
