import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { FlowchartContainer } from '../components/charts';

/**
 * FlowchartPage - 流程图页面
 *
 * 使用FlowchartContainer组件包装流程图功能，提供流程图的创建、编辑和可视化功能。
 * 支持通过URL参数传入初始流程图内容，可以从其他页面引用，并记录访问来源。
 *
 * @component
 * @example
 * ```tsx
 * <FlowchartPage />
 * ```
 *
 * @returns {JSX.Element} FlowchartPage组件
 */
const FlowchartPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFlowchart = queryParams.get('flowchart');
  const ref = queryParams.get('ref');

  // 记录页面访问来源
  useEffect(() => {
    if (ref) {
      console.log('流程图访问来源:', ref);
    }
  }, [ref]);

  return (
    <>
      <Helmet>
        <title>流程图编辑器 - 嵌入式编程平台</title>
        <meta name="description" content="创建和编辑程序流程图" />
      </Helmet>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">流程图编辑器</h1>
          <p className="text-gray-600 mt-1">
            创建、编辑和可视化程序流程图，支持多种节点类型和连接方式
          </p>
        </div>

        <FlowchartContainer initialFlowchart={initialFlowchart || ''} />
      </div>
    </>
  );
};

export default FlowchartPage; 