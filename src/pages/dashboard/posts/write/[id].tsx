import React, { useEffect, useMemo } from "react";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

// components
import PostsEditor from "~/components/dashboard/posts/PostsEditor";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";

// context
import { EditorProvider, useEditorContext } from "~/context/editor-context";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { isString } from "~/utils/assertion";
import { api } from "~/utils/api";

// types
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
      ...message,
    },
  };
}

export default function Posts() {
  const router = useRouter();

  const { changeCover, popoverOpen } = useEditorContext();

  const id = useMemo(() => {
    const _id = router.query.id?.toString();
    return _id ? (isString(_id) ? parseInt(_id, 10) : _id) : undefined;
  }, [router.query.id]);

  const query = api.posts.byId.useQuery(
    {
      id,
    },
    {
      staleTime: Infinity,
      enabled: !!id,
    }
  );

  const data = useMemo(() => {
    return query.data?.data;
  }, [query.data?.data]);

  useEffect(() => {
    if (data) {
      if (data.subTitle) {
        popoverOpen({ id: "subtitle" });
      }
      if (data.thumbnail) {
        changeCover({ id: data.thumbnail.id, url: data.thumbnail.url });
      }
    }
  }, [data]);

  return <PostsEditor id={id} data={data} />;
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  const router = useRouter();

  const id = (() => {
    const _id = router.query.id?.toString();
    return _id ? (isString(_id) ? parseInt(_id, 10) : _id) : null;
  })();

  return (
    <EditorProvider draftId={id}>
      <PostsLayout>{page}</PostsLayout>
    </EditorProvider>
  );
};
