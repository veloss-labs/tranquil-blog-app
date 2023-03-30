import React, { useCallback, useEffect } from "react";

// components
import { Button, Input } from "antd";
import { Icons } from "~/components/shared/Icons";
import PostsCoverButton from "~/components/dashboard/posts/PostsCoverButton";

// hooks
import { Transition, useEditorContext } from "~/context/editor-context";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useDebounceFn } from "ahooks";

// types
import type { CreateData } from "~/libs/validation/posts";

const PostsEditorHead = () => {
  const {
    popoverOpen,
    popoverClose,
    cover,
    subtitle,
    changeCover,
    changeTransition,
  } = useEditorContext();

  const { t } = useTranslation();

  const { control, setValue, formState, watch } = useFormContext<CreateData>();

  const watchTitle = watch("title");

  const control_title = useController({
    control,
    name: "title",
  });

  const control_subtitle = useController({
    control,
    name: "subTitle",
  });

  const debounced = useDebounceFn(
    (_: string) => {
      changeTransition(Transition.PROCESSING);
    },
    {
      wait: 200,
      trailing: true,
    }
  );

  const onAddSubtitle = useCallback(() => {
    popoverOpen({ id: "subtitle" });
  }, [popoverOpen]);

  const onCloseSubtitle = useCallback(() => {
    popoverClose({ id: "subtitle" });
    setValue("subTitle", undefined);
  }, [popoverClose]);

  const onRemoveCover = useCallback(() => {
    changeCover({ id: null, url: null });
  }, [changeCover]);

  useEffect(() => {
    if (!formState.dirtyFields.title) return;
    debounced.run(watchTitle);
  }, [watchTitle, formState.dirtyFields.title]);

  return (
    <>
      <div className="editor-header">
        <div>
          <PostsCoverButton />
          {!subtitle.open ? (
            <Button
              type="text"
              size="small"
              className="!inline-flex !items-center space-x-2"
              icon={<Icons.subTitle className="icon--sm" />}
              onClick={onAddSubtitle}
            >
              {t("dashboard.posts.write.add_subtitle")}
            </Button>
          ) : null}
        </div>
      </div>
      {cover.url ? (
        <div className="editor-cover">
          <div
            className="editor-cover__container"
            style={{
              backgroundImage: `url(${cover.url})`,
            }}
          >
            <div className="editor-cover__controls">
              <Button
                type="default"
                onClick={onRemoveCover}
                className="!inline-flex !items-center !justify-center"
                icon={<Icons.close className="icon--sm" />}
              ></Button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="editor-title">
        <Input.TextArea
          autoSize
          placeholder={t("dashboard.posts.write.title_placeholder")}
          {...control_title.field}
        />
      </div>
      {subtitle.open ? (
        <div className="editor-subtitle" aria-label="sub title">
          <Input.TextArea
            maxLength={150}
            autoSize
            placeholder={t("dashboard.posts.write.subtitle_placeholder")}
            {...control_subtitle.field}
          />
          <Button
            type="text"
            shape="circle"
            className="!absolute !top-0 !right-0"
            icon={<Icons.close />}
            onClick={onCloseSubtitle}
            size="small"
          />
        </div>
      ) : null}
    </>
  );
};

export default PostsEditorHead;
