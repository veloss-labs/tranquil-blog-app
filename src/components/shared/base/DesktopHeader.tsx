import { Button } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Icons } from "~/components/shared/Icons";
import { useTranslation } from "next-i18next";
import UserNav from "./UserNav";

interface DesktopHeaderProps {}

const DesktopHeader: React.FC<DesktopHeaderProps> = () => {
  const router = useRouter();
  const session = useSession();
  const { t } = useTranslation();

  const onMoveToSignin = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  return (
    <div className="header--desktop">
      <Link href="/" className="header-logo--desktop" aria-label="홈">
        <Icons.logo className="icon--lg" />
      </Link>
      <div className="header-content--desktop">
        <div className="flex items-center"></div>
        <div className="flex items-center">
          {session.status === "authenticated" && session.data ? (
            <UserNav session={session.data} />
          ) : (
            <div className="btn-groups--desktop">
              <Button
                type="text"
                role="link"
                data-href="/auth/signin"
                aria-label={t("shared.signin")}
                onClick={onMoveToSignin}
                onKeyDown={onMoveToSignin}
              >
                {t("shared.signin")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
