import React from "react";
import classNames from "classnames";

interface PostsLayoutProps {
  children: React.ReactNode;
  pageHeader?: React.ReactNode;
}

function PostsLayout({ children, pageHeader }: PostsLayoutProps) {
  return (
    <div>
      <div className={classNames("sm:h-full sm:overflow-auto")}>
        {pageHeader}
        <section>{children}</section>
      </div>
    </div>
  );
}

export default PostsLayout;
