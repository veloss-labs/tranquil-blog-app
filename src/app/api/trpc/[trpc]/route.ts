import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContextInner as ctx } from '~/server/api/context';
import { appRouter } from '~/server/api/root';
import { env } from '~/env/server.mjs';

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext() {
      return ctx({
        req,
      });
    },
    onError:
      env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`,
            );
          }
        : undefined,
  });
};

export const GET = handler;
export const POST = handler;

// export const runtime = 'edge';
