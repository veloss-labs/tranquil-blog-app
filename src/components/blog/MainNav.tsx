'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Icons } from './Icons';
import { siteConfig } from '~/constants/site';
import { MainNavItem } from '~/ts/common';
import classNames from 'classnames';

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ children, items }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <>
      <div className="flex gap-6 md:gap-10">
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Icons.logo />
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>
        {items?.length ? (
          <nav className="hidden gap-6 md:flex">
            {items?.map((item, index) => (
              <Link
                key={index}
                href={item.disabled ? '#' : item.href}
                className={classNames(
                  'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                  item.href.startsWith(`/${segment}`)
                    ? 'text-foreground'
                    : 'text-foreground/60',
                  item.disabled && 'cursor-not-allowed opacity-80',
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
        <button
          className="flex items-center space-x-2 md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.logo />}
          <span className="font-bold">Menu</span>
        </button>
        {/* {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )} */}
      </div>
    </>
  );
}
