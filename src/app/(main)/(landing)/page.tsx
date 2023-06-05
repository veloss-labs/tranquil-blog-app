import React, { Suspense } from 'react';
import PostCards from '~/components/blog/PostCards';
import PostCardSkeleton from '~/components/blog/skeleton/PostCardSkeleton';

interface PageProps {
  searchParams: {
    tag?: string;
  };
}

export const runtime = 'edge';

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="mt-8">
      <Suspense
        fallback={
          <>
            {Array.from({ length: 10 }).map((_, index) => (
              <PostCardSkeleton key={`PostCardSkeleton-${index}`} />
            ))}
          </>
        }
      >
        <PostCards tag={searchParams?.tag} />
      </Suspense>
    </div>
  );
}
