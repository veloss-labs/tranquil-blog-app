import { cache } from 'react';
import { api } from '~/libs/api/server';
import logger from '~/utils/logger';
import { notionClient } from '../db/notion-client';

import type { ByIdInput } from '../api/routers/posts';
import { ExtendedRecordMap } from 'notion-types';

import 'server-only';

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notionClient.getPage(pageId);
  return recordMap;
}

export const getPost = cache(async (input: ByIdInput) => {
  try {
    const data = await api.posts.byId.fetch(input);
    return data.pageInfo;
  } catch (error) {
    logger.error(error as Error);
    return null;
  }
});
