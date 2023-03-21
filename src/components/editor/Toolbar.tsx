import clsx from "clsx";
import React, { useCallback, useRef } from "react";
import { Radio, Space } from "antd";


import { Icons } from "~/components/shared/Icons";
import * as Popover from "@radix-ui/react-popover";
import type { TiptapEditorInstance } from "./useEditor";
import { useEditorContext } from "~/context/editor-context";
import ColorPicker from "./ColorPicker";

interface ToolbarProps {
  editor: TiptapEditorInstance;
}

function Toolbar({ editor }: ToolbarProps) {
  const { } = useEditorContext();

  return (
    <div className="editor__toolbar">
      <button
        type="button"
        aria-label="Toggle bold"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("bold"),
        })}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icons.Bold />
      </button>
      <button
        type="button"
        aria-label="Toggle italic"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("italic"),
        })}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icons.Italic />
      </button>
      <button
        type="button"
        aria-label="Toggle underline"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("strike"),
        })}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <Icons.Strikethrough />
      </button>
      <Toolbar.Highlight editor={editor} />
      <div className="divider"></div>
      <Toolbar.Heading editor={editor} />
      <button
        type="button"
        aria-label="Toggle blockquote"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("blockquote"),
        })}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
      >
        <Icons.Quote />
      </button>
      <button
        type="button"
        aria-label="Toggle code block"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("codeBlock"),
        })}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
      >
        <Icons.Code />
      </button>
      <div className="divider"></div>
      <button
        type="button"
        aria-label="Toggle bullet list"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("bulletList"),
        })}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
      >
        <Icons.BulletList />
      </button>
      <button
        type="button"
        aria-label="Toggle ordered list"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("orderedList"),
        })}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
      >
        <Icons.OrderedList />
      </button>
      {/* <button
        type="button"
        aria-label="Toggle task list"
        className={clsx("btn-menu", {
          "is-active": editor.isActive("taskItem"),
        })}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={!editor.can().chain().focus().toggleTaskList().run()}
      >
        <Icons.Checkbox />
      </button> */}
      <div className="divider"></div>
      <button
        type="button"
        aria-label="Toggle udo"
        className={clsx("btn-menu")}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Icons.Back />
      </button>
      <button
        type="button"
        aria-label="Toggle redo"
        className={clsx("btn-menu")}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Icons.Forward />
      </button>
    </div>
  );
}

export default Toolbar;

Toolbar.Heading = function Heading({ editor }: ToolbarProps) {
  const { heading, popoverClose, popoverOpen, changeHeadingLevel } =
    useEditorContext();
  const $heading = useRef<HTMLDivElement | null>(null);

  return (
    <div className="with-popover extensions-heading" ref={$heading}>
      <Popover.Root
        open={heading.open}
        onOpenChange={(open) => {
          if (open) {
            popoverOpen({ id: "heading" });
          } else {
            popoverClose({ id: "heading" });
          }
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Toggle heading"
            className={clsx("btn-menu", {
              "is-active": editor.isActive("heading") || heading.open,
            })}
            disabled={!editor.can().chain().focus().toggleHeading({ level: 1 })}
          >
            <Icons.Heading />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="editor__popover-content w-14"
            sideOffset={5}
          >
            <Radio.Group
              name="radiogroup"
              className="w-full"
              value={heading.level.toString()}
              buttonStyle="solid"
              onChange={(e) => {
                const level = parseInt(e.target.value);
                changeHeadingLevel({ level });
                // @ts-ignore
                editor.chain().focus().toggleHeading({ level }).run();
              }}
            >
              <Space
                direction="vertical"
                size="small"
                align="center"
                className="w-full"
              >
                <Radio.Button value="1" className="!border-none">
                  H1
                </Radio.Button>
                <Radio.Button value="2" className="!border-none">
                  H2
                </Radio.Button>
                <Radio.Button value="3" className="!border-none">
                  H3
                </Radio.Button>
                <Radio.Button value="4" className="!border-none">
                  H4
                </Radio.Button>
                <Radio.Button value="5" className="!border-none">
                  H5
                </Radio.Button>
                <Radio.Button value="6" className="!border-none">
                  H6
                </Radio.Button>
              </Space>
            </Radio.Group>
            <Popover.Arrow className="editor__popover-arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

interface HighlightProps extends ToolbarProps { }

Toolbar.Highlight = function Highlight({ editor }: HighlightProps) {
  const { highlight, popoverClose, popoverOpen, changeHighlightColor } =
    useEditorContext();
  const $highlight = useRef<HTMLDivElement | null>(null);

  const onChangeHighlightColor = useCallback(
    (color: string) => {
      changeHighlightColor({ color });
      editor.chain().focus().setHighlight({ color }).run();
    },
    [changeHighlightColor, editor]
  );

  return (
    <div className="with-popover extensions-highlight" ref={$highlight}>
      <Popover.Root
        open={highlight.open}
        onOpenChange={(open) => {
          if (open) {
            popoverOpen({ id: "highlight" });
          } else {
            popoverClose({ id: "highlight" });
          }
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="Toggle highlight"
            className={clsx("btn-menu", {
              "is-active": editor.isActive("highlight") || highlight.open,
            })}
            disabled={!editor.can().chain().focus().toggleHighlight()}
          >
            <Icons.Highlight />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="editor__popover-content" sideOffset={5}>
            <ColorPicker
              color={highlight.color}
              onChange={onChangeHighlightColor}
            />
            <Popover.Close className="editor__popover-close" aria-label="Close">
              <Icons.close />
            </Popover.Close>
            <Popover.Arrow className="editor__popover-arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};
