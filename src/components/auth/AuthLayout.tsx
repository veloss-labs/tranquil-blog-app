import React from "react";
import Link from "next/link";
import { Icons } from "~/components/shared/Icons";
import { useTranslation } from "next-i18next";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation();
  return (
    <>
      <Link href="/" className="btn-link--back">
        <Icons.arrowLeft className="icon--sm mr-2" />
        {t("shared.back")}
      </Link>
      <div className="auth-layout">
        <div className="auth-container">{children}</div>
      </div>
    </>
  );
}
