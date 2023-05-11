import type { GetServerSidePropsContext } from 'next';
import type { NextRequest } from 'next/server';
import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { notion } from '~/server/db/notion';

type CreateContextOptions = {
  req: NextRequest | GetServerSidePropsContext['req'] | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return {
    req: opts.req,
    notion,
  };
};

export const createContext = (opts: CreateNextContextOptions) => {
  return createContextInner({
    req: opts.req,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
