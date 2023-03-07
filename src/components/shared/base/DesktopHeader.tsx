import { Button } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Icons } from "~/components/shared/Icons";
import UserNav from "./UserNav";

interface DesktopHeaderProps {}

const DesktopHeader: React.FC<DesktopHeaderProps> = () => {
  const router = useRouter();
  const session = useSession();

  const onMoveToSignin = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  const onMoveToSignup = useCallback(() => {
    router.push("/auth/signup");
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
                aria-label="로그인"
                onClick={onMoveToSignin}
                onKeyDown={onMoveToSignin}
              >
                로그인
              </Button>
              <Button
                type="primary"
                className="!shadow-none"
                role="link"
                aria-label="회원가입"
                data-href="/auth/signup"
                onClick={onMoveToSignup}
                onKeyDown={onMoveToSignup}
              >
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;
