import React, { useReducer, useMemo } from "react";
import { createContext } from "~/libs/react/context";

enum Action {
  CLOSE_SIDEBAR = "CLOSE_SIDEBAR",
  CLOSE_POPUP_MENU = "CLOSE_POPUP_MENU",
  OPEN_SIDEBAR = "OPEN_SIDEBAR",
  OPEN_POPUP_MENU = "OPEN_POPUP_MENU",
  TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR",
  TOGGLE_POPUP_MENU = "TOGGLE_POPUP_MENU",
}

type CloseSidebar = {
  type: Action.CLOSE_SIDEBAR;
};

type ClosePopupMenu = {
  type: Action.CLOSE_POPUP_MENU;
};

type OpenSidebar = {
  type: Action.OPEN_SIDEBAR;
};

type OpenPopupMenu = {
  type: Action.OPEN_POPUP_MENU;
};

type ToggleSidebar = {
  type: Action.TOGGLE_SIDEBAR;
};

type TogglePopupMenu = {
  type: Action.TOGGLE_POPUP_MENU;
};

type ActionType =
  | CloseSidebar
  | ClosePopupMenu
  | OpenSidebar
  | OpenPopupMenu
  | ToggleSidebar
  | TogglePopupMenu;

interface AdminLayoutContextState {
  isShowSidebar: boolean;
  isShowPopupMenu: boolean;
}

interface AdminLayoutContext extends AdminLayoutContextState {
  closeSidebar: () => void;
  closePopupMenu: () => void;
  openSidebar: () => void;
  openPopupMenu: () => void;
  toggleSidebar: () => void;
  togglePopupMenu: () => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: AdminLayoutContextState = {
  isShowSidebar: true,
  isShowPopupMenu: false,
};

const [Provider, useLayoutAdminContext] = createContext<AdminLayoutContext>({
  name: "useLayoutAdminContext",
  errorMessage: "useLayoutAdminContext: `context` is undefined.",
  defaultValue: initialState,
});

function reducer(
  state = initialState,
  action: ActionType
): AdminLayoutContextState {
  switch (action.type) {
    case Action.CLOSE_SIDEBAR:
      return {
        ...state,
        isShowSidebar: false,
      };
    case Action.CLOSE_POPUP_MENU:
      return {
        ...state,
        isShowPopupMenu: false,
      };
    case Action.OPEN_SIDEBAR:
      return {
        ...state,
        isShowSidebar: true,
      };
    case Action.OPEN_POPUP_MENU:
      return {
        ...state,
        isShowPopupMenu: true,
      };
    case Action.TOGGLE_SIDEBAR:
      return {
        ...state,
        isShowSidebar: !state.isShowSidebar,
      };
    case Action.TOGGLE_POPUP_MENU:
      return {
        ...state,
        isShowPopupMenu: !state.isShowPopupMenu,
      };
    default:
      return state;
  }
}

interface Props extends Partial<AdminLayoutContextState> {
  children: React.ReactNode;
}

function AdminLayoutProvider({ children, ...otherProps }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, initialState, otherProps)
  );

  const closeSidebar = () => dispatch({ type: Action.CLOSE_SIDEBAR });

  const closePopupMenu = () => dispatch({ type: Action.CLOSE_POPUP_MENU });

  const openSidebar = () => dispatch({ type: Action.OPEN_SIDEBAR });

  const openPopupMenu = () => dispatch({ type: Action.OPEN_POPUP_MENU });

  const toggleSidebar = () => dispatch({ type: Action.TOGGLE_SIDEBAR });

  const togglePopupMenu = () => dispatch({ type: Action.TOGGLE_POPUP_MENU });

  const actions = useMemo(
    () => ({
      ...state,
      closeSidebar,
      closePopupMenu,
      openSidebar,
      openPopupMenu,
      toggleSidebar,
      togglePopupMenu,
      dispatch,
    }),
    [state]
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AdminLayoutProvider, useLayoutAdminContext };
