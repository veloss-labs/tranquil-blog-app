import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, type FormInstance, Input, Modal } from "antd";
import { useController, useForm } from "react-hook-form";
import { schema } from "~/libs/validation/categories";
import type { CreateData } from "~/libs/validation/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/utils/api";

interface InternalDashboardCategoriesModalProps {
  categoryId?: number;
  setForm: (form: FormInstance | null) => void;
  changeOpen: (open: boolean) => void;
}

const InternalDashboardCategoriesModal: React.FC<
  InternalDashboardCategoriesModalProps
> = ({ setForm, changeOpen }) => {
  const $form = useRef<FormInstance>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateData>({
    mode: "onSubmit",
    resolver: zodResolver(schema.create),
  });

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
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit = useCallback(
    (data: CreateData) => {
      mutation_create.mutate(data);
    },
    [mutation_create]
  );

  useEffect(() => {
    setForm($form.current);
  }, []);

  return (
    <Form layout="vertical" ref={$form} onFinish={handleSubmit(onSubmit)}>
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
    "categoryId" | "changeOpen"
  > {
  open: boolean;
  destroyOnClose?: boolean;
}

const DashboardCategoriesModal: React.FC<DashboardCategoriesModalProps> = ({
  open,
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
      console.log("destroy");
      setForm(null);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      title="카테고리 등록"
      centered
      okText="등록"
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
      />
    </Modal>
  );
};

export default DashboardCategoriesModal;
