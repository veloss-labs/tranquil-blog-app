import '~/assets/css/globals.css';
import { PreloadResources } from './preload-resources';
import { ClientProviders } from './client-provider';
import Script from 'next/script';
import { ApiService } from '~/api/client';
import { env } from '~/env/server.mjs';
import { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import classNames from 'classnames';
import localFont from 'next/font/local';
import { url } from '~/utils/url';

export const runtime = 'edge';

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: '../assets/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Tranquil Blog';
  const description = 'my own silent blog';
  return {
    title,
    description,
    openGraph: {
      title,
      siteName: title,
      description,
      url,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title,
      description,
      creator: '@Lalossol',
      card: 'summary_large_image',
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
    metadataBase: new URL(url),
    manifest: '/manifest.json',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
    alternates: {
      canonical: '/',
      types: {
        'application/atom+xml': '/feed.xml',
      },
    },
    other: {
      'msapplication-TileColor': '#ffffff',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/images/icons/favicon-16x16.png',
      apple: '/images/icons/apple-touch-icon.png',
    },
    category: 'blog',
    keywords: ['blog', 'tranquil', 'lalossol'],
    robots: 'index, follow',
  };
}

interface LayoutProps {
  children: React.JSX.Element;
}

export default function Layout({ children }: LayoutProps) {
  ApiService.setBaseUrl(env.NEXT_PUBLIC_API_HOST);
  return (
    <html lang="en" suppressHydrationWarning>
      <PreloadResources />
      <link
        rel="search"
        href="/opensearch.xml"
        type="application/opensearchdescription+xml"
        title="Blog"
      />
      <Script id="inject-env" strategy="afterInteractive">
        {`
          window.ENV = ${JSON.stringify({
            API_BASE_URL: env.NEXT_PUBLIC_API_HOST,
          })}
        `}
      </Script>
      <body
        className={classNames(
          'font-sans',
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
