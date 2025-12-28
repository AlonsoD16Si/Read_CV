/**
 * Markdown content renderer using react-markdown
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="mb-4 mt-8 text-3xl font-bold" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="mb-3 mt-6 text-2xl font-semibold" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="mb-2 mt-4 text-xl font-semibold" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="mb-4 ml-6 list-disc" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="mb-4 ml-6 list-decimal" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
        a: ({ node, ...props }) => (
          <a
            className="text-black underline hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
            {...props}
          />
        ),
        code: ({ node, className, ...props }: any) => {
          const isInline = !className;
          return isInline ? (
            <code
              className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono dark:bg-gray-800"
              {...props}
            />
          ) : (
            <code className={className} {...props} />
          );
        },
        pre: ({ node, ...props }) => (
          <pre
            className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic dark:border-gray-700"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

