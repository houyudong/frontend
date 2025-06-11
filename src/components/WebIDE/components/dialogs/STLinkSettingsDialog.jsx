import React from 'react';
import './STLinkSettingsDialog.css';

const STLinkSettingsDialog = ({
  show,
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>ST-Link 设置</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="settings-group">
            <label>OpenOCD 配置:</label>
            <div className="info-box">
              <p>ST-Link连接使用OpenOCD进行管理。</p>
              <p>支持的传输模式:</p>
              <ul>
                <li>SWD (Serial Wire Debug)</li>
                <li>JTAG</li>
              </ul>
            </div>
            <div className="settings-option">
              <label>传输模式:</label>
              <select className="settings-select">
                <option value="swd">SWD (默认)</option>
                <option value="jtag">JTAG</option>
              </select>
            </div>
          </div>
        </div>
        <div className="dialog-footer">
          <button className="dialog-button" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
};

export default STLinkSettingsDialog;
