import React from 'react';
import './BuildPanel.css';

interface BuildPanelProps {
  buildOutput: string;
  buildErrors: any[];
  onClear: () => void;
}

/**
 * BuildPanel - 构建输出面板组件
 * 
 * 显示编译输出和错误信息。
 * 
 * @param {BuildPanelProps} props - 组件属性
 * @returns {React.ReactElement} 构建输出面板组件
 */
const BuildPanel: React.FC<BuildPanelProps> = ({
  buildOutput,
  buildErrors,
  onClear
}) => {
  return (
    <div className="build-panel">
      <div className="build-output">
        <pre>{buildOutput}</pre>
      </div>
      {buildErrors.length > 0 && (
        <div className="build-errors">
          <h3>错误信息</h3>
          <ul>
            {buildErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BuildPanel; 