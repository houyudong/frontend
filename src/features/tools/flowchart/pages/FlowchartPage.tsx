import React, { useState } from 'react';
import MainLayout from '../../../../pages/layout/MainLayout';

// 节点类型定义
const nodeTypes = {
  start: { label: '开始', color: '#10B981', shape: 'ellipse' },
  end: { label: '结束', color: '#EF4444', shape: 'ellipse' },
  process: { label: '处理', color: '#3B82F6', shape: 'rectangle' },
  decision: { label: '判断', color: '#F59E0B', shape: 'diamond' },
  input: { label: '输入', color: '#8B5CF6', shape: 'parallelogram' },
  output: { label: '输出', color: '#06B6D4', shape: 'parallelogram' },
  subroutine: { label: '子程序', color: '#EC4899', shape: 'rectangle' }
};

// 预定义模板
const templates = [
  {
    id: 'led-control',
    name: 'LED控制流程',
    description: '简单的LED控制算法流程',
    nodes: [
      { id: '1', type: 'default', position: { x: 250, y: 0 }, data: { label: '开始' }, style: { backgroundColor: '#10B981' } },
      { id: '2', type: 'default', position: { x: 250, y: 100 }, data: { label: '初始化GPIO' } },
      { id: '3', type: 'default', position: { x: 250, y: 200 }, data: { label: '读取按键状态' } },
      { id: '4', type: 'default', position: { x: 250, y: 300 }, data: { label: '按键按下？' }, style: { backgroundColor: '#F59E0B' } },
      { id: '5', type: 'default', position: { x: 100, y: 400 }, data: { label: '点亮LED' } },
      { id: '6', type: 'default', position: { x: 400, y: 400 }, data: { label: '熄灭LED' } },
      { id: '7', type: 'default', position: { x: 250, y: 500 }, data: { label: '延时' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5', label: '是' },
      { id: 'e4-6', source: '4', target: '6', label: '否' },
      { id: 'e5-7', source: '5', target: '7' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-3', source: '7', target: '3' },
    ]
  },
  {
    id: 'uart-communication',
    name: 'UART通信流程',
    description: 'UART串口通信处理流程',
    nodes: [
      { id: '1', type: 'default', position: { x: 250, y: 0 }, data: { label: '开始' }, style: { backgroundColor: '#10B981' } },
      { id: '2', type: 'default', position: { x: 250, y: 100 }, data: { label: '初始化UART' } },
      { id: '3', type: 'default', position: { x: 250, y: 200 }, data: { label: '等待数据' } },
      { id: '4', type: 'default', position: { x: 250, y: 300 }, data: { label: '接收到数据？' }, style: { backgroundColor: '#F59E0B' } },
      { id: '5', type: 'default', position: { x: 250, y: 400 }, data: { label: '处理数据' } },
      { id: '6', type: 'default', position: { x: 250, y: 500 }, data: { label: '发送响应' } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5', label: '是' },
      { id: 'e4-3', source: '4', target: '3', label: '否' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-3', source: '6', target: '3' },
    ]
  }
];

/**
 * FlowchartPage - 流程图工具页面
 *
 * 算法流程图设计工具，支持Mermaid代码生成
 */
const FlowchartPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [mermaidCode, setMermaidCode] = useState('');

  // 加载模板
  const loadTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    generateMermaidFromTemplate(template);
    setShowTemplates(false);
  };

  // 从模板生成Mermaid代码
  const generateMermaidFromTemplate = (template: typeof templates[0]) => {
    let code = 'flowchart TD\n';

    template.nodes.forEach(node => {
      const shape = getNodeShape(node.style?.backgroundColor);
      code += `    ${node.id}${shape}${node.data.label}${shape}\n`;
    });

    template.edges.forEach(edge => {
      const label = edge.label ? `|${edge.label}|` : '';
      code += `    ${edge.source} -->${label} ${edge.target}\n`;
    });

    setMermaidCode(code);
  };

  // 获取节点形状
  const getNodeShape = (color?: string) => {
    if (color === '#F59E0B') return '{'; // 判断节点用菱形
    if (color === '#10B981' || color === '#EF4444') return '(('; // 开始结束用圆形
    return '['; // 默认矩形
  };

  // 复制Mermaid代码
  const copyMermaidCode = () => {
    navigator.clipboard.writeText(mermaidCode);
    alert('Mermaid代码已复制到剪贴板！');
  };

  // 清空
  const clearAll = () => {
    setSelectedTemplate(null);
    setMermaidCode('');
  };

  return (
    <MainLayout>
      <div className="page-container">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">流程图工具</h1>
          <p className="text-gray-600">算法流程图设计工具，支持拖拽编辑和多种导出格式</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧工具栏 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 节点工具 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">节点工具</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {Object.entries(nodeTypes).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => addNode(type)}
                      className="w-full p-2 text-left text-sm border border-gray-200 rounded hover:bg-gray-50 flex items-center space-x-2"
                      style={{ borderLeftColor: config.color, borderLeftWidth: '4px' }}
                    >
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: config.color }}
                      />
                      <span>{config.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 操作工具 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">操作</h3>
              </div>
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="w-full btn-secondary text-sm"
                >
                  📋 加载模板
                </button>
                <button
                  onClick={clearAll}
                  className="w-full btn-secondary text-sm"
                >
                  🗑️ 清空
                </button>
                <button
                  onClick={copyMermaidCode}
                  disabled={!mermaidCode}
                  className="w-full btn-secondary text-sm disabled:opacity-50"
                >
                  📝 复制Mermaid
                </button>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">统计</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">当前模板:</span>
                    <span className="font-medium">{selectedTemplate?.name || '无'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">代码行数:</span>
                    <span className="font-medium">{mermaidCode.split('\n').length - 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧代码区域 */}
          <div className="lg:col-span-3">
            <div className="card">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Mermaid流程图代码</h3>
                <p className="text-sm text-gray-600 mt-1">选择模板生成Mermaid流程图代码</p>
              </div>
              <div className="p-4">
                {mermaidCode ? (
                  <div className="space-y-4">
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{mermaidCode}</pre>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={copyMermaidCode}
                        className="btn-primary"
                      >
                        📋 复制代码
                      </button>
                      <a
                        href={`https://mermaid.live/edit#pako:${btoa(mermaidCode)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        🔗 在线预览
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">选择流程图模板</h3>
                    <p className="text-gray-600 mb-4">从预定义模板开始创建流程图</p>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="btn-primary"
                    >
                      查看模板
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 模板选择模态框 */}
        {showTemplates && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">选择模板</h3>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      节点: {template.nodes.length} | 连接: {template.edges.length}
                    </div>
                    <button
                      onClick={() => loadTemplate(template)}
                      className="btn-primary w-full"
                    >
                      使用此模板
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-8 card">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">使用说明</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🎯 添加节点</h4>
                <p className="text-gray-600">点击左侧节点类型按钮在画布上添加节点</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔗 连接节点</h4>
                <p className="text-gray-600">拖拽节点边缘的连接点来创建节点间的连线</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📋 使用模板</h4>
                <p className="text-gray-600">选择预定义模板快速创建常用流程图</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💾 导出分享</h4>
                <p className="text-gray-600">支持导出JSON格式或生成Mermaid代码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FlowchartPage;
