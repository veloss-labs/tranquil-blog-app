import '~/assets/css/globals.css';
import { PreloadResources } from './preload-resources';
import { ClientProviders } from './client-provider';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PreloadResources />
      <link
        rel="search"
        href="/opensearch.xml"
        type="application/opensearchdescription+xml"
        title="Blog"
      />
      <ClientProviders>
        <body>{children}</body>
      </ClientProviders>
    </html>
  );
}
