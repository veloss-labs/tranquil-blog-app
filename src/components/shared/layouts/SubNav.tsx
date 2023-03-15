import React, { useMemo } from "react";
import { Button, Dropdown, Typography } from "antd";
import { Icons } from "~/components/shared/Icons";
import { api } from "~/utils/api";

import type { MenuProps } from "antd";
import Link from "next/link";
import clsx from "clsx";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: "4",
    danger: true,
    label: "a danger item",
  },
];

const SubNav = () => {
  const query = api.categories.infinity.useInfiniteQuery(
    {
      limit: 100,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.data?.nextCursor;
      },
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );

  const categories = useMemo(
    () => query.data?.pages.map((page) => page.data?.items ?? []).flat() ?? [],
    [query.data]
  );

  return (
    <div className="subnav">
      <div className="subnav--views">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button
            className="!inline-flex !items-center"
            aria-label="리스트 필터 옵션"
          >
            <Typography.Text>최신순</Typography.Text>
            <Icons.down className="icon--sm ml-2 opacity-50" />
          </Button>
        </Dropdown>
      </div>
      <div className="subnav--categories invisible space-x-1 md:visible">
        <ul className="btn-categories-group">
          {categories.map((category) => (
            <li
              className={clsx("btn-category", {
                active: false,
              })}
              key={`subnav-category-${category.id}`}
            >
              <Link aria-label={category.name} href="/" title={category.name}>
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="subnav--filters">
        <Button
          className="!inline-flex !items-center"
          aria-label="리스트 검색 옵션"
          icon={<Icons.subTitle className="icon--sm mr-2 opacity-80" />}
        >
          <Typography.Text>필터</Typography.Text>
        </Button>
      </div>
    </div>
  );
};

export default SubNav;
