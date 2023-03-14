import { useCallback, useMemo, useRef } from "react";
import { stringify, parse, type IParseOptions } from "qs";
import { useRouter } from "next/router";
import { useForceUpdate } from "./useForceUpdate";
import { isFunction } from "~/utils/assertion";

import type { IStringifyOptions } from "qs";

export interface Options {
  navigateMode?: "push" | "replace";
  transitionOptions?: {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
  };
  stringifyOptions?: IStringifyOptions;
}

const baseStringifyConfig: IStringifyOptions = {
  skipNulls: true,
  addQueryPrefix: true,
  arrayFormat: "comma",
  encode: false,
};

type UrlState = Record<string, any>;

export const useUrlState = <S extends UrlState = UrlState>(
  initialState?: S | (() => S),
  options?: Options
) => {
  type State = Partial<{ [key in keyof S]: any }>;
  const {
    navigateMode = "push",
    transitionOptions,
    stringifyOptions,
  } = options || {};

  const mergedStringifyOptions = {
    ...baseStringifyConfig,
    ...stringifyOptions,
  };

  const router = useRouter();

  const update = useForceUpdate();

  const initialStateRef = useRef(
    isFunction(initialState) ? (initialState as () => S)() : initialState || {}
  );

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...router.query,
    }),
    [router.query]
  );

  const setState = useCallback(
    (s: React.SetStateAction<State>) => {
      const newQuery = isFunction(s) ? s(targetQuery) : s;

      update();
      router[navigateMode](
        {
          search: stringify(
            {
              ...router.query,
              ...newQuery,
            },
            mergedStringifyOptions
          ),
        },
        undefined,
        transitionOptions
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router, navigateMode, transitionOptions]
  );

  return [targetQuery, setState] as const;
};

export interface ParserdOptions {
  parserOptions?: IParseOptions;
}

const baseParserConfig: IParseOptions = {
  comma: true,
};

export interface UseUrlParamsState {
  isRelationship: boolean | "true" | "false";
  viewType: string;
  type: string | string[];
}

export const useParams = <S extends UrlState = UseUrlParamsState>(
  initialState?: S | (() => S),
  options?: ParserdOptions
) => {
  type State = Partial<{ [key in keyof S]: any }>;

  const initialStateRef = useRef(
    isFunction(initialState) ? (initialState as () => S)() : initialState || {}
  );

  const { parserOptions } = options || {};
  const router = useRouter();

  const query = router.query as unknown as string;

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...router.query,
    }),
    [router.query]
  );

  const mergedParseredOptions = {
    ...baseParserConfig,
    ...parserOptions,
  };

  const params = useMemo(
    () =>
      parse(
        targetQuery as Record<string, string>,
        mergedParseredOptions
      ) as unknown as State,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query]
  );

  return params;
};

export const useResetUrlState = () => {
  const router = useRouter();

  return useCallback(() => {
    const url = new URL(location.pathname, location.origin);
    router.replace(url, undefined, { shallow: true });
  }, [router]);
};
