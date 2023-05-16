import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { NotionAPI } from 'notion-client';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  isNotionDatabasePage,
  isNotionPageValidation,
} from '~/utils/assertion';
import { PROPERTIES, serialize } from '~/utils/serialize';

export const postsRouter = createTRPCRouter({
  infinite: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        initialCursor: z.string().nullish(),
        tagId: z.string().nullish().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 100;
      const cursor = input.cursor ?? input.initialCursor;

      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const data = await ctx.notion.databases.query({
        database_id: env.NOTION_DATABASE_ID,
        page_size: limit,
        ...(cursor && {
          next_cursor: cursor,
        }),
        ...(input.tagId && {
          filter: {
            property: PROPERTIES.TAGS,
            relation: {
              contains: input.tagId,
            },
          },
        }),
        sorts: [
          {
            property: PROPERTIES.CREATED_AT,
            direction: 'descending',
          },
        ],
      });

      if (!isNotionDatabasePage(data)) {
        return {
          items: [],
          nextCursor: null,
        };
      }

      const list = data.results.filter(isNotionPageValidation).map(serialize);

      return {
        items: list,
        nextCursor: data.has_more ? data.next_cursor : null,
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const _pageInfo = await ctx.notion.pages.retrieve({
        page_id: input.id,
      });

      if (!isNotionPageValidation(_pageInfo)) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Invalid Notion Page',
        });
      }

      const pageInfo = serialize(_pageInfo);

      return {
        pageInfo,
      };
    }),
});
