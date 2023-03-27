import React from "react";
import Link from "next/link";
import { Icons } from "~/components/shared/Icons";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  title: string;
  description: string;
  isSignup?: boolean;
  children: React.ReactNode;
}

export default function AuthForm({
  title,
  description,
  isSignup,
  children,
}: AuthFormProps) {
  const { t } = useTranslation("common");

  console.log("ssr (component)", t("signin.not_account"));
  console.log("ssr (component)", t("signin.title"));

  return (
    <div className="auth-form">
      <div>
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="title">{title}</h1>
        <p className="description">{description}</p>
      </div>
      {children}
      <p className="footer">
        <Link href={isSignup ? "/auth/signup" : "/auth/signin"}>
          {isSignup ? t("signin.not_account") : t("signin.already_account")}
        </Link>
      </p>
    </div>
  );
}
