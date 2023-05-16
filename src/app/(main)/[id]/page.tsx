import Link from 'next/link';
import React from 'react';
import { getPost } from '~/server/data/getPost';
import { getDateFormat } from '~/utils/date';

interface PageProps {
  params: {
    id: string;
  };
}
// https://www.notion.so/image/https%3A%2F%2Fdeno.com%2Fblog%2Froll-your-own-javascript-runtime-pt3%2Fcover.png?table=block&id=2c88c1a5-5539-4c3c-bd0b-1e09fc0e9170&spaceId=15edf32f-6b81-450f-acaf-9ce27666032a&width=2000&userId=cac42e24-7c10-4b08-9e06-37e8e30406b3&cache=v2

export default async function Page({ params }: PageProps) {
  const pageInfo = await getPost(params);
  console.log('pageInfo', pageInfo);
  return (
    <>
      <div>
        <img
          src={
            'https://www.notion.so/image/https%3A%2F%2Fdeno.com%2Fblog%2Froll-your-own-javascript-runtime-pt3%2Fcover.png?table=block&id=2c88c1a5-5539-4c3c-bd0b-1e09fc0e9170&spaceId=15edf32f-6b81-450f-acaf-9ce27666032a&width=1450&userId=cac42e24-7c10-4b08-9e06-37e8e30406b3&cache=v2'
          }
          alt={pageInfo?.description}
          className="mx-auto max-w-screen-sm max-w-lg w-full mt-4 sm:mt-0"
        ></img>
      </div>
      <article className="max-w-screen-md px-4 pt-8 pb-16 md:pt-16 mx-auto">
        <h1 className="mt-6 text-4xl font-bold text-gray-800 sm:text-5xl font-display">
          {pageInfo?.title}
        </h1>
        <div className="mt-8 text-gray-500">
          <p className="flex gap-2 items-center">
            <time dateTime="2023-03-01T16:00:00.000Z">
              {getDateFormat(pageInfo?.createdAt)}
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
          <p>
            <a className="hover:underline" href="https://github.com/OhMinsSup">
              veloss
            </a>
          </p>
          <div className="flow-root mt-8 text-sm text-gray-400">
            <p className="-m-2 flex flex-row">
              {pageInfo?.tags?.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/?tag=${tag.slug}`}
                  className="m-2 hover:text-blue-500 hover:underline"
                >
                  {tag.name}
                </Link>
              ))}
            </p>
          </div>
        </div>
        <hr className="my-8"></hr>
        <div className="markdown-body"></div>
      </article>
    </>
  );
}
