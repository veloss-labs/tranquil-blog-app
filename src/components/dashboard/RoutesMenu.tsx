import React, { useCallback } from "react";

// components
import { Menu } from "antd";

// hooks
import { useRouteDashboardContext } from "~/context/route-context";

import { getUrl } from "~/utils/utils";
import { Routes } from "~/libs/router/routes";

import type { UrlRoutes } from "~/ts/common";
import type { SelectEventHandler } from "rc-menu/lib/interface";

interface RoutesMenuProps {
  pageTransition: (url: UrlRoutes) => Promise<void>;
}

function RoutesMenu({ pageTransition }: RoutesMenuProps) {
  const { menuRoutes, selectedRoute, changeSelectedRoute } =
    useRouteDashboardContext();

  const onSelect: SelectEventHandler = useCallback(
    (data) => {
      const pathname = Routes.getMoveToRoute(data.selectedKeys);
      if (!pathname) return;
      const nextUrl = new URL(pathname, getUrl().origin);
      pageTransition(nextUrl);
      changeSelectedRoute(data.selectedKeys);
    },
    [pageTransition, changeSelectedRoute]
  );

  return (
    <Menu
      className="routes-menu"
      mode={"inline"}
      selectedKeys={selectedRoute}
      items={menuRoutes}
      onSelect={onSelect}
      onDeselect={onSelect}
    />
  );
}

export default RoutesMenu;
