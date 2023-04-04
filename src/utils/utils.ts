import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Nullable } from '~/ts/common';
import type { GetServerSidePropsContext, NextPageContext } from 'next';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


import { apiHost } from '~/constants/env';
import { isBrowser } from '~/libs/browser/dom';

type GetUrlParams = {
  ctx?: Nullable<GetServerSidePropsContext | NextPageContext>;
  nextApiRoutes?: boolean;
};

export const getUrl = (params?: GetUrlParams) => {
  const { ctx, nextApiRoutes } = params || {};
  const _NEXT_API_ROUTES_PATHNAME = '/api';
  const _NEXT_COMMON_PATHNAME = '/';
  const baseUrl = nextApiRoutes
    ? _NEXT_API_ROUTES_PATHNAME
    : _NEXT_COMMON_PATHNAME;

  if (!apiHost) {
    if (ctx && ctx.req) {
      const { headers } = ctx.req;
      const host = headers.host?.toString() || '';
      const protocol = headers['x-forwarded-proto']?.toString() || 'http';
      return new URL(baseUrl, `${protocol}://${host}`);
    } else if (isBrowser) {
      return new URL(baseUrl, location.origin);
    }
  }

  // apiHost의 pathname을 split해서 baseUrl에 붙여준다.
  // ex) apiHost: https://api.example.com/api/v1
  //     baseUrl: https://api.example.com
  //     pathname: /api/v1
  return new URL(apiHost);
};


/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// invariant(condition, message) will refine types based on "condition", and
// if "condition" is false will throw an error. This function is special-cased
// in flow itself, so we can't name it anything else.
export default function invariant(
  cond?: boolean,
  message?: string,
  ...args: string[]
): asserts cond {
  if (cond) {
    return;
  }

  throw new Error(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    'Internal Lexical error: invariant() is meant to be replaced at compile ' +
      'time. There is no runtime version. Error: ' +
      message,
  );
}

export const computedTableIndex = (
  total: number,
  size: number,
  no: number,
  index: number
) => {
  return total - size * (no - 1) - index;
};

export function optimizeAnimation(callback: () => void) {
  let ticking = false;

  return () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
    }
  };
}

export const toKebabCase = (str: string) => {
  // 단어를 앞글자가 대문자인 경우에만 그 앞에 공백을 추가한다. 그리고 앞뒤 공백을 제거한다.
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};