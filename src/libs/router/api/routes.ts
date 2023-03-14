import type { AuthoritiesSchema } from "../ts/route";

export const getAyncRoutes = async () => {
  return new Promise<{ data: AuthoritiesSchema[] }>((resolve) => {
    resolve({
      data: getRoutes().data,
    });
  });
};

export const getRoutes = () => {
  return {
    data: [
      {
        category: { idx: 1, name: "대시보드", type: "MENU", used: true },
        authorities: null,
      },
      {
        category: { idx: 2, name: "카테고리", type: "MENU", used: true },
        authorities: null,
      },
      {
        category: { idx: 3, name: "게시글", type: "MENU", used: true },
        authorities: null,
      },
    ],
  } as { data: AuthoritiesSchema[] };
};
