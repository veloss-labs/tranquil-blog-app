import React, { useEffect } from "react";
import PostsLayout from "~/components/dashboard/posts/PostsLayout";
import PostsHeader from "~/components/dashboard/posts/PostsHeader";
import { EditorContent } from "@tiptap/react";

import {
  AuthMode,
  getServerAuthSession,
  getServerAuthValidation,
} from "~/server/auth";

// components
import PostsContent from "~/components/dashboard/posts/PostsContent";
import Toolbar from "~/components/editor/Toolbar";

// hooks
import { FormProvider, useForm } from 'react-hook-form'
import { useTiptapEditor } from "~/components/editor/useEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from '~/libs/validation/posts'

// context
import { EditorProvider } from "~/context/editor-context";

// types
import type { GetServerSidePropsContext } from "next";

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

  const methods = useForm({
    resolver: zodResolver(schema.create)
  })

  return (
    <FormProvider {...methods}>
      <div className="mt-4">
        <PostsHeader />
        <PostsContent>
          {editor && <Toolbar editor={editor} />}
          <EditorContent editor={editor} />
        </PostsContent>
      </div>
    </FormProvider>
  );
}

Posts.getLayout = function GetLayout(page: React.ReactNode) {
  return (
    <PostsLayout>
      <EditorProvider>{page}</EditorProvider>
    </PostsLayout>
  );
};
