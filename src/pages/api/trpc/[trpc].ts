// import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
// import type { NextRequest, NextResponse } from 'next/server';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});
// export API handler
// export default async function handler(req: NextRequest) {
//   return fetchRequestHandler({
//     endpoint: '/api/trpc',
//     router: appRouter,
//     req,
//     createContext: (opts) => createTRPCContext(opts),
//     onError:
//     env.NODE_ENV === "development"
//       ? ({ path, error }) => {
//           console.error(
//             `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
//           );
//         }
//       : undefined,
//   });
// }