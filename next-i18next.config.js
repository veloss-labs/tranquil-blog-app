const path = require("path");

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  debug: false,
  i18n: {
    locales: ["ko", "en"],
    defaultLocale: "ko",
    localeDetection: false,
  },
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === "undefined"
      ? path.resolve("./public/locales")
      : "/locales",
  reloadOnPrerender: process.env.NODE_ENV === "development",
  ns: ["common"],
};
