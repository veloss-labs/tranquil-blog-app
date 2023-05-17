import { cache } from 'react';
import { ApiService } from '~/api/client';
import { NEXT_ROUTES_API_ENDPOINTS } from '~/constants/constants';
import logger from '~/utils/logger';

import 'server-only';

export const getMarkdown = cache(async (pageId: string) => {
  try {
    const { json } = await ApiService.getJson<string>(
      NEXT_ROUTES_API_ENDPOINTS.NOTION.PAGE_ID.MARKDOWN(pageId),
    );
    return json.result;
  } catch (error) {
    logger.error(error as Error);
    return '';
  }
});
