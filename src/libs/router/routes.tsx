/* eslint-disable react/react-in-jsx-scope */
import hash from "stable-hash";
import { LineChartOutlined, FormOutlined } from "@ant-design/icons";
import { isEmpty } from "~/utils/assertion";

import type {
  AuthoritiesSchema,
  AuthoritySchema,
  CategorySchema,
  RouteItem,
} from "./ts/route";
import type { NextRouter } from "next/router";

const _PAGES = {
  DASHBOARD: {
    name: "대시보드",
    path: "/dashboard",
  },
  MANAGERS: {
    name: "게시글",
    path: "/dashboard/posts",
  },
};

class InternalRoutes {
  private _ownerTableMap: Map<string, CategorySchema> = new Map();

  private _childrenTableMap: Map<
    string,
    AuthoritySchema & {
      ownerKey: string;
    }
  > = new Map();

  private _matchPathName(path: string) {
    if (path === _PAGES.DASHBOARD.path) {
      return _PAGES.DASHBOARD.name;
    }

    const page = Object.values(_PAGES)
      .filter((page) => page.path !== _PAGES.DASHBOARD.path)
      .find((page) => {
        const regex = new RegExp(page.path);
        return regex.test(path);
      });

    return page?.name;
  }

  private _matchPageName(name: string) {
    if (name === _PAGES.DASHBOARD.name) {
      return _PAGES.DASHBOARD.path;
    }

    const page = Object.values(_PAGES).find((page) => {
      return name.includes(page.name);
    });

    return page?.path;
  }

  private _getMoveToRoute(keys: string[]) {
    const key = keys.at(-1);
    if (!key) {
      return undefined;
    }

    if (this._ownerTableMap.has(key)) {
      const route = this._ownerTableMap.get(key);
      if (!route) {
        return undefined;
      }
      return this._matchPageName(route.name);
    }

    const hasMap = this._childrenTableMap.has(key);
    if (!hasMap) {
      return undefined;
    }

    const route = this._childrenTableMap.get(key);
    if (!route) {
      return undefined;
    }

    return this._matchPageName(route.name);
  }

  private _generateCategoryIcon(category: CategorySchema) {
    switch (category.name) {
      case "대시보드": {
        return <LineChartOutlined />;
      }
      case "게시글": {
        return <FormOutlined />;
      }
    }
    return undefined;
  }

  private _makeMenu(ownerKey: string, menus: AuthoritySchema[]) {
    const _menus: RouteItem[] = [];

    for (const _menu of menus) {
      const uniqueKey = hash(_menu);

      if (!this._childrenTableMap.has(uniqueKey)) {
        this._childrenTableMap.set(
          uniqueKey,
          Object.assign({}, _menu, { ownerKey })
        );
      }

      _menus.push({
        key: uniqueKey,
        icon: null,
        children: undefined,
        label: _menu.name,
      });
    }

    return _menus;
  }

  private _makeOwnerRoutes(menu: AuthoritiesSchema) {
    const { category, authorities } = menu;

    const uniqueKey = hash(category);

    if (!this._ownerTableMap.has(uniqueKey)) {
      this._ownerTableMap.set(uniqueKey, category);
    }

    return {
      key: uniqueKey,
      icon: this._generateCategoryIcon(category),
      children: authorities
        ? this._makeMenu(uniqueKey, authorities)
        : undefined,
      label: category.name,
    };
  }

  generateHashKey(data: unknown) {
    return hash(data);
  }

  makeClientRoutes(routes?: AuthoritiesSchema[] | undefined) {
    const safetyRoutes = routes ?? [];

    const menuRoutes: RouteItem[] = [];

    for (const _route of safetyRoutes) {
      const menu = this._makeOwnerRoutes(_route);
      menuRoutes.push(menu);
    }

    return menuRoutes;
  }

  getSelectedRoute(routes: RouteItem[], nextRouter?: NextRouter) {
    if (isEmpty(routes)) {
      return {
        selectedRoute: [] as string[],
        openRoutes: [] as string[],
      };
    }

    const defaultKey = routes.at(0)?.key;

    if (nextRouter) {
      const { pathname } = nextRouter;
      const name = this._matchPathName(pathname.replace(/\/$/, ""));
      if (!name) {
        return {
          selectedRoute: [defaultKey] as string[],
          openRoutes: [] as string[],
        };
      }

      const selectedRoute: string[] = [];
      const openRoutes: string[] = [];
      for (const routeValue of this._ownerTableMap.values()) {
        if (routeValue.name === name) {
          const key = hash(routeValue);
          selectedRoute.push(key);
        }
      }

      for (const routeValue of this._childrenTableMap.values()) {
        if (routeValue.name === name) {
          const { ownerKey, ...others } = routeValue;
          const key = hash(others);
          selectedRoute.push(key);
          openRoutes.push(ownerKey);
        }
      }

      return {
        selectedRoute,
        openRoutes,
      };
    }

    return {
      selectedRoute: [defaultKey] as string[],
      openRoutes: [] as string[],
    };
  }

  getMoveToRoute(keys: string[]) {
    return this._getMoveToRoute(keys);
  }
}

export const Routes = new InternalRoutes();
