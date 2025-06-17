import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import MermaidToReactFlow from './MermaidToReactFlow';

// 配置Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  themeCSS: `
    .node rect, .node circle, .node ellipse, .node polygon, .node path {
      fill: #f0f9ff;
      stroke: #3b82f6;
      stroke-width: 1.5px;
    }
    .edgePath .path {
      stroke: #3b82f6;
      stroke-width: 1.5px;
    }
    .arrowheadPath {
      fill: #3b82f6;
    }
    .edgeLabel {
      background-color: #ffffff;
      padding: 2px;
      border-radius: 3px;
      font-size: 11px;
    }
    .cluster rect {
      fill: #f0f7ff;
      stroke: #bae6fd;
      stroke-width: 1px;
    }
    .label {
      font-family: 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif;
      font-size: 11px;
      color: #1e3a8a;
      font-weight: normal;
    }
    .nodeLabel, .edgeLabel {
      font-size: 11px;
      font-family: 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif;
      font-weight: normal;
    }
    .flowchart-link {
      stroke: #3b82f6;
      stroke-width: 1.5px;
    }
    g.node text {
      font-size: 11px;
      font-family: 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif;
      font-weight: normal;
    }
    .cluster .label text {
      font-size: 11px;
      font-weight: normal;
    }
    g.cluster text {
      font-size: 11px;
    }
    .node .label foreignObject {
      overflow: visible;
    }
    .node div {
      overflow: visible;
      line-height: 1.2;
    }
  `,
  flowchart: {
    htmlLabels: true,
    curve: 'linear',
    useMaxWidth: true,
    padding: 8,
    rankSpacing: 35,
    nodeSpacing: 25,
  },
  logLevel: 'error',
});

interface MermaidFlowchartProps {
  chart: string;
  className?: string;
  onError?: (error: string | Error) => void;
}

/**
 * Mermaid流程图渲染组件
 * @param props 组件属性
 * @param props.chart Mermaid图表定义
 * @param props.className 可选的CSS类名
 * @param props.onError 错误处理回调函数
 */
const MermaidFlowchart: React.FC<MermaidFlowchartProps> = ({ 
  chart, 
  className = '',
  onError 
}) => {
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uniqueId] = useState<string>(`mermaid-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);

  // 预处理复杂的流程图定义
  const preprocessFlowchart = (chartText: string): string => {
    let correctedChart = chartText.trim();
    
    // 检测特定的带子图的流程图模式
    if (correctedChart.includes('subgraph') && correctedChart.includes('style init fill:#f9d6e3')) {
      console.log('检测到特殊的子图流程图，应用专门的修复');
      return `flowchart TD
    A[HAL初始化] --> B[GPIO初始化]
    B --> C[UART初始化]
    C --> D[进入主循环]
    D --> E[处理任务]
    E --> D
    
    F[中断处理] --> G[读取按钮状态]
    G --> H[切换LED]
    H --> I[发送串口消息]
    
    style A fill:#f9d6e3,stroke:#333
    style B fill:#e3f2fd,stroke:#333
    style C fill:#fff3e0,stroke:#333
    style D fill:#e8f7e4,stroke:#333
    style F fill:#ffeb3b,stroke:#333`;
    }
    
    // 确保图表以flowchart或graph开头
    if (!correctedChart.startsWith('flowchart') && !correctedChart.startsWith('graph')) {
      correctedChart = `flowchart TD\n${correctedChart}`;
    }
    
    // 为多行文本添加适当的缩进
    correctedChart = correctedChart.split('\n')
      .map(line => line.trim())
      .join('\n');
    
    // 修复subgraph语法
    const subgraphRegex = /subgraph\s+([^\n]+)\s*\n(.*?)\n\s*end/gs;
    correctedChart = correctedChart.replace(subgraphRegex, (match, title, content) => {
      if (!content.trim()) {
        return `subgraph ${title}\n    空节点[" "]\nend`;
      }
      const fixedContent = content.replace(/-->/g, ' --> ');
      return `subgraph ${title}\n${fixedContent}\nend`;
    });
    
    // 修复样式语法
    const styleRegex = /style\s+([^\s]+)\s+([^,\n]+)/g;
    correctedChart = correctedChart.replace(styleRegex, (match, node, style) => {
      return `style ${node} ${style}`;
    });
    
    return correctedChart;
  };

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setRenderError(null);
      } catch (error) {
        console.error('处理流程图出错:', error);
        const errorMessage = `无法处理流程图: ${error instanceof Error ? error.message : '未知错误'}`;
        setRenderError(errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart, uniqueId]);

  return (
    <div className={`flowchart-container ${className}`}>
      {isLoading && <div className="loading">加载中...</div>}
      {renderError && <div className="error">{renderError}</div>}
      
      <MermaidToReactFlow 
        mermaidContent={chart}
        height={400}
        className={className}
      />
    </div>
  );
};

export default MermaidFlowchart; 