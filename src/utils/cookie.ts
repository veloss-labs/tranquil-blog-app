import Cookies from "js-cookie";

export const COOKIE_POSTS = {
  NAME: "next-blog.postId",
  OPTIONS: {
    path: "/",
    sameSite: "lax" as const,
    domain: "localhost",
  },
  set: function (draftId: number) {
    Cookies.set(this.NAME, draftId.toString(), this.OPTIONS);
  },
};
