import React, { useMemo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

function SubNavCategories() {
  const router = useRouter();
  const { data, isLoading, error } = api.categories.topCategories.useQuery(
    {
      pageSize: 50,
    },
    {
      staleTime: Infinity,
    }
  );

  const categories = useMemo(() => data?.data ?? [], [data]);

  if (isLoading) {
    return <SubNavCategories.Skeleton />;
  }

  if (error) {
    return null;
  }

  return (
    <>
      {categories.map((category) => {
        const q = router.query.category?.toString();
        return (
          <li
            className={clsx("btn-category snap-center", {
              active: q ? q === category.id.toString() : false,
            })}
            key={`subnav-category-${category.id}`}
          >
            <Link
              aria-label={category.name}
              href={{
                pathname: "/",
                query: {
                  ...router.query,
                  category: category.id,
                },
              }}
              title={category.name}
              shallow
            >
              {category.name}
            </Link>
          </li>
        );
      })}
    </>
  );
}
export default SubNavCategories;

SubNavCategories.Skeleton = function Skeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          className="btn-category ml-2 snap-center"
          key={`subnav-category-${i}`}
        >
          <a
            aria-label="skeleton"
            title="skeleton"
            href="#"
            className="rounded-md bg-gray-100 !text-transparent duration-700 ease-in-out group-hover:opacity-75"
          >
            skeleton
          </a>
        </li>
      ))}
    </>
  );
};
