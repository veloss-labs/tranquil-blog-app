// @ts-check
import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
  SENTRY_DSN:
    process.env.NODE_ENV === 'production'
      ? z.string().url().min(1)
      : z.string().optional(),
  NOTION_API_KEY: z.string().min(1),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js
 * middleware, so you have to do it manually here.
 * @type {{ [k in keyof z.input<typeof serverSchema>]: string | undefined }}
 */
export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV,
  DEPLOY_GROUP: process.env.DEPLOY_GROUP,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
};

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  NEXT_PUBLIC_API_HOST: z.string().optional(),
  NEXT_PUBLIC_DEPLOY_GROUP: z.enum(['development', 'local', 'production']),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.input<typeof clientSchema>]: string | undefined }}
 */
export const clientEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
  NEXT_PUBLIC_DEPLOY_GROUP: process.env.NEXT_PUBLIC_DEPLOY_GROUP,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
};
