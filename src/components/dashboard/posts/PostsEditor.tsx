import React, { useEffect, useMemo, useRef } from "react";
import isEqual from "lodash-es/isEqual";

// nextjs
import dynamic from "next/dynamic";

// components
import PostsContent from "~/components/dashboard/posts/PostsContent";
import Toolbar from "~/components/editor/Toolbar";
import PostsHeader from "~/components/dashboard/posts/PostsHeader";
import { EditorContent } from "@tiptap/react";

// hooks
import { FormProvider, useForm } from "react-hook-form";
import { useTiptapEditor } from "~/components/editor/useEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type CreateData } from "~/libs/validation/posts";

// context
import { Transition, useEditorContext } from "~/context/editor-context";
import { useTranslation } from "next-i18next";
import { useDebounceFn } from "ahooks";
import { useSnapShot } from "~/libs/hooks/useSnapShot";

// api
import { api } from "~/utils/api";

// types
import type { PostDetailSchema } from "~/server/api/routers/posts";

const PostsPublishDrawer = dynamic(
  () => import("~/components/dashboard/posts/PostsPublishDrawer"),
  { ssr: false }
);

const PostsDraftViewDrawer = dynamic(
  () => import("~/components/dashboard/posts/PostsDraftViewDrawer"),
  { ssr: false }
);

interface PostsEditorProps {
  id?: number;
  data?: PostDetailSchema;
}

const PostsEditor: React.FC<PostsEditorProps> = ({ id, data }) => {
  const { t } = useTranslation();

  const isHydrated = useRef(false);

  const { changeTransition, transition, changeDraftId } = useEditorContext();

  const defaultValues: CreateData = useMemo(() => {
    return {
      title: "",
      subTitle: "",
      description: "",
      content: "",
      thumbnailId: null,
      issueDate: null,
      tags: [],
      categoryId: null,
    };
  }, []);

  const methods = useForm<CreateData>({
    resolver: zodResolver(schema.create),
    defaultValues,
  });

  const watchAll = methods.watch();

  const { setSnapShot, getSnapShot } = useSnapShot();

  const mutation_create = api.drafts.create.useMutation({
    onSettled(data) {
      if (data?.data) {
        // Set Draft ID
        changeDraftId(data.data);
      }
      changeTransition(Transition.DONE);
    },
  });

  const mutation_update = api.drafts.update.useMutation({
    onSettled(data) {
      if (data?.data) {
        // Set Draft ID
        changeDraftId(data.data);
      }
      changeTransition(Transition.DONE);
    },
  });

  const debounced_sync = useDebounceFn(
    (input: Pick<CreateData, "title" | "content">) => {
      console.log("⚡️ Syncing");

      const snapShot = getSnapShot();

      if (isEqual(snapShot, input)) {
        changeTransition(Transition.DONE);
        return;
      }

      setSnapShot(input);

      if (id) {
        mutation_update.mutate(Object.assign({}, { id }, input));
      } else {
        mutation_create.mutate(Object.assign({}, input));
      }

      console.log("💥 Synced");
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
    content: data?.content ?? "",
  });

  useEffect(() => {
    if (transition === Transition.PROCESSING) {
      debounced_sync.run({
        title: watchAll.title,
        content: watchAll.content,
      });
    }
  }, [transition, watchAll.title, watchAll.content]);

  useEffect(() => {
    if (data) {
      if (!isHydrated.current) {
        console.log("🔥 Hydrating", data);
        methods.reset({
          title: data.title ?? "",
          subTitle: data.subTitle ?? "",
          dsecription: data.description ?? "",
          content: data.content ?? "",
          thumbnailId: data.thumbnail?.id ?? null,
          issueDate: data.issueDate ? new Date(data.issueDate) : null,
          categoryId: data.category ? data.category.id : null,
          // @ts-ignore
          tags:
            data.postsTags.map((tag: any) => tag?.tag?.name).filter(Boolean) ??
            [],
        });
        isHydrated.current = true;
        return;
      }
    }
  }, [data]);

  return (
    <FormProvider {...methods}>
      <div className="mt-4">
        <PostsHeader />
        <PostsContent>
          {editor && <Toolbar editor={editor} />}
          <EditorContent editor={editor} />
        </PostsContent>
        <PostsPublishDrawer />
        <PostsDraftViewDrawer />
      </div>
    </FormProvider>
  );
};

export default PostsEditor;
