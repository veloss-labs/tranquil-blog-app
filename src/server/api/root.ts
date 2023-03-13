import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { categoriesRouter } from "~/server/api/routers/categories";
import { postsRouter } from "~/server/api/routers/posts";
import { commonRouter } from "~/server/api/routers/common";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  categories: categoriesRouter,
  posts: postsRouter,
  common: commonRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
