import { isEmpty } from "~/utils/assertion";
import { SearchState } from "./searchState";

export class PostsSearch<S = any> extends SearchState<S> {
  makeQuery(query: Partial<S>): S {
    const parser = (query: any) => {
      const ignoreKeys: string[] = ["timeAll"];

      for (const key in query) {
        if (ignoreKeys.includes(key)) {
          delete query[key];
        }
        // 값이 없으면 제거
        if (isEmpty(query[key])) {
          delete query[key];
        }
      }

      return query;
    };

    return this.baseMakeQuery(query, parser);
  }

  IsSearchQuery = (state: any) => {
    return this.checkIsSearchQuery(state);
  };

  getClientForm = (query: any, ignoreKeys: string[] = []) => {
    const parser = (q: any) => {
      for (const key in q) {
        if (ignoreKeys.includes(key)) {
          delete q[key];
        }
      }

      return q;
    };

    return this.makeClientQuery(query, parser);
  };
}
