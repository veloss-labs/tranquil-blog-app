import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { SharedHistoryContext } from "./context/useSharedHistoryContext";
import { TableContext } from "./plugins/TablePlugin";
import { SharedAutocompleteContext } from "./context/useSharedAutocompleteContext";
import Editor from "./Editor";

function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={}>
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
  );
}

export default LexicalEditor;
