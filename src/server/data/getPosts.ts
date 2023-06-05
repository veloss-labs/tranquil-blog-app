import { cache } from 'react';
import { api } from '~/libs/api/server';
import logger from '~/utils/logger';

import type { ListInput } from '../api/routers/posts';
import type { CoverType, PostSchema } from '~/ts/schema';

import 'server-only';

export const getPosts = cache(async (input: ListInput) => {
  try {
    const data = await api.posts.infinite.fetchInfinite(input);
    // @ts-ignore
    const posts = data?.pages?.flatMap((page) => page?.items) ?? [];
    return posts as PostSchema<CoverType>[];
  } catch (error) {
    logger.error(error as Error);
    return [];
  }
});
