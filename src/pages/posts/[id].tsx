import React, { useEffect, useMemo, useRef } from "react";

import Layout from "~/components/shared/layouts/Layout";
import Image from "next/image";
import PostViewer from "~/components/posts/PostViewer";
import Link from "next/link";
import { Icons } from "~/components/shared/Icons";
import { Avatar } from "antd";

// hooks
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// utils
import { getDateFormat } from "~/utils/date";

// api
import { api } from "~/utils/api";
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

export default function Posts(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const $lock_view = useRef(false);
  const $transition_lock = useRef(false);

  const { t } = useTranslation();

  const id = useMemo(() => {
    const _id = router.query.id?.toString();
    if (!_id) {
      return undefined;
    }
    const _idNum = parseInt(_id, 10);
    if (Number.isNaN(_idNum)) {
      return undefined;
    }
    return _idNum;
  }, [router.query.id]);

  const resp = api.posts.byId.useQuery({ id }, { enabled: !!id });

  const mutation_view = api.posts.view.useMutation({
    onSuccess: () => {
      $lock_view.current = true;
      $transition_lock.current = false;
    },
    onError: (error) => {
      console.log(error);
      $lock_view.current = true;
      $transition_lock.current = false;
    },
  });

  const { data } = resp.data ?? {};

  useEffect(() => {
    if (id && !$transition_lock.current) {
      $transition_lock.current = true;
      if (!$lock_view.current) {
        mutation_view.mutate({
          id,
        });
      }
    }
  }, [id]);

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <div>
        {data?.createdAt && (
          <time
            dateTime={data.createdAt.toISOString()}
            className="block text-sm text-slate-600"
          >
            {t("post.date_at", {
              date: getDateFormat(data.createdAt),
            })}
          </time>
        )}
        <h1 className="mt-2 inline-block text-4xl font-extrabold leading-tight text-slate-900 lg:text-5xl">
          {data?.title}
        </h1>
        {data?.user ? (
          <div className="mt-4 flex space-x-4">
            <Link
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              href={`/blog/${data.user.profile?.username}`}
              className="text-decoration-none flex items-center space-x-2 text-sm no-underline"
            >
              <Avatar
                size="large"
                gap={4}
                src={data.user.profile?.profileUrl ?? undefined}
              >
                {data?.user?.profile?.username}
              </Avatar>
              <div className="flex-1 text-left leading-tight">
                <p className="m-0 font-medium text-slate-900">
                  {data.user.email}
                </p>
                <p className="m-0 mt-1 text-[12px] text-slate-600">
                  @{data.user.profile?.username}
                </p>
              </div>
            </Link>
          </div>
        ) : null}
      </div>
      {data?.thumbnail ? (
        <div className="relative">
          <Image
            src={data.thumbnail.url}
            alt={data.title ?? "thumbnail"}
            className="m-0 my-4 h-auto max-w-full rounded-md border border-slate-200 bg-slate-200 transition-colors group-hover:border-slate-900"
            priority
            width={768}
            height={405}
          />
        </div>
      ) : null}
      <PostViewer content={data?.content ?? ""} />
      <hr className="my-4 border-slate-200" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link
          href="/"
          className="text-decoration-none inline-flex items-center justify-center text-sm font-medium text-slate-600 no-underline hover:text-slate-900"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          {t("post.sell_all_posts")}
        </Link>
      </div>
    </article>
  );
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <Layout>
      <div className="container-contents">
        <div className="container-contents--list flushed">{page}</div>
      </div>
    </Layout>
  );
};
