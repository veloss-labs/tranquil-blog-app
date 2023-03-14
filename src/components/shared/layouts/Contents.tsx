import clsx from "clsx";
import React from "react";

interface ContentsProps {
  subNav?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  hasFlushed?: boolean;
  children: React.ReactNode;
}

const Contents: React.FC<ContentsProps> = ({
  subNav,
  left,
  right,
  hasFlushed,
  children,
}) => {
  return (
    <div className="container-contents">
      {subNav ? (
        <div className="container-contents--subnav container-fluid">
          {subNav}
        </div>
      ) : null}
      {left}
      <div
        className={clsx("container-contents--list", {
          flushed: hasFlushed,
        })}
      >
        <div className="main-list">
          <div className="main-list--full">{children}</div>
        </div>
      </div>
      {right}
    </div>
  );
};

export default Contents;
