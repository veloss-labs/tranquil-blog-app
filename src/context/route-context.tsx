import { useRouter } from "next/router";
import React, { useReducer, useMemo, useEffect } from "react";
import { createContext } from "~/libs/react/context";
import { Routes } from "~/libs/router/routes";
import type { AuthoritiesSchema, RouteItem } from "~/libs/router/ts/route";

enum Action {
  TRANSITION_ROUTE = "TRANSITION_ROUTE",
  CHANGE_SELECTED_ROUTE = "CHANGE_SELECTED_ROUTE",
  CHANGE_OPEN_ROUTES = "CHANGE_OPEN_ROUTES",
  INIT_ROUTES = "INIT_ROUTES",
}

type TransitionRoute = {
  type: Action.TRANSITION_ROUTE;
  payload: {
    isLoading: boolean;
  };
};

type ChangeSelectedRoute = {
  type: Action.CHANGE_SELECTED_ROUTE;
  payload: {
    selectedRoute: string[];
  };
};

type ChangeOpenRoutes = {
  type: Action.CHANGE_OPEN_ROUTES;
  payload: {
    openRoutes: string[];
  };
};

type InitRoutes = {
  type: Action.INIT_ROUTES;
  payload: {
    selectedRoute: string[];
    openRoutes: string[];
  };
};

type ActionType =
  | TransitionRoute
  | ChangeSelectedRoute
  | ChangeOpenRoutes
  | InitRoutes;

interface DashboardRouteContextState {
  isRouteLoading: boolean;
  originRoutes: AuthoritiesSchema[];
  menuRoutes: RouteItem[];
  selectedRoute?: string[];
  openRoutes?: string[];
}

interface DashboardRouteContext extends DashboardRouteContextState {
  transitionRoute: (isLoading: boolean) => void;
  changeSelectedRoute: (selectedRoute: string[]) => void;
  changeOpenRoutes: (openRoutes: string[]) => void;
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
    case Action.CHANGE_SELECTED_ROUTE:
      return {
        ...state,
        selectedRoute: action.payload.selectedRoute,
      };
    case Action.CHANGE_OPEN_ROUTES:
      return {
        ...state,
        openRoutes: action.payload.openRoutes,
      };
    case Action.INIT_ROUTES:
      return {
        ...state,
        selectedRoute: action.payload.selectedRoute,
        openRoutes: action.payload.openRoutes,
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

  const menuRoutes = useMemo(
    () => Routes.makeClientRoutes(otherProps?.originRoutes),
    [otherProps.originRoutes]
  );
  const { selectedRoute, openRoutes } = useMemo(
    () => Routes.getSelectedRoute(menuRoutes, nextRouter),
    [menuRoutes, nextRouter]
  );

  const [state, dispatch] = useReducer(
    reducer,
    Object.assign({}, initialState, {
      ...otherProps,
      menuRoutes,
      // selectedRoute,
      // openRoutes,
    })
  );

  useEffect(() => {
    dispatch({
      type: Action.INIT_ROUTES,
      payload: {
        selectedRoute,
        openRoutes,
      },
    });
  }, [nextRouter.pathname]);

  const transitionRoute = (isLoading: boolean) => {
    dispatch({
      type: Action.TRANSITION_ROUTE,
      payload: {
        isLoading,
      },
    });
  };

  const changeSelectedRoute = (selectedRoute: string[]) => {
    dispatch({
      type: Action.CHANGE_SELECTED_ROUTE,
      payload: {
        selectedRoute,
      },
    });
  };

  const changeOpenRoutes = (openRoutes: string[]) => {
    dispatch({
      type: Action.CHANGE_OPEN_ROUTES,
      payload: {
        openRoutes,
      },
    });
  };

  const actions = useMemo(
    () => ({
      ...state,
      transitionRoute,
      changeSelectedRoute,
      changeOpenRoutes,
      dispatch,
    }),
    [state]
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { DashboardRouteProvider, useRouteDashboardContext };
