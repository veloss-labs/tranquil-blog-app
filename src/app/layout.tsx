import '~/assets/css/globals.css';
import { PreloadResources } from './preload-resources';
import { ClientProviders } from './client-provider';
import { ApiService } from '~/api/client';
import { env } from '~/env/server.mjs';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  manifest: '/manifest.json',
  themeColor: '#0F172A',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  alternates: {
    canonical: '/',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
  },
};

interface LayoutProps {
  children: React.JSX.Element;
}

export default function Layout({ children }: LayoutProps) {
  ApiService.setBaseUrl(env.NEXT_PUBLIC_API_HOST);
  return (
    <html lang="en">
      <PreloadResources />
      <link
        rel="search"
        href="/opensearch.xml"
        type="application/opensearchdescription+xml"
        title="Blog"
      />
      {/* <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify({
            API_BASE_URL: env.NEXT_PUBLIC_API_HOST,
          })}`,
        }}
      /> */}
      <ClientProviders>
        <body>{children}</body>
      </ClientProviders>
    </html>
  );
}
