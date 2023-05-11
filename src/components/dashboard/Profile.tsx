import React, { useCallback } from "react";
import { Dropdown, Typography, Button } from "antd";

// components
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import LogOutIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

// hooks
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// types
import type { MenuProps } from "antd";

function Profile() {
  const session = useSession();
  const router = useRouter();
  const { t } = useTranslation();

  const onLogout = useCallback(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  const onHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const items: MenuProps["items"] = [
    {
      label: (
        <Button
          type="link"
          icon={<HomeIcon />}
          size="small"
          className="btn-menu--profile sm:min-w-[8rem]"
          onClick={onHome}
        >
          {t("dashboard.routes.home")}
        </Button>
      ),
      key: "0",
    },
    {
      label: (
        <Button
          type="link"
          icon={<UserIcon />}
          size="small"
          className="btn-menu--profile sm:min-w-[8rem]"
        >
          {t("dashboard.routes.profile")}
        </Button>
      ),
      key: "1",
    },
    {
      type: "divider",
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
          {t("shared.sign_out")}
        </Button>
      ),
      key: "2",
    },
  ];

  return (
    <>
      <div className="ml-1">
        <Typography.Text>{t("dashboard.routes.my_dashboard")}</Typography.Text>
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
            {session?.data?.user?.profile?.username}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </Dropdown>
    </>
  );
}

export default React.memo(Profile);
