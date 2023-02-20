/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback } from "react";

// components
import { Input, Button, Form } from "antd";

// form
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "~/libs/validation/auth";

export default function SignupForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const control_email = useController({
    control,
    name: "email",
  });

  const control_nickname = useController({
    control,
    name: "nickname",
  });

  const control_password = useController({
    control,
    name: "password",
  });

  const control_passwordConfirm = useController({
    control,
    name: "passwordConfirm",
  });

  const onSubmit = useCallback((data: SignupFormData) => {
    console.log(data);
  }, []);

  return (
    <div className="grid gap-6">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Form.Item
              label="닉네임"
              name="nickname"
              validateStatus={errors.nickname?.message ? "error" : undefined}
              help={
                errors.nickname?.message ? errors.nickname?.message : undefined
              }
            >
              <Input
                type="text"
                autoComplete="nickname"
                autoCorrect="off"
                placeholder="닉네임"
                {...control_nickname.field}
              />
            </Form.Item>
            <Form.Item
              label="이메일"
              name="email"
              validateStatus={errors.email?.message ? "error" : undefined}
              help={errors.email?.message ? errors.email?.message : undefined}
            >
              <Input
                type="email"
                autoComplete="email"
                autoCorrect="off"
                placeholder="name@example.com"
                {...control_email.field}
              />
            </Form.Item>
            <Form.Item
              label="비밀번호"
              name="password"
              validateStatus={errors.password?.message ? "error" : undefined}
              help={
                errors.password?.message ? errors.password?.message : undefined
              }
            >
              <Input.Password
                autoComplete="password"
                autoCorrect="off"
                placeholder="비밀번호"
                {...control_password.field}
              />
            </Form.Item>
            <Form.Item
              label="비밀번호 확인"
              name="passwordConfirm"
              validateStatus={
                errors.passwordConfirm?.message ? "error" : undefined
              }
              help={
                errors.passwordConfirm?.message
                  ? errors.passwordConfirm?.message
                  : undefined
              }
            >
              <Input.Password
                autoComplete="password"
                autoCorrect="off"
                placeholder="비밀번호 확인"
                {...control_passwordConfirm.field}
              />
            </Form.Item>
          </div>
          <Button htmlType="submit" type="primary" className="!shadow-none">
            회원가입
          </Button>
        </div>
      </Form>
    </div>
  );
}
