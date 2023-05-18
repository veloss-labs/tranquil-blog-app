import React, { Suspense } from 'react';
import Markdown from '~/components/blog/Markdown';
import PageContent from '~/components/blog/PageContent';
import MarkdownSkeleton from '~/components/blog/skeleton/MarkdownSkeleton';
import { getPost } from '~/server/data/getPost';
import { UnionPostSchema } from '~/ts/schema';

interface PageProps {
  params: {
    id: string;
  };
}

export const runtime = 'edge';

export default async function Page({ params }: PageProps) {
  const data = (await getPost(params)) as Awaited<UnionPostSchema>;
  return (
    <PageContent
      item={data}
      markdown={
        <Suspense fallback={<MarkdownSkeleton />}>
          {/* @ts-expect-error Async Server Component */}
          <Markdown pageId={params.id} />
        </Suspense>
      }
    />
  );
}
