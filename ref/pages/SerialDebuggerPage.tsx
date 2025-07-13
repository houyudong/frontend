import React from 'react';
import { Helmet } from 'react-helmet';
import { SerialDebuggerContainer } from '../components';

/**
 * SerialDebuggerPage - 串口调试器页面
 *
 * 使用SerialDebuggerContainer组件包装串口调试器功能
 *
 * @component
 * @example
 * ```tsx
 * <SerialDebuggerPage />
 * ```
 *
 * @returns {JSX.Element} SerialDebuggerPage组件
 */
const SerialDebuggerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>串口调试器 - 嵌入式编程平台</title>
        <meta name="description" content="通过Web Serial API与STM32设备进行通信" />
      </Helmet>

      {/* 内容区域 */}
      <div className="container mx-auto px-4 py-6">
        <SerialDebuggerContainer />
      </div>
    </>
  );
};

export default SerialDebuggerPage; 