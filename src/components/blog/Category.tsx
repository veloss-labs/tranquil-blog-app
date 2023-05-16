'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import classNames from 'classnames';

interface CategoryProps {
  name: string;
  slug: string | null;
  to: string;
}

export default function Category({ name, slug, to }: CategoryProps) {
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
      href={to}
    >
      {name}
    </Link>
  );
}
