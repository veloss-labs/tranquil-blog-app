import React from "react";

export default function Placeholder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <div className={className || "Placeholder__root"}>{children}</div>
      <style jsx>{`
        .Placeholder__root {
          font-size: 15px;
          color: #999;
          overflow: hidden;
          position: absolute;
          text-overflow: ellipsis;
          top: 8px;
          left: 28px;
          right: 28px;
          user-select: none;
          white-space: nowrap;
          display: inline-block;
          pointer-events: none;
        }
      `}</style>
    </>
  );
}
