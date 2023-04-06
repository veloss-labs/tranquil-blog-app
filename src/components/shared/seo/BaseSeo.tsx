import React from "react";
import { DefaultSeo } from "next-seo";

export const siteConfig = {
  name: "Tranquil",
  description: "나만이 개인 블로그!",
  url: "http://localhost:3000",
  ogImage: "http://localhost:3000/og.png",
  links: {
    github: "https://github.com/veloss-labs/tranquil-blog-app",
  },
};

export default function BaseSeo() {
  return (
    <>
      <DefaultSeo
        title="Blog"
        titleTemplate={`%s | ${siteConfig.name}`}
        description={siteConfig.description}
        openGraph={{
          type: "website",
          locale: "ko",
          siteName: siteConfig.name,
          url: siteConfig.url,
          images: [
            {
              url: siteConfig.ogImage,
              alt: siteConfig.name,
            },
          ],
        }}
        twitter={{
          handle: "@veloss",
          site: "@veloss",
          cardType: "summary_large_image",
        }}
        additionalLinkTags={[
          {
            rel: "shortcut icon",
            type: "image/x-icon",
            href: "/favicon/favicon.ico",
          },
          {
            rel: "icon",
            sizes: "32x32",
            href: "/favicon/favicon-32x32.png",
          },
          {
            rel: "icon",
            sizes: "16x16",
            href: "/favicon/favicon-16x16.png",
          },
          {
            rel: "apple-touch-icon",
            sizes: "114x114",
            href: "/favicon/apple-touch-icon",
          },
          {
            rel: "manifest",
            href: "/site.webmanifest",
          },
        ]}
        additionalMetaTags={[
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
          },
          {
            name: "keywords",
            content: "Next.js, React, Tailwind CSS, Antd",
          },
          {
            name: "creator",
            content: "veloss",
          },
        ]}
      />
    </>
  );
}
