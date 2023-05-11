import React from 'react';
import Link from 'next/link';
import { Icons } from './Icons';
import { docsConfig, siteConfig } from '~/constants/site';
import { MainNav } from './MainNav';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={docsConfig.mainNav} />
        <div className="flex flex-1 items-center space-x-4 sm:justify-end">
          <div className="flex-1 sm:grow-0">{/* <DocsSearch /> */}</div>
          <nav className="flex space-x-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.gitHub className="h-7 w-7" />
              <span className="sr-only">GitHub</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
