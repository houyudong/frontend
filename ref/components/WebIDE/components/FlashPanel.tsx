import React from 'react';
import './FlashPanel.css';

interface FlashPanelProps {
  isConnected: boolean;
  onFlash: () => void;
  onVerify: () => void;
  onErase: () => void;
}

/**
 * FlashPanel - 烧录面板组件
 * 
 * 用于管理固件烧录操作。
 * 
 * @param {FlashPanelProps} props - 组件属性
 * @returns {React.ReactElement} 烧录面板组件
 */
const FlashPanel: React.FC<FlashPanelProps> = ({
  isConnected,
  onFlash,
  onVerify,
  onErase
}) => {
  return (
    <div className="flash-panel">
      <div className="flash-header">
        <h3>烧录</h3>
        <div className="flash-actions">
          <button
            className="flash-button"
            onClick={onFlash}
            disabled={!isConnected}
          >
            烧录
          </button>
          <button
            className="verify-button"
            onClick={onVerify}
            disabled={!isConnected}
          >
            验证
          </button>
          <button
            className="erase-button"
            onClick={onErase}
            disabled={!isConnected}
          >
            擦除
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashPanel; 