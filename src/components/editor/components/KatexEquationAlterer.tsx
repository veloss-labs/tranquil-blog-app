/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useCallback, useState } from "react";

import Button from "./Button";
import KatexRenderer from "./KatexRenderer";

type Props = {
  initialEquation?: string;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  initialEquation = "",
}: Props): JSX.Element {
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);

  const onClick = useCallback(() => {
    onConfirm(equation, inline);
  }, [onConfirm, equation, inline]);

  const onCheckboxChange = useCallback(() => {
    setInline(!inline);
  }, [setInline, inline]);

  return (
    <>
      <div className="KatexEquationAlterer_defaultRow">
        Inline
        <input type="checkbox" checked={inline} onChange={onCheckboxChange} />
      </div>
      <div className="KatexEquationAlterer_defaultRow">Equation </div>
      <div className="KatexEquationAlterer_centerRow">
        {inline ? (
          <input
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="KatexEquationAlterer_textArea"
          />
        ) : (
          <textarea
            onChange={(event) => {
              setEquation(event.target.value);
            }}
            value={equation}
            className="KatexEquationAlterer_textArea"
          />
        )}
      </div>
      <div className="KatexEquationAlterer_defaultRow">Visualization </div>
      <div className="KatexEquationAlterer_centerRow">
        <KatexRenderer
          equation={equation}
          inline={false}
          onDoubleClick={() => null}
        />
      </div>
      <div className="KatexEquationAlterer_dialogActions">
        <Button onClick={onClick}>Confirm</Button>
      </div>
      <style jsx global>{`
        .KatexEquationAlterer_defaultRow {
          display: flex;
          flex-direction: row;
          margin-top: 10px;
          margin-bottom: 10px;
          justify-content: space-between;
          overflow: hidden;
        }

        .KatexEquationAlterer_dialogActions {
          display: flex;
          flex-direction: row;
          overflow: hidden;
          margin-top: 20px;
          margin-bottom: 0;
          justify-content: right;
        }

        .KatexEquationAlterer_centerRow {
          display: flex;
          flex-direction: "row";
          margin-top: 10px;
          margin-bottom: 10px;
          justify-content: center;
          overflow: hidden;
        }

        .KatexEquationAlterer_textArea {
          width: 100%;
          resize: none;
          padding: 7px;
        }
      `}</style>
    </>
  );
}
