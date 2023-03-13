/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Excalidraw from "@excalidraw/excalidraw";
import * as React from "react";
import type { ReactPortal } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

export type ExcalidrawElementFragment = {
  isDeleted?: boolean;
};

type Props = {
  closeOnClickOutside?: boolean;
  /**
   * The initial set of elements to draw into the scene
   */
  initialElements: ReadonlyArray<ExcalidrawElementFragment>;
  /**
   * Controls the visibility of the modal
   */
  isShown?: boolean;
  /**
   * Completely remove Excalidraw component
   */
  onDelete: () => void;
  /**
   * Callback when the save button is clicked
   */
  onSave: (elements: ReadonlyArray<ExcalidrawElementFragment>) => void;
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({
  closeOnClickOutside = false,
  onSave,
  initialElements,
  isShown = false,
  onDelete,
}: Props): ReactPortal | null {
  const excaliDrawModelRef = useRef<HTMLDivElement | null>(null);

  const [discardModalOpen, setDiscardModalOpen] = useState(false);
  const [elements, setElements] =
    useState<ReadonlyArray<ExcalidrawElementFragment>>(initialElements);

  useEffect(() => {
    if (excaliDrawModelRef.current !== null) {
      excaliDrawModelRef.current.focus();
    }
  }, []);

  useEffect(() => {
    let modalOverlayElement: HTMLElement | null = null;

    const clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target;
      if (
        excaliDrawModelRef.current !== null &&
        !excaliDrawModelRef.current.contains(target as Node) &&
        closeOnClickOutside
      ) {
        onDelete();
      }
    };

    if (excaliDrawModelRef.current !== null) {
      modalOverlayElement = excaliDrawModelRef.current?.parentElement;
      if (modalOverlayElement !== null) {
        modalOverlayElement?.addEventListener("click", clickOutsideHandler);
      }
    }

    return () => {
      if (modalOverlayElement !== null) {
        modalOverlayElement?.removeEventListener("click", clickOutsideHandler);
      }
    };
  }, [closeOnClickOutside, onDelete]);

  useLayoutEffect(() => {
    const currentModalRef = excaliDrawModelRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDelete();
      }
    };

    if (currentModalRef !== null) {
      currentModalRef.addEventListener("keydown", onKeyDown);
    }

    return () => {
      if (currentModalRef !== null) {
        currentModalRef.removeEventListener("keydown", onKeyDown);
      }
    };
  }, [elements, onDelete]);

  const save = () => {
    if (elements.filter((el) => !el.isDeleted).length > 0) {
      onSave(elements);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
  };

  const discard = () => {
    if (elements.filter((el) => !el.isDeleted).length === 0) {
      // delete node if the scene is clear
      onDelete();
    } else {
      //Otherwise, show confirmation dialog before closing
      setDiscardModalOpen(true);
    }
  };

  function ShowDiscardDialog(): JSX.Element {
    return (
      <Modal
        title="Discard"
        onClose={() => {
          setDiscardModalOpen(false);
        }}
        closeOnClickOutside={true}
      >
        Are you sure you want to discard the changes?
        <div className="ExcalidrawModal__discardModal">
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
              onDelete();
            }}
          >
            Discard
          </Button>{" "}
          <Button
            onClick={() => {
              setDiscardModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  }

  if (isShown === false) {
    return null;
  }

  const onChange = (els: ReadonlyArray<ExcalidrawElementFragment>) => {
    setElements(els);
  };

  // This is a hacky work-around for Excalidraw + Vite.
  // In DEV, Vite pulls this in fine, in prod it doesn't. It seems
  // like a module resolution issue with ESM vs CJS?
  const _Excalidraw =
    Excalidraw.$$typeof != null ? Excalidraw : Excalidraw.default;

  return createPortal(
    <>
      <div className="ExcalidrawModal__overlay" role="dialog">
        <div
          className="ExcalidrawModal__modal"
          ref={excaliDrawModelRef}
          tabIndex={-1}
        >
          <div className="ExcalidrawModal__row">
            {discardModalOpen && <ShowDiscardDialog />}
            <_Excalidraw
              onChange={onChange}
              initialData={{
                appState: { isLoading: false },
                elements: initialElements,
              }}
            />
            <div className="ExcalidrawModal__actions">
              <button className="action-button" onClick={discard}>
                Discard
              </button>
              <button className="action-button" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .ExcalidrawModal__overlay {
          display: flex;
          align-items: center;
          position: fixed;
          flex-direction: column;
          top: 0px;
          bottom: 0px;
          left: 0px;
          right: 0px;
          flex-grow: 0px;
          flex-shrink: 1px;
          z-index: 100;
          background-color: rgba(40, 40, 40, 0.6);
        }
        .ExcalidrawModal__actions {
          text-align: end;
          position: absolute;
          right: 5px;
          top: 5px;
          z-index: 1;
        }
        .ExcalidrawModal__actions button {
          background-color: #fff;
          border-radius: 5px;
        }
        .ExcalidrawModal__row {
          position: relative;
          padding: 40px 5px 5px;
          width: 70vw;
          height: 70vh;
          border-radius: 8px;
          box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2),
            0 2px 4px 0 rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }
        .ExcalidrawModal__row > div {
          border-radius: 5px;
        }
        .ExcalidrawModal__modal {
          position: relative;
          z-index: 10;
          top: 50px;
          width: auto;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          background-color: #eee;
        }
        .ExcalidrawModal__discardModal {
          margin-top: 60px;
          text-align: center;
        }
      `}</style>
    </>,
    document.body
  );
}
