import { Buffer } from 'node:buffer';
import { getPosts } from '~/server/data/getPosts';
import type { CoverType, PostSchema } from '~/ts/schema';

export async function GET(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const domain = `${protocol}://${host}`;
  const now = new Date();

  const entry = ({
    id,
    title,
    updatedAt,
    createdAt,
    description,
  }: PostSchema<CoverType>) => {
    return `
    <entry>
        <title type="html"><![CDATA[${title}]]></title>
        <id>${domain}/${id}</id>
        <updated>${updatedAt}</updated>
        ${
          description
            ? `<summary type="html"><![CDATA[${description}]]></summary>`.trim()
            : ''
        }
        <author>
            <name>Veloss</name>
        </author>
        <published>${createdAt}</published>
        <rights>©${now.getFullYear()} Tranquil Blog</rights>
    </entry>
    `.trim();
  };

  const posts = await getPosts({ limit: 100 });

  const xmlString = `
  <feed xmlns="http://www.w3.org/2005/Atom">
    <id>${domain}</id>
    <title>Tranquil Blog</title>
    <updated>${now.toISOString()}</updated>
    <link rel="alternate" href="${domain}" />
    <link rel="self" href="${domain}/feed.xml" />
    <subtitle>Tranquil Blog</subtitle>
    <icon>${domain}/favicon.ico</icon>
    <rights>©${now.getFullYear()} Tranquil Blog</rights>
    ${posts.map(entry).join('\n')}
  </feed>
  `.trim();
  return new Response(xmlString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(xmlString)),
    },
  });
}

export const runtime = 'edge';
