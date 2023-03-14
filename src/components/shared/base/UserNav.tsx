import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { Dropdown, Space, Avatar, Button, Typography } from "antd";

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

  const menuItems: MenuProps["items"] = useMemo(() => {
    const _menuItems: MenuProps["items"] = [
      {
        label: (
          <Link href="/" aria-label="profile">
            <Typography.Text strong> Profile</Typography.Text>
          </Link>
        ),
        key: "0",
      },
      {
        label: (
          <Link href="/" aria-label="account setting">
            <Typography.Text strong>Account Setting</Typography.Text>
          </Link>
        ),
        key: "1",
      },
    ];
    if (session?.user?.role?.authority === "CREATOR") {
      _menuItems.push({
        label: (
          <Link href="/dashboard" aria-label="dashboard">
            <Typography.Text strong>Dashboard</Typography.Text>
          </Link>
        ),
        key: "2",
      });
      _menuItems.push({
        label: (
          <Link href="/dashboard/posts" aria-label="posts">
            <Typography.Text strong>Posts</Typography.Text>
          </Link>
        ),
        key: "3",
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
          Sign out
        </Typography.Text>
      ),
      key: "4",
    });

    return _menuItems;
  }, [session?.user?.role?.authority, onSignOut]);

  return (
    <div className="user-nav">
      <Space size="small">
        <Dropdown
          menu={{
            items: menuItems,
          }}
          placement="bottomLeft"
          trigger={["click"]}
          className="flex w-14 items-center"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Avatar size="large" gap={4} src="/images/profile.jpeg">
              {session?.user?.profile?.username}
            </Avatar>
          </a>
        </Dropdown>
      </Space>
    </div>
  );
};

export default UserNav;
