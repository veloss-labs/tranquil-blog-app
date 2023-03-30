import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

// components
import * as Popover from "@radix-ui/react-popover";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { Button, message, Upload, Tabs, Spin } from "antd";
import { Icons } from "~/components/shared/Icons";
import { InboxOutlined } from "@ant-design/icons";
import Deferred from "~/components/shared/loader/Deferred";

// api
import { api } from "~/utils/api";

// hooks
import { useForceUpdate } from "~/libs/hooks/useForceUpdate";
import { useEditorContext } from "~/context/editor-context";
import { useEventListener } from "ahooks";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";

// utils
import { optimizeAnimation } from "~/utils/utils";
import {
  getClientHeight,
  getScrollHeight,
  getScrollTop,
  getTargetElement,
} from "~/libs/browser/dom";

// types
import type { UploadRequestOption } from "rc-upload/lib/interface";
import type { RcFile } from "antd/lib/upload";
import type { CreateData } from "~/libs/validation/posts";

const PostsCoverButton = () => {
  const forceUpdate = useForceUpdate();
  const { t } = useTranslation();
  const [tabKey, setTabKey] = useState("upload");
  const { cover, popoverOpen, popoverClose } = useEditorContext();
  const $button = useRef<HTMLElement | null>(null);

  const items = useMemo(() => {
    return [
      {
        key: "upload",
        label: t("dashboard.posts.write.tabs_upload"),
        children: <PostsCoverButton.UploadCover />,
      },
      {
        key: "library",
        label: t("dashboard.posts.write.tabs_library"),
        children: <PostsCoverButton.LibraryCover />,
      },
    ];
  }, [cover.open]);

  const onChange = useCallback(
    (key: string) => {
      setTabKey(key);
    },
    [setTabKey]
  );

  useEffect(() => {
    if (!cover.open) {
      setTabKey("upload");
    }
  }, [cover.open]);

  return (
    <Popover.Root
      open={cover.open}
      onOpenChange={(open) => {
        if (open) {
          popoverOpen({ id: "cover" });
        } else {
          popoverClose({ id: "cover" });
        }
      }}
    >
      <Popover.Trigger asChild>
        <Button
          type="text"
          size="small"
          className="!inline-flex !items-center space-x-2"
          icon={<Icons.media className="icon--sm" />}
          ref={(ref) => {
            if (!$button.current) {
              $button.current = ref;
              forceUpdate();
            }
          }}
        >
          {t("dashboard.posts.write.add_cover")}
        </Button>
      </Popover.Trigger>
      <Popover.Portal container={$button.current}>
        <Popover.Content
          className="editor__popover-content w-screen !p-0 md:w-[640px]"
          sideOffset={5}
        >
          <div className="upload__container">
            <Tabs
              items={items}
              activeKey={tabKey}
              onChange={onChange}
              className="p-3"
              size="small"
              destroyInactiveTabPane
            />
            <Popover.Close className="editor__popover-close" aria-label="Close">
              <Icons.close />
            </Popover.Close>
          </div>
          <Popover.Arrow className="editor__popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default PostsCoverButton;

PostsCoverButton.UploadCover = function UploadCover() {
  const mutation_url = api.files.presignedUrl.useMutation();

  const mutation_upload = api.files.upload.useMutation();

  const { changeCover, popoverClose } = useEditorContext();
  const { setValue } = useFormContext<CreateData>();

  const isUploading = useMemo(() => {
    return mutation_url.isLoading || mutation_upload.isLoading;
  }, [mutation_upload.isLoading, mutation_url.isLoading]);

  const ctx = api.useContext();
  const { t } = useTranslation();

  const customRequest = useCallback(
    async ({ file }: UploadRequestOption) => {
      const rcFile = file as RcFile;

      const resp_url = await mutation_url.mutateAsync({
        filename: rcFile.name,
        fileType: rcFile.type,
        fileSize: rcFile.size,
        uploadType: "posts",
      });

      const { presignedUrl = undefined, key = undefined } = resp_url.data ?? {};
      if (!presignedUrl || !key) {
        // TODO: Error 처리
        return;
      }

      const headers = new Headers();
      // contentType
      headers.append("Content-Type", rcFile.type);

      // binary upload
      await fetch(presignedUrl, {
        method: "PUT",
        body: rcFile,
        headers,
      });

      const resp_upload = await mutation_upload.mutateAsync({
        key,
        uploadType: "posts",
        mediaType: "images",
      });
      const { url = undefined, id = undefined } = resp_upload.data ?? {};
      if (!url || !id) {
        // TODO: Error 처리
        return;
      }

      changeCover({
        id,
        url,
      });
      setValue("thumbnailId", id);
      popoverClose({ id: "cover" });

      ctx.images.infinity.refetch();
    },
    [mutation_url, mutation_upload, ctx.images.infinity]
  );

  return (
    <>
      <div className="p-0">
        <Upload.Dragger
          accept="image/*"
          maxCount={1}
          disabled={isUploading}
          showUploadList={false}
          onChange={(info) => {
            const { status } = info.file;
            if (status !== "uploading") {
            }
            if (status === "done") {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === "error") {
              message.error(`${info.file.name} file upload failed.`);
            }
          }}
          beforeUpload={(file) => {
            const image = [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ];

            if (file.size > 10485760) {
              return false;
            }

            // 이미지인 경우 최대 10mb, 비디오인 경우 최대 20mb
            if (image.includes(file.type)) {
              return true;
            }

            return false;
          }}
          customRequest={customRequest}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-hint break-words">
            {t("dashboard.posts.write.upload_alert")}
          </p>
          {isUploading ? (
            <Deferred>
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-brand-50 bg-opacity-70">
                <Spin />
              </div>
            </Deferred>
          ) : null}
        </Upload.Dragger>
      </div>
    </>
  );
};

PostsCoverButton.LibraryCover = function LibraryCover() {
  const $container = useRef<HTMLDivElement | null>(null);
  const { cover } = useEditorContext();

  const query = api.images.infinity.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      enabled: cover.open,
      getNextPageParam(lastPage) {
        return lastPage.data?.nextCursor;
      },
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );

  const images = useMemo(
    () => query.data?.pages.map((page) => page.data?.items ?? []).flat() ?? [],
    [query.data]
  );

  const scrollFn = optimizeAnimation(() => {
    const el = getTargetElement($container);
    if (!el) {
      return;
    }

    const scrollTop = getScrollTop(el);
    const scrollHeight = getScrollHeight(el);
    const clientHeight = getClientHeight(el);

    if (scrollHeight - scrollTop <= clientHeight + 200 && query.hasNextPage) {
      query.fetchNextPage();
    }
  });

  useEventListener("scroll", scrollFn, { target: $container });

  return (
    <div className="p-4 pt-0">
      <div className="h-56 overflow-y-scroll" ref={$container}>
        <div className="grid grid-cols-12 gap-4">
          {images.map((image) => (
            <PostsCoverButton.LibraryImage
              key={image.id}
              id={image.id}
              url={image.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface LibraryImageProps {
  id: number;
  url: string;
}

PostsCoverButton.LibraryImage = function LibraryImage({
  id,
  url,
}: LibraryImageProps) {
  const { changeCover, cover } = useEditorContext();

  const { setValue } = useFormContext<CreateData>();

  const onSelect = useCallback(() => {
    if (cover.id === id) {
      changeCover({
        id: null,
        url: null,
      });
      setValue("thumbnailId", null);
    } else {
      changeCover({
        id,
        url,
      });
      setValue("thumbnailId", id);
    }
  }, [changeCover, cover.id, id, url]);

  return (
    <div className={"col-span-4 cursor-pointer rounded-lg"}>
      <button
        type="button"
        className={clsx(
          "h-full w-full overflow-hidden rounded-lg bg-transparent p-0 outline-none",
          {
            "border border-solid border-brand-700": cover.id === id,
            "border-none": cover.id !== id,
          }
        )}
        onClick={onSelect}
      >
        <AspectRatio.Root ratio={16 / 9}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            className="h-full w-full object-cover"
            alt="Library Posts Cover"
          />
        </AspectRatio.Root>
      </button>
    </div>
  );
};
