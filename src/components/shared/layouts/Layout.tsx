import { Button } from "antd";
import React, { useCallback, useState } from "react";
import DesktopHeader from "~/components/shared/base/DesktopHeader";
import MobileHeader from "~/components/shared/base/MobileHeader";
import { Icons } from "../Icons";

interface LayoutProps {
  children: React.ReactNode;
  hasHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hasHeader = true }) => {
  const [open, setOpen] = useState(false);

  const onClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className="flex h-full flex-col">
      {hasHeader ? (
        <>
          <MobileHeader
            headerLeft={
              <Button
                type="text"
                icon={
                  open ? (
                    <Icons.close className="icon--md" />
                  ) : (
                    <Icons.menu className="icon--md" />
                  )
                }
                onClick={onClick}
              />
            }
          />
          <DesktopHeader />
        </>
      ) : null}
      {children}
    </div>
  );
};

export default Layout;
