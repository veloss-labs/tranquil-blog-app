import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { env } from '~/env/server.mjs';

import 'server-only';

const globalForNotion = globalThis as unknown as {
  notion: Client;
  n2m: NotionToMarkdown;
};

export const notion =
  globalForNotion.notion ||
  new Client({
    auth: env.NOTION_API_KEY,
  });

export const n2m =
  globalForNotion.n2m || new NotionToMarkdown({ notionClient: notion });

if (env.NODE_ENV !== 'production') globalForNotion.notion = notion;
if (env.NODE_ENV !== 'production') globalForNotion.n2m = n2m;
