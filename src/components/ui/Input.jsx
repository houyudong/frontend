import React, { forwardRef } from 'react';

/**
 * Input - 输入框组件
 * 
 * 用于文本输入的表单控件。
 * 
 * @component
 * @example
 * ```jsx
 * <Input placeholder="请输入用户名" />
 * <Input type="password" placeholder="请输入密码" />
 * <Input variant="filled" label="电子邮箱" />
 * <Input isInvalid errorMessage="请输入有效的电子邮箱" />
 * ```
 */
const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  label,
  placeholder,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  // 变体样式映射
  const variantClasses = {
    default: 'bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    flushed: 'bg-transparent border-b border-gray-300 rounded-none px-0 focus:border-primary-500 focus:ring-0',
    unstyled: 'bg-transparent border-0 px-0 focus:ring-0',
  };
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-2.5 px-4 text-lg',
  };
  
  // 状态样式
  const stateClasses = isInvalid 
    ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500 text-danger-900' 
    : '';
  
  // 禁用样式
  const disabledClasses = isDisabled 
    ? 'opacity-50 cursor-not-allowed bg-gray-50' 
    : '';
  
  // 基础样式
  const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none';
  
  // 组合输入框样式
  const inputClasses = `
    ${baseClasses} 
    ${variantClasses[variant] || variantClasses.default} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${stateClasses} 
    ${disabledClasses} 
    ${leftIcon ? 'pl-10' : ''} 
    ${rightIcon ? 'pr-10' : ''} 
    ${className}
  `;
  
  // 输入框组件
  const inputElement = (
    <input
      ref={ref}
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      aria-invalid={isInvalid}
      aria-describedby={
        helperText ? `${props.id}-helper-text` : 
        errorMessage ? `${props.id}-error-message` : undefined
      }
      {...props}
    />
  );
  
  // 如果没有标签、帮助文本或错误消息，只返回输入框
  if (!label && !helperText && !errorMessage && !leftIcon && !rightIcon) {
    return inputElement;
  }
  
  return (
    <div className="w-full">
      {/* 标签 */}
      {label && (
        <label 
          htmlFor={props.id} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${isRequired ? 'required' : ''}`}
        >
          {label}
          {isRequired && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 输入框容器 */}
      <div className="relative">
        {/* 左侧图标 */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        {/* 输入框 */}
        {inputElement}
        
        {/* 右侧图标 */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* 帮助文本或错误消息 */}
      {(helperText || errorMessage) && (
        <div className="mt-1">
          {helperText && !isInvalid && (
            <p id={`${props.id}-helper-text`} className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
          {isInvalid && errorMessage && (
            <p id={`${props.id}-error-message`} className="text-sm text-danger-500">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
