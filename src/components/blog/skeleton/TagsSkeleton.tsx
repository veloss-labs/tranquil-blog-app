import React from 'react';
import TagSkeleton from './TagSkeleton';

export default function TagsSkeleton() {
  return (
    <>
      <TagSkeleton />
      {Array.from({ length: 5 }).map((_, index) => (
        <TagSkeleton key={`TagSkeleton-${index}`} />
      ))}
    </>
  );
}
