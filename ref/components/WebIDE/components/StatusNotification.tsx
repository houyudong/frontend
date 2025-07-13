import React, { useEffect } from 'react';
import './StatusNotification.css';

interface StatusNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: React.ReactNode;
  show: boolean;
  onClose: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  dismissible?: boolean;
  autoHideDuration?: number;
}

/**
 * StatusNotification - 状态通知组件
 * 
 * 用于显示操作结果或系统状态的通知。
 * 
 * @param {StatusNotificationProps} props - 组件属性
 * @returns {React.ReactElement | null} 状态通知组件
 */
const StatusNotification: React.FC<StatusNotificationProps> = ({
  type,
  title,
  message,
  show,
  onClose,
  actions = [],
  dismissible = true,
  autoHideDuration = 5000
}) => {
  useEffect(() => {
    if (show && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, autoHideDuration, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className={`status-notification ${type}`}>
      <div className="notification-header">
        <h4>{title}</h4>
        {dismissible && (
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      <div className="notification-content">
        {message}
      </div>
      {actions.length > 0 && (
        <div className="notification-actions">
          {actions.map((action, index) => (
            <button
              key={index}
              className="action-button"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusNotification; 