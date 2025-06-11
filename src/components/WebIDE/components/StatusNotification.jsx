import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaSync, FaTimes } from 'react-icons/fa';
import './StatusNotification.css';

/**
 * 状态通知组件 - 用于显示服务状态、错误和警告
 * @param {Object} props 组件属性
 * @param {string} props.type 通知类型: 'error', 'warning', 'success', 'info'
 * @param {string} props.title 通知标题
 * @param {string|React.ReactNode} props.message 通知消息内容
 * @param {boolean} props.show 是否显示通知
 * @param {Function} props.onClose 关闭通知的回调函数
 * @param {Array} props.actions 可选的操作按钮数组 [{label, onClick, icon}]
 * @param {boolean} props.dismissible 是否可以关闭
 * @param {number} props.autoHideDuration 自动隐藏的时间(毫秒)，0表示不自动隐藏
 */
const StatusNotification = ({
  type = 'info',
  title,
  message,
  show = false,
  onClose,
  actions = [],
  dismissible = true,
  autoHideDuration = 0
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isClosing, setIsClosing] = useState(false);

  // 当show属性变化时更新可见状态
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsClosing(false);
    } else {
      handleClose();
    }
  }, [show]);

  // 自动隐藏
  useEffect(() => {
    let timer;
    if (isVisible && autoHideDuration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoHideDuration]);

  // 处理关闭
  const handleClose = () => {
    setIsClosing(true);
    // 动画结束后再真正隐藏
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // 300ms是动画持续时间
  };

  if (!isVisible) return null;

  // 根据类型选择图标和样式
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="notification-icon error" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'info':
      default:
        return <FaInfoCircle className="notification-icon info" />;
    }
  };

  return (
    <div className={`status-notification ${type} ${isClosing ? 'closing' : ''}`}>
      <div className="notification-header">
        {getIcon()}
        <h3 className="notification-title">{title}</h3>
        {dismissible && (
          <button className="close-button" onClick={handleClose}>
            <FaTimes />
          </button>
        )}
      </div>
      
      <div className="notification-body">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
      
      {actions.length > 0 && (
        <div className="notification-actions">
          {actions.map((action, index) => (
            <button 
              key={index} 
              className="action-button" 
              onClick={action.onClick}
            >
              {action.icon && <span className="action-icon">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusNotification;
