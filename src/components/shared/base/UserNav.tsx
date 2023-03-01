import { Button } from "antd";
import React from "react";

interface UserNavProps {}

const UserNav: React.FC<UserNavProps> = () => {
  return (
    <div className="user-nav">
      <Button className="btn-write--user">새 글 작성</Button>
      UserNav
    </div>
  );
};

export default UserNav;
