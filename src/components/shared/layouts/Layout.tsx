import React from "react";
import MobileHeader from "~/components/shared/base/MobileHeader";

interface LayoutProps {
  children: React.ReactNode;
  hasHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hasHeader = true }) => {
  return (
    <div className="flex h-full flex-col">
      {hasHeader ? (
        <>
          <MobileHeader />
        </>
      ) : null}
      {children}
    </div>
  );
};

export default Layout;
