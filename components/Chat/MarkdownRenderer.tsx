import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm sm:prose-base max-w-none dark:prose-invert break-words">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="relative rounded-md overflow-hidden my-2">
                <div className="bg-slate-800 text-xs text-slate-300 px-4 py-1 flex justify-between items-center">
                  <span>{match[1]}</span>
                </div>
                <pre className="!mt-0 !mb-0 !rounded-t-none bg-slate-900 p-4 overflow-x-auto">
                  <code className={`${className} text-sm`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;