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

interface SubtitleContextState extends PopoverContextState {}

interface CoverContextState extends PopoverContextState {
  id: number | null;
  url: string | null;
  transition: Transition;
}

interface PublishContextState extends PopoverContextState {}

export enum Transition {
  IDLE = "IDLE",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
}

interface EditorContextState {
  highlight: HighlightContextState;
  heading: HeadingContextState;
  subtitle: SubtitleContextState;
  cover: CoverContextState;
  publish: PublishContextState;
  transition: Transition;
}

enum Action {
  CHANGE_TRANSITION = "CHANGE_TRANSITION",
  POPOVER_ALL_CLOSE = "POPOVER_ALL_CLOSE",
  POPOVER_OPEN = "POPOVER_OPEN",
  POPOVER_CLOSE = "POPOVER_CLOSE",
  CHANGE_HIGHLIGHT_COLOR = "CHANGE_HIGHLIGHT_COLOR",
  CHANGE_HEADING_LEVEL = "CHANGE_HEADING_LEVEL",
  CHNAGE_SUBTITLE_TEXT = "CHNAGE_SUBTITLE_TEXT",
  CHANGE_TITLE_TEXT = "CHANGE_TITLE_TEXT",
  CHANGE_COVER = "CHANGE_COVER",
  TRANSITION_COVER = "TRANSITION_COVER",
}

type ChangeTransitionAction = {
  type: Action.CHANGE_TRANSITION;
  payload: Transition;
};

type PopoverAllCloseAction = {
  type: Action.POPOVER_ALL_CLOSE;
};

type PopoverOpenAction = {
  type: Action.POPOVER_OPEN;
  payload: {
    id: keyof Omit<EditorContextState, "transition">;
  };
};

type PopoverCloseAction = {
  type: Action.POPOVER_CLOSE;
  payload: {
    id: keyof Omit<EditorContextState, "transition">;
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
  | ChangeCoverAction
  | ChangeCoverTransitionAction
  | PopoverAllCloseAction
  | ChangeTransitionAction;

interface EditorContext extends EditorContextState {
  popoverAllClose: () => void;
  popoverOpen: (payload: PopoverOpenAction["payload"]) => void;
  popoverClose: (payload: PopoverCloseAction["payload"]) => void;
  changeHighlightColor: (
    payload: ChangeHighlightColorAction["payload"]
  ) => void;
  changeHeadingLevel: (payload: ChangeHeadingLevelAction["payload"]) => void;
  transitionCover: (payload: ChangeCoverTransitionAction["payload"]) => void;
  changeCover: (payload: ChangeCoverAction["payload"]) => void;
  changeTransition: (transition: ChangeTransitionAction["payload"]) => void;
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
  },
  cover: {
    transition: Transition.IDLE,
    open: false,
    id: null,
    url: null,
  },
  publish: {
    open: false,
  },
  transition: Transition.IDLE,
};

const [Provider, useEditorContext] = createContext<EditorContext>({
  name: "useEditorContext",
  errorMessage: "useEditorContext: `context` is undefined.",
  defaultValue: initialState,
});

function reducer(state = initialState, action: ActionType): EditorContextState {
  switch (action.type) {
    case Action.POPOVER_ALL_CLOSE: {
      return {
        ...state,
        highlight: {
          ...state.highlight,
          open: false,
        },
        heading: {
          ...state.heading,
          open: false,
        },
        subtitle: {
          ...state.subtitle,
          open: false,
        },
        cover: {
          ...state.cover,
          open: false,
        },
      };
    }
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
    case Action.CHANGE_TRANSITION:
      return {
        ...state,
        transition: action.payload,
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

  const popoverAllClose = () => {
    dispatch({
      type: Action.POPOVER_ALL_CLOSE,
    });
  };

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

  const changeTransition = (transition: Transition) => {
    dispatch({
      type: Action.CHANGE_TRANSITION,
      payload: transition,
    });
  };

  const actions = useMemo(
    () => ({
      ...state,
      popoverAllClose,
      popoverOpen,
      popoverClose,
      changeHighlightColor,
      changeHeadingLevel,
      changeCover,
      transitionCover,
      changeTransition,
      dispatch,
    }),
    [state]
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { EditorProvider, useEditorContext };
