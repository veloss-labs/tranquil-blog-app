import '~/assets/css/components/markdown.css';

import React from 'react';

interface LayoutProps {
  children: React.JSX.Element;
  params: {
    id: string;
  };
}

export default async function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
