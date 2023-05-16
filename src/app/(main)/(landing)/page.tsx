import React from 'react';
import PostCard from '~/components/blog/PostCard';
import { getPosts } from '~/server/data/getPosts';
import { getTags } from '~/server/data/getTags';

// types
import type { CoverType, PostSchema } from '~/ts/schema';

interface PageProps {
  searchParams: Record<string, string>;
}

export default async function Page({ searchParams }: PageProps) {
  const tags = await getTags();

  const currentTag = searchParams?.tag ?? null;
  const tagId = currentTag
    ? tags.find((tag) => tag.slug === currentTag)?.id
    : null;

  const posts = await getPosts({ limit: 100, tagId });

  return (
    <div className="mt-8">
      {posts.map((item: PostSchema<CoverType>) => (
        <PostCard {...item} tagList={tags} key={item.id} />
      ))}
    </div>
  );
}
