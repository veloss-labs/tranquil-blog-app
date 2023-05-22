import type { MetadataRoute } from 'next';
import { PAGE_ENDPOINTS } from '~/constants/constants';
import { getPosts } from '~/server/data/getPosts';
import logger from '~/utils/logger';
import { url } from '~/utils/url';

export default async function sitemap(): Promise<
  Promise<Promise<MetadataRoute.Sitemap>>
> {
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

  return [...routesMap, ...postsRoutes];
}
