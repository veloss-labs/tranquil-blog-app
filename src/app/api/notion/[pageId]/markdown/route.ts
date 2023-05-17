import { n2m } from '~/server/db/notion';

interface Context {
  params: {
    pageId: string;
  };
}

export async function GET(request: Request, context: Context) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const pageId = context.params.pageId;
  const mdblocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return new Response(
    JSON.stringify({
      mdx: mdString?.parent ?? '',
    }),
    {
      headers: {
        'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
        'Content-Type': 'application/json',
      },
    },
  );
}

// export const runtime = 'edge';
