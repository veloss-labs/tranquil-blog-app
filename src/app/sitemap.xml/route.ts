import { PAGE_ENDPOINTS } from '~/constants/constants';
import { getPosts } from '~/server/data/getPosts';
import logger from '~/utils/logger';
import { url } from '~/utils/url';
import { Buffer } from 'node:buffer';

export async function GET(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');
  if (!host) {
    throw new Error('Could not determine domain URL.');
  }
  const routesMap = [PAGE_ENDPOINTS.ROOT].map((route) => ({
    url: `${url}${route}`,
    lastModified: new Date().toISOString(),
  }));

  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    posts = await getPosts({ limit: 100 });
  } catch (error) {
    logger.error(error as Error);
    posts = [];
  }

  const postsRoutes = posts.map((post) => ({
    url: `${url}${PAGE_ENDPOINTS.ID(post.id)}`,
    lastModified: new Date(post.updatedAt).toISOString(),
  }));

  //  generate sitemap
  const xmlString = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!--  created with Free Online Sitemap Generator www.xml-sitemaps.com  -->
  ${routesMap
    .map((route) => {
      return `<url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <priority>1.00</priority>
    </url>`;
    })
    .join('')}
    ${postsRoutes
      .map((route) => {
        return `<url>
        <loc>${route.url}</loc>
        <lastmod>${route.lastModified}</lastmod>
        <priority>0.80</priority>
        </url>`;
      })
      .join('')}
  </urlset>
    `;

  return new Response(xmlString, {
    headers: {
      'Cache-Control': `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(xmlString)),
    },
  });
}

export const runtime = 'edge';
