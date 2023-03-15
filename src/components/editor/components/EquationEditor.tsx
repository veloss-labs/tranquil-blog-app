/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { forwardRef } from "react";

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
};

function EquationEditor(
  { equation, setEquation, inline }: BaseEquationEditorProps,
  forwardedRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>
): JSX.Element {
  const onChange = (event: React.ChangeEvent) => {
    setEquation((event.target as HTMLInputElement).value);
  };

  return (
    <>
      {inline && forwardedRef instanceof HTMLInputElement ? (
        <span className="EquationEditor_inputBackground">
          <span className="EquationEditor_dollarSign">$</span>
          <input
            className="EquationEditor_inlineEditor"
            value={equation}
            onChange={onChange}
            autoFocus={true}
            ref={forwardedRef as React.RefObject<HTMLInputElement>}
          />
          <span className="EquationEditor_dollarSign">$</span>
        </span>
      ) : (
        <div className="EquationEditor_inputBackground">
          <span className="EquationEditor_dollarSign">{"$$\n"}</span>
          <textarea
            className="EquationEditor_blockEditor"
            value={equation}
            onChange={onChange}
            ref={forwardedRef as React.RefObject<HTMLTextAreaElement>}
          />
          <span className="EquationEditor_dollarSign">{"\n$$"}</span>
        </div>
      )}
      <style jsx>{`
        .EquationEditor_inlineEditor {
          padding: 0;
          margin: 0;
          border: 0;
          outline: 0;
          color: #8421a2;
          background-color: inherit;
          resize: none;
        }

        .EquationEditor_blockEditor {
          padding: 0;
          margin: 0;
          border: 0;
          outline: 0;
          color: #8421a2;
          background-color: inherit;
          resize: none;
          width: 100%;
        }

        .EquationEditor_inputBackground {
          background-color: #eee;
        }

        .EquationEditor_dollarSign {
          text-align: left;
          color: #b0b0b0;
        }
      `}</style>
    </>
  );
}

export default forwardRef(EquationEditor);
