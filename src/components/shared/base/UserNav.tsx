import React from "react";
import { Dropdown, Space, Avatar, Button } from "antd";

import type { MenuProps } from "antd";
import type { Session } from "next-auth";

interface UserNavProps {
  session: Session;
}

const items: MenuProps["items"] = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: "0",
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: "3rd menu item",
    key: "3",
  },
];

const menuProps = {
  items,
  onClick: () => {
    console.log("click");
  },
};

const UserNav: React.FC<UserNavProps> = ({ session }) => {
  return (
    <div className="user-nav">
      <Space size="small">
        <Dropdown
          menu={menuProps}
          placement="bottom"
          trigger={["click"]}
          className="flex w-14 items-center"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Avatar size="large" gap={4} src="/images/profile.jpeg">
              {session?.user?.name}
            </Avatar>
          </a>
        </Dropdown>
        <Button
          type="primary"
          className="btn-write--user !shadow-none"
          size="middle"
        >
          새 글 작성
        </Button>
      </Space>
    </div>
  );
};

export default UserNav;
