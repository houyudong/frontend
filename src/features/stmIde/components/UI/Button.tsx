import React from 'react'
import Icon from './Icon'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconSize?: number
  className?: string
  onClick?: () => void
  title?: string
  id?: string
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconSize = 14,
  className = '',
  onClick,
  title,
  id,
  type = 'button'
}) => {
  const baseClasses = 'btn'
  const variantClasses = {
    default: '',
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    secondary: 'btn-secondary'
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1 h-7',
    md: 'text-sm px-3 py-1.5 h-8',
    lg: 'text-base px-4 py-2 h-10'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    'flex items-center gap-1',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      id={id}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      title={title}
    >
      {loading ? (
        <Icon name="refresh" size={iconSize} className="animate-spin" />
      ) : icon ? (
        <Icon name={icon} size={iconSize} />
      ) : null}
      {children}
    </button>
  )
}

export default Button
