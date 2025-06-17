import React from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import remarkGfm from 'remark-gfm';

interface CodeExplanationProps {
  explanation: string;
  className?: string;
}

/**
 * 代码解释组件
 * 用于展示代码的详细解释，支持 Markdown 格式
 * @param {CodeExplanationProps} props - 组件属性
 * @param {string} props.explanation - 代码解释内容（Markdown 格式）
 * @param {string} [props.className] - 可选的 CSS 类名
 */
const CodeExplanation: React.FC<CodeExplanationProps> = ({ explanation, className = '' }) => {
  if (!explanation) {
    return (
      <div className={`p-8 text-center text-gray-500 ${className}`}>
        <p>暂无代码解释</p>
      </div>
    );
  }

  return (
    <div className={`code-explanation bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2" {...props} />,
          h5: ({ node, ...props }) => <h5 className="text-md font-medium text-gray-700 mt-3 mb-1" {...props} />,
          h6: ({ node, ...props }) => <h6 className="text-md font-medium text-gray-600 mt-3 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="text-gray-700 my-3 leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-8 my-4 text-gray-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-8 my-4 text-gray-700" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-300" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-50" {...props} />,
          th: ({ node, ...props }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700" {...props} />,
          td: ({ node, ...props }) => <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props} />,
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={monokai}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 text-sm"
                showLineNumbers={true}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded-md text-red-600 font-mono text-sm" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => <pre className="bg-gray-900 rounded-md overflow-auto p-0 my-4" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-6 border-gray-300" {...props} />,
          img: ({ node, ...props }) => <img className="max-w-full rounded-md my-4" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-800" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-800" {...props} />,
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
};

export default CodeExplanation; 