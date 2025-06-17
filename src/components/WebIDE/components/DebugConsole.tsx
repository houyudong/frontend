import React from 'react';
import './DebugConsole.css';

interface DebugConsoleProps {
  debugOutput: string;
  onClear: () => void;
}

/**
 * DebugConsole - 调试控制台组件
 * 
 * 显示调试输出信息。
 * 
 * @param {DebugConsoleProps} props - 组件属性
 * @returns {React.ReactElement} 调试控制台组件
 */
const DebugConsole: React.FC<DebugConsoleProps> = ({
  debugOutput,
  onClear
}) => {
  return (
    <div className="debug-console">
      <div className="debug-output">
        <pre>{debugOutput}</pre>
      </div>
    </div>
  );
};

export default DebugConsole; 