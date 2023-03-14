import React from "react";
import { useSharedHistoryContext } from "~/components/editor/context/useSharedHistoryContext";
import { useSettings } from "~/components/editor/context/useSettingsContext";

const Editor = () => {
  const { historyState } = useSharedHistoryContext();
  const {} = useSettings();
  return <div>Editor</div>;
};

export default Editor;
