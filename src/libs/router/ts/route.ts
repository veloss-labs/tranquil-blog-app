import type { MenuProps } from 'antd/es/menu';
import type { Nullable } from '~/ts/common';

export interface AuthoritySchema {
  idx: number;
  name: string;
  code: string;
  order: number;
  used: boolean;
}

export interface CategorySchema {
  idx: number;
  name: string;
  type: string;
  used: boolean;
}

export interface AuthoritiesSchema {
  authorities: Nullable<AuthoritySchema[]> | undefined;
  category: CategorySchema;
}

export type MenuItem = Required<MenuProps>['items'][number];

export type RouteItem = MenuItem & {
  /**
   * @deprecated
   * @description routeMap 에서 사용하는 형태로 변경
   */
  meta?: Nullable<Record<string, any>>;
};
