import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { Dropdown, Space, Avatar, Typography } from "antd";
import { useTranslation } from "next-i18next";

import { signOut } from "next-auth/react";

import type { MenuProps } from "antd";
import type { Session } from "next-auth";

interface UserNavProps {
  session: Session;
}

const UserNav: React.FC<UserNavProps> = ({ session }) => {
  const onSignOut = useCallback(() => {
    signOut({
      callbackUrl: "/",
    });
  }, []);

  const { t } = useTranslation();

  const menuItems: MenuProps["items"] = useMemo(() => {
    const _menuItems: MenuProps["items"] = [
      {
        label: (
          <Link
            href={`/blog/${session.user?.profile?.username}`}
            aria-label="profile"
          >
            <Typography.Text strong>{t("shared.profile")}</Typography.Text>
          </Link>
        ),
        key: "0",
      },
      {
        label: (
          <Link href="/account/profile" aria-label="account setting">
            <Typography.Text strong>
              {t("shared.account_settings")}
            </Typography.Text>
          </Link>
        ),
        key: "1",
      },
    ];
    if (session?.user?.role?.authority === "CREATOR") {
      _menuItems.push({
        label: (
          <Link href="/dashboard" aria-label="dashboard">
            <Typography.Text strong>{t("shared.dashboard")}</Typography.Text>
          </Link>
        ),
        key: "2",
      });
    }
    _menuItems.push({
      type: "divider",
    });
    _menuItems.push({
      label: (
        <Typography.Text
          role="button"
          aria-label="sign out button"
          strong
          onClick={onSignOut}
        >
          {t("shared.sign_out")}
        </Typography.Text>
      ),
      key: "3",
    });

    return _menuItems;
  }, [
    session.user?.profile?.username,
    session.user?.role?.authority,
    t,
    onSignOut,
  ]);

  return (
    <div className="user-nav">
      <Space size="small">
        <Dropdown
          menu={{
            items: menuItems,
            style: {
              width: "150px",
            },
          }}
          placement="bottomLeft"
          trigger={["click"]}
          className="flex w-14 items-center"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Avatar
              size="large"
              gap={4}
              src={session?.user?.profile?.profileUrl ?? undefined}
            >
              {session?.user?.profile?.username}
            </Avatar>
          </a>
        </Dropdown>
      </Space>
    </div>
  );
};

export default UserNav;
