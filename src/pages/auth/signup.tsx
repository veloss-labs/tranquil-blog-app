import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import AuthLayout from "~/components/auth/AuthLayout";
import SignupForm from "~/components/auth/SignupForm";

import { getServerAuthSession } from "~/server/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

// types
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  const message = await serverSideTranslations(ctx.locale ?? "ko", ["common"]);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...message,
    },
  };
}

export default function SignUp(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation();
  return (
    <AuthLayout>
      <AuthForm
        title={t("signup.title")}
        description={t("signup.description")}
        isSignup={false}
      >
        <SignupForm />
      </AuthForm>
    </AuthLayout>
  );
}
