import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";

function PostCard() {
  const [isLoading, setLoading] = useState(true);

  return (
    <li className="posts-card-item">
      <div className="image-container">
        <Image
          alt="main image"
          src="/images/webpack.png"
          fill
          className={clsx(
            "duration-700 ease-in-out group-hover:opacity-75",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
          sizes="(max-width: 768px) 100vw,
          (max-width: 1200px) 50vw,
          33vw"
        />
      </div>
      <div className="my-info">
        <Image
          className="mr-2 block rounded-full"
          src="/images/profile.jpeg"
          alt="profile"
          width={24}
          height={24}
        />
        veloss-labs
      </div>
      <h3 className="title">
        Migrate from Webpack to Remix Migrate from Webpack to Remix
      </h3>
      <div className="action">
        <span className="text-xs">좋아요 11개</span>
        <span className="text-xs">댓글 10개</span>
        <span className="text-xs">조회수 10개</span>
      </div>
    </li>
  );
}

export default PostCard;
