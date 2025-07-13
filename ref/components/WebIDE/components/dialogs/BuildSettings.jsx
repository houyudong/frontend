import React, { useState } from 'react';
import './BuildSettings.css';

// 构建设置对话框组件
const BuildSettings = ({ 
  show, 
  onClose, 
  onSave, 
  settings = {
    optimizationLevel: 'debug',
    debugInfo: true,
    targetMcu: 'STM32F103ZET6',
    outputFormat: 'hex',
    additionalOptions: ''
  }
}) => {
  const [optimizationLevel, setOptimizationLevel] = useState(settings.optimizationLevel);
  const [debugInfo, setDebugInfo] = useState(settings.debugInfo);
  const [targetMcu, setTargetMcu] = useState(settings.targetMcu);
  const [outputFormat, setOutputFormat] = useState(settings.outputFormat);
  const [additionalOptions, setAdditionalOptions] = useState(settings.additionalOptions);
  
  // 处理保存设置
  const handleSave = () => {
    onSave({
      optimizationLevel,
      debugInfo,
      targetMcu,
      outputFormat,
      additionalOptions
    });
    onClose();
  };
  
  if (!show) {
    return null;
  }
  
  return (
    <div className="dialog-overlay">
      <div className="dialog-content build-settings-dialog">
        <div className="dialog-header">
          <h3>构建设置</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="dialog-body">
          <div className="form-group">
            <label htmlFor="optimizationLevel">优化级别</label>
            <select 
              id="optimizationLevel" 
              value={optimizationLevel}
              onChange={(e) => setOptimizationLevel(e.target.value)}
            >
              <option value="debug">Debug (-O0)</option>
              <option value="size">Size (-Os)</option>
              <option value="speed">Speed (-O2)</option>
              <option value="max">Maximum (-O3)</option>
            </select>
            <div className="help-text">
              Debug: 无优化，便于调试<br />
              Size: 优化代码大小<br />
              Speed: 优化执行速度<br />
              Maximum: 最大优化
            </div>
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={debugInfo}
                onChange={(e) => setDebugInfo(e.target.checked)}
              />
              包含调试信息
            </label>
            <div className="help-text">
              生成调试信息，便于使用调试器进行调试
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="targetMcu">目标MCU</label>
            <select 
              id="targetMcu" 
              value={targetMcu}
              onChange={(e) => setTargetMcu(e.target.value)}
            >
              <option value="STM32F103C8T6">STM32F103C8T6 (Blue Pill)</option>
              <option value="STM32F103RBT6">STM32F103RBT6</option>
              <option value="STM32F103RCT6">STM32F103RCT6</option>
              <option value="STM32F103VET6">STM32F103VET6</option>
              <option value="STM32F103ZET6">STM32F103ZET6</option>
              <option value="STM32F407VET6">STM32F407VET6</option>
              <option value="STM32F407ZGT6">STM32F407ZGT6</option>
              <option value="STM32H743ZIT6">STM32H743ZIT6</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="outputFormat">输出格式</label>
            <select 
              id="outputFormat" 
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
            >
              <option value="hex">Intel HEX (.hex)</option>
              <option value="bin">Binary (.bin)</option>
              <option value="both">Both HEX and Binary</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalOptions">附加选项</label>
            <input 
              type="text" 
              id="additionalOptions" 
              value={additionalOptions}
              onChange={(e) => setAdditionalOptions(e.target.value)}
              placeholder="附加的GCC编译选项"
            />
            <div className="help-text">
              附加的GCC编译选项，多个选项用空格分隔
            </div>
          </div>
        </div>
        
        <div className="dialog-footer">
          <button className="dialog-button cancel-button" onClick={onClose}>
            取消
          </button>
          <button className="dialog-button primary-button" onClick={handleSave}>
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildSettings;
