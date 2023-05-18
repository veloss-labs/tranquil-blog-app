import React from 'react';

export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse py-8 border-t border-gray-200 grid sm:grid-cols-3 gap-2">
      <div className="w-56 text-gray-500">
        <p>
          <time
            className="bg-gray-100 rounded-sm text-transparent"
            dateTime="2023-05-15T14:39:00.000Z"
          >
            May 15, 2023
          </time>
        </p>
        <div className="flow-root mt-8 text-sm text-gray-400">
          <div className="-m-2 flex flex-wrap">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="m-2 bg-gray-100 rounded-sm text-transparent">tag1</a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="m-2 bg-gray-100 rounded-sm text-transparent">tag2</a>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2">
        <h3 className="text-2xl bg-gray-100 rounded-sm text-transparent">
          Title
        </h3>
        <div className="mt-4 bg-gray-100 rounded-sm text-transparent">
          Description
        </div>
      </div>
    </div>
  );
}
