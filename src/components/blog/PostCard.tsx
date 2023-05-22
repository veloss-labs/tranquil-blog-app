import React from 'react';
import Link from 'next/link';
import { getDateFormat } from '~/utils/date';

import type { PostSchema, CoverType, TagSchema } from '~/ts/schema';
import { PAGE_ENDPOINTS } from '~/constants/constants';

interface PostCardProps<C extends CoverType> extends PostSchema<C> {
  tagList: TagSchema[];
}

export default function PostCard<C extends CoverType>({
  id,
  title,
  description,
  tags,
  tagList,
  createdAt,
}: PostCardProps<C>) {
  const currentTags = (() => {
    return tags
      .map((tag) => {
        const _tag = tagList.find((item) => item.id === tag.id);
        return {
          id: tag.id,
          name: _tag?.name ?? null,
          slug: _tag?.slug ?? null,
        };
      })
      .filter((tag) => tag.name !== null);
  })();

  return (
    <div className="py-8 border-t border-gray-200 grid sm:grid-cols-3 gap-2">
      <div className="w-56 text-gray-500">
        <p>
          <time dateTime={createdAt}>{getDateFormat(createdAt)}</time>
        </p>
        <div className="flow-root mt-8 text-sm text-gray-400">
          <div className="-m-2 flex flex-wrap">
            {currentTags.map((tag) => (
              <Link
                key={tag.id}
                href={{
                  pathname: PAGE_ENDPOINTS.ROOT,
                  query: { tag: tag.slug },
                }}
                className="m-2 hover:text-blue-500 hover:underline"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link className="sm:col-span-2" href={PAGE_ENDPOINTS.ID(id)} prefetch>
        <h3 className="text-2xl text-gray-800 font-bold font-display">
          {title}
        </h3>
        <div className="mt-4 text-gray-800">{description}</div>
      </Link>
    </div>
  );
}
