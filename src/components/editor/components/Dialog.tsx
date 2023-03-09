/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "./Dialog.css";

import React from "react";

type Props = Readonly<{
  "data-test-id"?: string;
  children: React.ReactNode;
}>;

export function DialogButtonsList({ children }: Props): JSX.Element {
  return (
    <>
      <div className="DialogButtonsList">{children}</div>
      <style jsx>{`
        .DialogActions {
          display: flex;
          flex-direction: row;
          justify-content: right;
          margin-top: 20px;
        }

        .DialogButtonsList {
          display: flex;
          flex-direction: column;
          justify-content: right;
          margin-top: 20px;
        }

        .DialogButtonsList button {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}

export function DialogActions({
  "data-test-id": dataTestId,
  children,
}: Props): JSX.Element {
  return (
    <>
      <div className="DialogActions" data-test-id={dataTestId}>
        {children}
      </div>
      <style jsx>{`
        .DialogActions {
          display: flex;
          flex-direction: row;
          justify-content: right;
          margin-top: 20px;
        }

        .DialogButtonsList {
          display: flex;
          flex-direction: column;
          justify-content: right;
          margin-top: 20px;
        }

        .DialogButtonsList button {
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
