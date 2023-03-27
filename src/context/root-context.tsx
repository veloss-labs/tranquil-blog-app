import React from "react";

import { _COLOR } from "~/libs/styles/color";

import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import { DashboardLayoutProvider } from "~/context/layout-context";
import { DashboardRouteProvider } from "~/context/route-context";

import { getRoutes } from "~/libs/router/api/routes";

import { type Session } from "next-auth";

import "dayjs/locale/ko";
import koKR from "antd/locale/ko_KR";

interface RootContextProps {
  session: Session | null;
  children: React.ReactNode;
}

const RootContext: React.FC<RootContextProps> = ({ children, session }) => {
  return (
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
          <DashboardLayoutProvider>{children}</DashboardLayoutProvider>
        </DashboardRouteProvider>
      </SessionProvider>
    </ConfigProvider>
  );
};

export default RootContext;
