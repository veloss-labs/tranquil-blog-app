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
        category: { idx: 2, name: "담당자 관리", type: "MENU", used: true },
        authorities: [
          { idx: 1, name: "담당자 목록", code: "ASG", order: 1, used: true },
        ],
      },
      {
        category: { idx: 3, name: "회원 관리", type: "MENU", used: true },
        authorities: [
          { idx: 2, name: "회원 목록", code: "USR", order: 1, used: true },
        ],
      },
      {
        category: { idx: 4, name: "게시판 관리", type: "MENU", used: true },
        authorities: [
          { idx: 3, name: "1:1 문의", code: "IQR", order: 1, used: true },
          { idx: 4, name: "공지사항", code: "NTS", order: 3, used: true },
          { idx: 5, name: "FAQ", code: "FAQ", order: 5, used: true },
        ],
      },
    ],
  } as { data: AuthoritiesSchema[] };
};

export const getAuthorityList = async () => {
  return new Promise<{ data: any[] }>((resolve) => {
    resolve({
      data: [
        {
          category: { idx: 1, name: "기초관리", type: "MENU", used: true },
          authorities: [
            { idx: 10, name: "회사정보", code: "CIM", order: 1, used: true },
            { idx: 11, name: "기초코드", code: "BCM", order: 2, used: true },
            { idx: 12, name: "약관관리", code: "TRM", order: 3, used: true },
            { idx: 13, name: "관리자 메뉴", code: "MGR", order: 4, used: true },
            { idx: 14, name: "수수료 관리", code: "FEE", order: 5, used: true },
            { idx: 15, name: "BRS 관리", code: "BRS", order: 6, used: true },
            { idx: 16, name: "메시지 관리", code: "MSG", order: 7, used: true },
            { idx: 18, name: "비속어 관리", code: "FUC", order: 8, used: true },
          ],
        },
        {
          category: { idx: 2, name: "담당자 관리", type: "MENU", used: true },
          authorities: [
            { idx: 19, name: "담당자 목록", code: "ASG", order: 1, used: true },
          ],
        },
        {
          category: { idx: 3, name: "회원관리", type: "MENU", used: true },
          authorities: [
            { idx: 20, name: "회원목록", code: "USR", order: 1, used: true },
            {
              idx: 21,
              name: "크리에이터 관리",
              code: "CRT",
              order: 2,
              used: true,
            },
            { idx: 22, name: "컬렉션 관리", code: "CLL", order: 3, used: true },
            {
              idx: 46,
              name: "인증 크리에이터 관리",
              code: "ACR",
              order: 3,
              used: true,
            },
            { idx: 23, name: "찜 리스트", code: "ZZM", order: 4, used: true },
          ],
        },
        {
          category: { idx: 4, name: "NFT 관리", type: "MENU", used: true },
          authorities: [
            { idx: 24, name: "투표관리", code: "VFT", order: 1, used: true },
            { idx: 25, name: "투표상세", code: "VOT", order: 2, used: true },
            { idx: 26, name: "드롭관리", code: "DFT", order: 3, used: true },
          ],
        },
        {
          category: { idx: 5, name: "거래관리", type: "MENU", used: true },
          authorities: [
            { idx: 29, name: "거래완료", code: "TRS", order: 1, used: true },
            { idx: 27, name: "판매예약", code: "SEL", order: 1, used: true },
            { idx: 28, name: "구매예약", code: "BUY", order: 1, used: true },
          ],
        },
        {
          category: { idx: 6, name: "자산관리", type: "MENU", used: true },
          authorities: [
            { idx: 30, name: "입출금내역", code: "BBS", order: 1, used: true },
            { idx: 31, name: "배당금 관리", code: "DIV", order: 2, used: true },
            {
              idx: 32,
              name: "출금신청내역",
              code: "WDS",
              order: 3,
              used: true,
            },
            { idx: 33, name: "보유작품", code: "OWN", order: 4, used: true },
            { idx: 34, name: "NFT 지갑", code: "NFW", order: 5, used: true },
          ],
        },
        {
          category: { idx: 7, name: "게시판 관리", type: "MENU", used: true },
          authorities: [
            { idx: 35, name: "1:1 문의", code: "IQR", order: 1, used: true },
            { idx: 36, name: "댓글", code: "CMM", order: 2, used: true },
            { idx: 37, name: "공지사항", code: "NTS", order: 3, used: true },
            { idx: 38, name: "뉴스", code: "NWS", order: 4, used: true },
            { idx: 39, name: "FAQ", code: "FAQ", order: 5, used: true },
          ],
        },
        {
          category: { idx: 9, name: "통계", type: "MENU", used: true },
          authorities: [
            { idx: 40, name: "USDT", code: "SUS", order: 1, used: true },
            { idx: 41, name: "거래", code: "STR", order: 2, used: true },
            { idx: 42, name: "출금", code: "SWD", order: 3, used: true },
            { idx: 43, name: "상품", code: "SNF", order: 4, used: true },
            { idx: 44, name: "컬렉션", code: "SCO", order: 5, used: true },
            { idx: 45, name: "크리에이터", code: "SCR", order: 6, used: true },
          ],
        },
      ],
    });
  });
};
