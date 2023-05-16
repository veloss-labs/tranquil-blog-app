import React from 'react';
import Header from '~/components/blog/Header';
import Footer from '~/components/blog/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1">{children}</div>
      <Footer />
    </div>
  );
}
