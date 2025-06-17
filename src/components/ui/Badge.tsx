import React, { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

/**
 * Badge - 徽章组件
 * 
 * 用于显示状态、计数或标签的小型组件。
 * 
 * @component
 * @example
 * ```tsx
 * <Badge variant="primary">新</Badge>
 * <Badge variant="success" size="sm">已完成</Badge>
 * <Badge variant="danger" rounded>99+</Badge>
 * ```
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}) => {
  // 变体样式映射
  const variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    info: 'bg-info-100 text-info-800',
    light: 'bg-gray-100 text-gray-600',
    dark: 'bg-gray-700 text-white',
  };
  
  // 尺寸样式映射
  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-0.5',
  };
  
  // 圆角样式
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // 基础样式
  const baseClasses = 'inline-flex items-center font-medium';
  
  // 组合所有样式
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClasses} ${className}`;
  
  return (
    <span className={allClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge; 