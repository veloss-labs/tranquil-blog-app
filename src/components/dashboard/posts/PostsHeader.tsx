import { Button, Space } from "antd";
import React from "react";
import { Icons } from "~/components/shared/Icons";

const PostsHeader = () => {
  return (
    <div className="dashboard-posts--header">
      <div className="dashboard-posts--header-wrapper">
        <div className="dashboard-posts--header-left"></div>
        <div className="dashboard-posts--header-right">
          <Space size="middle">
            <Button
              type="text"
              size="large"
              icon={<Icons.time className="icon--md" />}
            />
            <Button type="primary" className="!shadow-none">
              출간하기
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PostsHeader;
