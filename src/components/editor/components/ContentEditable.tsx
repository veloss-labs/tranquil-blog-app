/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import React from "react";

export default function LexicalContentEditable({
  className,
}: {
  className?: string;
}): JSX.Element {
  return (
    <>
      <ContentEditable className={className || "ContentEditable__root"} />;
      <style jsx>{`
        .ContentEditable__root {
          border: 0;
          font-size: 15px;
          display: block;
          position: relative;
          tab-size: 1;
          outline: 0;
          padding: 8px 28px;
          min-height: calc(100% - 16px);
        }
        @media (max-width: 1025px) {
          .ContentEditable__root {
            padding: 8px;
          }
        }
      `}</style>
    </>
  );
}
