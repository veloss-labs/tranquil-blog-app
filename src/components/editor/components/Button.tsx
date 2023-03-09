/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import classNames from "classnames";

export default function Button({
  "data-test-id": dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: {
  "data-test-id"?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element {
  return (
    <>
      <button
        disabled={disabled}
        className={classNames(
          "Button__root",
          disabled && "Button__disabled",
          small && "Button__small",
          className
        )}
        onClick={onClick}
        title={title}
        aria-label={title}
        {...(dataTestId && { "data-test-id": dataTestId })}
      >
        {children}
      </button>
      <style jsx>{`
        .Button__root {
          padding-top: 10px;
          padding-bottom: 10px;
          padding-left: 15px;
          padding-right: 15px;
          border: 0px;
          background-color: #eee;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        .Button__root:hover {
          background-color: #ddd;
        }
        .Button__small {
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 13px;
        }
        .Button__disabled {
          cursor: not-allowed;
        }
        .Button__disabled:hover {
          background-color: #eee;
        }
      `}</style>
    </>
  );
}
