import React from "react";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";
import PostsHeader from "~/components/dashboard/posts/PostsHeader";
import { EditorContent } from "@tiptap/react";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

import type { GetServerSidePropsContext } from "next";
import PostsContent from "~/components/dashboard/posts/PostsContent";
import Toolbar from "~/components/editor/Toolbar";
import { useTiptapEditor } from "~/components/editor/useEditor";
import { EditorProvider } from "~/context/editor-context";

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
  const editor = useTiptapEditor({
    placeholder: "Write something …",
  });

  return (
    <div className="mt-4">
      <PostsHeader />
      <PostsContent>
        {editor && <Toolbar editor={editor} />}
        <EditorContent editor={editor} />
      </PostsContent>
    </div>
  );
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <PostsLayout>
      <EditorProvider>{page}</EditorProvider>
    </PostsLayout>
  );
};
