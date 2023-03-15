import { environment } from "~/constants/env";
import { isBrowser } from "~/libs/browser/dom";

type LogCategory =
  | "client"
  | "server"
  | "api"
  | "db"
  | "middleware"
  | "pages"
  | "components"
  | "logging";

type Extra = Record<string, any>;

class Logger {
  /**
   * Log information
   *
   * @param category A log message category that will be prepended
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  info(label: LogCategory, message: string, extra?: Extra) {
    if (isBrowser) {
      console.info(
        `%c[${label}]:${message}`,
        "color: #fff; background-color: #28a745; padding: 2px 4px; border-radius: 4px;",
        extra
      );
    } else {
      console.info(`[${label}]:${message}`, extra);
    }
  }

  /**
   * Debug information
   *
   * @param category A log message category that will be prepended
   * @param extra Arbitrary data to be logged
   */
  debug(label: LogCategory, message: string, extra?: Extra) {
    if (environment === "development") {
      if (isBrowser) {
        console.debug(
          `%c[${label}]${message}`,
          "color: #fff; background-color: #17a2b8; padding: 2px 4px; border-radius: 4px;",
          extra
        );
      } else {
        console.debug(`[${label}]:${message}`, extra);
      }
    }
  }

  /**
   * Logging information
   * @param message A log message
   * @param extra Arbitrary data to be logged
   * @param category A log message category that will be prepended
   */
  log(label: LogCategory, message: string, extra?: Extra) {
    if (environment === "development") {
      if (isBrowser) {
        console.log(
          `%c[${label}]:${message}`,
          "color: #fff; background-color: #17a2b8; padding: 2px 4px; border-radius: 4px;",
          extra
        );
      } else {
        console.log(`[${label}]:${message}`, extra);
      }
      return;
    }
  }

  /**
   * Log a warning
   *
   * @param message A warning message
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  warn(message: string, extra?: Extra) {
    if (isBrowser) {
      console.warn(
        `%c[warning]:${message}`,
        "color: #fff; background-color: #ffc107; padding: 2px 4px; border-radius: 4px;",
        extra
      );
    } else {
      console.warn(`[warning]:${message}`, extra);
    }
  }

  /**
   * Report a runtime error
   *
   * @param message A description of the error
   * @param error The error that occurred
   * @param extra Arbitrary data to be logged that will appear in prod logs
   */
  error(message: string, error: Error | unknown, extra?: Extra) {
    console.error(message, {
      error,
      extra,
    });
  }
}

export const logger = new Logger();

