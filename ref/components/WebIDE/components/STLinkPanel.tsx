import React from 'react';
import './STLinkPanel.css';

interface STLinkPanelProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSettings: () => void;
}

/**
 * STLinkPanel - ST-Link面板组件
 * 
 * 用于管理ST-Link调试器连接。
 * 
 * @param {STLinkPanelProps} props - 组件属性
 * @returns {React.ReactElement} ST-Link面板组件
 */
const STLinkPanel: React.FC<STLinkPanelProps> = ({
  isConnected,
  onConnect,
  onDisconnect,
  onSettings
}) => {
  return (
    <div className="stlink-panel">
      <div className="stlink-header">
        <h3>ST-Link</h3>
        <div className="stlink-actions">
          <button
            className={`connect-button ${isConnected ? 'connected' : ''}`}
            onClick={isConnected ? onDisconnect : onConnect}
          >
            {isConnected ? '断开连接' : '连接'}
          </button>
          <button
            className="settings-button"
            onClick={onSettings}
            disabled={!isConnected}
          >
            设置
          </button>
        </div>
      </div>
      <div className="stlink-status">
        <div className={`status-indicator ${isConnected ? 'connected' : ''}`} />
        <span className="status-text">
          {isConnected ? '已连接' : '未连接'}
        </span>
      </div>
    </div>
  );
};

export default STLinkPanel; 