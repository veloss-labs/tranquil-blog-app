import { tagsRouter } from '~/server/api/routers/tags';
import { postsRouter } from '~/server/api/routers/posts';
import { createTRPCRouter } from '~/server/api/trpc';
import { commonRouter } from '~/server/api/routers/common';

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  posts: postsRouter,
  common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
