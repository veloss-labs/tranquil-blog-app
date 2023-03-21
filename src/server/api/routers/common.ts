import { env } from "~/env/server.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getTrpcRouterCookie } from "~/server/auth";
import { responseWith } from "~/server/utils/response";

export const commonRouter = createTRPCRouter({
  generateId: publicProcedure.query(({ ctx }) => {
    const cookies = getTrpcRouterCookie(ctx);
    const guestId = cookies.get(env.GUEST_ID_NAME, {
      signed: true,
    });
    if (!guestId) {
      const id = Math.random().toString(36).substring(2);
      cookies.set(env.GUEST_ID_NAME, id, {
        signed: true,
        httpOnly: true,
        path: "/",
        maxAge: Number(env.GUEST_ID_COOKIE_MAX_AGE),
        sameSite: "lax",
      });
    }
    return responseWith({
      data: undefined,
    });
  }),
});
