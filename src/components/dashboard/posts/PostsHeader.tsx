import React, { useCallback } from "react";

// components
import { Button, Space } from "antd";
import { Icons } from "~/components/shared/Icons";

// hooks
import { useEditorContext } from "~/context/editor-context";
import { useRouter } from "next/router";

const PostsHeader = () => {
  const router = useRouter();
  const { popoverOpen } = useEditorContext();

  const onClick = useCallback(() => {
    popoverOpen({ id: 'publish' })
  }, [popoverOpen])

  const onBack = useCallback(() => {
    router.back();
  }, [router])

  return (
    <div className="dashboard-posts--header">
      <div className="dashboard-posts--header-wrapper">
        <div className="dashboard-posts--header-left">
          <Space size="middle">
            <Button
              type="text"
              size="large"
              onClick={onBack}
              icon={<Icons.Back className="icon--md" />}
            />
          </Space>
        </div>
        <div className="dashboard-posts--header-right">
          <Space size="middle">
            <Button
              type="text"
              size="large"
              icon={<Icons.time className="icon--md" />}
            />
            <Button type="primary" className="!shadow-none" onClick={onClick}>
              출간하기
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default PostsHeader;
