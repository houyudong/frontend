/**
 * 统一的按钮组件
 * 
 * 提供一致的按钮样式和交互体验
 */

import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  // 基础样式类名
  const getButtonClasses = () => {
    const classes = ['btn', `btn-${variant}`, `btn-${size}`];

    if (fullWidth) {
      classes.push('w-full');
    }

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  };

  // 加载动画组件
  const LoadingSpinner = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      size === 'xs' ? 'w-3 h-3' :
      size === 'sm' ? 'w-4 h-4' :
      size === 'md' ? 'w-4 h-4' :
      size === 'lg' ? 'w-5 h-5' : 'w-6 h-6'
    )} />
  );

  // 渲染图标
  const renderIcon = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    return icon;
  };

  return (
    <button
      className={getButtonClasses()}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      <span>{children}</span>
      {iconPosition === 'right' && !loading && icon}
    </button>
  );
};

export default Button;
