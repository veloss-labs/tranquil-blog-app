import React from 'react';
import PostCard from '~/components/blog/PostCard';
import { getPosts } from '~/server/data/getPosts';
import { getTags } from '~/server/data/getTags';

// types
import type { CoverType, PostSchema } from '~/ts/schema';
import { isEmpty } from '~/utils/assertion';

// export const runtime = 'edge';

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
  console.log(posts);

  return (
    <div className="mt-8">
      <>
        {posts.map((item: PostSchema<CoverType>) => (
          <PostCard {...item} tagList={tags} key={item.id} />
        ))}
      </>
      {/* {isEmpty(posts) ? (
        <div className="flex flex-col items-start justify-start md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
          <div className="space-x-2 pt-6 pb-8 md:space-y-5">
            <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
              404
            </h1>
          </div>
          <div className="max-w-md">
            <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
              Whoops! No results found
            </p>
            <p className="mb-8">Try using the new tags.</p>
          </div>
        </div>
      ) : (
        <>
          {posts.map((item: PostSchema<CoverType>) => (
            <PostCard {...item} tagList={tags} key={item.id} />
          ))}
        </>
      )} */}
    </div>
  );
}
