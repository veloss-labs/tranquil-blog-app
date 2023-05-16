import { TRPCError } from '@trpc/server';
import { env } from '~/env/server.mjs';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { isNotionTagPageValidation } from '~/utils/assertion';
import { PROPERTIES, serializeForTag } from '~/utils/serialize';

export const tagsRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const blogDB = await ctx.notion.databases.retrieve({
      database_id: env.NOTION_DATABASE_ID,
    });

    const { properties } = blogDB;

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

    return {
      tags,
    };
  }),
});
