import React from 'react';
import PostCard from './PostCard';
import type { CoverType, PostSchema } from '~/ts/schema';
import { getTags } from '~/server/data/getTags';
import { getPosts } from '~/server/data/getPosts';

interface PostCardsProps {
  tag?: string;
}

export default async function PostCards({ tag }: PostCardsProps) {
  const tags = await getTags();

  const tagId = tag ? tags.find((item) => item.slug === tag)?.id : null;

  const posts = await getPosts({ limit: 100, tagId });

  return (
    <>
      {posts.map((item: PostSchema<CoverType>) => (
        <PostCard {...item} tagList={tags} key={item.id} />
      ))}
    </>
  );
}
