import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Divider, Menu, Typography, type MenuProps } from "antd";
import { Typography } from "antd";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

// type MenuItem = Required<MenuProps>["items"][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: "group"
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   } as MenuItem;
// }

interface SiteNavMenuProps {
  session: Session | null;
  onCloseSiteNavMenu: () => void;
}

// const items: MenuProps["items"] = [
//   getItem("Navigation One", "sub1", null, [
//     getItem(
//       "Item 1",
//       "g1",
//       null,
//       [getItem("Option 1", "1"), getItem("Option 2", "2")],
//       "group"
//     ),
//     getItem(
//       "Item 2",
//       "g2",
//       null,
//       [getItem("Option 3", "3"), getItem("Option 4", "4")],
//       "group"
//     ),
//   ]),

//   getItem("Navigation Two", "sub2", null, [
//     getItem("Option 5", "5"),
//     getItem("Option 6", "6"),
//     getItem("Submenu", "sub3", null, [
//       getItem("Option 7", "7"),
//       getItem("Option 8", "8"),
//     ]),
//   ]),

//   getItem("Navigation Three", "sub4", null, [
//     getItem("Option 9", "9"),
//     getItem("Option 10", "10"),
//     getItem("Option 11", "11"),
//     getItem("Option 12", "12"),
//   ]),
// ];

const SiteNavMenu: React.FC<SiteNavMenuProps> = ({
  session,
  onCloseSiteNavMenu,
}) => {
  const onSignOut = useCallback(() => {
    onCloseSiteNavMenu();
    signOut({
      callbackUrl: "/",
    });
  }, [onCloseSiteNavMenu]);

  return (
    <div className="site-nav-menu site-nav-menu--mobile">
      {/* <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
      <Divider /> */}
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
              <span className="site-nav-bold-text">OhMinSeop</span>
            </Link>
          </li>
          <div className="site-nav-mobile-user-menu-columns">
            <li>
              <Link data-site-nav-element="Profile" href="/">
                Profile
              </Link>
            </li>
            <li>
              <Link data-site-nav-element="Account Setting" href="/">
                Account Setting
              </Link>
            </li>
            {session?.user?.role?.authority === "CREATOR" && (
              <>
                <li>
                  <Link data-site-nav-element="Dashboard" href="/dashboard">
                    Dashboard
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
                Sign Out
              </Typography.Text>
            </li>
          </div>
        </ul>
      ) : null}
    </div>
  );
};

export default SiteNavMenu;
