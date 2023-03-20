import React, { useCallback } from "react";
import { Button, Input } from "antd";
import { Icons } from "~/components/shared/Icons";
import { useEditorContext } from "~/context/editor-context";
import PostsCoverButton from "~/components/dashboard/posts/PostsCoverButton";

const PostsEditorHead = () => {
  const {
    popoverOpen,
    popoverClose,
    title,
    subtitle,
    changeSubtitleText,
    changeTitleText,
  } = useEditorContext();

  const onAddSubtitle = useCallback(() => {
    popoverOpen({ id: "subtitle" });
  }, [popoverOpen]);

  const onCloseSubtitle = useCallback(() => {
    popoverClose({ id: "subtitle" });
    changeSubtitleText({ text: "" });
  }, [popoverClose, changeSubtitleText]);

  const onChangeSubtitle: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        changeSubtitleText({ text: e.target.value });
      },
      [changeSubtitleText]
    );

  const onChangeTitle: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (e) => {
        changeTitleText({ text: e.target.value });
      },
      [changeTitleText]
    );

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
      <div className="editor-title">
        <Input.TextArea
          value={title}
          autoSize
          placeholder="제목"
          onChange={onChangeTitle}
        />
      </div>
      {subtitle.open ? (
        <div className="editor-subtitle" aria-label="sub title">
          <Input.TextArea
            maxLength={150}
            autoSize
            value={subtitle.text}
            onChange={onChangeSubtitle}
            placeholder="Article Subtitle…"
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
