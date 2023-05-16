import React from 'react';
import PostCard from '~/components/blog/PostCard';
import { api } from '~/libs/api/server';

// types
import type { CoverType, PostSchema } from '~/ts/schema';

interface PageProps {
  searchParams: Record<string, string>;
}

export default async function Page({ searchParams }: PageProps) {
  const { tags } = await api.tags.list.fetch();

  const currentTag = searchParams?.tag ?? null;
  const tagId = currentTag
    ? tags.find((tag) => tag.slug === currentTag)?.id
    : null;

  const data = await api.posts.infinite.fetchInfinite({
    limit: 100,
    tagId,
  });

  // @ts-expect-error
  const posts = data?.pages?.flatMap((page) => page?.items) ?? [];

  return (
    <div className="mt-8">
      {posts.map((item: PostSchema<CoverType>) => (
        <PostCard {...item} tagList={tags} key={item.id} />
      ))}
    </div>
  );
}
