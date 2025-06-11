import React from 'react';
import SyntaxHighlighterOriginal from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const SyntaxHighlighter = ({
  language = 'javascript',
  style = monokai,
  children,
  showLineNumbers = true,
  wrapLines = true,
  wrapLongLines = false,
  customStyle = {},
  ...props
}) => {
  if (!children) {
    return (
      <div className="p-4 bg-gray-100 text-gray-500 rounded-md text-center">
        No code to display
      </div>
    );
  }

  return (
    <SyntaxHighlighterOriginal
      language={language}
      style={style}
      showLineNumbers={showLineNumbers}
      wrapLines={wrapLines}
      wrapLongLines={wrapLongLines}
      customStyle={{
        borderRadius: '0.5rem',
        padding: '1rem',
        fontSize: '0.9rem',
        ...customStyle,
      }}
      {...props}
    >
      {String(children).trim()}
    </SyntaxHighlighterOriginal>
  );
};

export default SyntaxHighlighter;