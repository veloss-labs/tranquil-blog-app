import React from "react";
import DraftsLayout from "~/components/dashboard/drafts/DraftsLayout";
import { getServerAuthSession } from "~/server/auth";

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

  // Only creator can access this page
  if (session.role.authority !== "CREATOR") {
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

export default function Drafts() {
  return <div className="mt-4">Drafts</div>;
}

Drafts.getLayout = function GetLayout(page: React.ReactNode) {
  return <DraftsLayout>{page}</DraftsLayout>;
};
