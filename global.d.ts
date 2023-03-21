export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // env
      NODE_ENV: "development" | "production" | "test";
      DEPLOY_GROUP: "development" | "production" | "local";

      // application
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_API_HOST: string;
      NEXT_PUBLIC_DEPLOY_GROUP: "local" | "development" | "production";

      // next-auth
      NEXTAUTH_SECRET: string;
      GUEST_ID_COOKIE_SECRET: string;
      GUEST_ID_NAME: string;
      GUEST_ID_COOKIE_MAX_AGE: string;

      // cloudflare storage
      CLOUDFLARE_R2_PUBLIC_URL: string;
      CLOUDFLARE_R2_ENDPOINT: string;
      CLOUDFLARE_R2_BUCKET_NAME: string;
      CLOUDFLARE_R2_ACCESS_KEY_ID: string;
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: string;
      CLOUDFLARE_R2_EXPIRES: string;
    }
  }
}
