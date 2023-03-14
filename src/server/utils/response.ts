const _default_response_body = {
  ok: true,
  resultCode: 0,
  resultMessage: undefined,
  data: undefined,
};

interface ResponseBody<T> {
  ok?: boolean | undefined;
  resultCode?: number | undefined;
  resultMessage?: string | undefined;
  data?: T | undefined;
}

export const responseWith = <T = unknown>(
  params: ResponseBody<T>
): ResponseBody<T> => {
  return Object.assign(_default_response_body, params);
};
