import React, { useState } from 'react';
import './STLinkSettingsDialog.css';

interface STLinkSettingsDialogProps {
  show: boolean;
  onClose: () => void;
}

/**
 * STLinkSettingsDialog - ST-Link设置对话框组件
 * 
 * 用于配置ST-Link调试器连接的对话框。
 * 
 * @param {STLinkSettingsDialogProps} props - 组件属性
 * @returns {React.ReactElement | null} ST-Link设置对话框组件
 */
const STLinkSettingsDialog: React.FC<STLinkSettingsDialogProps> = ({
  show,
  onClose
}) => {
  const [settings, setSettings] = useState({
    port: 'SWD',
    speed: '1000',
    resetMode: 'normal',
    connectUnderReset: false
  });

  if (!show) {
    return null;
  }

  const handleSave = (): void => {
    // TODO: 实现保存设置的功能
    onClose();
  };

  return (
    <div className="stlink-settings-overlay">
      <div className="stlink-settings">
        <div className="dialog-header">
          <h2>ST-Link设置</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="dialog-content">
          <div className="setting-group">
            <label>端口</label>
            <select
              value={settings.port}
              onChange={(e) =>
                setSettings({ ...settings, port: e.target.value })
              }
            >
              <option value="SWD">SWD</option>
              <option value="JTAG">JTAG</option>
            </select>
          </div>
          <div className="setting-group">
            <label>速度 (kHz)</label>
            <select
              value={settings.speed}
              onChange={(e) =>
                setSettings({ ...settings, speed: e.target.value })
              }
            >
              <option value="1000">1000</option>
              <option value="500">500</option>
              <option value="200">200</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="setting-group">
            <label>复位模式</label>
            <select
              value={settings.resetMode}
              onChange={(e) =>
                setSettings({ ...settings, resetMode: e.target.value })
              }
            >
              <option value="normal">正常</option>
              <option value="hardware">硬件复位</option>
              <option value="core">内核复位</option>
            </select>
          </div>
          <div className="setting-group">
            <label>复位时连接</label>
            <input
              type="checkbox"
              checked={settings.connectUnderReset}
              onChange={(e) =>
                setSettings({ ...settings, connectUnderReset: e.target.checked })
              }
            />
          </div>
        </div>
        <div className="dialog-footer">
          <button className="cancel-button" onClick={onClose}>
            取消
          </button>
          <button className="save-button" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default STLinkSettingsDialog; 