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
    return (
      <Html
        lang="ko"
        dir="ltr"
        className={cn("bg-white font-sans text-slate-900 antialiased")}
      >
        <Head />
        <body className="m-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
