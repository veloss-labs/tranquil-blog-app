import React, { useEffect, useMemo } from "react";

// nextjs
import dynamic from "next/dynamic";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

// components
import PostsContent from "~/components/dashboard/posts/PostsContent";
import Toolbar from "~/components/editor/Toolbar";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";
import PostsHeader from "~/components/dashboard/posts/PostsHeader";
import { EditorContent } from "@tiptap/react";

// hooks
import { FormProvider, useForm } from "react-hook-form";
import { useTiptapEditor } from "~/components/editor/useEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type CreateData } from "~/libs/validation/posts";

// context
import {
  EditorProvider,
  Transition,
  useEditorContext,
} from "~/context/editor-context";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// types
import type { GetServerSidePropsContext } from "next";
import { useDebounceFn } from "ahooks";

const PostsPublishDrawer = dynamic(
  () => import("~/components/dashboard/posts/PostsPublishDrawer"),
  { ssr: false }
);

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
  const { t } = useTranslation();
  const { changeTransition, transition } = useEditorContext();
  const defaultValues: CreateData = useMemo(() => {
    return {
      title: "",
      subTitle: "",
      description: "",
      content: "",
      thumbnailId: null,
      issueDate: null,
      published: false,
      tags: [],
      categoryId: null,
    };
  }, []);

  const methods = useForm<CreateData>({
    resolver: zodResolver(schema.create),
    defaultValues,
  });

  const watchAll = methods.watch();

  const debounced_sync = useDebounceFn(
    async (input: Pick<CreateData, "title" | "content">) => {
      console.log("Syncing...", input);
      changeTransition(Transition.DONE);
    },
    {
      wait: 500,
      trailing: true,
    }
  );

  const debounced_content = useDebounceFn(
    // @ts-ignore
    (editor) => {
      changeTransition(Transition.PROCESSING);
      methods.setValue("content", editor.getHTML());
    },
    {
      wait: 200,
      trailing: true,
    }
  );

  const editor = useTiptapEditor({
    placeholder: t("dashboard.posts.write.placeholder"),
    onUpdate({ editor }) {
      debounced_content.run(editor);
    },
  });

  useEffect(() => {
    if (transition === Transition.PROCESSING) {
      debounced_sync.run({
        title: watchAll.title,
        content: watchAll.content,
      });
    }
  }, [transition, watchAll.title, watchAll.content]);

  return (
    <FormProvider {...methods}>
      <div className="mt-4">
        <PostsHeader />
        <PostsContent>
          {editor && <Toolbar editor={editor} />}
          <EditorContent editor={editor} />
        </PostsContent>
        <PostsPublishDrawer />
      </div>
    </FormProvider>
  );
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <EditorProvider>
      <PostsLayout>{page}</PostsLayout>
    </EditorProvider>
  );
};
