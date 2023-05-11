import React, { useMemo } from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import clsx from "clsx";
import { Button, Dropdown, Typography } from "antd";
import { Icons } from "~/components/shared/Icons";
import _SubNavCategories from "~/components/shared/layouts/SubNavCategories";

// hooks
import { useRouter } from "next/router";
import { useUrlState } from "~/libs/hooks/useUrlState";
import { useTranslation } from "next-i18next";

// types
import type { MenuProps } from "antd";

const SubNavCategories = dynamic(
  () => import("~/components/shared/layouts/SubNavCategories"),
  {
    ssr: false,
    loading: () => <_SubNavCategories.Skeleton />,
  }
);

function SubNav() {
  return (
    <div className="subnav">
      <SubNav.Sorting />
      <SubNav.Categories />
      <SubNav.Filters />
    </div>
  );
}

export default SubNav;

SubNav.Sorting = function Sorting() {
  const { t } = useTranslation();
  const router = useRouter();
  const [_, setState] = useUrlState(undefined, {
    transitionOptions: {
      shallow: true,
    },
  });

  const items: MenuProps["items"] = useMemo(() => {
    return [
      {
        key: "latest",
        label: (
          <Link
            href={{
              pathname: "/",
              query: { ...router.query, sorting: "latest" },
            }}
            shallow
          >
            {t("shared.latest")}
          </Link>
        ),
      },
      {
        key: "oldest",
        label: (
          <Link
            href={{
              pathname: "/",
              query: { ...router.query, sorting: "oldest" },
            }}
            shallow
          >
            {t("shared.oldest")}
          </Link>
        ),
      },
    ];
  }, [router.query, t]);

  const text = useMemo(() => {
    const sorting = router.query.sorting?.toString();
    if (!sorting) return t("shared.latest");
    switch (sorting) {
      case "latest":
        return t("shared.latest");
      case "oldest":
        return t("shared.oldest");
      case "popular":
        return t("shared.popular");
      default:
        return t("shared.latest");
    }
  }, [router.query.sorting, t]);

  return (
    <div className="subnav--views">
      <Dropdown
        menu={{
          items,
          selectedKeys: [router.query.sorting?.toString() ?? "latest"],
          onClick: ({ key }) => {
            setState({ sorting: key });
          },
        }}
        trigger={["click"]}
      >
        <Button className="!inline-flex !items-center" aria-label="sorting">
          <Typography.Text>{text}</Typography.Text>
          <Icons.down className="icon--sm ml-2 opacity-50" />
        </Button>
      </Dropdown>
    </div>
  );
};

SubNav.Categories = function Categories() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="subnav--categories snap-x space-x-1">
      <ul className="btn-categories-group">
        <li
          className={clsx("btn-category snap-center", {
            active: !router.query.category?.toString(),
          })}
        >
          <Link
            aria-label="all"
            href={{
              pathname: "/",
              query: {
                ...router.query,
                category: undefined,
              },
            }}
            title="all"
            shallow
          >
            {t("shared.all")}
          </Link>
        </li>
        <SubNavCategories />
      </ul>
    </div>
  );
};

SubNav.Filters = function Filters() {
  const { t } = useTranslation();
  return (
    <div className="subnav--filters">
      <Button
        className="!inline-flex !items-center"
        aria-label="filters"
        icon={<Icons.subTitle className="icon--sm mr-2 opacity-80" />}
      >
        <Typography.Text>{t("shared.filter")}</Typography.Text>
      </Button>
    </div>
  );
};
