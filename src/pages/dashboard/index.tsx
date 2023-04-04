import React from "react";
import { Breadcrumb } from "antd";
import DashboardLayout from "~/components/dashboard/DashboardLayout";
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

  return {
    props: {
      session,
    },
  };
}

export default function Dashboard() {
  return <div className="mt-4">Home</div>;
}

Dashboard.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <DashboardLayout
      pageHeader={
        <div className="px-5 pt-7 sm:px-10">
          <Breadcrumb items={[{ title: "대시보드", href: "/dashboard" }]} />
        </div>
      }
    >
      {page}
    </DashboardLayout>
  );
};
