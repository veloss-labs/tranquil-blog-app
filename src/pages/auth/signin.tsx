import React from "react";
import AuthForm from "~/components/auth/AuthForm";
import AuthLayout from "~/components/auth/AuthLayout";
import LoginForm from "~/components/auth/LoginForm";
import { useTranslation } from "next-i18next";

// server
import { getServerAuthSession } from "~/server/auth";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

export default function SignIn(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation();
  console.log("ssr (page)", t("signin.not_account"));
  console.log("ssr (page)", t("signin.title"));

  return (
    <AuthLayout>
      <AuthForm
        title={t("signin.title")}
        description={t("signin.description")}
        isSignup
      >
        <LoginForm />
      </AuthForm>
    </AuthLayout>
  );
}