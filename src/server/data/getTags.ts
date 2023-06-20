import { cache } from 'react';
import { api } from '~/@trpc/next-layout/server/server';
import logger from '~/utils/logger';

import 'server-only';

export const getTags = cache(async () => {
  try {
    const { tags } = await api.tags.list.fetch();
    return tags;
  } catch (error) {
    logger.error(error as Error);
    return [];
  }
});
