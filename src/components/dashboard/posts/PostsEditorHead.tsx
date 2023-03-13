import React from "react";
import { Button, Input } from "antd";
import { Icons } from "~/components/shared/Icons";

const PostsEditorHead = () => {
  return (
    <>
      <div className="editor-header">
        <div>
          <Button
            type="text"
            size="small"
            className="!inline-flex !items-center space-x-2"
            icon={<Icons.media className="icon--sm" />}
          >
            Add Cover
          </Button>
          <Button
            type="text"
            size="small"
            className="!inline-flex !items-center space-x-2"
            icon={<Icons.subTitle className="icon--sm" />}
          >
            Add Subtitle
          </Button>
        </div>
      </div>
      <div className="editor-title">
        <Input.TextArea autoSize placeholder="제목" />
      </div>
    </>
  );
};

export default PostsEditorHead;
