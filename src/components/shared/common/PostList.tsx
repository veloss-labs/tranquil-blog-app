import React from "react";
import PostCard from "./PostCard";

interface PostListProps {}

const PostList: React.FC<PostListProps> = () => {
  return (
    <>
      <ol className="posts-card-list container-fluid relative">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </ol>
      ;
    </>
  );
};

export default PostList;
