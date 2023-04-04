import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";

// components

import {
  Drawer,
  Button,
  Row,
  Form,
  Col,
  Input,
  Select,
  DatePicker,
} from "antd";

// hooks
import { useEditorContext } from "~/context/editor-context";
import { useFormContext, useController } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useMedia } from "~/libs/hooks/useMedia";

// api
import { api } from "~/utils/api";

// types
import type { CreateData } from "~/libs/validation/posts";
import type { SubmitHandler } from "react-hook-form";
import type { FormInstance } from "antd";

interface InternalPostsPublishDrawerProps {
  setForm: (form: FormInstance | null) => void;
  setLoading: (loading: boolean) => void;
}

const InternalPostsPublishDrawer: React.FC<InternalPostsPublishDrawerProps> = ({
  setForm,
  setLoading,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const $form = useRef<FormInstance>(null);
  const { handleSubmit, control, watch } = useFormContext<CreateData>();

  const watchTags = watch("tags");

  const utils = api.useContext();

  const query_categories = api.categories.pages.useQuery(
    {
      page: 1,
      pageSize: 100,
    },
    {
      staleTime: Infinity,
    }
  );

  const categories = useMemo(() => {
    return query_categories.data?.data?.list ?? [];
  }, [query_categories.data?.data?.list]);

  const { draftId, popoverClose } = useEditorContext();

  const mutation_create = api.posts.create.useMutation({
    onSuccess: async () => {
      popoverClose({
        id: "publish",
      });
      await utils.posts.pages.invalidate();
      router.replace("/dashboard/posts/");
    },
  });

  const mutation_update = api.posts.update.useMutation({
    onSuccess: async () => {
      popoverClose({
        id: "publish",
      });
      await utils.posts.pages.invalidate();
      router.replace("/dashboard/posts/");
    },
  });

  const control_description = useController({
    control,
    name: "dsecription",
  });

  const control_categoryId = useController({
    control,
    name: "categoryId",
  });

  const control_issueDate = useController({
    control,
    name: "issueDate",
  });

  const control_tags = useController({
    control,
    name: "tags",
  });

  const onSubmit: SubmitHandler<CreateData> = (input) => {
    if (!draftId) {
      mutation_create.mutate(input);
    } else {
      mutation_update.mutate({
        id: draftId,
        title: input.title ?? undefined,
        subTitle: input.subTitle,
        content: input.content,
        dsecription: input.dsecription,
        thumbnailId: input.thumbnailId,
        issueDate: input.issueDate ?? undefined,
        tags: input.tags ?? [],
        categoryId: input.categoryId,
      });
    }
  };

  useEffect(() => {
    setForm($form.current);
  }, []);

  useEffect(() => {
    if (mutation_create.isLoading || mutation_update.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [mutation_create.isLoading, mutation_update.isLoading]);

  console.log("render", watchTags);

  return (
    <Form layout="vertical" ref={$form} onFinish={handleSubmit(onSubmit)}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t("dashboard.posts.write.description_label")}
            extra={t("dashboard.posts.write.description_desc")}
          >
            <Input.TextArea
              placeholder={t("dashboard.posts.write.description_placeholder")}
              autoSize={{ minRows: 3, maxRows: 5 }}
              ref={control_description.field.ref}
              name={control_description.field.name}
              value={control_description.field.value ?? ""}
              onChange={control_description.field.onChange}
              onBlur={control_description.field.onBlur}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t("dashboard.posts.write.category_label")}>
            <Select
              placeholder={t("dashboard.posts.write.category_placeholder")}
              {...control_categoryId.field}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label={t("dashboard.posts.write.tags_label")}>
            <Select
              mode="tags"
              placeholder={t("dashboard.posts.write.tags_placeholder")}
              options={
                watchTags?.map((item) => ({ label: item, value: item })) ?? []
              }
              {...control_tags.field}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={t("dashboard.posts.write.issueDate_label")}
            extra={t("dashboard.posts.write.issueDate_desc")}
          >
            <DatePicker
              showTime
              format={"YYYY-MM-DD HH:mm:ss"}
              name={control_issueDate.field.name}
              value={
                control_issueDate.field.value instanceof Date
                  ? dayjs(control_issueDate.field.value)
                  : undefined
              }
              onChange={(date) => {
                control_issueDate.field.onChange(date?.toDate());
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const PostsPublishDrawer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [$form, setFormElement] = useState<FormInstance | null>(null);
  const { publish, popoverClose } = useEditorContext();
  const isMobile = useMedia("(max-width: 460px)");
  const { t } = useTranslation();

  const onClose = useCallback(() => {
    popoverClose({ id: "publish" });
  }, [popoverClose]);

  const setForm = useCallback((form: FormInstance | null) => {
    setFormElement(form);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const onSubmit = useCallback(() => {
    $form?.submit();
  }, [$form]);

  useEffect(() => {
    if (!publish.open) {
      setForm(null);
      setIsLoading(false);
    }
  }, [publish.open]);

  return (
    <Drawer
      width={isMobile ? "100%" : 368}
      onClose={onClose}
      destroyOnClose
      open={publish.open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Button
          loading={isLoading}
          onClick={onSubmit}
          type="primary"
          className="!shadow-none"
        >
          {t("dashboard.posts.write.publish")}
        </Button>
      }
    >
      <InternalPostsPublishDrawer setForm={setForm} setLoading={setLoading} />
    </Drawer>
  );
};

export default PostsPublishDrawer;
