import React from "react";
import cx from "classnames";

// components
import { Avatar, Button, Layout, theme } from "antd";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import Profile from "~/components/dashboard/Profile";

// hooks
import { useLayoutDashboardContext } from "~/context/layout-context";
import { useSession } from "next-auth/react";

interface PostsSidebarProps { }

function PostsSidebar(_: PostsSidebarProps) {
  const session = useSession();
  const { isShowSidebar, toggleSidebar } = useLayoutDashboardContext();

  const { token } = theme.useToken();

  return (
    <Layout.Sider
      className={cx("sidebar hidden overflow-y-scroll", {
        "sm:block": isShowSidebar,
        hidden: !isShowSidebar,
      })}
    >
      <div className="flex h-full flex-col">
        <div className="flex">
          <div className="shrink-0">
            <Avatar
              shape="square"
              size={46}
              style={{ backgroundColor: token.colorPrimary }}
            >
              {session?.data?.user?.profile?.username}
            </Avatar>
          </div>
          <div className="ml-1 grow">
            <Profile />
          </div>
        </div>
        <div className="grow overflow-auto"></div>
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

export default React.memo(PostsSidebar);
