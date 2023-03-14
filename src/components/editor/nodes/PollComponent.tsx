/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Option, Options, PollNode } from "./PollNode";
import clsx from "clsx";
import { useCollaborationContext } from "@lexical/react/LexicalCollaborationContext";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import type {
  GridSelection,
  NodeKey,
  NodeSelection,
  RangeSelection,
} from "lexical";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from "lexical";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Button from "~/components/editor/components/Button";
import { $isPollNode, createPollOption } from "./PollNode";

function getTotalVotes(options: Options): number {
  return options.reduce((totalVotes, next) => {
    return totalVotes + next.votes.length;
  }, 0);
}

function PollOptionComponent({
  option,
  index,
  options,
  totalVotes,
  withPollNode,
}: {
  index: number;
  option: Option;
  options: Options;
  totalVotes: number;
  withPollNode: (
    cb: (pollNode: PollNode) => void,
    onSelect?: () => void
  ) => void;
}): JSX.Element {
  const { clientID } = useCollaborationContext();
  const checkboxRef = useRef(null);
  const votesArray = option.votes;
  const checkedIndex = votesArray.indexOf(clientID);
  const checked = checkedIndex !== -1;
  const votes = votesArray.length;
  const text = option.text;

  return (
    <div className="PollNode__optionContainer">
      <div
        className={clsx(
          "PollNode__optionCheckboxWrapper",
          checked && "PollNode__optionCheckboxChecked"
        )}
      >
        <input
          ref={checkboxRef}
          className="PollNode__optionCheckbox"
          type="checkbox"
          onChange={(e) => {
            withPollNode((node) => {
              node.toggleVote(option, clientID);
            });
          }}
          checked={checked}
        />
      </div>
      <div className="PollNode__optionInputWrapper">
        <div
          className="PollNode__optionInputVotes"
          style={{ width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%` }}
        />
        <span className="PollNode__optionInputVotesCount">
          {votes > 0 && (votes === 1 ? "1 vote" : `${votes} votes`)}
        </span>
        <input
          className="PollNode__optionInput"
          type="text"
          value={text}
          onChange={(e) => {
            const target = e.target;
            const value = target.value;
            const selectionStart = target.selectionStart;
            const selectionEnd = target.selectionEnd;
            withPollNode(
              (node) => {
                node.setOptionText(option, value);
              },
              () => {
                target.selectionStart = selectionStart;
                target.selectionEnd = selectionEnd;
              }
            );
          }}
          placeholder={`Option ${index + 1}`}
        />
      </div>
      <button
        disabled={options.length < 3}
        className={clsx(
          "PollNode__optionDelete",
          options.length < 3 && "PollNode__optionDeleteDisabled"
        )}
        arial-label="Remove"
        onClick={() => {
          withPollNode((node) => {
            node.deleteOption(option);
          });
        }}
      />
    </div>
  );
}

export default function PollComponent({
  question,
  options,
  nodeKey,
}: {
  nodeKey: NodeKey;
  options: Options;
  question: string;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const totalVotes = useMemo(() => getTotalVotes(options), [options]);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);
  const ref = useRef(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isPollNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload;

          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  const withPollNode = (
    cb: (node: PollNode) => void,
    onUpdate?: () => void
  ): void => {
    editor.update(
      () => {
        const node = $getNodeByKey(nodeKey);
        if ($isPollNode(node)) {
          cb(node);
        }
      },
      { onUpdate }
    );
  };

  const addOption = () => {
    withPollNode((node) => {
      node.addOption(createPollOption());
    });
  };

  const isFocused = $isNodeSelection(selection) && isSelected;

  return (
    <>
      <div
        className={`PollNode__container ${isFocused ? "focused" : ""}`}
        ref={ref}
      >
        <div className="PollNode__inner">
          <h2 className="PollNode__heading">{question}</h2>
          {options.map((option, index) => {
            const key = option.uid;
            return (
              <PollOptionComponent
                key={key}
                withPollNode={withPollNode}
                option={option}
                index={index}
                options={options}
                totalVotes={totalVotes}
              />
            );
          })}
          <div className="PollNode__footer">
            <Button onClick={addOption} small={true}>
              Add Option
            </Button>
          </div>
        </div>
      </div>
      <style jsx global>
        {`
          .PollNode__container {
            border: 1px solid #eee;
            background-color: #fcfcfc;
            border-radius: 10px;
            max-width: 600px;
            min-width: 400px;
            cursor: pointer;
            user-select: none;
          }
          .PollNode__container.focused {
            outline: 2px solid rgb(60, 132, 244);
          }
          .PollNode__inner {
            margin: 15px;
            cursor: default;
          }
          .PollNode__heading {
            margin-left: 0px;
            margin-top: 0px;
            margin-right: 0px;
            margin-bottom: 15px;
            color: #444;
            text-align: center;
            font-size: 18px;
          }
          .PollNode__optionContainer {
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
            align-items: center;
          }
          .PollNode__optionInputWrapper {
            display: flex;
            flex: 10px;
            border: 1px solid rgb(61, 135, 245);
            border-radius: 5px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
          }
          .PollNode__optionInput {
            display: flex;
            flex: 1px;
            border: 0px;
            padding: 7px;
            color: rgb(61, 135, 245);
            background-color: transparent;
            font-weight: bold;
            outline: 0px;
            z-index: 0;
          }
          .PollNode__optionInput::placeholder {
            font-weight: normal;
            color: #999;
          }
          .PollNode__optionInputVotes {
            background-color: rgb(236, 243, 254);
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            transition: width 1s ease;
            z-index: 0;
          }
          .PollNode__optionInputVotesCount {
            color: rgb(61, 135, 245);
            position: absolute;
            right: 15px;
            font-size: 12px;
            top: 5px;
          }
          .PollNode__optionCheckboxWrapper {
            position: relative;
            display: flex;
            width: 22px;
            height: 22px;
            border: 1px solid #999;
            margin-right: 10px;
            border-radius: 5px;
          }
          .PollNode__optionCheckboxChecked {
            border: 1px solid rgb(61, 135, 245);
            background-color: rgb(61, 135, 245);
          }
          .PollNode__optionCheckboxChecked:after {
            content: "";
            cursor: pointer;
            border-color: #fff;
            border-style: solid;
            position: absolute;
            display: block;
            top: 4px;
            width: 5px;
            left: 8px;
            height: 9px;
            margin: 0;
            transform: rotate(45deg);
            border-width: 0 2px 2px 0;
          }
          .PollNode__optionCheckbox {
            border: 0px;
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
          .PollNode__optionDelete {
            position: relative;
            display: flex;
            width: 28px;
            height: 28px;
            margin-left: 6px;
            border: 0px;
            background-color: transparent;
            background-position: 6px 6px;
            background-repeat: no-repeat;
            z-index: 0;
            cursor: pointer;
            border-radius: 5px;
            opacity: 0.3;
          }
          .PollNode__optionDelete:before,
          .PollNode__optionDelete:after {
            position: absolute;
            display: block;
            content: "";
            background-color: #999;
            width: 2px;
            height: 15px;
            top: 6px;
            left: 13px;
          }
          .PollNode__optionDelete:before {
            transform: rotate(-45deg);
          }
          .PollNode__optionDelete:after {
            transform: rotate(45deg);
          }
          .PollNode__optionDelete:hover {
            opacity: 1;
            background-color: #eee;
          }
          .PollNode__optionDeleteDisabled {
            cursor: not-allowed;
          }
          .PollNode__optionDeleteDisabled:hover {
            opacity: 0.3;
            background-color: transparent;
          }
          .PollNode__footer {
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </>
  );
}
