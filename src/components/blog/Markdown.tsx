'use client';
// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import remarkGfm from 'remark-gfm';
// import remarkBreaks from 'remark-breaks';
// import remarkRehype from 'remark-rehype';
// import rehypeStringify from 'rehype-stringify';

// ...

// // notion data -> markdown
// const markdownData = parseNotion2MD(notionData);

// const load = await unified()
//   .use(remarkParse) // markdown을 mdast로 변환
//   .use(remarkGfm) // remark가 GFM도 지원 가능하도록
//   .use(remarkBreaks) // remark가 line-break도 지원 가능하도록
//   .use(remarkRehype, { allowDangerousHtml: true }) // mdast를 hast로 변환
//   .use(rehypeStringify, {allowDangerousHtml: true}) // hast를 html 변환
//   .process(markdownData);

// // 위 과정을 markdownData를 input으로 해서 최종적으로 html로 변환합니다.

interface MarkdownProps {
  pageId: string;
}

export default function Markdown({ pageId }: MarkdownProps) {
  return <div>Markdown</div>;
}
