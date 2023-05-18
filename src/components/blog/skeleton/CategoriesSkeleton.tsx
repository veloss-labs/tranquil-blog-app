import React from 'react';
import CategorySkeleton from './CategorySkeleton';

export default function CategoriesSkeleton() {
  return (
    <>
      <CategorySkeleton />
      {Array.from({ length: 5 }).map((_, index) => (
        <CategorySkeleton key={`CategorySkeleton-${index}`} />
      ))}
    </>
  );
}
