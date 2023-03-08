/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback } from "react";

interface Props
  extends Readonly<{
    "data-test-id"?: string;
    label: string;
    onChange: (val: string) => void;
    placeholder?: string;
    value: string;
  }> {}

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  "data-test-id": dataTestId,
}: Props) {
  return (
    <>
      <div className="Input__wrapper">
        <label className="Input__label">{label}</label>
        <input
          type="text"
          className="Input__input"
          placeholder={placeholder}
          value={value}
          onChange={useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value);
            },
            [onChange]
          )}
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
