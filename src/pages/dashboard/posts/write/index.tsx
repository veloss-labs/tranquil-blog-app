import React, { useCallback } from "react";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
  getServerSideCookie,
} from "~/server/auth";

// components
import PostsEditor from "~/components/dashboard/posts/PostsEditor";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";

// hooks
import { useBeforeUnload } from "~/libs/hooks/useBeforeUnload";

// context
import { EditorProvider, useEditorContext } from "~/context/editor-context";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// utils
import { logger } from "~/utils/logger";
import { COOKIE_POSTS } from "~/utils/cookie";

// types
import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const result = getServerAuthValidation(session, AuthMode.CREATOR);

  if (result.redirect) {
    return result;
  }

  const cookies = getServerSideCookie(ctx);
  const draftId = cookies.get(COOKIE_POSTS.NAME);
  if (draftId) {
    cookies.set(
      COOKIE_POSTS.NAME,
      "",
      Object.assign({}, COOKIE_POSTS.OPTIONS, {
        expires: new Date(0),
      })
    );
    return {
      redirect: {
        destination: `/dashboard/posts/write/${draftId}`,
        permanent: false,
      },
    };
  }

  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  return {
    props: {
      session,
      ...message,
    },
  };
}

export default function Posts() {
  const { draftId } = useEditorContext();

  useBeforeUnload(
    useCallback(() => {
      if (draftId) {
        logger.info("pages", "🚀 [useBeforeUnload]");
        COOKIE_POSTS.set(draftId);
      }
    }, [draftId])
  );

  return <PostsEditor id={draftId ?? undefined} />;
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <EditorProvider>
      <PostsLayout>{page}</PostsLayout>
    </EditorProvider>
  );
};
