import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, {
  type DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { cn } from "~/utils/utils";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          (
            <StyleProvider cache={cache}>
              <App {...props} />
            </StyleProvider>
          ),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-test="extract"
            dangerouslySetInnerHTML={{ __html: extractStyle(cache) }}
          />
        </>
      ),
    };
  }

  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale ?? "ko";
    return (
      <Html
        lang={currentLocale}
        dir="ltr"
        className="bg-white font-sans text-slate-900 antialiased"
      >
        <Head>
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content="white"
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content="black"
          />
        </Head>
        <body className="min-h-screen">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
