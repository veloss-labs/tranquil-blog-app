import React from 'react';
import PostCardSkeleton from '~/components/blog/skeleton/PostCardSkeleton';

export default function Loading() {
  return (
    <div className="mt-8">
      {Array.from({ length: 10 }).map((_, index) => (
        <PostCardSkeleton key={`PostCardSkeleton-${index}`} />
      ))}
    </div>
  );
}
