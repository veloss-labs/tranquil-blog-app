import React from "react";
import Layout from "~/components/shared/layouts/Layout";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerAuthSession, getServerAuthValidation } from "~/server/auth";
// import { useSession } from "next-auth/react";

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
  return <div>AccountProfile</div>;
}

Profile.getLayout = function GetLayout(page: React.ReactNode) {
  return <Layout>{page}</Layout>;
};
