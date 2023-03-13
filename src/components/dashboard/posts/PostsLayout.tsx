import React, { useCallback, useEffect } from "react";
import classNames from "classnames";

// components
import { Avatar, Button, theme, Typography } from "antd";
import PostsSidebar from "~/components/dashboard/posts/PostsSidebar";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";

// hooks
import { useLayoutDashboardContext } from "~/context/layout-context";
import { useMedia } from "~/libs/hooks/useMedia";

interface DraftsLayoutProps {
  children: React.ReactNode;
  pageHeader?: React.ReactNode;
}

function DraftsLayout({ children, pageHeader }: DraftsLayoutProps) {
  const { token } = theme.useToken();

  const { isShowSidebar, openSidebar, closeSidebar, togglePopupMenu } =
    useLayoutDashboardContext();

  const isMobile = useMedia("(max-width: 640px)", false);

  const onTogglePopupMenu = useCallback(() => {
    togglePopupMenu();
  }, [togglePopupMenu]);

  const onToggleSidebar = useCallback(() => {
    if (isMobile) {
      togglePopupMenu();
      return;
    }
    openSidebar();
  }, [isMobile, openSidebar, togglePopupMenu]);

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }, [isMobile]);

  return (
    <>
      <div>
        <PostsSidebar />
        <div className="mobile-header">
          <div className="flex items-center">
            <Avatar
              shape="square"
              size={36}
              style={{ backgroundColor: token.colorPrimary }}
            >
              P
            </Avatar>
            <Typography.Title className="!mb-0 !mt-0 ml-3" level={4}>
              Admin UI
            </Typography.Title>
          </div>
          <div>
            <Button
              type="text"
              className="!flex items-center justify-center"
              htmlType="button"
              onClick={onTogglePopupMenu}
            >
              <Bars3Icon className="h-8 w-8" />
            </Button>
          </div>
        </div>
        <div
          className={classNames("sm:h-full sm:overflow-auto", {
            "sm:ml-72": isShowSidebar,
          })}
        >
          {pageHeader}
          <section>{children}</section>
          {!isShowSidebar ? (
            <div className="fixed bottom-5 left-5">
              <Button
                htmlType="button"
                type="primary"
                className="!flex items-center justify-center !shadow-none"
                icon={<Bars3Icon className="h-5 w-5" />}
                onClick={onToggleSidebar}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default DraftsLayout;
