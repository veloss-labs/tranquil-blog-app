import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import { Inter as FontSans } from "next/font/google";

import { api } from "~/utils/api";
import koKR from "antd/locale/ko_KR";

import "~/styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { _COLOR } from "~/libs/styles/color";
import { AdminLayoutProvider } from "~/context/layout-context";
import { AdminRouteProvider } from "~/context/route-context";

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
          <AdminRouteProvider>
            <AdminLayoutProvider>
              <Component {...pageProps} />
            </AdminLayoutProvider>
          </AdminRouteProvider>
        </SessionProvider>
      </ConfigProvider>
    </div>
  );
};

export default api.withTRPC(App);
