import React, { Suspense } from 'react';
import AsyncTags from '~/components/blog/AsyncTags';
import TagsSkeleton from '~/components/blog/skeleton/TagsSkeleton';

interface LayoutProps {
  children: React.JSX.Element;
}

export const runtime = 'edge';

export default async function Layout({ children }: LayoutProps) {
  return (
    <main className="max-w-screen-md px-4 pt-16 mx-auto">
      <h1 className="text-5xl font-display font-bold">Blog</h1>
      <div className="flow-root mt-8 text-sm text-gray-400">
        <div className="-m-4 flex flex-row flex-wrap">
          <Suspense fallback={<TagsSkeleton />}>
            {/* @ts-expect-error Async Server Component */}
            <AsyncTags />
          </Suspense>
        </div>
      </div>
      {children}
    </main>
  );
}
