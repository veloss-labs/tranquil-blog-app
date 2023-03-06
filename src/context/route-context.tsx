import React, { useReducer, useMemo } from "react";
import { createContext } from "~/libs/react/context";
import type { AuthoritiesSchema, RouteItem } from "~/libs/router/ts/route";

enum Action {
  TRANSITION_ROUTE = "TRANSITION_ROUTE",
}

type TransitionRoute = {
  type: Action.TRANSITION_ROUTE;
  payload: {
    isLoading: boolean;
  };
};

type ActionType = TransitionRoute;

interface AdminRouteContextState {
  isRouteLoading: boolean;
  originRoutes: AuthoritiesSchema[];
  menuRoutes: RouteItem[];
  selectedRoute?: string[];
  openRoutes?: string[];
}

interface AdminRouteContext extends AdminRouteContextState {
  transitionRoute: (isLoading: boolean) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: AdminRouteContextState = {
  isRouteLoading: false,
  originRoutes: [],
  menuRoutes: [],
  openRoutes: [],
  selectedRoute: [],
};

const [Provider, useRouteAdminContext] = createContext<AdminRouteContext>({
  name: "useRouteAdminContext",
  errorMessage: "useRouteAdminContext: `context` is undefined.",
  defaultValue: initialState,
});

function reducer(
  state = initialState,
  action: ActionType
): AdminRouteContextState {
  switch (action.type) {
    case Action.TRANSITION_ROUTE:
      return {
        ...state,
        isRouteLoading: action.payload.isLoading,
      };
    default:
      return state;
  }
}

interface Props extends Partial<AdminRouteContext> {
  children: React.ReactNode;
}

function AdminRouteProvider({ children, ...otherProps }: Props) {
  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, initialState, otherProps)
  );

  const transitionRoute = (isLoading: boolean) => {
    dispatch({
      type: Action.TRANSITION_ROUTE,
      payload: {
        isLoading,
      },
    });
  };

  const actions = useMemo(
    () => ({
      ...state,
      transitionRoute,
      dispatch,
    }),
    [state]
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { AdminRouteProvider, useRouteAdminContext };
