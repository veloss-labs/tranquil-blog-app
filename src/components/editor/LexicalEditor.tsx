import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedHistoryContext } from "./context/useSharedHistoryContext";
import { TableContext } from "./plugins/TablePlugin";
import { SharedAutocompleteContext } from "./context/useSharedAutocompleteContext";
import Editor from "./Editor";
import { useSettings } from "./context/useSettingsContext";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";


function LexicalEditor() {
  const {
    settings: { isCollab, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: undefined,
    namespace: "Playground",
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          <TableContext>
            <SharedAutocompleteContext>
              <div className="editor-shell">
                <Editor />
              </div>
            </SharedAutocompleteContext>
          </TableContext>
        </SharedHistoryContext>
      </LexicalComposer>
    </>
  );
}

export default LexicalEditor;
