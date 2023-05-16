'use client';

import React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Icons } from './Icons';
import { MainNavItem } from '~/ts/common';
import classNames from 'classnames';

interface MainNavProps {
  items?: MainNavItem[];
}

export function MainNav({ items }: MainNavProps) {
  const segment = useSelectedLayoutSegment();

  return (
    <>
      <div className="flex gap-6 md:gap-10">
        <Link href="/" className="items-center space-x-2 md:flex">
          <Icons.logo />
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
      </div>
    </>
  );
}
