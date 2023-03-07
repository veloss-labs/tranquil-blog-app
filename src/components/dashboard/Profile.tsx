import React, { useCallback } from "react";
import { Dropdown, Typography, Button } from "antd";

// components
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import LogOutIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

// hooks
import { signOut, useSession } from "next-auth/react";

// types
import type { MenuProps } from "antd";

function Profile() {
  const session = useSession();

  const onLogout = useCallback(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  const items: MenuProps["items"] = [
    {
      label: (
        <Button
          type="link"
          icon={<UserIcon />}
          size="small"
          className="btn-menu--profile sm:min-w-[8rem]"
        >
          내 프로필
        </Button>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type="link"
          icon={<LogOutIcon />}
          size="small"
          className="btn-menu--profile"
          onClick={onLogout}
        >
          로그아웃
        </Button>
      ),
      key: "1",
    },
  ];

  return (
    <>
      <div className="ml-1">
        <Typography.Text>나의 대시보드</Typography.Text>
      </div>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Button
          size="small"
          htmlType="button"
          shape="default"
          type="text"
          className="btn-menu--toggle"
        >
          <span className="ellipsis-text sm:max-w-[10rem]">
            {session?.data?.user?.name}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </Dropdown>
    </>
  );
}

export default React.memo(Profile);
