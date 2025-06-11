import React, { forwardRef } from 'react';

/**
 * Checkbox - 复选框组件
 * 
 * 用于选择多个选项的复选框组件。
 * 
 * @component
 * @example
 * ```jsx
 * <Checkbox label="同意条款" />
 * <Checkbox label="记住我" defaultChecked />
 * <Checkbox label="禁用选项" isDisabled />
 * ```
 */
const Checkbox = forwardRef(({
  label,
  helperText,
  errorMessage,
  isChecked,
  defaultChecked,
  onChange,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  size = 'md',
  colorScheme = 'primary',
  className = '',
  ...props
}, ref) => {
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };
  
  // 颜色样式映射
  const colorClasses = {
    primary: 'text-primary-600 focus:ring-primary-500',
    secondary: 'text-secondary-600 focus:ring-secondary-500',
    success: 'text-success-600 focus:ring-success-500',
    danger: 'text-danger-600 focus:ring-danger-500',
    warning: 'text-warning-600 focus:ring-warning-500',
    info: 'text-info-600 focus:ring-info-500',
  };
  
  // 状态样式
  const stateClasses = isInvalid 
    ? 'border-danger-500 focus:ring-danger-500' 
    : 'border-gray-300';
  
  // 禁用样式
  const disabledClasses = isDisabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';
  
  // 基础样式
  const baseClasses = 'rounded focus:ring-2 focus:ring-offset-2';
  
  // 组合复选框样式
  const checkboxClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${colorClasses[colorScheme] || colorClasses.primary} 
    ${stateClasses} 
    ${disabledClasses}
  `;
  
  // 处理复选框变化
  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };
  
  return (
    <div className={`flex ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            checked={isChecked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            disabled={isDisabled}
            required={isRequired}
            aria-invalid={isInvalid}
            aria-describedby={
              helperText ? `${props.id}-helper-text` : 
              errorMessage ? `${props.id}-error-message` : undefined
            }
            className={checkboxClasses}
            {...props}
          />
        </div>
        {(label || helperText || errorMessage) && (
          <div className="ml-2 text-sm">
            {label && (
              <label 
                htmlFor={props.id} 
                className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-700'} ${isRequired ? 'required' : ''}`}
              >
                {label}
                {isRequired && <span className="text-danger-500 ml-1">*</span>}
              </label>
            )}
            {helperText && !isInvalid && (
              <p id={`${props.id}-helper-text`} className="text-gray-500">
                {helperText}
              </p>
            )}
            {isInvalid && errorMessage && (
              <p id={`${props.id}-error-message`} className="text-danger-500">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
