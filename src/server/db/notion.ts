import { Client } from '@notionhq/client';
import { env } from '~/env/server.mjs';

const globalForNotion = globalThis as unknown as { notion: Client };

export const notion =
  globalForNotion.notion ||
  new Client({
    auth: env.NOTION_API_KEY,
  });

if (env.NODE_ENV !== 'production') globalForNotion.notion = notion;
