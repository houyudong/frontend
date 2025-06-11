import React from 'react';
import { Helmet } from 'react-helmet';
import { WebIDEContainer } from '../components';

/**
 * WebIDEPage - WebIDE页面
 *
 * 使用WebIDEContainer组件包装WebIDE功能，提供代码编辑、编译、调试等功能。
 * 这是平台的核心功能页面，允许用户在浏览器中直接编写和测试STM32代码。
 * Banner和工具栏已集成到EnhancedToolbar组件中，提供统一的用户体验。
 *
 * @component
 * @example
 * ```jsx
 * <WebIDEPage />
 * ```
 *
 * @returns {ReactElement} WebIDEPage组件
 */
const WebIDEPage = () => {
  return (
    <>
      <Helmet>
        <title>AI代码IDE - 嵌入式编程平台</title>
      </Helmet>

      {/* WebIDEContainer包含了集成了Banner的EnhancedToolbar */}
      <WebIDEContainer />
    </>
  );
};

export default WebIDEPage;