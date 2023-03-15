import React, { useEffect, useState } from "react";
import { useSharedHistoryContext } from "~/components/editor/context/useSharedHistoryContext";
import { useSettings } from "~/components/editor/context/useSettingsContext";
import Placeholder from "~/components/editor/components/Placeholder";
import ContentEditable from "~/components/editor/components/ContentEditable";

import TableCellNodes from "./nodes/TableCellNodes";
import ActionsPlugin from "./plugins/ActionsPlugin";
import AutocompletePlugin from "./plugins/AutocompletePlugin";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "./plugins/ClickableLinkPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import CollapsiblePlugin from "./plugins/CollapsiblePlugin";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import EmojiPickerPlugin from "./plugins/EmojiPickerPlugin";
import EmojisPlugin from "./plugins/EmojisPlugin";
import EquationsPlugin from "./plugins/EquationsPlugin";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugin";
import FigmaPlugin from "./plugins/FigmaPlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import KeywordsPlugin from "./plugins/KeywordsPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "./plugins/MaxLengthPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";
import PollPlugin from "./plugins/PollPlugin";
import SpeechToTextPlugin from "./plugins/SpeechToTextPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableOfContentsPlugin from "./plugins/TableOfContentsPlugin";
import { TablePlugin as NewTablePlugin } from "./plugins/TablePlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import { isBrowser } from "~/libs/browser/dom";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";

const Editor = () => {
  const { historyState } = useSharedHistoryContext();
  const {
    settings: {
      isCollab,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
    },
  } = useSettings();

  const text = isCollab
    ? "Enter some collaborative rich text..."
    : isRichText
    ? "Enter some rich text..."
    : "Enter some plain text...";

  const placeholder = <Placeholder>{text}</Placeholder>;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const cellEditorConfig = {
    namespace: "Playground",
    nodes: [...TableCellNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        isBrowser && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };

    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      {isRichText && <ToolbarPlugin />}
      <div
        className={`editor-container ${showTreeView ? "tree-view" : ""} ${
          !isRichText ? "plain-text" : ""
        }`}
      >
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <DragDropPaste />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />
        <MentionsPlugin />
        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <SpeechToTextPlugin />
        <AutoLinkPlugin />
        {isRichText ? (
          <>
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable />
                  </div>
                </div>
              }
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <TablePlugin />
            <TableCellResizer />
            <NewTablePlugin cellEditorConfig={cellEditorConfig}>
              <AutoFocusPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="TableNode__contentEditable" />
                }
                placeholder={null}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <MentionsPlugin />
              <HistoryPlugin />
              <ImagesPlugin captionsEnabled={false} />
              <LinkPlugin />
              <ClickableLinkPlugin />
              <FloatingTextFormatToolbarPlugin />
            </NewTablePlugin>
            <ImagesPlugin />
            <LinkPlugin />
            <PollPlugin />
            <TwitterPlugin />
            <YouTubePlugin />
            <FigmaPlugin />
            <ClickableLinkPlugin />
            <HorizontalRulePlugin />
            <EquationsPlugin />
            <ExcalidrawPlugin />
            <TabFocusPlugin />
            <TabIndentationPlugin />
            <CollapsiblePlugin />
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={placeholder}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? "UTF-16" : "UTF-8"}
            maxLength={5}
          />
        )}
        {isAutocomplete && <AutocompletePlugin />}
        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        <ActionsPlugin isRichText={isRichText} />
      </div>
      <style jsx global>
        {`
          .PlaygroundEditorTheme__ltr {
            text-align: left;
          }
          .PlaygroundEditorTheme__rtl {
            text-align: right;
          }
          .PlaygroundEditorTheme__paragraph {
            margin: 0;
            position: relative;
          }
          .PlaygroundEditorTheme__quote {
            margin: 0;
            margin-left: 20px;
            margin-bottom: 10px;
            font-size: 15px;
            color: rgb(101, 103, 107);
            border-left-color: rgb(206, 208, 212);
            border-left-width: 4px;
            border-left-style: solid;
            padding-left: 16px;
          }
          .PlaygroundEditorTheme__h1 {
            font-size: 24px;
            color: rgb(5, 5, 5);
            font-weight: 400;
            margin: 0;
          }
          .PlaygroundEditorTheme__h2 {
            font-size: 15px;
            color: rgb(101, 103, 107);
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
          }
          .PlaygroundEditorTheme__h3 {
            font-size: 12px;
            margin: 0;
            text-transform: uppercase;
          }
          .PlaygroundEditorTheme__indent {
            --lexical-indent-base-value: 40px;
          }
          .PlaygroundEditorTheme__textBold {
            font-weight: bold;
          }
          .PlaygroundEditorTheme__textItalic {
            font-style: italic;
          }
          .PlaygroundEditorTheme__textUnderline {
            text-decoration: underline;
          }
          .PlaygroundEditorTheme__textStrikethrough {
            text-decoration: line-through;
          }
          .PlaygroundEditorTheme__textUnderlineStrikethrough {
            text-decoration: underline line-through;
          }
          .PlaygroundEditorTheme__textSubscript {
            font-size: 0.8em;
            vertical-align: sub !important;
          }
          .PlaygroundEditorTheme__textSuperscript {
            font-size: 0.8em;
            vertical-align: super;
          }
          .PlaygroundEditorTheme__textCode {
            background-color: rgb(240, 242, 245);
            padding: 1px 0.25rem;
            font-family: Menlo, Consolas, Monaco, monospace;
            font-size: 94%;
          }
          .PlaygroundEditorTheme__hashtag {
            background-color: rgba(88, 144, 255, 0.15);
            border-bottom: 1px solid rgba(88, 144, 255, 0.3);
          }
          .PlaygroundEditorTheme__link {
            color: rgb(33, 111, 219);
            text-decoration: none;
          }
          .PlaygroundEditorTheme__link:hover {
            text-decoration: underline;
            cursor: pointer;
          }
          .PlaygroundEditorTheme__code {
            background-color: rgb(240, 242, 245);
            font-family: Menlo, Consolas, Monaco, monospace;
            display: block;
            padding: 8px 8px 8px 52px;
            line-height: 1.53;
            font-size: 13px;
            margin: 0;
            margin-top: 8px;
            margin-bottom: 8px;
            tab-size: 2;
            /* white-space: pre; */
            overflow-x: auto;
            position: relative;
          }
          .PlaygroundEditorTheme__code:before {
            content: attr(data-gutter);
            position: absolute;
            background-color: #eee;
            left: 0;
            top: 0;
            border-right: 1px solid #ccc;
            padding: 8px;
            color: #777;
            white-space: pre-wrap;
            text-align: right;
            min-width: 25px;
          }
          .PlaygroundEditorTheme__table {
            border-collapse: collapse;
            border-spacing: 0;
            max-width: 100%;
            overflow-y: scroll;
            table-layout: fixed;
            width: calc(100% - 25px);
            margin: 30px 0;
          }
          .PlaygroundEditorTheme__tableSelected {
            outline: 2px solid rgb(60, 132, 244);
          }
          .PlaygroundEditorTheme__tableCell {
            border: 1px solid #bbb;
            min-width: 75px;
            vertical-align: top;
            text-align: start;
            padding: 6px 8px;
            position: relative;
            cursor: default;
            outline: none;
          }
          .PlaygroundEditorTheme__tableCellSortedIndicator {
            display: block;
            opacity: 0.5;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #999;
          }
          .PlaygroundEditorTheme__tableCellResizer {
            position: absolute;
            right: -4px;
            height: 100%;
            width: 8px;
            cursor: ew-resize;
            z-index: 10;
            top: 0;
          }
          .PlaygroundEditorTheme__tableCellHeader {
            background-color: #f2f3f5;
            text-align: start;
          }
          .PlaygroundEditorTheme__tableCellSelected {
            background-color: #c9dbf0;
          }
          .PlaygroundEditorTheme__tableCellPrimarySelected {
            border: 2px solid rgb(60, 132, 244);
            display: block;
            height: calc(100% - 2px);
            position: absolute;
            width: calc(100% - 2px);
            left: -1px;
            top: -1px;
            z-index: 2;
          }
          .PlaygroundEditorTheme__tableCellEditing {
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
            border-radius: 3px;
          }
          .PlaygroundEditorTheme__tableAddColumns {
            position: absolute;
            top: 0;
            width: 20px;
            background-color: #eee;
            height: 100%;
            right: 0;
            animation: table-controls 0.2s ease;
            border: 0;
            cursor: pointer;
          }
          .PlaygroundEditorTheme__tableAddColumns:after {
            background-image: url(../images/icons/plus.svg);
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            display: block;
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.4;
          }
          .PlaygroundEditorTheme__tableAddColumns:hover {
            background-color: #c9dbf0;
          }
          .PlaygroundEditorTheme__tableAddRows {
            position: absolute;
            bottom: -25px;
            width: calc(100% - 25px);
            background-color: #eee;
            height: 20px;
            left: 0;
            animation: table-controls 0.2s ease;
            border: 0;
            cursor: pointer;
          }
          .PlaygroundEditorTheme__tableAddRows:after {
            background-image: url(../images/icons/plus.svg);
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            display: block;
            content: " ";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.4;
          }
          .PlaygroundEditorTheme__tableAddRows:hover {
            background-color: #c9dbf0;
          }
          @keyframes table-controls {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          .PlaygroundEditorTheme__tableCellResizeRuler {
            display: block;
            position: absolute;
            width: 1px;
            background-color: rgb(60, 132, 244);
            height: 100%;
            top: 0;
          }
          .PlaygroundEditorTheme__tableCellActionButtonContainer {
            display: block;
            right: 5px;
            top: 6px;
            position: absolute;
            z-index: 4;
            width: 20px;
            height: 20px;
          }
          .PlaygroundEditorTheme__tableCellActionButton {
            background-color: #eee;
            display: block;
            border: 0;
            border-radius: 20px;
            width: 20px;
            height: 20px;
            color: #222;
            cursor: pointer;
          }
          .PlaygroundEditorTheme__tableCellActionButton:hover {
            background-color: #ddd;
          }
          .PlaygroundEditorTheme__characterLimit {
            display: inline;
            background-color: #ffbbbb !important;
          }
          .PlaygroundEditorTheme__ol1 {
            padding: 0;
            margin: 0;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__ol2 {
            padding: 0;
            margin: 0;
            list-style-type: upper-alpha;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__ol3 {
            padding: 0;
            margin: 0;
            list-style-type: lower-alpha;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__ol4 {
            padding: 0;
            margin: 0;
            list-style-type: upper-roman;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__ol5 {
            padding: 0;
            margin: 0;
            list-style-type: lower-roman;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__ul {
            padding: 0;
            margin: 0;
            list-style-position: inside;
          }
          .PlaygroundEditorTheme__listItem {
            margin: 0 32px;
          }
          .PlaygroundEditorTheme__listItemChecked,
          .PlaygroundEditorTheme__listItemUnchecked {
            position: relative;
            margin-left: 8px;
            margin-right: 8px;
            padding-left: 24px;
            padding-right: 24px;
            list-style-type: none;
            outline: none;
          }
          .PlaygroundEditorTheme__listItemChecked {
            text-decoration: line-through;
          }
          .PlaygroundEditorTheme__listItemUnchecked:before,
          .PlaygroundEditorTheme__listItemChecked:before {
            content: "";
            width: 16px;
            height: 16px;
            top: 2px;
            left: 0;
            cursor: pointer;
            display: block;
            background-size: cover;
            position: absolute;
          }
          .PlaygroundEditorTheme__listItemUnchecked[dir="rtl"]:before,
          .PlaygroundEditorTheme__listItemChecked[dir="rtl"]:before {
            left: auto;
            right: 0;
          }
          .PlaygroundEditorTheme__listItemUnchecked:focus:before,
          .PlaygroundEditorTheme__listItemChecked:focus:before {
            box-shadow: 0 0 0 2px #a6cdfe;
            border-radius: 2px;
          }
          .PlaygroundEditorTheme__listItemUnchecked:before {
            border: 1px solid #999;
            border-radius: 2px;
          }
          .PlaygroundEditorTheme__listItemChecked:before {
            border: 1px solid rgb(61, 135, 245);
            border-radius: 2px;
            background-color: #3d87f5;
            background-repeat: no-repeat;
          }
          .PlaygroundEditorTheme__listItemChecked:after {
            content: "";
            cursor: pointer;
            border-color: #fff;
            border-style: solid;
            position: absolute;
            display: block;
            top: 6px;
            width: 3px;
            left: 7px;
            right: 7px;
            height: 6px;
            transform: rotate(45deg);
            border-width: 0 2px 2px 0;
          }
          .PlaygroundEditorTheme__nestedListItem {
            list-style-type: none;
          }
          .PlaygroundEditorTheme__nestedListItem:before,
          .PlaygroundEditorTheme__nestedListItem:after {
            display: none;
          }
          .PlaygroundEditorTheme__tokenComment {
            color: slategray;
          }
          .PlaygroundEditorTheme__tokenPunctuation {
            color: #999;
          }
          .PlaygroundEditorTheme__tokenProperty {
            color: #905;
          }
          .PlaygroundEditorTheme__tokenSelector {
            color: #690;
          }
          .PlaygroundEditorTheme__tokenOperator {
            color: #9a6e3a;
          }
          .PlaygroundEditorTheme__tokenAttr {
            color: #07a;
          }
          .PlaygroundEditorTheme__tokenVariable {
            color: #e90;
          }
          .PlaygroundEditorTheme__tokenFunction {
            color: #dd4a68;
          }
          .PlaygroundEditorTheme__mark {
            background: rgba(255, 212, 0, 0.14);
            border-bottom: 2px solid rgba(255, 212, 0, 0.3);
            padding-bottom: 2px;
          }
          .PlaygroundEditorTheme__markOverlap {
            background: rgba(255, 212, 0, 0.3);
            border-bottom: 2px solid rgba(255, 212, 0, 0.7);
          }
          .PlaygroundEditorTheme__mark.selected {
            background: rgba(255, 212, 0, 0.5);
            border-bottom: 2px solid rgba(255, 212, 0, 1);
          }
          .PlaygroundEditorTheme__markOverlap.selected {
            background: rgba(255, 212, 0, 0.7);
            border-bottom: 2px solid rgba(255, 212, 0, 0.7);
          }
          .PlaygroundEditorTheme__embedBlock {
            user-select: none;
          }
          .PlaygroundEditorTheme__embedBlockFocus {
            outline: 2px solid rgb(60, 132, 244);
          }

          .StickyEditorTheme__paragraph {
            margin: 0;
            position: "relative";
          }
        `}
      </style>
    </>
  );
};

export default Editor;
