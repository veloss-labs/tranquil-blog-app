import isEqual from "lodash-es/isEqual";
import dayjs from "dayjs";
import type { SearchStateOption } from "~/libs/search/ts/state";
import { isFunction, isInvalidDate, isString } from "~/utils/assertion";

export class SearchState<S = any> {
  private _initialQuery: S = {} as S;

  constructor(opts?: SearchStateOption<S>) {
    this._initialQuery = opts?.initialQuery || ({} as S);
  }

  getInitialQuery = () => {
    return this._initialQuery;
  };

  setInitialQuery = (query: any) => {
    this._initialQuery = query;
  };

  protected baseMakeQuery = (
    query: Partial<S>,
    parser?: (...args: any[]) => any
  ): S => {
    const _nextQuery = {};

    const _q = query as any;

    const { rangeTime, ...rest } = _q;

    if (rest?.pageNo) {
      Object.assign(_nextQuery, {
        pageNo: rest.pageNo,
      });
    }

    if (rest?.pageSize) {
      Object.assign(_nextQuery, {
        pageSize: rest.pageSize,
      });
    }

    if (typeof rest?.timeAll === "boolean") {
      Object.assign(_nextQuery, {
        timeAll: !!rest.timeAll,
      });

      if (!rest.timeAll) {
        const [start, end] = rangeTime ?? [];
        if (start && end && start.isBefore(end)) {
          Object.assign(_nextQuery, {
            startAt: start.startOf("date").toDate().getTime(),
            endAt: end.endOf("date").toDate().getTime(),
          });
        }
      }
    }

    if (rest?.keyword) {
      Object.assign(_nextQuery, {
        keyword: rest.keyword,
      });
    }

    if (isFunction(parser)) {
      Object.assign(_nextQuery, parser(Object.assign({}, _q, _nextQuery)));
    }

    return _nextQuery as S;
  };

  protected makeClientQuery = (
    query: Partial<S>,
    parser?: (...args: any[]) => any
  ) => {
    const initFormData = {
      timeAll: true,
      rangeTime: undefined,
      keyword: "",
    };

    const _q = query as any;

    const timeAll = _q.timeAll;

    if (timeAll && isString(timeAll) && ["true", "false"].includes(timeAll)) {
      Object.assign(initFormData, {
        timeAll: timeAll === "true",
      });
    }

    const startAt = _q.startAt;
    const endAt = _q.endAt;

    if (startAt && endAt) {
      const _nextStartAt = Number(startAt);
      const _nextEndAt = Number(endAt);
      // check invalid date time
      if (Number.isNaN(_nextStartAt) || Number.isNaN(_nextEndAt)) {
        // invalid date time
      } else {
        // start date time is before end date time
        if (_nextStartAt < _nextEndAt) {
          const __nextStartAt = new Date(_nextStartAt);
          const __nextEndAt = new Date(_nextEndAt);

          if (isInvalidDate(__nextStartAt) || isInvalidDate(__nextEndAt)) {
          } else {
            Object.assign(initFormData, {
              timeAll: false,
              rangeTime: [dayjs(__nextStartAt), dayjs(__nextEndAt)],
            });
          }
        }
      }
    }

    const keyword = _q.keyword;

    if (keyword) {
      Object.assign(initFormData, {
        keyword,
      });
    }

    if (isFunction(parser)) {
      Object.assign(initFormData, parser(Object.assign({}, _q, initFormData)));
    }

    return initFormData as S;
  };

  protected checkIsSearchQuery = (
    query: Partial<S>,
    parser?: {
      init?: (...args: any[]) => any;
      next?: (...args: any[]) => any;
    }
  ) => {
    // query의 값이 defaultValue와 다르면 true
    const initFormData = this.makeClientQuery(this._initialQuery, parser?.init);

    const nextFormData = this.makeClientQuery(query, parser?.next);

    return !isEqual(initFormData, nextFormData);
  };

  protected serverFormData = () => {
    return {};
  };
}
