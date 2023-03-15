/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { TableOfContentsEntry } from "@lexical/react/LexicalTableOfContents";
import type { HeadingTagType } from "@lexical/rich-text";
import type { NodeKey } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalTableOfContents from "@lexical/react/LexicalTableOfContents";
import { useEffect, useRef, useState } from "react";
import * as React from "react";

const MARGIN_ABOVE_EDITOR = 624;
const HEADING_WIDTH = 9;

function indent(tagName: HeadingTagType) {
  if (tagName === "h2") {
    return "heading2";
  } else if (tagName === "h3") {
    return "heading3";
  }
}

function isHeadingAtTheTopOfThePage(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()?.[0]?.y;
  return (
    // @ts-ignore
    elementYPosition >= MARGIN_ABOVE_EDITOR &&
    // @ts-ignore
    elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
  );
}
function isHeadingAboveViewport(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()?.[0]?.y;
  // @ts-ignore
  return elementYPosition < MARGIN_ABOVE_EDITOR;
}
function isHeadingBelowTheTopOfThePage(element: HTMLElement): boolean {
  const elementYPosition = element?.getClientRects()?.[0]?.y;
  // @ts-ignore
  return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH;
}

function TableOfContentsList({
  tableOfContents,
}: {
  tableOfContents: Array<TableOfContentsEntry>;
}): JSX.Element {
  const [selectedKey, setSelectedKey] = useState("");
  const selectedIndex = useRef(0);
  const [editor] = useLexicalComposerContext();

  function scrollToNode(key: NodeKey, currIndex: number) {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(key);
      if (domElement !== null) {
        domElement.scrollIntoView();
        setSelectedKey(key);
        selectedIndex.current = currIndex;
      }
    });
  }

  useEffect(() => {
    function scrollCallback() {
      if (
        tableOfContents.length !== 0 &&
        selectedIndex.current < tableOfContents.length - 1
      ) {
        let currentHeading = editor.getElementByKey(
          // @ts-ignore
          tableOfContents[selectedIndex.current][0]
        );
        if (currentHeading !== null) {
          if (isHeadingBelowTheTopOfThePage(currentHeading)) {
            //On natural scroll, user is scrolling up
            while (
              currentHeading !== null &&
              isHeadingBelowTheTopOfThePage(currentHeading) &&
              selectedIndex.current > 0
            ) {
              const prevHeading = editor.getElementByKey(
                // @ts-ignore
                tableOfContents[selectedIndex.current - 1][0]
              );
              if (
                prevHeading !== null &&
                (isHeadingAboveViewport(prevHeading) ||
                  isHeadingBelowTheTopOfThePage(prevHeading))
              ) {
                selectedIndex.current--;
              }
              currentHeading = prevHeading;
            }
            // @ts-ignore
            const prevHeadingKey = tableOfContents[selectedIndex.current][0];
            setSelectedKey(prevHeadingKey);
          } else if (isHeadingAboveViewport(currentHeading)) {
            //On natural scroll, user is scrolling down
            while (
              currentHeading !== null &&
              isHeadingAboveViewport(currentHeading) &&
              selectedIndex.current < tableOfContents.length - 1
            ) {
              const nextHeading = editor.getElementByKey(
                // @ts-ignore
                tableOfContents[selectedIndex.current + 1][0]
              );
              if (
                nextHeading !== null &&
                (isHeadingAtTheTopOfThePage(nextHeading) ||
                  isHeadingAboveViewport(nextHeading))
              ) {
                selectedIndex.current++;
              }
              currentHeading = nextHeading;
            }
            // @ts-ignore
            const nextHeadingKey = tableOfContents[selectedIndex.current][0];
            setSelectedKey(nextHeadingKey);
          }
        }
      } else {
        selectedIndex.current = 0;
      }
    }
    let timerId: ReturnType<typeof setTimeout>;

    function debounceFunction(func: () => void, delay: number) {
      clearTimeout(timerId);
      timerId = setTimeout(func, delay);
    }

    function onScroll(): void {
      debounceFunction(scrollCallback, 10);
    }

    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [tableOfContents, editor]);

  return (
    <div className="table-of-contents">
      <ul className="headings">
        {tableOfContents.map(([key, text, tag], index) => {
          if (index === 0) {
            return (
              <div className="normal-heading-wrapper" key={key}>
                <div
                  className="first-heading"
                  onClick={() => scrollToNode(key, index)}
                  role="button"
                  tabIndex={0}
                >
                  {("" + text).length > 20
                    ? text.substring(0, 20) + "..."
                    : text}
                </div>
                <br />
              </div>
            );
          } else {
            return (
              <div
                className={`normal-heading-wrapper ${
                  selectedKey === key ? "selected-heading-wrapper" : ""
                }`}
                key={key}
              >
                <div
                  onClick={() => scrollToNode(key, index)}
                  role="button"
                  className={indent(tag)}
                  tabIndex={0}
                >
                  <li
                    className={`normal-heading ${
                      selectedKey === key ? "selected-heading" : ""
                    }
                    `}
                  >
                    {("" + text).length > 27
                      ? text.substring(0, 27) + "..."
                      : text}
                  </li>
                </div>
              </div>
            );
          }
        })}
      </ul>
    </div>
  );
}

export default function TableOfContentsPlugin() {
  return (
    <>
      <LexicalTableOfContents>
        {(tableOfContents) => {
          return <TableOfContentsList tableOfContents={tableOfContents} />;
        }}
      </LexicalTableOfContents>
      <style jsx>{`
        .table-of-contents .heading2 {
          margin-left: 10px;
        }

        .table-of-contents .heading3 {
          margin-left: 20px;
        }

        .selected-heading {
          color: #3578e5;
          position: relative;
        }

        .selected-heading-wrapper::before {
          content: " ";
          position: absolute;
          display: inline-block;
          left: -30px;
          top: 4px;
          z-index: 10;
          height: 4px;
          width: 4px;
          background-color: #3578e5;
          border: solid 4px white;
          border-radius: 50%;
        }

        .normal-heading {
          cursor: pointer;
          line-height: 20px;
          font-size: 16px;
        }

        .table-of-contents {
          color: #65676b;
          position: fixed;
          top: 200px;
          right: -35px;
          padding: 10px;
          width: 250px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          z-index: 1;
          height: 300px;
        }

        .first-heading {
          color: black;
          font-weight: bold;
          cursor: pointer;
        }

        .headings {
          list-style: none;
          margin-top: 0;
          margin-left: 10px;
          padding: 0;
          overflow: scroll;
          width: 200px;
          height: 220px;
          overflow-x: hidden;
          overflow-y: auto;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .headings::-webkit-scrollbar {
          display: none;
        }

        .headings::before {
          content: " ";
          position: absolute;
          height: 220px;
          width: 4px;
          right: 240px;
          margin-top: 5px;
          background-color: #ccd0d5;
          border-radius: 2px;
        }

        .normal-heading-wrapper {
          margin-left: 32px;
          position: relative;
        }
      `}</style>
    </>
  );
}
