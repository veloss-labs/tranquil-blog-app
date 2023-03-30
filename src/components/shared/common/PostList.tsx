import React, { useMemo } from "react";
import PostCard from "./PostCard";
import { api } from "~/utils/api";

interface PostListProps {}

const PostList: React.FC<PostListProps> = () => {
  const query = api.posts.infinity.useInfiniteQuery(
    {},
    {
      getNextPageParam(lastPage) {
        return lastPage.data?.nextCursor;
      },
      staleTime: Infinity,
    }
  );

  const list = useMemo(
    () => query.data?.pages.map((page) => page.data?.items ?? []).flat() ?? [],
    [query.data]
  );

  const loading = query.isFetching || query.isLoading;

  return (
    <>
      <ol className="posts-card-list container-fluid relative">
        {list.map((post) => (
          <PostCard key={`main-post-${post.id}`} post={post} />
        ))}
      </ol>
    </>
  );
};

export default PostList;
