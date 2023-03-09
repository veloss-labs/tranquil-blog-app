/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from "react";

type Props = Readonly<{
  "data-test-id"?: string;
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

export default function FileInput({
  accept,
  label,
  onChange,
  "data-test-id": dataTestId,
}: Props): JSX.Element {
  return (
    <>
      <div className="Input__wrapper">
        <label className="Input__label">{label}</label>
        <input
          type="file"
          accept={accept}
          className="Input__input"
          onChange={(e) => onChange(e.target.files)}
          data-test-id={dataTestId}
        />
      </div>
      <style jsx>{`
        .Input__wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
        }
        .Input__label {
          display: flex;
          flex: 1;
          color: #666;
        }
        .Input__input {
          display: flex;
          flex: 2;
          border: 1px solid #999;
          padding-top: 7px;
          padding-bottom: 7px;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 16px;
          border-radius: 5px;
          min-width: 0;
        }
      `}</style>
    </>
  );
}
