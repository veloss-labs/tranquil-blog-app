import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import { Inter as FontSans } from "@next/font/google";

import { api } from "~/utils/api";
import koKR from "antd/locale/ko_KR";

import "~/styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

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
            colorPrimary: "#111111",
          },
        }}
        locale={koKR}
      >
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ConfigProvider>
    </div>
  );
};

export default api.withTRPC(App);
