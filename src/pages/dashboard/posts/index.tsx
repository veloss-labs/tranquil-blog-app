import React from "react";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";
import PostsHeader from "~/components/dashboard/posts/PostsHeader";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

import type { GetServerSidePropsContext } from "next";
import PostsContent from "~/components/dashboard/posts/PostsContent";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const result = getServerAuthValidation(session, AuthMode.CREATOR);

  if (result.redirect) {
    return result;
  }

  return {
    props: {},
  };
}

export default function Drafts() {
  return (
    <div className="mt-4">
      <PostsHeader />
      <PostsContent />
    </div>
  );
}

Drafts.getLayout = function GetLayout(page: React.ReactNode) {
  return <PostsLayout>{page}</PostsLayout>;
};
