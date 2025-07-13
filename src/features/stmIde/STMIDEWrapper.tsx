import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import STMIDEApp from './App';
import './styles/index.css';

// 错误回退组件
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">STMIDE 加载失败</h2>
      <p className="text-gray-600 mb-4">抱歉，IDE环境遇到了问题</p>
      <details className="text-left bg-gray-100 p-4 rounded-lg">
        <summary className="cursor-pointer font-medium">错误详情</summary>
        <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
          {error.message}
        </pre>
      </details>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        重新加载
      </button>
    </div>
  </div>
);

interface STMIDEWrapperProps {
  hideTitle?: boolean;
}

/**
 * STMIDEWrapper - STMIDE包装器组件
 *
 * 将完整的STMIDE集成到新架构中
 * 保持STMIDE的完整功能和独立性
 */
const STMIDEWrapper: React.FC<STMIDEWrapperProps> = ({ hideTitle = false }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="stmide-wrapper h-screen w-full">
        <STMIDEApp hideTitle={hideTitle} />
      </div>
    </ErrorBoundary>
  );
};

export default STMIDEWrapper;
