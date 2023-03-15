import React from "react";
import PostsEditorHead from "./PostsEditorHead";

interface PostsContentProps {
  children: React.ReactNode;
}

const PostsContent: React.FC<PostsContentProps> = ({ children }) => {
  return (
    <div className="dashboard-posts--content">
      <div className="dashboard-posts--content-wrapper">
        <div className="dashboard-posts--content-editor">
          <PostsEditorHead />
          <div className="px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default PostsContent;
