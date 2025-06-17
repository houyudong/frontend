import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  color?: SpinnerColor;
  label?: string;
  className?: string;
}

/**
 * Spinner - 加载指示器组件
 * 
 * 用于指示加载状态的旋转动画组件。
 * 
 * @component
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner size="lg" color="primary" />
 * <Spinner size="sm" color="success" label="加载中..." />
 * ```
 */
const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
  className = '',
  ...props
}) => {
  // 尺寸样式映射
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };
  
  // 颜色样式映射
  const colorClasses: Record<SpinnerColor, string> = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-gray-200 border-t-gray-600',
    success: 'border-success-200 border-t-success-600',
    danger: 'border-danger-200 border-t-danger-600',
    warning: 'border-warning-200 border-t-warning-600',
    info: 'border-info-200 border-t-info-600',
    light: 'border-gray-100 border-t-gray-300',
    dark: 'border-gray-600 border-t-gray-900',
  };
  
  // 基础样式
  const baseClasses = 'inline-block rounded-full animate-spin';
  
  // 组合所有样式
  const spinnerClasses = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;
  
  // 如果有标签，则显示标签和spinner
  if (label) {
    return (
      <div className="inline-flex items-center" {...props}>
        <div className={spinnerClasses} role="status" aria-label={label} />
        <span className="ml-2">{label}</span>
      </div>
    );
  }
  
  // 否则只显示spinner
  return (
    <div className={spinnerClasses} role="status" aria-label="加载中" {...props} />
  );
};

export default Spinner; 