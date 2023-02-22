import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import AuthLayout from "~/components/auth/AuthLayout";
import SignupForm from "~/components/auth/SignupForm";

import { getServerAuthSession } from "~/server/auth";

import type { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function SignUp() {
  return (
    <AuthLayout>
      <AuthForm
        title="Create an account"
        description="계정을 만들려면 아래에 정보들을 입력하세요."
        isSignup={false}
      >
        <SignupForm />
      </AuthForm>
    </AuthLayout>
  );
}
