import React from "react";
import { Divider, Menu, MenuProps } from "antd";
import Link from "next/link";
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

interface SiteNavMenuProps {}

const items: MenuProps["items"] = [
  getItem("Navigation One", "sub1", null, [
    getItem(
      "Item 1",
      "g1",
      null,
      [getItem("Option 1", "1"), getItem("Option 2", "2")],
      "group"
    ),
    getItem(
      "Item 2",
      "g2",
      null,
      [getItem("Option 3", "3"), getItem("Option 4", "4")],
      "group"
    ),
  ]),

  getItem("Navigation Two", "sub2", null, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),

  getItem("Navigation Three", "sub4", null, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),
];

const SiteNavMenu: React.FC<SiteNavMenuProps> = () => {
  return (
    <div className="site-nav-menu site-nav-menu--mobile">
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
      <Divider />
      <ul className="site-nav-mobile-user-menu">
        <li>
          <Link href="/" className="site-nav-bold-text site-nav-mobile-avatar">
            <img
              src="https://cdn.dribbble.com/users/4714321/avatars/normal/open-uri20200123-26444-dmet7r?1579773018"
              height={40}
              alt=""
            />
            <span className="site-nav-bold-text">OhMinSeop</span>
          </Link>
        </li>
        <div className="site-nav-mobile-user-menu-columns">
          <li>
            <a data-site-nav-element="Profile" href="/veloss">
              Profile
            </a>{" "}
          </li>
          <li>
            <a data-site-nav-element="Profile" href="/veloss">
              Account Setting
            </a>{" "}
          </li>
          <li>
            <a data-site-nav-element="Profile" href="/veloss">
              Dashboard
            </a>{" "}
          </li>
        </div>
        <hr className="mt-6 block h-[1px] border-[0] bg-slate-300" />
        <div className="site-nav-mobile-footer">
          <li className="site-nav-bold-text">
            <a data-site-nav-element="Profile" href="/veloss">
              Sign Out
            </a>{" "}
          </li>
        </div>
      </ul>
    </div>
  );
};

export default SiteNavMenu;
