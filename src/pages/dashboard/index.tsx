import React from 'react';
import { Breadcrumb } from 'antd';
import DashboardLayout from '~/components/dashboard/DashboardLayout';
import { getServerAuthSession } from '~/server/auth';

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Dashboard() {
  return <div className="mt-4">Home</div>;
}

Dashboard.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <DashboardLayout
      pageHeader={
        <div className="pt-7 px-5 sm:px-10">
          <Breadcrumb>
            <Breadcrumb.Item>홈</Breadcrumb.Item>
            <Breadcrumb.Item>대시보드</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      }
    >
      {page}
    </DashboardLayout>
  );
};
