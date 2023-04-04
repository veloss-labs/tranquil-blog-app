import React from "react";
import { EditorContent } from "@tiptap/react";
import { useTiptapEditor } from "~/components/editor/useEditor";

interface PostViewerProps {
  content: string;
}

const PostViewer: React.FC<PostViewerProps> = ({ content }) => {
  const editor = useTiptapEditor({
    content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

export default PostViewer;
