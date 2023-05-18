'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import classNames from 'classnames';
import { PAGE_ENDPOINTS } from '~/constants/constants';

interface TagProps {
  name: string;
  slug: string | null;
}

export default function Tag({ name, slug }: TagProps) {
  const searchParams = useSearchParams();

  const tag = useMemo(() => {
    return searchParams?.get('tag');
  }, [searchParams]);

  return (
    <Link
      className={classNames(
        'm-2 py-1 px-2 hover:text-blue-500 hover:underline',
        {
          'bg-gray-100 rounded': tag === slug,
        },
      )}
      href={{
        pathname: PAGE_ENDPOINTS.ROOT,
        ...(slug && {
          query: { tag: slug },
        }),
      }}
    >
      {name}
    </Link>
  );
}
