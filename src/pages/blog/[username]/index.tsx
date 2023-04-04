import React from "react";
import Layout from "~/components/shared/layouts/Layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      ...message,
    },
  };
}

export default function User(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <div>UserName</div>;
}

User.getLayout = function GetLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
