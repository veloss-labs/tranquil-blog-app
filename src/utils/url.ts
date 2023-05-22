import { env } from '~/env/server.mjs';
import { isBrowser } from '~/libs/browser/dom';

export const url = (function () {
  if (isBrowser) {
    return window.location.origin;
  }
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
})();
