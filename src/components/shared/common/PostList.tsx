import React, { useMemo } from "react";
import PostCard from "./PostCard";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

interface PostListProps {}

const PostList: React.FC<PostListProps> = () => {
  const router = useRouter();

  const categoryId = useMemo(() => {
    const _categoryId = router.query.category?.toString();
    if (!_categoryId) return undefined;
    const _id = parseInt(_categoryId);
    return isNaN(_id) ? undefined : _id;
  }, [router.query.category]);

  const sorting = useMemo(() => {
    const _sorting = router.query.sorting?.toString();
    if (!_sorting) return undefined;
    return _sorting;
  }, [router.query.sorting]);

  const query = api.posts.infinity.useInfiniteQuery(
    {
      categoryId,
      sorting,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.data?.nextCursor;
      },
      // 60초에 한번
      staleTime: 60 * 1000,
    }
  );

  const list = useMemo(
    () => query.data?.pages.map((page) => page.data?.items ?? []).flat() ?? [],
    [query.data]
  );

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
