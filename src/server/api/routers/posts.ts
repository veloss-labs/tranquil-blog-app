import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { env } from '~/env/server.mjs';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { getPage } from '~/server/data/getPost';
import { TagSchema } from '~/ts/schema';
import {
  isNotionDatabasePage,
  isNotionPageValidation,
  isNotionTagPageValidation,
} from '~/utils/assertion';
import { PROPERTIES, serialize, serializeForTag } from '~/utils/serialize';

const listSchema = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  initialCursor: z.string().nullish(),
  tagId: z.string().nullish().optional(),
});

export type ListInput = z.infer<typeof listSchema>;

const byIdSchema = z.object({
  id: z.string(),
});

export type ByIdInput = z.infer<typeof byIdSchema>;

export const postsRouter = createTRPCRouter({
  infinite: publicProcedure.input(listSchema).query(async ({ input, ctx }) => {
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
  byId: publicProcedure.input(byIdSchema).query(async ({ input, ctx }) => {
    const [blogDB_pages, blogDB_database] = await Promise.all([
      ctx.notion.pages.retrieve({
        page_id: input.id,
      }),
      ctx.notion.databases.retrieve({
        database_id: env.NOTION_DATABASE_ID,
      }),
    ]);

    if (!isNotionPageValidation(blogDB_pages)) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invalid Notion Page',
      });
    }

    const { properties } = blogDB_database;

    const tagProperty = properties[PROPERTIES.TAGS];
    if (tagProperty.type !== 'relation') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Tag property is not a relation',
      });
    }

    const { relation } = tagProperty;

    const tagDB = await ctx.notion.databases.query({
      database_id: relation.database_id,
      page_size: 100,
    });

    const tags = tagDB.results
      .filter(isNotionTagPageValidation)
      .map(serializeForTag);

    const pageInfo = serialize(blogDB_pages);

    const unionTags: TagSchema[] = [];
    for (const tag of pageInfo.tags) {
      const foundTag = tags.find((t) => t.id === tag.id);
      if (foundTag) {
        tags.push(foundTag);
      }
    }

    return {
      pageInfo: {
        ...pageInfo,
        tags: unionTags,
      },
    };
  }),
});
