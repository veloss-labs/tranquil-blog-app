import React from "react";
import Link from "next/link";
import { Icons } from "~/components/shared/Icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <Link href="/" className="btn-link--back">
        <Icons.arrowLeft className="icon--sm mr-2" />
        Back
      </Link>
      <div className="auth-layout">
        <div className="auth-container">{children}</div>
      </div>
    </>
  );
}
