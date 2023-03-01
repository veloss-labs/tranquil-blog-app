import { Button } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { Icons } from "~/components/shared/Icons";

interface MobileHeaderProps {}

const MobileHeader: React.FC<MobileHeaderProps> = () => {
  const router = useRouter();
  const session = useSession();

  console.log(session);

  const onMoveToSignin = useCallback(() => {
    router.push("/auth/signin");
  }, [router]);

  const onMoveToSignup = useCallback(() => {
    router.push("/auth/signup");
  }, [router]);

  return (
    <div className="header--mobile">
      <Link href="/" className="header-logo--mobile" aria-label="홈">
        <Icons.logo className="icon--lg" />
      </Link>
      <div className="header-content--mobile">
        <div className="flex items-center"></div>
        <div className="flex items-center">
          <div className="btn-groups--mobile">
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
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;
