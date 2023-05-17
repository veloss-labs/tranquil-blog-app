import { cache } from 'react';
import { api } from '~/libs/api/server';
import logger from '~/utils/logger';

import type { ByIdInput } from '../api/routers/posts';

import 'server-only';

export const getPost = cache(async (input: ByIdInput) => {
  try {
    const data = await api.posts.byId.fetch(input);
    return data.pageInfo;
  } catch (error) {
    logger.error(error as Error);
    return null;
  }
});
