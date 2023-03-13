import React from "react";
import PostsEditorHead from "./PostsEditorHead";

const PostsContent = () => {
  return (
    <div className="dashboard-posts--content">
      <div className="dashboard-posts--content-wrapper">
        <div className="dashboard-posts--content-editor">
          <PostsEditorHead />
          <div className="px-4 py-4">PostsContent</div>
        </div>
      </div>
    </div>
  );
};

export default PostsContent;
