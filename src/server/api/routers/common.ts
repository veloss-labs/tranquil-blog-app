import { env } from '~/env/server.mjs';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const commonRouter = createTRPCRouter({
  database: publicProcedure.query(async ({ ctx }) => {
    const blogDB = await ctx.notion.databases.query({
      database_id: env.NOTION_DATABASE_ID,
    });

    return {
      data: blogDB,
    };
  }),
});
