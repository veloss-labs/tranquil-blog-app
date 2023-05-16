import { Client } from '@notionhq/client';
import { notion as officialNotion } from './notion';

// @ts-ignore
import { NotionCompatAPI } from 'notion-compat';
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types';

// import { previewImagesEnabled, useOfficialNotionAPI } from './config';
// import { getPreviewImageMap } from './preview-images';
const globalForNotionCompat = globalThis as unknown as { notionCompat: any };

export const notionCompat = new NotionCompatAPI(officialNotion);
