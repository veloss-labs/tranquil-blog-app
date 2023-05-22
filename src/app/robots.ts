import { MetadataRoute } from 'next';
import { url } from '~/utils/url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
