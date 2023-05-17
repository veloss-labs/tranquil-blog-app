import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { getMarkdown } from '~/server/data/getMarkdown';

interface MarkdownProps {
  pageId: string;
}

export default async function Markdown({ pageId }: MarkdownProps) {
  const markdown = await getMarkdown(pageId);

  const load = await unified()
    .use(remarkParse) // markdown을 mdast로 변환
    .use(remarkGfm) // remark가 GFM도 지원 가능하도록
    .use(remarkBreaks) // remark가 line-break도 지원 가능하도록
    .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
    .use(rehypeStringify, { allowDangerousHtml: true }) // hast를 html 변환
    .process(markdown);

  return (
    <div
      data-color-mode="light"
      data-light-theme="light"
      data-dark-theme="dark"
      className="markdown-body"
      dangerouslySetInnerHTML={{
        __html: String(load),
      }}
    />
  );
}
