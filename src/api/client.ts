import { isBrowser } from '~/libs/browser/dom';
import type { Nullable } from '~/ts/common';
import { isEmpty, isString } from '~/utils/assertion';

export class HTTPError extends Error {
  public response: Response;
  public request: Request;
  public options: any;

  constructor(response: Response, request: Request, options: any) {
    const code =
      response.status || response.status === 0 ? response.status : '';
    const title = response.statusText || '';
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}`);

    this.name = 'HTTPError';
    this.response = response;
    this.request = request;
    this.options = options;
  }
}

export type ApiRoutes = URL | RequestInfo;

export type CustomOptions = {
  isAuthticated?: boolean;
};

export type BaseApiOptions = {
  custom?: CustomOptions;
  init?: RequestInit;
};

export type BaseResponse<Data = any> = {
  resultCode: number;
  message: Nullable<string | string[]> | undefined;
  error: Nullable<string> | undefined;
  result: Data;
};

export class ApiService {
  static baseUrl = !isBrowser
    ? process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api`
      : 'http://localhost:3000/api'
    : // @ts-ignore
    window.ENV?.API_BASE_URL ?? process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/api`
    : 'http://localhost:3000/api';

  static setBaseUrl(url?: string) {
    this.baseUrl = url || 'http://localhost:3000/api';
  }

  static middlewareForSearchParams = (
    url: ApiRoutes | string,
    params?: URLSearchParams | string,
  ) => {
    if (!params) {
      return url;
    }
    const textSearchParams = isString(params)
      ? params.replace(/^\?/, '')
      : new URLSearchParams(params).toString();
    const searchParams = '?' + textSearchParams;
    const toStringUrl = isString(url) ? url : url.toString();
    return toStringUrl.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
  };

  static middlewareForUrl = (pathname: ApiRoutes) => {
    const baseURL = new URL(ApiService.baseUrl);
    const basePathname = baseURL.pathname;
    const concatPathname = basePathname + '/' + pathname.toString();
    return new URL(concatPathname, ApiService.baseUrl);
  };

  static headerJSON = (options?: BaseApiOptions['init']) => {
    const headers = new Headers();
    if (options?.headers && options.headers instanceof Headers) {
      for (const [key, value] of options.headers.entries()) {
        headers.set(key, value);
      }
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  };

  static async get(
    pathname: ApiRoutes,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const input = this.middlewareForUrl(pathname);
    const request = new Request(input, {
      ...options,
      method: 'GET',
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(response, request, options);
    }
    return {
      response,
      request,
    };
  }

  static async post(
    pathname: ApiRoutes,
    body?: any,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const input = this.middlewareForUrl(pathname);
    const request = new Request(input, {
      ...options,
      method: 'POST',
      body: body && !isEmpty(body) ? JSON.stringify(body) : undefined,
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(response, request, options);
    }
    return {
      response,
      request,
    };
  }

  static async delete(
    pathname: ApiRoutes,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const input = this.middlewareForUrl(pathname);
    const request = new Request(input, {
      ...options,
      method: 'DELETE',
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(response, request, options);
    }
    return {
      response,
      request,
    };
  }

  static async put(
    pathname: ApiRoutes,
    body?: any,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const input = this.middlewareForUrl(pathname);
    const request = new Request(input, {
      ...options,
      method: 'PUT',
      body: body && !isEmpty(body) ? JSON.stringify(body) : undefined,
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(response, request, options);
    }
    return {
      response,
      request,
    };
  }

  static async patch(
    pathname: ApiRoutes,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const input = this.middlewareForUrl(pathname);
    const request = new Request(input, {
      ...options,
      method: 'PATCH',
    });
    const response = await fetch(request);
    if (!response.ok) {
      throw new HTTPError(response, request, options);
    }
    return {
      response,
      request,
    };
  }

  static async getJson<R = Record<string, any>>(
    pathname: ApiRoutes,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const headers = this.headerJSON(options);
    const { request, response } = await this.get(pathname, {
      ...options,
      headers,
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json();
    return {
      json: data as BaseResponse<R>,
      response,
      request,
    };
  }

  static async postJson<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const headers = this.headerJSON(options);
    const { request, response } = await this.post(pathname, body, {
      ...options,
      headers,
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json();
    return {
      json: data as BaseResponse<R>,
      response,
      request,
    };
  }

  static async deleteJson<R = Record<string, any>>(
    pathname: ApiRoutes,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const headers = this.headerJSON(options);
    const { request, response } = await this.delete(pathname, {
      ...options,
      headers,
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json();
    return {
      json: data as BaseResponse<R>,
      response,
      request,
    };
  }

  static async putJson<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: BaseApiOptions['init'] | undefined,
  ) {
    const headers = this.headerJSON(options);
    const { request, response } = await this.put(pathname, body, {
      ...options,
      headers,
    });
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json();
    return {
      json: data as BaseResponse<R>,
      response,
      request,
    };
  }
}
