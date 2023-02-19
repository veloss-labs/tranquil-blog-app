import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";

import { api } from "../utils/api";
import koKR from "antd/locale/ko_KR";

import "../styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

interface AppPageProps {
  session: Session | null;
}

const App: AppType<AppPageProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#63489a",
          colorLink: "#63489a",
          colorLinkHover: "#7f68a6",
        },
      }}
      locale={koKR}
    >
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ConfigProvider>
  );
};

export default api.withTRPC(App);
