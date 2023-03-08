import React from "react";
import cx from "classnames";

// components
import { Button, Layout } from "antd";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";

// hooks
import { useLayoutDashboardContext } from "~/context/layout-context";

interface DraftsSidebarProps {}

function DraftsSidebar(_: DraftsSidebarProps) {
  const { isShowSidebar, toggleSidebar } = useLayoutDashboardContext();

  return (
    <Layout.Sider
      className={cx("sidebar hidden overflow-y-scroll", {
        "sm:block": isShowSidebar,
        hidden: !isShowSidebar,
      })}
    >
      <div className="flex h-full flex-col">
        <div className="grow overflow-auto">Menu</div>
        <div>
          <div className="absolute bottom-0 right-0 m-3 flex justify-end">
            <Button
              type="text"
              className="!flex items-center justify-center"
              htmlType="button"
              onClick={toggleSidebar}
            >
              <ChevronLeftIcon className="h-3 w-3" />
              <Bars3Icon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Layout.Sider>
  );
}

export default React.memo(DraftsSidebar);
