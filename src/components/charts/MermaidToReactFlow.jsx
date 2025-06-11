import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
  NodeResizer
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
};

// 配置Dagre布局
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// 自动布局函数
const getLayoutedElements = (nodes, edges, direction = 'TB') => {
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
const parseMermaidToFlow = (mermaidContent) => {
  // 初始化节点和边的数组
  const nodes = [];
  const edges = [];
  
  // 简单解析流程图语法
  // 移除flowchart和graph前缀
  let content = mermaidContent.replace(/^\s*(flowchart|graph)\s+[A-Z]+\s*/i, '');
  
  // 分割行
  const lines = content.split('\n');
  
  // 节点ID映射
  const nodeMap = new Map();
  
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
        const node = {
          id: sourceId,
          data: { label: sourceId },
          style: { ...nodeStyles.base, ...nodeStyles.default },
        };
        nodes.push(node);
        nodeMap.set(sourceId, node);
      }
      
      if (!nodeMap.has(targetId)) {
        const node = {
          id: targetId,
          data: { label: targetId },
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
        node.data.label = nodeLabel;
      } else {
        // 创建新节点
        const node = {
          id: nodeId,
          data: { label: nodeLabel },
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

const MermaidToReactFlow = ({ mermaidContent, height = 400, className = '', onLayoutChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState(null);
  const [flowInstance, setFlowInstance] = useState(null);
  // 连接模式
  const [isConnectMode, setIsConnectMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  // 动画相关状态
  const [showAnimation, setShowAnimation] = useState(false);
  // 箭头类型状态
  const [arrowType, setArrowType] = useState('single'); // 'single' 或 'bidirectional'
  // 文本编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [fontSize, setFontSize] = useState(12);
  const [fontColor, setFontColor] = useState('#1E3A8A');

  // 布局方向状态
  const [direction, setDirection] = useState('TB');

  // 添加自定义事件监听器
  useEffect(() => {
    const handleEditNodeText = (event) => {
      const { nodeId, text } = event.detail;
      console.log('Edit node text event received:', nodeId, text);
      setIsEditing(true);
      setEditingNodeId(nodeId);
      setEditingText(text);
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('edit-node-text', handleEditNodeText);
    }
    
    return () => {
      if (wrapper) {
        wrapper.removeEventListener('edit-node-text', handleEditNodeText);
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
    } catch (err) {
      console.error("Error parsing Mermaid:", err);
      setError(`Failed to parse flowchart: ${err.message}`);
    }
  }, [mermaidContent, direction]);

  // 布局变更函数
  const onLayout = useCallback((direction) => {
    if (!nodes.length) return;
    
    // 设置布局方向
    setDirection(direction);
    
    // 应用布局算法
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      direction
    );
    
    // 添加动画
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
    
    // 更新节点和边
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    
    // 如果有回调函数，执行回调
    if (onLayoutChange) {
      onLayoutChange({ nodes: layoutedNodes, edges: layoutedEdges, direction });
    }
  }, [nodes, edges, onLayoutChange]);

  // 添加节点时的处理函数
  const handleAddNode = (nodeType) => {
    const nodeId = `node-${Date.now()}`;
    let newNode = {
      id: nodeId,
      data: {
        label: nodeType === 'start' ? '开始' :
               nodeType === 'end' ? '结束' :
               nodeType === 'process' ? '处理' :
               nodeType === 'decision' ? '判断' : '操作',
        fontSize: `${fontSize}px`,
        fontColor: fontColor
      },
      position: { x: 100, y: 100 },
      style: {
        ...nodeStyles.base,
        ...(nodeType === 'start' ? nodeStyles.start :
            nodeType === 'end' ? nodeStyles.end :
            nodeType === 'process' ? nodeStyles.process :
            nodeType === 'default' ? nodeStyles.default : {}),
        fontSize: `${fontSize}px`,
        color: fontColor,
      }
    };
    
    if (nodeType === 'decision') {
      newNode.type = 'diamond';
    } else {
      newNode.type = 'resizable';
    }
    
    setNodes((nds) => [...nds, newNode]);
  };
  
  // 切换连接模式
  const toggleConnectMode = () => {
    setIsConnectMode(!isConnectMode);
    setSelectedNode(null);
  };
  
  // 切换箭头类型
  const toggleArrowType = () => {
    setArrowType(arrowType === 'single' ? 'bidirectional' : 'single');
  };
  
  // 处理节点点击
  const onNodeClick = (event, node) => {
    if (!isConnectMode) return;
    
    if (!selectedNode) {
      // 第一次点击选择源节点
      setSelectedNode(node);
    } else if (selectedNode.id !== node.id) {
      // 第二次点击选择目标节点并创建连接
      const newEdge = {
        id: `edge-${selectedNode.id}-${node.id}-${Date.now()}`,
        source: selectedNode.id,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#3b82f6' }
      };
      
      // 根据箭头类型设置
      if (arrowType === 'single') {
        newEdge.markerEnd = {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        };
      } else {
        // 双向箭头
        newEdge.markerEnd = {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        };
        newEdge.markerStart = {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        };
      }
      
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNode(null); // 重置选择状态
    }
  };
  
  // 处理边的删除
  const onEdgeClick = (event, edge) => {
    if (window.confirm('是否删除此连接线？')) {
      setEdges((eds) => eds.filter(e => e.id !== edge.id));
    }
  };
  
  // 处理节点的删除
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    if (window.confirm('是否删除此节点？')) {
      setNodes((nds) => nds.filter(n => n.id !== node.id));
      // 同时删除与此节点相关的所有边
      setEdges((eds) => eds.filter(e => e.source !== node.id && e.target !== node.id));
    }
  };

  // 应用动画效果到节点
  const getNodeAnimationClass = (nodeId) => {
    if (!showAnimation) return '';
    
    // 为不同节点添加不同的动画延迟，创造波浪效果
    const nodeIndex = nodes.findIndex(n => n.id === nodeId);
    const delayFactor = nodeIndex % 5; // 0到4的延迟因子
    
    return `animate-bounce-in delay-${delayFactor}00`;
  };

  // 处理节点双击 - 编辑文本
  const onNodeDoubleClick = (event, node) => {
    // 如果已经在连接模式，则不进入编辑模式
    if (isConnectMode) return;
    
    // 设置当前选中的节点
    setSelectedNode(node);
    
    // 进入编辑模式
    setIsEditing(true);
    setEditingNodeId(node.id);
    setEditingText(node.data.label);
    
    // 阻止事件冒泡
    event.stopPropagation();
  };

  // 处理文本编辑提交
  const handleEditSubmit = () => {
    if (!editingNodeId) return;
    
    console.log('Submitting edit for node:', editingNodeId, 'New text:', editingText);
    
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === editingNodeId) {
        console.log('Updating node:', node);
        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            label: editingText
          }
        };
        console.log('Updated node:', updatedNode);
        return updatedNode;
      }
      return node;
    }));
    
    setIsEditing(false);
    setEditingNodeId(null);
    setEditingText('');
  };

  // 取消编辑
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditingNodeId(null);
    setEditingText('');
  };

  // 应用字体设置
  const applyFontSettings = () => {
    setNodes(nodes.map(node => {
      // Apply font settings to all nodes regardless of selection
      return {
        ...node,
        data: {
          ...node.data,
          fontSize: `${fontSize}px`,
          fontColor: fontColor
        },
        style: {
          ...node.style,
          fontSize: `${fontSize}px`,
          color: fontColor
        }
      };
    }));
    
    setShowFontSettings(false);
  };

  return (
    <div style={{ height: `${height}px`, width: '100%', display: 'flex' }} className={`reactflow-wrapper ${className}`}>
      {/* 左侧工具栏 */}
      <div className="flow-toolbar bg-white border-r border-gray-200 p-2 flex flex-col items-center" style={{ width: '50px' }}>
        <button 
          className="mb-3 p-2 rounded hover:bg-gray-100" 
          title="添加开始节点"
          onClick={() => handleAddNode('start')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="mb-3 p-2 rounded hover:bg-gray-100" 
          title="添加处理节点"
          onClick={() => handleAddNode('process')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="mb-3 p-2 rounded hover:bg-gray-100" 
          title="添加判断节点（菱形）"
          onClick={() => handleAddNode('decision')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 22 12 12 22 2 12" />
          </svg>
        </button>
        <button 
          className="mb-3 p-2 rounded hover:bg-gray-100" 
          title="添加结束节点"
          onClick={() => handleAddNode('end')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="border-t border-gray-200 my-2 w-full"></div>
        <button 
          className={`mb-3 p-2 rounded ${isConnectMode ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          title={isConnectMode ? "退出连接模式" : "进入连接模式"}
          onClick={toggleConnectMode}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z" />
            <path d="M11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
          </svg>
        </button>
        {/* 箭头类型切换按钮 */}
        <button 
          className={`mb-3 p-2 rounded hover:bg-gray-100 ${arrowType === 'bidirectional' ? 'bg-blue-100' : ''}`}
          title={arrowType === 'single' ? "切换到双向箭头" : "切换到单向箭头"}
          onClick={toggleArrowType}
        >
          {arrowType === 'single' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H7.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0L7.414 9H12.586L10.293 6.707a1 1 0 011.414-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        {/* 字体设置按钮 */}
        <button 
          className="mb-3 p-2 rounded hover:bg-gray-100"
          title="字体设置"
          onClick={() => setShowFontSettings(!showFontSettings)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            <path fillRule="evenodd" d="M8 1a3 3 0 00-3 3v8a3 3 0 003 3h8a3 3 0 003-3V7.414A3 3 0 0017.586 6L14 2.414A3 3 0 0011.586 1H8zm5 5a1 1 0 001 1h1a1 1 0 110 2h-1a1 1 0 01-1-1H9a1 1 0 110-2h4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* 流程图区域 */}
      <div style={{ flex: 1, position: 'relative' }}>
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                className: getNodeAnimationClass(node.id)
              }))}
              edges={edges.map(edge => ({
                ...edge,
                animated: showAnimation || edge.animated
              }))}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onInit={(instance) => {
                setFlowInstance(instance);
                
                // 注册自定义节点
                instance.setNodes(nodes.map(node => {
                  if (node.type === 'diamond') {
                    return {
                      ...node,
                      type: 'diamond'
                    };
                  }
                  if (!node.type || node.type === 'default') {
                    return {
                      ...node,
                      type: 'resizable'
                    };
                  }
                  return node;
                }));
              }}
              onNodeClick={onNodeClick}
              onNodeDoubleClick={onNodeDoubleClick}
              onEdgeClick={onEdgeClick}
              onNodeContextMenu={onNodeContextMenu}
              fitView
              attributionPosition="bottom-right"
              onConnect={(params) => {
                // 这个回调会在使用内置的连接机制时触发
                const newEdge = {
                  ...params,
                  type: 'smoothstep',
                  style: { stroke: '#3b82f6' },
                  id: `edge-${params.source}-${params.target}-${Date.now()}`
                };
                
                // 根据箭头类型设置
                if (arrowType === 'single') {
                  newEdge.markerEnd = {
                    type: MarkerType.ArrowClosed,
                    color: '#3b82f6',
                  };
                } else {
                  // 双向箭头
                  newEdge.markerEnd = {
                    type: MarkerType.ArrowClosed,
                    color: '#3b82f6',
                  };
                  newEdge.markerStart = {
                    type: MarkerType.ArrowClosed,
                    color: '#3b82f6',
                  };
                }
                
                setEdges((eds) => [...eds, newEdge]);
              }}
              connectionLineStyle={{ stroke: '#3b82f6' }}
              connectionMode="loose"
              nodeTypes={{
                diamond: DiamondShapeNode,
                resizable: ResizableNode
              }}
            >
              <Controls />
              <Background color="#f8fafc" gap={16} />
              <Panel position="top-right">
                <div className="layout-buttons flex space-x-2">
                  <button 
                    onClick={() => onLayout('TB')}
                    className="bg-white border border-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    垂直布局
                  </button>
                  <button 
                    onClick={() => onLayout('LR')}
                    className="bg-white border border-gray-200 px-2 py-1 rounded text-sm hover:bg-gray-50"
                  >
                    水平布局
                  </button>
                </div>
              </Panel>
              {isConnectMode && (
                <Panel position="top-left">
                  <div className={`bg-blue-100 border border-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm ${selectedNode ? 'animate-pulse' : ''}`}>
                    {selectedNode 
                      ? `已选择源节点 "${selectedNode.data.label}", 请选择目标节点`
                      : '连接模式：请先选择源节点'}
                  </div>
                </Panel>
              )}
            </ReactFlow>
            
            {/* 文字编辑弹窗 */}
            {isEditing && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg w-80">
                  <h3 className="text-lg font-semibold mb-3">编辑节点文字</h3>
                  <textarea
                    className="w-full border border-gray-300 rounded p-2 mb-3"
                    rows={3}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                      onClick={handleEditCancel}
                    >
                      取消
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-500 rounded text-white hover:bg-blue-600"
                      onClick={handleEditSubmit}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* 字体设置面板 */}
            {showFontSettings && (
              <div className="absolute right-4 top-14 bg-white p-3 rounded-lg shadow-md border border-gray-200 z-10 w-64">
                <h3 className="text-sm font-semibold mb-2">字体设置</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">字体大小</label>
                    <div className="flex items-center">
                      <input 
                        type="range" 
                        min="8" 
                        max="24" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))} 
                        className="flex-grow"
                      />
                      <span className="ml-2 text-sm">{fontSize}px</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">字体颜色</label>
                    <input 
                      type="color" 
                      value={fontColor} 
                      onChange={(e) => setFontColor(e.target.value)} 
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 text-sm"
                      onClick={() => setShowFontSettings(false)}
                    >
                      取消
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-500 rounded text-white hover:bg-blue-600 text-sm"
                      onClick={applyFontSettings}
                    >
                      应用
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MermaidToReactFlow; 