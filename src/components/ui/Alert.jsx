import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

/**
 * Alert - 提示组件
 * 
 * 用于显示重要信息、成功消息、警告或错误的组件。
 * 
 * @component
 * @example
 * ```jsx
 * <Alert variant="info">这是一条信息提示</Alert>
 * <Alert variant="success" dismissible>操作成功！</Alert>
 * <Alert variant="warning" title="注意">请注意这个警告信息</Alert>
 * <Alert variant="danger" title="错误" dismissible>发生了一个错误</Alert>
 * ```
 */
const Alert = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  // 变体样式映射
  const variantClasses = {
    info: 'bg-info-50 text-info-800 border-info-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    danger: 'bg-danger-50 text-danger-800 border-danger-200',
  };
  
  // 图标映射
  const icons = {
    info: <FiInfo className="w-5 h-5 text-info-500" />,
    success: <FiCheckCircle className="w-5 h-5 text-success-500" />,
    warning: <FiAlertTriangle className="w-5 h-5 text-warning-500" />,
    danger: <FiAlertCircle className="w-5 h-5 text-danger-500" />,
  };
  
  // 基础样式
  const baseClasses = 'p-4 border-l-4 rounded-md flex';
  
  // 组合所有样式
  const allClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.info} ${className}`;
  
  return (
    <div className={allClasses} role="alert" {...props}>
      <div className="flex-shrink-0 mr-3">
        {icons[variant]}
      </div>
      <div className="flex-1">
        {title && (
          <h3 className="text-sm font-medium mb-1">{title}</h3>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
          onClick={onDismiss}
          aria-label="关闭"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
