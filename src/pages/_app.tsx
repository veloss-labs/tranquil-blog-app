import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import { Inter as FontSans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { api } from "~/utils/api";
import koKR from "antd/locale/ko_KR";

import "~/styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { _COLOR } from "~/libs/styles/color";
import { DashboardLayoutProvider } from "~/context/layout-context";
import { DashboardRouteProvider } from "~/context/route-context";
import { getRoutes } from "~/libs/router/api/routes";
import { clientEnv } from "~/env/schema.mjs";

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
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <div className={fontSans.variable}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: _COLOR.brand.DEFAULT,
            colorPrimaryHover: _COLOR.brand.HOVER,
            colorPrimaryActive: _COLOR.brand.ACTIVE,
            colorLink: _COLOR.brand.LINK,
            colorLinkHover: _COLOR.brand.LINK_HOVER,
            colorText: _COLOR.brand.DEFAULT,
          },
        }}
        locale={koKR}
      >
        <SessionProvider session={session}>
          <DashboardRouteProvider originRoutes={getRoutes().data}>
            <DashboardLayoutProvider>
              {getLayout(<Component {...pageProps} />)}
            </DashboardLayoutProvider>
          </DashboardRouteProvider>
        </SessionProvider>
      </ConfigProvider>
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

export default api.withTRPC(App);
