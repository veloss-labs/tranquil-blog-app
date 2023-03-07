import { useRouter } from "next/router";
import React, { useReducer, useMemo } from "react";
import { createContext } from "~/libs/react/context";
import { Routes } from "~/libs/router/routes";
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

interface DashboardRouteContextState {
  isRouteLoading: boolean;
  originRoutes: AuthoritiesSchema[];
  menuRoutes: RouteItem[];
  selectedRoute?: string[];
  openRoutes?: string[];
}

interface DashboardRouteContext extends DashboardRouteContextState {
  transitionRoute: (isLoading: boolean) => void;
  dispatch: React.Dispatch<ActionType>;
}

const initialState: DashboardRouteContextState = {
  isRouteLoading: false,
  originRoutes: [],
  menuRoutes: [],
  openRoutes: [],
  selectedRoute: [],
};

const [Provider, useRouteDashboardContext] =
  createContext<DashboardRouteContext>({
    name: "useRouteDashboardContext",
    errorMessage: "useRouteDashboardContext: `context` is undefined.",
    defaultValue: initialState,
  });

function reducer(
  state = initialState,
  action: ActionType
): DashboardRouteContextState {
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

interface Props extends Partial<DashboardRouteContext> {
  children: React.ReactNode;
}

function DashboardRouteProvider({ children, ...otherProps }: Props) {
  const nextRouter = useRouter();
  const menuRoutes = useMemo(() => Routes.makeClientRoutes(otherProps?.originRoutes), [otherProps.originRoutes])
  const { selectedRoute, openRoutes } = useMemo(() => Routes.getSelectedRoute(
    menuRoutes,
    nextRouter
  ), [menuRoutes, nextRouter])
  
  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, initialState, {
      ...otherProps,
      menuRoutes,
      selectedRoute,
      openRoutes,
    })
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

export { DashboardRouteProvider, useRouteDashboardContext };
