import React, { useState, useEffect, useRef } from 'react';
import { FiInfo, FiX, FiEdit, FiSave, FiCopy, FiCode } from 'react-icons/fi';
import MermaidFlowchart from '../charts/MermaidFlowchart';
import { ReactFlowProvider } from 'reactflow';

// 示例流程图
const SAMPLE_FLOWCHARTS = [
  {
    name: "简单流程",
    code: `flowchart TD
    A[开始] --> B[初始化]
    B --> C[主循环]
    C --> D[处理输入]
    D --> C`
  },
  {
    name: "GPIO示例",
    code: `flowchart TD
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
    style F fill:#ffeb3b,stroke:#333`
  },
  {
    name: "决策流程",
    code: `flowchart TD
    A[开始] --> B{是否初始化?}
    B -->|是| C[运行应用]
    B -->|否| D[执行初始化]
    D --> C
    C --> E{是否有错误?}
    E -->|是| F[处理错误]
    E -->|否| G[继续执行]
    F --> G
    G --> C`
  },
  {
    name: "横向流程",
    code: `flowchart LR
    A[开始] --> B(处理步骤1)
    B --> C(处理步骤2)
    C --> D{判断条件}
    D -->|条件1| E[执行路径1]
    D -->|条件2| F[执行路径2]
    E --> G[结束]
    F --> G`
  }
];

/**
 * FlowchartContainer - 流程图容器组件
 *
 * 包装流程图组件，提供示例选择、编辑和使用指南
 *
 * @component
 */
const FlowchartContainer = ({ initialFlowchart = '' }) => {
  const [showGuide, setShowGuide] = useState(false);
  const [selectedFlowchart, setSelectedFlowchart] = useState(SAMPLE_FLOWCHARTS[0]);
  const [customFlowchart, setCustomFlowchart] = useState(initialFlowchart || '');
  const [isCustom, setIsCustom] = useState(!!initialFlowchart);
  const [isEditing, setIsEditing] = useState(false);
  const [showExamplesPanel, setShowExamplesPanel] = useState(true);
  const [flowchartError, setFlowchartError] = useState(null);

  // 监听自定义事件，显示使用指南
  useEffect(() => {
    const handleShowGuide = () => {
      setShowGuide(true);
    };

    window.addEventListener('flowchart-show-guide', handleShowGuide);

    return () => {
      window.removeEventListener('flowchart-show-guide', handleShowGuide);
    };
  }, []);

  // 处理流程图选择
  const handleFlowchartChange = (event) => {
    const selected = SAMPLE_FLOWCHARTS.find(chart => chart.name === event.target.value);
    if (selected) {
      setSelectedFlowchart(selected);
      setIsCustom(false);
      setIsEditing(false);
    }
  };

  // 切换自定义/预设流程图
  const toggleCustom = () => {
    if (!isCustom) {
      // 切换到自定义模式
      setCustomFlowchart(selectedFlowchart.code);
      setIsCustom(true);
      setIsEditing(true);
    } else {
      // 切换回预设模式
      setIsCustom(false);
      setIsEditing(false);
    }
  };

  // 处理自定义流程图变更
  const handleCustomChange = (event) => {
    setCustomFlowchart(event.target.value);
  };

  // 保存自定义流程图
  const handleSaveCustom = () => {
    setIsEditing(false);
  };

  // 复制流程图代码
  const handleCopyCode = () => {
    const codeToCopy = isCustom ? customFlowchart : selectedFlowchart.code;
    navigator.clipboard.writeText(codeToCopy)
      .then(() => {
        // 显示复制成功提示
        alert('流程图代码已复制到剪贴板');
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };

  // 处理流程图渲染错误
  const handleFlowchartError = (error) => {
    console.error('流程图渲染错误:', error);
    setFlowchartError(`流程图渲染失败: ${error.message || error}`);
  };

  return (
    <div className="flowchart-container">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 左侧面板 - 示例和编辑 */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FiCode className="mr-2 text-primary-600" />
              流程图编辑器
            </h2>

            {/* 示例选择 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择示例流程图
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={isCustom ? "custom" : selectedFlowchart.name}
                onChange={handleFlowchartChange}
                disabled={isCustom && isEditing}
              >
                {SAMPLE_FLOWCHARTS.map(chart => (
                  <option key={chart.name} value={chart.name}>
                    {chart.name}
                  </option>
                ))}
                {isCustom && <option value="custom">自定义流程图</option>}
              </select>
            </div>

            {/* 切换按钮 */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={toggleCustom}
                className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center"
                disabled={isEditing}
              >
                {isCustom ? (
                  <>
                    <FiCode className="mr-2" />
                    使用预设流程图
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" />
                    创建自定义流程图
                  </>
                )}
              </button>

              {isCustom && (
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  title="复制代码"
                >
                  <FiCopy />
                </button>
              )}
            </div>

            {/* 自定义流程图编辑器 */}
            {isCustom && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mermaid流程图代码
                  </label>
                  {isEditing ? (
                    <button
                      onClick={handleSaveCustom}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <FiSave className="mr-1" />
                      保存
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <FiEdit className="mr-1" />
                      编辑
                    </button>
                  )}
                </div>

                <textarea
                  className="w-full h-64 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                  value={customFlowchart}
                  onChange={handleCustomChange}
                  placeholder="输入Mermaid流程图代码..."
                  readOnly={!isEditing}
                />

                {flowchartError && (
                  <div className="mt-2 p-2 bg-red-50 text-red-600 text-sm rounded-md">
                    {flowchartError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 右侧面板 - 流程图显示 */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-[600px]">
            <ReactFlowProvider>
              <MermaidFlowchart
                chart={isCustom ? customFlowchart : selectedFlowchart.code}
                className="w-full h-full"
              />
            </ReactFlowProvider>
          </div>
        </div>
      </div>

      {/* 使用指南对话框 */}
      {showGuide && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" />
                  流程图使用指南
                </h2>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-4">
                <p className="mb-4 text-gray-700">
                  流程图编辑器可以帮助你创建和可视化程序流程图，支持多种节点类型和连接方式。
                </p>

                <h4 className="font-semibold text-blue-800 mb-2">基本操作</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>使用鼠标拖动可以平移整个流程图</li>
                  <li>使用鼠标滚轮可以缩放流程图</li>
                  <li>点击右上角的布局按钮可以切换垂直/水平布局</li>
                  <li>点击动画按钮可以启动/停止流程动画</li>
                  <li>点击导出按钮可以将流程图保存为图片</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">创建自定义流程图</h4>
                <ul className="list-disc pl-5 text-gray-700 mb-4">
                  <li>点击"创建自定义流程图"按钮进入编辑模式</li>
                  <li>使用Mermaid语法编写流程图代码</li>
                  <li>点击"保存"按钮应用更改</li>
                  <li>点击"复制代码"按钮可以复制当前流程图代码</li>
                </ul>

                <h4 className="font-semibold text-blue-800 mb-2">Mermaid语法示例</h4>
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4 font-mono text-sm">
                  flowchart TD<br/>
                  &nbsp;&nbsp;A[开始] --&gt; B[处理]<br/>
                  &nbsp;&nbsp;B --&gt; C{条件}<br/>
                  &nbsp;&nbsp;C --&gt;|是| D[路径1]<br/>
                  &nbsp;&nbsp;C --&gt;|否| E[路径2]<br/>
                  &nbsp;&nbsp;D --&gt; F[结束]<br/>
                  &nbsp;&nbsp;E --&gt; F
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowGuide(false)}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartContainer;
