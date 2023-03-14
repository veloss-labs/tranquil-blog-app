/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Klass, LexicalNode } from "lexical";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { AutocompleteNode } from "./AutocompleteNode";
import { EmojiNode } from "~/components/editor/nodes/EmojiNode";
import { EquationNode } from "~/components/editor/nodes/EquationNode";
import { ExcalidrawNode } from "~/components/editor/nodes/ExcalidrawNode";
import { ImageNode } from "~/components/editor/nodes/ImageNode";
import { KeywordNode } from "~/components/editor/nodes/KeywordNode";
import { MentionNode } from "~/components/editor/nodes/MentionNode";

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
  MentionNode,
  EmojiNode,
  ExcalidrawNode,
  EquationNode,
  AutocompleteNode,
  KeywordNode,
];

export default PlaygroundNodes;
