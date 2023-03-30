import React, { useCallback, useMemo } from "react";
import Link from "next/link";

// components

import { Drawer, List, Skeleton, Button } from "antd";
import { useEditorContext } from "~/context/editor-context";
import { useTranslation } from "next-i18next";
import { useMedia } from "~/libs/hooks/useMedia";
import { api } from "~/utils/api";

interface InternalPostsDraftViewDrawerProps {}

const InternalPostsDraftViewDrawer: React.FC<
  InternalPostsDraftViewDrawerProps
> = ({}) => {
  const { draftView } = useEditorContext();

  const { t } = useTranslation();

  const query = api.posts.infinity.useInfiniteQuery(
    {
      isDraft: true,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.data?.nextCursor;
      },
      staleTime: Infinity,
      enabled: draftView.open,
    }
  );

  const list = useMemo(
    () => query.data?.pages.map((page) => page.data?.items ?? []).flat() ?? [],
    [query.data]
  );

  const loading = query.isFetching || query.isLoading;

  const loadMore = useMemo(() => {
    if (query.hasNextPage) {
      <div className=" mt-3 text-center">
        <Button
          type="default"
          onClick={() => {
            query.fetchNextPage();
          }}
        >
          {t("shared.loadMore")}
        </Button>
      </div>;
    }
    return null;
  }, [query]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={list}
      loadMore={loadMore}
      renderItem={(item) => (
        <List.Item>
          <Skeleton title={false} loading={loading} active>
            <List.Item.Meta
              title={
                <Link href={`/dashboard/posts/write/${item.id}`} replace>
                  {item.title || "Untitled"}
                </Link>
              }
              description={item.description || "No description"}
            />
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

const PostsDraftViewDrawer = () => {
  const isMobile = useMedia("(max-width: 460px)");
  const { draftView, popoverClose } = useEditorContext();

  const onClose = useCallback(() => {
    popoverClose({ id: "draftView" });
  }, [popoverClose]);

  return (
    <Drawer
      width={isMobile ? "100%" : 368}
      onClose={onClose}
      destroyOnClose
      open={draftView.open}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <InternalPostsDraftViewDrawer />
    </Drawer>
  );
};

export default PostsDraftViewDrawer;
