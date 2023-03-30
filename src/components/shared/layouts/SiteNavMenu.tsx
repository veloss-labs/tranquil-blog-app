import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Typography } from "antd";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";

import type { Session } from "next-auth";

interface SiteNavMenuProps {
  session: Session | null;
  onCloseSiteNavMenu: () => void;
}

const SiteNavMenu: React.FC<SiteNavMenuProps> = ({
  session,
  onCloseSiteNavMenu,
}) => {
  const { t } = useTranslation();

  const onSignOut = useCallback(() => {
    onCloseSiteNavMenu();
    signOut({
      callbackUrl: "/",
    });
  }, [onCloseSiteNavMenu]);

  return (
    <div className="site-nav-menu site-nav-menu--mobile">
      {session ? (
        <ul className="site-nav-mobile-user-menu m-0">
          <li>
            <Link
              href="/"
              className="site-nav-bold-text site-nav-mobile-avatar"
            >
              <Image
                src="/images/profile.jpeg"
                width={40}
                height={40}
                alt="profile"
              />
              <span className="site-nav-bold-text">
                {session?.user?.profile.username}
              </span>
            </Link>
          </li>
          <div className="site-nav-mobile-user-menu-columns">
            <li>
              <Link data-site-nav-element="Profile" href="/">
                {t("shared.profile")}
              </Link>
            </li>
            <li>
              <Link data-site-nav-element="Account Setting" href="/">
                {t("shared.account_settings")}
              </Link>
            </li>
            {session?.user?.role?.authority === "CREATOR" && (
              <>
                <li>
                  <Link data-site-nav-element="Dashboard" href="/dashboard">
                    {t("shared.dashboard")}
                  </Link>
                </li>
              </>
            )}
          </div>
          <hr className="mt-6 block h-[1px] border-[0] bg-slate-300" />
          <div className="site-nav-mobile-footer">
            <li className="site-nav-bold-text">
              <Typography.Text
                className="cursor-pointer font-bold text-slate-500"
                role="button"
                aria-label="sign out"
                onClick={onSignOut}
              >
                {t("shared.sign_out")}
              </Typography.Text>
            </li>
          </div>
        </ul>
      ) : null}
    </div>
  );
};

export default SiteNavMenu;
