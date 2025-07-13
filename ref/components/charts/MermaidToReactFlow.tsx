import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  NodeResizer,
  Node,
  Edge,
  ReactFlowInstance,
  NodeProps as ReactFlowNodeProps
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import './MermaidToReactFlow.css';
import { DiamondShapeNode, ResizableNode } from './ReactFlowNodes';

// 自定义节点样式 
const nodeStyles = {
  base: {
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    textAlign: 'center',
    border: '1px solid #1a192b',
    width: 'auto',
    minWidth: '150px'
  },
  default: {
    background: '#f0f9ff',
    border: '1px solid #3b82f6',
    color: '#1e3a8a'
  },
  start: {
    background: '#e6f7ff',
    color: '#1890ff',
    border: '1px solid #91d5ff'
  },
  end: {
    background: '#fff2e8',
    color: '#fa541c',
    border: '1px solid #ffbb96'
  },
  process: {
    background: '#f6ffed',
    color: '#52c41a',
    border: '1px solid #b7eb8f'
  },
  decision: {
    background: '#fff7e6',
    color: '#fa8c16',
    border: '1px solid #ffd591'
  }
} as const;

// 配置Dagre布局
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// 自动布局函数
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  // 为每个节点设置尺寸
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 });
  });

  // 添加边
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 计算布局
  dagre.layout(dagreGraph);

  // 应用计算得到的坐标
  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWithPosition.width / 2,
          y: nodeWithPosition.y - nodeWithPosition.height / 2,
        },
      };
    }),
    edges,
  };
};

// 解析Mermaid语法并转换为ReactFlow格式
const parseMermaidToFlow = (mermaidContent: string) => {
  // 初始化节点和边的数组
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // 简单解析流程图语法
  // 移除flowchart和graph前缀
  let content = mermaidContent.replace(/^\s*(flowchart|graph)\s+[A-Z]+\s*/i, '');
  
  // 分割行
  const lines = content.split('\n');
  
  // 节点ID映射
  const nodeMap = new Map<string, Node>();
  
  // 处理每一行
  lines.forEach((line, index) => {
    line = line.trim();
    
    // 跳过空行和注释
    if (!line || line.startsWith('%')) return;
    
    // 跳过style行和subgraph相关行
    if (line.startsWith('style') || line.startsWith('subgraph') || line === 'end') return;
    
    // 处理节点连接 (A --> B)
    const connectionMatch = line.match(/([A-Za-z0-9_]+)\s*--+>?\s*([A-Za-z0-9_]+)(\[.*?\])?/);
    if (connectionMatch) {
      const sourceId = connectionMatch[1];
      const targetId = connectionMatch[2];
      const label = connectionMatch[3] ? connectionMatch[3].replace(/\[|\]/g, '') : '';
      
      // 添加边
      edges.push({
        id: `e${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        label: label,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
      });
      
      // 如果节点不在映射中，添加基本节点
      if (!nodeMap.has(sourceId)) {
        const node: Node = {
          id: sourceId,
          data: { label: sourceId },
          position: { x: 0, y: 0 }, // 添加必需的 position 属性
          style: { ...nodeStyles.base, ...nodeStyles.default },
        };
        nodes.push(node);
        nodeMap.set(sourceId, node);
      }
      
      if (!nodeMap.has(targetId)) {
        const node: Node = {
          id: targetId,
          data: { label: targetId },
          position: { x: 0, y: 0 }, // 添加必需的 position 属性
          style: { ...nodeStyles.base, ...nodeStyles.default },
        };
        nodes.push(node);
        nodeMap.set(targetId, node);
      }
      
      return;
    }
    
    // 处理节点定义 (A[Text])
    const nodeMatch = line.match(/([A-Za-z0-9_]+)\s*\[(["']?)(.*?)\2\]/);
    if (nodeMatch) {
      const nodeId = nodeMatch[1];
      const nodeLabel = nodeMatch[3];
      
      if (nodeMap.has(nodeId)) {
        // 更新现有节点的标签
        const node = nodeMap.get(nodeId);
        if (node) {
          node.data.label = nodeLabel;
        }
      } else {
        // 创建新节点
        const node: Node = {
          id: nodeId,
          data: { label: nodeLabel },
          position: { x: 0, y: 0 }, // 添加必需的 position 属性
          style: { ...nodeStyles.base, ...nodeStyles.default },
        };
        nodes.push(node);
        nodeMap.set(nodeId, node);
      }
    }
  });
  
  // 应用布局算法
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
  
  return { nodes: layoutedNodes, edges: layoutedEdges };
};

interface MermaidToReactFlowProps {
  mermaidContent: string;
  height?: number;
  className?: string;
  onLayoutChange?: (nodes: Node[], edges: Edge[]) => void;
}

const MermaidToReactFlow: React.FC<MermaidToReactFlowProps> = ({ 
  mermaidContent, 
  height = 400, 
  className = '', 
  onLayoutChange 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);
  // 连接模式
  const [isConnectMode, setIsConnectMode] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  // 动画相关状态
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  // 箭头类型状态
  const [arrowType, setArrowType] = useState<'single' | 'bidirectional'>('single');
  // 文本编辑状态
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const [showFontSettings, setShowFontSettings] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(12);
  const [fontColor, setFontColor] = useState<string>('#1E3A8A');

  // 布局方向状态
  const [direction, setDirection] = useState<'TB' | 'LR'>('TB');

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 添加自定义事件监听器
  useEffect(() => {
    const handleEditNodeText = (event: CustomEvent<{ nodeId: string; text: string }>) => {
      const { nodeId, text } = event.detail;
      console.log('Edit node text event received:', nodeId, text);
      setIsEditing(true);
      setEditingNodeId(nodeId);
      setEditingText(text);
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('edit-node-text', handleEditNodeText as EventListener);
    }
    
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('edit-node-text', handleEditNodeText as EventListener);
      }
    };
  }, []);

  useEffect(() => {
    if (!mermaidContent) {
      setError("No flowchart content provided");
      return;
    }

    try {
      // 解析Mermaid内容
      const { nodes: parsedNodes, edges: parsedEdges } = parseMermaidToFlow(mermaidContent);
      
      // 应用布局并设置节点和边
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        parsedNodes,
        parsedEdges,
        direction
      );
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setError(null);
      
      // 调用布局变更回调
      if (onLayoutChange) {
        onLayoutChange(layoutedNodes, layoutedEdges);
      }
    } catch (err) {
      console.error('解析流程图失败:', err);
      setError(err instanceof Error ? err.message : '解析流程图失败');
    }
  }, [mermaidContent, direction, onLayoutChange]);

  const handleAddNode = (nodeType: string) => {
    const newNodeId = `node_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      data: { label: '新节点' },
      position: { x: 100, y: 100 },
      style: { ...nodeStyles.base, ...nodeStyles[nodeType as keyof typeof nodeStyles] },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const toggleConnectMode = () => {
    setIsConnectMode(!isConnectMode);
  };

  const toggleArrowType = () => {
    setArrowType(arrowType === 'single' ? 'bidirectional' : 'single');
  };

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    if (isConnectMode && selectedNode) {
      // 创建新边
      const newEdge = {
        id: `e${selectedNode.id}-${node.id}`,
        source: selectedNode.id,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
      };
      
      setEdges((eds) => [...eds, newEdge]);
      setIsConnectMode(false);
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
    }
  };

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    // 处理边点击事件
    console.log('Edge clicked:', edge);
  };

  const onNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    // 处理节点右键菜单
    console.log('Node context menu:', node);
  };

  const getNodeAnimationClass = (nodeId: string) => {
    if (!showAnimation) return '';
    // 根据节点ID返回动画类名
    return 'animate-pulse';
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setIsEditing(true);
    setEditingNodeId(node.id);
    setEditingText(node.data.label);
  };

  const handleEditSubmit = () => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNodeId
            ? { ...node, data: { ...node.data, label: editingText } }
            : node
        )
      );
      setIsEditing(false);
      setEditingNodeId(null);
      setEditingText('');
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingNodeId(null);
    setEditingText('');
  };

  const applyFontSettings = () => {
    if (editingNodeId) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNodeId
            ? {
                ...node,
                style: {
                  ...node.style,
                  fontSize: `${fontSize}px`,
                  color: fontColor,
                },
              }
            : node
        )
      );
      setShowFontSettings(false);
    }
  };

  return (
    <div ref={wrapperRef} className={`mermaid-to-reactflow ${className}`} style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeContextMenu={onNodeContextMenu}
        onNodeDoubleClick={onNodeDoubleClick}
        onInit={setFlowInstance}
        nodeTypes={{
          diamond: DiamondShapeNode as React.ComponentType<ReactFlowNodeProps>,
          default: ResizableNode as React.ComponentType<ReactFlowNodeProps>,
        }}
        fitView
      >
        <Controls />
        <Background />
        <Panel position="top-right">
          <div className="flex space-x-2">
            <button
              onClick={() => handleAddNode('default')}
              className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              添加节点
            </button>
            <button
              onClick={toggleConnectMode}
              className={`px-3 py-1 rounded ${
                isConnectMode
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              连接模式
            </button>
            <button
              onClick={toggleArrowType}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              切换箭头
            </button>
          </div>
        </Panel>
      </ReactFlow>

      {/* 文本编辑对话框 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">编辑节点文本</h3>
            <textarea
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full h-32 p-2 border rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 字体设置对话框 */}
      {showFontSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">字体设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  字体大小
                </label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                  min="8"
                  max="32"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  字体颜色
                </label>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-full h-10 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowFontSettings(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={applyFontSettings}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 p-4 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default MermaidToReactFlow; 