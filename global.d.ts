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
    }
  }
}
