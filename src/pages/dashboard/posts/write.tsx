import React, { useMemo } from "react";

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
import { EditorProvider } from "~/context/editor-context";

// types
import type { GetServerSidePropsContext } from "next";

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

  return {
    props: {},
  };
}

export default function Posts() {
  const defaultValues: CreateData = useMemo(() => {
    return {
      title: "",
      subTitle: "",
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

  const editor = useTiptapEditor({
    placeholder: "Write something …",
    onUpdate({ editor }) {
      methods.setValue("content", editor.getHTML());
    },
  });

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
