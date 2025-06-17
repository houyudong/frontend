import React, { useState, useEffect } from 'react';
import './BuildSettings.css';

interface BuildSettings {
  optimizationLevel: string;
  debugInfo: boolean;
  targetMcu: string;
  outputFormat: string;
  additionalOptions: string;
}

interface BuildSettingsProps {
  show: boolean;
  onClose: () => void;
  onSave: (settings: BuildSettings) => void;
  settings?: BuildSettings;
}

/**
 * BuildSettings - 构建设置组件
 * 
 * 用于配置项目编译选项的对话框。
 * 
 * @param {BuildSettingsProps} props - 组件属性
 * @returns {React.ReactElement | null} 构建设置组件
 */
const BuildSettings: React.FC<BuildSettingsProps> = ({
  show,
  onClose,
  onSave,
  settings
}) => {
  const [localSettings, setLocalSettings] = useState<BuildSettings>({
    optimizationLevel: 'debug',
    debugInfo: true,
    targetMcu: 'STM32F103C8T6',
    outputFormat: 'hex',
    additionalOptions: ''
  });

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (!show) {
    return null;
  }

  const handleSave = (): void => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="build-settings-overlay">
      <div className="build-settings">
        <div className="dialog-header">
          <h2>构建设置</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="dialog-content">
          <div className="setting-group">
            <label>优化级别</label>
            <select
              value={localSettings.optimizationLevel}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, optimizationLevel: e.target.value })
              }
            >
              <option value="debug">调试 (-O0)</option>
              <option value="release">发布 (-O2)</option>
              <option value="optimize">优化 (-O3)</option>
            </select>
          </div>
          <div className="setting-group">
            <label>调试信息</label>
            <input
              type="checkbox"
              checked={localSettings.debugInfo}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, debugInfo: e.target.checked })
              }
            />
          </div>
          <div className="setting-group">
            <label>目标MCU</label>
            <input
              type="text"
              value={localSettings.targetMcu}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, targetMcu: e.target.value })
              }
            />
          </div>
          <div className="setting-group">
            <label>输出格式</label>
            <select
              value={localSettings.outputFormat}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, outputFormat: e.target.value })
              }
            >
              <option value="hex">HEX</option>
              <option value="bin">BIN</option>
              <option value="elf">ELF</option>
            </select>
          </div>
          <div className="setting-group">
            <label>附加选项</label>
            <input
              type="text"
              value={localSettings.additionalOptions}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, additionalOptions: e.target.value })
              }
              placeholder="输入额外的编译选项"
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

export default BuildSettings; 