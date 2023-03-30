import { Inter as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { api } from "~/utils/api";
import { appWithTranslation } from "next-i18next";

import "~/styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { clientEnv } from "~/env/schema.mjs";
import { useEffect } from "react";

import RootContext from "~/context/root-context";
import nextI18NextConfig from "../../next-i18next.config";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface AppPageProps {
  session: Session | null;
}

const App: AppType<AppPageProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const ctx = api.useContext();
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    ctx.common.generateId.fetch(undefined, {
      staleTime: Infinity,
    });
  }, []);

  return (
    <div className={fontSans.variable}>
      <RootContext session={session}>
        {getLayout(<Component {...pageProps} />)}
      </RootContext>
      <Analytics
        debug={
          clientEnv.NEXT_PUBLIC_DEPLOY_GROUP
            ? ["local"].includes(clientEnv.NEXT_PUBLIC_DEPLOY_GROUP)
            : false
        }
      />
    </div>
  );
};

export default api.withTRPC(appWithTranslation(App, nextI18NextConfig));
