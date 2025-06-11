import React from 'react';
import PropTypes from 'prop-types';
import { MermaidFlowchart } from '../charts';

/**
 * Mermaid - 流程图渲染组件
 *
 * 使用MermaidFlowchart组件渲染Mermaid语法的流程图。
 * 这是一个简单的包装组件，用于在common目录中提供Mermaid功能。
 *
 * @component
 * @example
 * ```jsx
 * // 基本用法
 * <Mermaid chart="flowchart TD
 *   A[开始] --> B[处理]
 *   B --> C[结束]" />
 * ```
 *
 * @param {Object} props - 组件属性
 * @param {string} props.chart - Mermaid图表定义
 * @param {string} [props.className] - 可选的CSS类名
 * @returns {ReactElement} Mermaid组件
 */
const Mermaid = ({ chart, className = '' }) => {
  if (!chart) {
    return (
      <div className={`p-4 text-center text-gray-500 ${className}`}>
        <p>暂无流程图</p>
      </div>
    );
  }

  return <MermaidFlowchart chart={chart} className={className} />;
};

Mermaid.propTypes = {
  chart: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Mermaid;
