import React, { useState } from 'react';
import { FaExclamationTriangle, FaSync, FaServer, FaTerminal } from 'react-icons/fa';
import './ServiceStatusDialog.css';

const ServiceStatusDialog = ({
  show,
  onSetCliPath
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!show) return null;

  // 刷新页面
  const handleRefresh = () => {
    setIsRefreshing(true);
    // 延迟一下再刷新，让用户看到按钮状态变化
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>
            <FaExclamationTriangle className="warning-icon" />
            STM32服务未运行
          </h3>
        </div>
        <div className="dialog-body">
          <p>无法连接到STM32服务。请确保:</p>
          <ol>
            <li>STM32服务已启动并正在运行</li>
            <li>服务地址配置正确</li>
            <li>OpenOCD已正确配置</li>
          </ol>

          <div className="troubleshooting-section">
            <h4>故障排除步骤:</h4>
            <ol>
              <li>检查STM32服务是否已启动 (stmgdbserver)</li>
              <li>确认服务运行在正确的端口 (默认5000)</li>
              <li>检查浏览器控制台是否有CORS或网络错误</li>
              <li>尝试重启服务和刷新页面</li>
            </ol>
          </div>

          <div className="action-buttons">
            <button
              className={`primary-button ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FaSync className={`button-icon ${isRefreshing ? 'spinning' : ''}`} />
              {isRefreshing ? '正在刷新...' : '刷新页面'}
            </button>
            <button
              className="secondary-button"
              onClick={() => window.open('/api/docs', '_blank')}
            >
              <FaTerminal className="button-icon" />
              查看API文档
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStatusDialog;
