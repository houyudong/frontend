import React from 'react';
import { Helmet } from 'react-helmet';
import { ErrorDebuggerContainer } from '../components';

/**
 * ErrorDebuggerPage - 错误调试页面
 *
 * 使用ErrorDebuggerContainer组件包装错误调试功能，提供分析和解决STM32开发中的
 * 编译错误、链接错误和运行时错误的功能。支持错误代码查询、常见问题解决方案和
 * 智能错误分析。
 *
 * @component
 * @example
 * ```tsx
 * <ErrorDebuggerPage />
 * ```
 *
 * @returns {JSX.Element} ErrorDebuggerPage组件
 */
const ErrorDebuggerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>错误调试 - 嵌入式编程平台</title>
        <meta name="description" content="分析和解决STM32开发中的错误" />
      </Helmet>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-6">
        <ErrorDebuggerContainer />
      </div>
    </>
  );
};

export default ErrorDebuggerPage; 