import React from 'react';

export default function MarkdownSkeleton() {
  return (
    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
      {/* Random Height Width Length Skeleton UI */}
      {Array.from({ length: 20 }).map((_, i) => (
        <p
          key={`paragraph-${i}`}
          style={{
            width: `${Math.floor(Math.random() * 100)}%`,
          }}
          className={`bg-gray-100 rounded text-transparent mb-4`}
        >
          paragraph
        </p>
      ))}
    </div>
  );
}
