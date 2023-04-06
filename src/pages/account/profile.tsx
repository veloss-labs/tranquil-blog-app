import React from "react";
import Layout from "~/components/shared/layouts/Layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerAuthSession, getServerAuthValidation } from "~/server/auth";
import ProfileLayout from "~/components/shared/layouts/ProfileLayout";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu } from "antd";
// import { useSession } from "next-auth/react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
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

const items: MenuProps["items"] = [
  getItem("Navigation One", "sub1", <MailOutlined />, [
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

  getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),
  ]),

  { type: "divider" },

  getItem("Navigation Three", "sub4", <SettingOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Option 11", "11"),
    getItem("Option 12", "12"),
  ]),

  getItem(
    "Group",
    "grp",
    null,
    [getItem("Option 13", "13"), getItem("Option 14", "14")],
    "group"
  ),
];

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const result = getServerAuthValidation(session);

  if (result.redirect) {
    return result;
  }

  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      ...message,
      session,
    },
  };
}

export default function Profile(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { data } = useSession();
  return (
    <>
      <div className="group">
        <div className="group__user-header">
          <div className="group__user-header-container">
            <h1>
              <Link href="/">
                <img className="photo" src="/images/profile.jpeg" alt="logo" />
                <span className="name">{data?.user?.profile?.username}</span>
              </Link>
              <span className="sep">/</span>
              Edit Profile
            </h1>
            <h2>Set up your Dribbble presence and hiring needs</h2>
          </div>
        </div>
      </div>
      <div className="secondary">
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </div>
      <div className="main">Main</div>
    </>
  );
}

Profile.getLayout = function GetLayout(page: React.ReactNode) {
  return <ProfileLayout>{page}</ProfileLayout>;
};
