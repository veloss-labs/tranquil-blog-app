import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, type FormInstance, Input, Modal } from "antd";
import { useController, useForm } from "react-hook-form";
import { schema } from "~/libs/validation/categories";
import type { CreateData } from "~/libs/validation/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";
import { logger } from "~/utils/logger";
import type { PostCategory } from "@prisma/client";

interface InternalDashboardCategoriesModalProps {
  category?: PostCategory | undefined;
  setForm: (form: FormInstance | null) => void;
  changeOpen: (open: boolean) => void;
}

const InternalDashboardCategoriesModal: React.FC<
  InternalDashboardCategoriesModalProps
> = ({ setForm, changeOpen, category }) => {
  const $form = useRef<FormInstance>(null);

  const utils = api.useContext();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateData>({
    mode: "onSubmit",
    resolver: zodResolver(schema.create),
  });

  const initialValues = category
    ? {
        name: category.name,
        description: category.description ?? undefined,
      }
    : undefined;

  const control_name = useController({
    control,
    name: "name",
  });

  const control_desc = useController({
    control,
    name: "description",
  });

  const mutation_create = api.categories.create.useMutation({
    onSuccess: () => {
      changeOpen(false);
      utils.categories.pages.invalidate();
      Modal.success({
        title: "카테고리 등록",
        content: "카테고리가 등록되었습니다.",
        centered: true,
      });
    },
    onError: (error) => {
      logger.error("[dashboard - categories] create error", error);
      Modal.error({
        title: "카테고리 등록",
        content: "카테고리 등록에 실패했습니다.",
        centered: true,
      });
    },
  });

  const mutation_update = api.categories.update.useMutation({
    onSuccess: () => {
      changeOpen(false);
      utils.categories.pages.invalidate();
      Modal.success({
        title: "카테고리 수정",
        content: "카테고리가 수정되었습니다.",
        centered: true,
      });
    },
    onError: (error) => {
      logger.error("[dashboard - categories] update error", error);
      Modal.error({
        title: "카테고리 수정",
        content: "카테고리 수정에 실패했습니다.",
        centered: true,
      });
    },
  });

  const onSubmit = useCallback(
    (data: CreateData) => {
      if (category) {
        mutation_update.mutate({ id: category.id, ...data });
      } else {
        mutation_create.mutate(data);
      }
    },
    [category, mutation_create, mutation_update]
  );

  useEffect(() => {
    setForm($form.current);
  }, []);

  useEffect(() => {
    if (category) {
      reset(initialValues);
    }
  }, [category]);

  return (
    <Form
      layout="vertical"
      ref={$form}
      onFinish={handleSubmit(onSubmit)}
      initialValues={initialValues}
    >
      <Form.Item
        name="name"
        label="이름"
        validateStatus={errors.name?.message ? "error" : undefined}
        help={errors.name?.message ? errors.name?.message : undefined}
      >
        <Input autoCorrect="off" {...control_name.field} />
      </Form.Item>
      <Form.Item
        name="description"
        label="설명"
        validateStatus={errors.description?.message ? "error" : undefined}
        help={
          errors.description?.message ? errors.description?.message : undefined
        }
      >
        <Input.TextArea {...control_desc.field} />
      </Form.Item>
    </Form>
  );
};

interface DashboardCategoriesModalProps
  extends Pick<
    InternalDashboardCategoriesModalProps,
    "category" | "changeOpen"
  > {
  open: boolean;
  destroyOnClose?: boolean;
}

const DashboardCategoriesModal: React.FC<DashboardCategoriesModalProps> = ({
  open,
  category,
  changeOpen,
  destroyOnClose = true,
}) => {
  const [$form, setFormElement] = useState<FormInstance | null>(null);

  const setForm = useCallback((form: FormInstance | null) => {
    setFormElement(form);
  }, []);

  const onSubmit = useCallback(() => {
    $form?.submit();
  }, [$form]);

  const onClose = useCallback(() => {
    changeOpen(false);
  }, [changeOpen]);

  useEffect(() => {
    if (!open) {
      setForm(null);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      title={`카테고리 ${category ? "수정" : "등록"}`}
      centered
      okText={category ? "수정" : "등록"}
      onOk={onSubmit}
      onCancel={onClose}
      okButtonProps={{
        className: "!shadow-none",
      }}
      cancelText="취소"
      destroyOnClose={destroyOnClose}
    >
      <InternalDashboardCategoriesModal
        changeOpen={changeOpen}
        setForm={setForm}
        category={category}
      />
    </Modal>
  );
};

export default DashboardCategoriesModal;
