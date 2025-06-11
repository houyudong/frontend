import React, { forwardRef } from 'react';

/**
 * Radio - 单选框组件
 * 
 * 用于从多个选项中选择一个选项的单选框组件。
 * 
 * @component
 * @example
 * ```jsx
 * <Radio name="gender" value="male" label="男" />
 * <Radio name="gender" value="female" label="女" />
 * <Radio name="gender" value="other" label="其他" isDisabled />
 * ```
 */
const Radio = forwardRef(({
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
  const baseClasses = 'rounded-full focus:ring-2 focus:ring-offset-2';
  
  // 组合单选框样式
  const radioClasses = `
    ${baseClasses} 
    ${sizeClasses[size] || sizeClasses.md} 
    ${colorClasses[colorScheme] || colorClasses.primary} 
    ${stateClasses} 
    ${disabledClasses}
  `;
  
  // 处理单选框变化
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
            type="radio"
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
            className={radioClasses}
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

Radio.displayName = 'Radio';

/**
 * RadioGroup - 单选框组组件
 * 
 * 用于管理一组相关的单选框。
 * 
 * @component
 * @example
 * ```jsx
 * <RadioGroup 
 *   name="gender" 
 *   value={gender} 
 *   onChange={setGender}
 *   label="性别"
 * >
 *   <Radio value="male" label="男" />
 *   <Radio value="female" label="女" />
 *   <Radio value="other" label="其他" />
 * </RadioGroup>
 * ```
 */
export const RadioGroup = forwardRef(({
  children,
  name,
  value,
  defaultValue,
  onChange,
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  orientation = 'vertical',
  className = '',
  ...props
}, ref) => {
  // 处理单选框组变化
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  // 克隆子元素并注入属性
  const clonedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    
    return React.cloneElement(child, {
      name,
      isChecked: value !== undefined ? child.props.value === value : undefined,
      defaultChecked: defaultValue !== undefined ? child.props.value === defaultValue : undefined,
      onChange: handleChange,
      isDisabled: isDisabled || child.props.isDisabled,
      isInvalid: isInvalid || child.props.isInvalid,
      isRequired: isRequired || child.props.isRequired,
    });
  });
  
  // 方向样式
  const orientationClasses = orientation === 'horizontal' 
    ? 'flex flex-row space-x-4' 
    : 'flex flex-col space-y-2';
  
  return (
    <div ref={ref} className={`${className}`} role="radiogroup" {...props}>
      {/* 标签 */}
      {label && (
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRequired ? 'required' : ''}`}>
          {label}
          {isRequired && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      {/* 单选框组 */}
      <div className={orientationClasses}>
        {clonedChildren}
      </div>
      
      {/* 帮助文本或错误消息 */}
      {(helperText || errorMessage) && (
        <div className="mt-1">
          {helperText && !isInvalid && (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
          {isInvalid && errorMessage && (
            <p className="text-sm text-danger-500">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default Radio;
