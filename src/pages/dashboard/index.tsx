import React from "react";
import { Breadcrumb } from "antd";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const result = getServerAuthValidation(session, AuthMode.CREATOR);

  if (result.redirect) {
    return result;
  }

  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      session,
      ...message,
    },
  };
}

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout
      pageHeader={
        <div className="px-5 pt-7 sm:px-10">
          <Breadcrumb
            items={[
              { title: t("dashboard.common.dashboard"), href: "/dashboard" },
            ]}
          />
        </div>
      }
    >
      <div className="mt-4">Home</div>
    </DashboardLayout>
  );
}
