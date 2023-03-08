import ModernError from "modern-errors";
import modernErrorsHttp from "modern-errors-http";
import modernErrorsClean from "modern-errors-clean";
import modernErrorsSerialize from "modern-errors-serialize";

export const HttpError = ModernError.subclass("BaseError", {
  plugins: [modernErrorsSerialize, modernErrorsClean, modernErrorsHttp],
});

export const UnauthorizedError = HttpError.subclass("UnauthorizedError", {
  http: {
    status: 401,
    title: "Unauthorized",
    detail: "You are not authorized to access this resource.",
  },
});

export const ForbiddenError = HttpError.subclass("ForbiddenError", {
  http: {
    status: 403,
    title: "Forbidden",
    detail: "You are not allowed to access this resource.",
  },
});

export const NotFoundError = HttpError.subclass("NotFoundError", {
  http: {
    status: 404,
    title: "Not Found",
    detail: "The requested resource could not be found.",
  },
});

export const BadRequestError = HttpError.subclass("BadRequestError", {
  http: {
    status: 400,
    title: "Bad Request",
    detail: "The request could not be understood by the server.",
  },
});

export const InternalServerError = HttpError.subclass("InternalServerError", {
  http: {
    status: 500,
    title: "Internal Server Error",
    detail: "The server encountered an unexpected condition.",
  },
});
