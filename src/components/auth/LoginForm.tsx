/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useCallback } from "react";

// components
import { Input, Button, Form } from "antd";

// form
import { useController, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema, type SignInData } from "~/libs/validation/auth";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(schema.signin),
  });

  const control_email = useController({
    control,
    name: "email",
  });

  const control_password = useController({
    control,
    name: "password",
  });

  const onSubmit = useCallback(async (data: SignInData) => {
    const resp = await signIn("credentials", data);
    console.log(resp);
  }, []);

  return (
    <div className="grid gap-6">
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
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
          </div>
          <Button htmlType="submit" type="primary" className="!shadow-none">
            로그인
          </Button>
        </div>
      </Form>
    </div>
  );
}
