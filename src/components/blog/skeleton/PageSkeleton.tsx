import React from 'react';
import MarkdownSkeleton from './MarkdownSkeleton';

export default function PageSkeleton() {
  return (
    <>
      <div>
        {/* Skeleton Image */}
        <div className="mx-auto max-w-screen-sm w-full bg-gray-100 rounded text-transparent mt-4 sm:mt-0">
          <div className=" h-[335px]"></div>
        </div>
      </div>
      <article className="animate-pulse max-w-screen-md px-4 pt-8 pb-16 md:pt-16 mx-auto">
        <h1 className="mt-6 text-4xl font-bold text-gray-800 sm:text-5xl font-display bg-gray-100 rounded text-transparent">
          Netlify Edge Functions on Deno
        </h1>
        <div className="mt-8 text-gray-500">
          <p className="flex gap-2 items-center">
            <time
              className="bg-gray-100 rounded text-transparent"
              dateTime="2023-05-15T14:39:00.000Z"
            >
              May 15, 2023
            </time>
            <a href="/feed" className="hover:text-gray-700" title="Atom Feed">
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"></path>
                <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1zM3 15a2 2 0 114 0 2 2 0 01-4 0z"></path>
              </svg>
            </a>
          </p>
          <div className="flow-root mt-8 text-sm text-gray-400">
            <p className="-m-2 flex flex-row">
              {Array.from({ length: 3 }).map((_, i) => (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a
                  key={`tag-${i}`}
                  className="m-2 bg-gray-100 rounded text-transparent"
                >
                  {`tag-${i}`}
                </a>
              ))}
            </p>
          </div>
        </div>
        <hr className="my-8" />
        <MarkdownSkeleton />
      </article>
    </>
  );
}
