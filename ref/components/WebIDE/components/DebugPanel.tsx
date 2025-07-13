import React, { useEffect, useRef } from 'react';
import './DebugPanel.css';

interface DebugPanelProps {
  sessionId: string;
  appendToDebugOutput: (text: string) => void;
}

/**
 * DebugPanel - 调试面板组件
 * 
 * 用于显示调试信息和控制调试会话。
 * 
 * @param {DebugPanelProps} props - 组件属性
 * @returns {React.ReactElement} 调试面板组件
 */
const DebugPanel: React.FC<DebugPanelProps> = ({
  sessionId,
  appendToDebugOutput
}) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (sessionId) {
      // 创建WebSocket连接
      const ws = new WebSocket(`ws://localhost:8080/debug/${sessionId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        appendToDebugOutput('调试会话已连接');
      };

      ws.onmessage = (event) => {
        appendToDebugOutput(event.data);
      };

      ws.onerror = (error) => {
        appendToDebugOutput(`调试会话错误: ${error}`);
      };

      ws.onclose = () => {
        appendToDebugOutput('调试会话已关闭');
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }
  }, [sessionId, appendToDebugOutput]);

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>调试面板</h3>
      </div>
      <div className="debug-content">
        {/* 这里可以添加更多的调试控制功能 */}
      </div>
    </div>
  );
};

export default DebugPanel; 