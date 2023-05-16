import { NotionAPI } from 'notion-client';
import { env } from '~/env/server.mjs';

// import { previewImagesEnabled, useOfficialNotionAPI } from './config';
// import { getPreviewImageMap } from './preview-images';
const globalForNotionClient = globalThis as unknown as {
  notionClient: NotionAPI;
};

export const notionClient =
  globalForNotionClient.notionClient || new NotionAPI();

if (env.NODE_ENV !== 'production')
  globalForNotionClient.notionClient = notionClient;
