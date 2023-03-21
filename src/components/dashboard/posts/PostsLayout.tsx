import React, { useCallback } from "react";
import classNames from "classnames";

// components
import { Avatar, Button, theme, Typography } from "antd";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";

// hooks
import { useLayoutDashboardContext } from "~/context/layout-context";

interface DraftsLayoutProps {
  children: React.ReactNode;
  pageHeader?: React.ReactNode;
}

function DraftsLayout({ children, pageHeader }: DraftsLayoutProps) {
  const { token } = theme.useToken();

  const { togglePopupMenu } = useLayoutDashboardContext();

  const onTogglePopupMenu = useCallback(() => {
    togglePopupMenu();
  }, [togglePopupMenu]);

  return (
    <>
      <div>
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
        <div className={classNames("sm:h-full sm:overflow-auto")}>
          {pageHeader}
          <section>{children}</section>
          <div className="fixed bottom-5 left-5">
            <Button
              htmlType="button"
              type="primary"
              className="!flex items-center justify-center !shadow-none"
              icon={<Bars3Icon className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default DraftsLayout;
