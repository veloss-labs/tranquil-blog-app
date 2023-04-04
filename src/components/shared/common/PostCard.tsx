import React, { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Avatar } from "antd";
import Link from "next/link";
import { Icons } from "../Icons";

interface PostCardProps {
  post: any;
}

function PostCard({ post }: PostCardProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <li className="posts-card-item">
      <Link
        href={`/posts/${post.id.toString() as string}`}
        className="text-current no-underline"
        prefetch
      >
        <div className="image-container">
          <Image
            alt="main image"
            src={post.thumbnail?.url ?? "/images/placeholder.png"}
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
          <Avatar
            size="small"
            gap={4}
            className="block"
            src={post.user?.profile?.profileUrl ?? undefined}
          >
            {post.user?.profile?.username}
          </Avatar>
          <span className="ml-2">{post.user?.profile?.username}</span>
        </div>
        <h3 className="title">{post?.title}</h3>
        <div className="action">
          <div className="action-item" role="button" aria-label="like button">
            <Icons.Heart className="mr-1 h-4 w-4" />
            <span className="font-medium text-brand-500">
              {post?.stats?.likes ?? 0}
            </span>
          </div>
          <div className="action-item">
            <Icons.EyeOpen className="mr-1 h-4 w-4" />
            <span className="font-medium text-brand-500">
              {post?.stats?.views ?? 0}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default PostCard;
