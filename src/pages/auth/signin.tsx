import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import AuthLayout from "~/components/auth/AuthLayout";
import LoginForm from "~/components/auth/LoginForm";

export default function SignIn() {
  return (
    <AuthLayout>
      <AuthForm
        title="Welcome back"
        description="계정에 로그인하려면 이메일, 비밀번호를 입력하세요."
        isSignup
      >
        <LoginForm />
      </AuthForm>
    </AuthLayout>
  );
}
