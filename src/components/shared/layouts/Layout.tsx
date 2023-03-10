import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "antd";
import DesktopHeader from "~/components/shared/base/DesktopHeader";
import MobileHeader from "~/components/shared/base/MobileHeader";
import { Icons } from "~/components/shared/Icons";
import SiteNavMenu from "~/components/shared/layouts/SiteNavMenu";
import { configResponsive, useResponsive } from "ahooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
  hasHeader?: boolean;
}

configResponsive({
  middle: 768,
});

const Layout: React.FC<LayoutProps> = ({ children, hasHeader = true }) => {
  const responsive = useResponsive();

  // const router = useRouter();

  const session = useSession();

  const middle = useMemo(() => {
    return responsive?.middle ?? true;
  }, [responsive]);

  const [open, setOpen] = useState(false);

  const onToggleClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onCloseSiteNavMenu = useCallback(() => {
    setOpen(false);
  }, []);

  // const onMoveToSignup = useCallback(() => {
  //   router.push("/auth/signup");
  // }, [router]);

  // 모바일에서만 사이드바 메뉴가 노출되게 설정하기 위해서
  useEffect(() => {
    if (middle) {
      setOpen(false);
      return;
    }
  }, [middle]);

  return (
    <div className="flex h-full flex-col">
      {hasHeader ? (
        <>
          <div className="site-nav">
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
                  onClick={onToggleClick}
                />
              }
              headerRight={
                session.status === "authenticated" && session.data ? null : (
                  <Button
                    type="primary"
                    className="!shadow-none"
                    role="link"
                    aria-label="회원가입"
                    data-href="/auth/signup"
                  >
                    회원가입
                  </Button>
                )
              }
            />
            {open ? (
              <SiteNavMenu
                session={session.data}
                onCloseSiteNavMenu={onCloseSiteNavMenu}
              />
            ) : null}
          </div>
          <DesktopHeader />
        </>
      ) : null}
      {children}
    </div>
  );
};

export default Layout;
