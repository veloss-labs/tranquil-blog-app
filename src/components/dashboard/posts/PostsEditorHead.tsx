import React, { useCallback } from "react";
import { Button, Input } from "antd";
import { Icons } from "~/components/shared/Icons";
import { useEditorContext } from "~/context/editor-context";
import PostsCoverButton from "~/components/dashboard/posts/PostsCoverButton";
import { useController, useFormContext } from "react-hook-form";
import type { CreateData } from "~/libs/validation/posts";

const PostsEditorHead = () => {
  const { popoverOpen, popoverClose, cover, subtitle, changeCover } =
    useEditorContext();

  const { control, setValue } = useFormContext<CreateData>();

  const control_title = useController({
    control,
    name: "title",
  });

  const control_subtitle = useController({
    control,
    name: "subTitle",
  });

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
              Add Subtitle
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
        <Input.TextArea autoSize placeholder="제목" {...control_title.field} />
      </div>
      {subtitle.open ? (
        <div className="editor-subtitle" aria-label="sub title">
          <Input.TextArea
            maxLength={150}
            autoSize
            placeholder="Article Subtitle…"
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
