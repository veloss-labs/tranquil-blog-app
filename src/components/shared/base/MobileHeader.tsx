import React from "react";
import { Icons } from "~/components/shared/Icons";

interface MobileHeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = <Icons.logo className="icon--lg" />,
  headerLeft,
  headerRight,
}) => {
  return (
    <div className="header--mobile">
      {headerLeft ? (
        <div className="header-left--mobile">{headerLeft}</div>
      ) : null}
      <div className="header-title--mobile">{title}</div>
      {headerRight ? (
        <div className="header-right--mobile">{headerRight}</div>
      ) : null}
    </div>
  );
};

export default MobileHeader;
