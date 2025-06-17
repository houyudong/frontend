import React, { ReactNode } from 'react';
import { Link, LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit' | 'reset';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
}

interface ButtonButtonProps extends BaseButtonProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: ButtonType;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface ButtonLinkProps extends BaseButtonProps, Omit<LinkProps, 'className'> {
  to: string;
}

interface ButtonAnchorProps extends BaseButtonProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

type ButtonProps = ButtonButtonProps | ButtonLinkProps | ButtonAnchorProps;

/**
 * Button - 通用按钮组件
 *
 * 用于触发操作或导航的交互式按钮组件。支持多种变体、尺寸和状态。
 * 可以作为普通按钮、路由链接或外部链接使用。
 *
 * @component
 * @example
 * ```tsx
 * // 基本用法
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   点击我
 * </Button>
 *
 * // 作为路由链接
 * <Button variant="outline" to="/about">
 *   关于我们
 * </Button>
 *
 * // 禁用状态
 * <Button variant="danger" disabled>
 *   禁用按钮
 * </Button>
 *
 * // 带图标的按钮
 * <Button variant="success">
 *   <FiCheck className="mr-2" /> 确认
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  // 变体样式映射
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    success: 'bg-success-500 hover:bg-success-600 text-white focus:ring-success-400',
    danger: 'bg-danger-500 hover:bg-danger-600 text-white focus:ring-danger-400',
    warning: 'bg-warning-500 hover:bg-warning-600 text-black focus:ring-warning-400',
    info: 'bg-info-500 hover:bg-info-600 text-white focus:ring-info-400',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };

  // 尺寸样式映射
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-2.5 px-5 text-lg',
  };

  // 禁用状态样式
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  // 基础样式
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  // 组合所有样式
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  // 如果提供了to属性，渲染为Link组件
  if ('to' in props) {
    const { to, ...linkProps } = props as ButtonLinkProps;
    return (
      <Link to={to} className={allClasses} {...linkProps}>
        {children}
      </Link>
    );
  }

  // 如果提供了href属性，渲染为a标签
  if ('href' in props) {
    const { href, ...anchorProps } = props as ButtonAnchorProps;
    return (
      <a href={href} className={allClasses} {...anchorProps}>
        {children}
      </a>
    );
  }

  // 默认渲染为button标签
  const { type = 'button', onClick, ...buttonProps } = props as ButtonButtonProps;
  return (
    <button
      type={type}
      className={allClasses}
      disabled={disabled}
      onClick={onClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button; 