import React, { useReducer, useMemo } from "react";
import { createContext } from "~/libs/react/context";
import type { Nullable } from "~/ts/common";

interface PopoverContextState {
  open: boolean;
}

interface HighlightContextState extends PopoverContextState {
  color: string;
}

interface HeadingContextState extends PopoverContextState {
  level: number;
}

interface SubtitleContextState extends PopoverContextState {
  text: string;
}

interface CoverContextState extends PopoverContextState {
  id: number | null;
  url: string | null;
  transition: Transition;
}

export enum Transition {
  IDLE = "IDLE",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
}

interface EditorContextState {
  highlight: HighlightContextState;
  heading: HeadingContextState;
  subtitle: SubtitleContextState;
  title: string;
  cover: CoverContextState;
}

enum Action {
  POPOVER_OPEN = "POPOVER_OPEN",
  POPOVER_CLOSE = "POPOVER_CLOSE",
  CHANGE_HIGHLIGHT_COLOR = "CHANGE_HIGHLIGHT_COLOR",
  CHANGE_HEADING_LEVEL = "CHANGE_HEADING_LEVEL",
  CHNAGE_SUBTITLE_TEXT = "CHNAGE_SUBTITLE_TEXT",
  CHANGE_TITLE_TEXT = "CHANGE_TITLE_TEXT",
  CHANGE_COVER = "CHANGE_COVER",
  TRANSITION_COVER = "TRANSITION_COVER",
}

type PopoverOpenAction = {
  type: Action.POPOVER_OPEN;
  payload: {
    id: keyof Omit<EditorContextState, "title">;
  };
};

type PopoverCloseAction = {
  type: Action.POPOVER_CLOSE;
  payload: {
    id: keyof Omit<EditorContextState, "title">;
  };
};

type ChangeHighlightColorAction = {
  type: Action.CHANGE_HIGHLIGHT_COLOR;
  payload: {
    color: string;
  };
};

type ChangeHeadingLevelAction = {
  type: Action.CHANGE_HEADING_LEVEL;
  payload: {
    level: number;
  };
};

type ChangeSubtitleTextAction = {
  type: Action.CHNAGE_SUBTITLE_TEXT;
  payload: {
    text: string;
  };
};

type ChangeTitleTextAction = {
  type: Action.CHANGE_TITLE_TEXT;
  payload: {
    text: string;
  };
};

type ChangeCoverAction = {
  type: Action.CHANGE_COVER;
  payload: {
    id: Nullable<number>;
    url: Nullable<string>;
  };
};

type ChangeCoverTransitionAction = {
  type: Action.TRANSITION_COVER;
  payload: {
    transition: Transition;
  };
};

type ActionType =
  | PopoverOpenAction
  | PopoverCloseAction
  | ChangeHighlightColorAction
  | ChangeHeadingLevelAction
  | ChangeSubtitleTextAction
  | ChangeTitleTextAction
  | ChangeCoverAction
  | ChangeCoverTransitionAction;

interface EditorContext extends EditorContextState {
  popoverOpen: (payload: PopoverOpenAction["payload"]) => void;
  popoverClose: (payload: PopoverCloseAction["payload"]) => void;
  changeHighlightColor: (
    payload: ChangeHighlightColorAction["payload"]
  ) => void;
  changeHeadingLevel: (payload: ChangeHeadingLevelAction["payload"]) => void;
  changeSubtitleText: (payload: ChangeSubtitleTextAction["payload"]) => void;
  changeTitleText: (payload: ChangeTitleTextAction["payload"]) => void;
  transitionCover: (payload: ChangeCoverTransitionAction["payload"]) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: EditorContextState = {
  highlight: {
    open: false,
    color: "#000000",
  },
  heading: {
    open: false,
    level: 1,
  },
  subtitle: {
    open: false,
    text: "",
  },
  cover: {
    transition: Transition.IDLE,
    open: false,
    id: null,
    url: null,
  },
  title: "",
};

const [Provider, useEditorContext] = createContext<EditorContext>({
  name: "useEditorContext",
  errorMessage: "useEditorContext: `context` is undefined.",
  defaultValue: initialState,
});

function reducer(state = initialState, action: ActionType): EditorContextState {
  switch (action.type) {
    case Action.POPOVER_OPEN:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          open: true,
        },
      };
    case Action.POPOVER_CLOSE:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          open: false,
        },
      };
    case Action.CHANGE_HIGHLIGHT_COLOR:
      return {
        ...state,
        highlight: {
          ...state.highlight,
          color: action.payload.color,
        },
      };
    case Action.CHANGE_HEADING_LEVEL:
      return {
        ...state,
        heading: {
          ...state.heading,
          level: action.payload.level,
        },
      };
    case Action.CHNAGE_SUBTITLE_TEXT:
      return {
        ...state,
        subtitle: {
          ...state.subtitle,
          text: action.payload.text,
        },
      };
    case Action.CHANGE_TITLE_TEXT:
      return {
        ...state,
        title: action.payload.text,
      };
    case Action.CHANGE_COVER:
      return {
        ...state,
        cover: {
          ...state.cover,
          id: action.payload.id,
          url: action.payload.url,
        },
      };
    case Action.TRANSITION_COVER:
      return {
        ...state,
        cover: {
          ...state.cover,
          transition: action.payload.transition,
        },
      };
    default:
      return state;
  }
}

interface Props extends Partial<EditorContextState> {
  children: React.ReactNode;
}

function EditorProvider({ children, ...otherProps }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, initialState, otherProps)
  );

  const popoverOpen = (payload: PopoverOpenAction["payload"]) => {
    dispatch({
      type: Action.POPOVER_OPEN,
      payload,
    });
  };

  const popoverClose = (payload: PopoverCloseAction["payload"]) => {
    dispatch({
      type: Action.POPOVER_CLOSE,
      payload,
    });
  };

  const changeHighlightColor = (
    payload: ChangeHighlightColorAction["payload"]
  ) => {
    dispatch({
      type: Action.CHANGE_HIGHLIGHT_COLOR,
      payload,
    });
  };

  const changeHeadingLevel = (payload: ChangeHeadingLevelAction["payload"]) => {
    dispatch({
      type: Action.CHANGE_HEADING_LEVEL,
      payload,
    });
  };

  const changeSubtitleText = (payload: ChangeSubtitleTextAction["payload"]) => {
    dispatch({
      type: Action.CHNAGE_SUBTITLE_TEXT,
      payload,
    });
  };

  const changeTitleText = (payload: ChangeTitleTextAction["payload"]) => {
    dispatch({
      type: Action.CHANGE_TITLE_TEXT,
      payload,
    });
  };

  const changeCover = (payload: ChangeCoverAction["payload"]) => {
    dispatch({
      type: Action.CHANGE_COVER,
      payload,
    });
  };

  const transitionCover = (payload: ChangeCoverTransitionAction["payload"]) => {
    dispatch({
      type: Action.TRANSITION_COVER,
      payload,
    });
  };

  const actions = useMemo(
    () => ({
      ...state,
      popoverOpen,
      popoverClose,
      changeHighlightColor,
      changeHeadingLevel,
      changeSubtitleText,
      changeTitleText,
      changeCover,
      transitionCover,
      dispatch,
    }),
    [state]
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { EditorProvider, useEditorContext };
