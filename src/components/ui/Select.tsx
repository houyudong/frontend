import React, { forwardRef, ChangeEvent } from 'react';
import { FiChevronDown } from 'react-icons/fi';

type SelectVariant = 'default' | 'filled' | 'flushed' | 'unstyled';
type SelectSize = 'sm' | 'md' | 'lg';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  value?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  variant?: SelectVariant;
  size?: SelectSize;
  className?: string;
}

/**
 * Select - 选择框组件
 * 
 * 用于从预定义选项中选择一个或多个值的下拉选择组件。
 * 
 * @component
 * @example
 * ```tsx
 * <Select 
 *   label="选择国家" 
 *   options={[
 *     { value: 'cn', label: '中国' },
 *     { value: 'us', label: '美国' },
 *     { value: 'jp', label: '日本' }
 *   ]} 
 * />
 * ```
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options = [],
  value,
  onChange,
  placeholder = '请选择',
  label,
  helperText,
  errorMessage,
  isInvalid = false,
  isDisabled = false,
  isRequired = false,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  // 变体样式映射
  const variantClasses: Record<SelectVariant, string> = {
    default: 'bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    flushed: 'bg-transparent border-b border-gray-300 rounded-none px-0 focus:border-primary-500 focus:ring-0',
    unstyled: 'bg-transparent border-0 px-0 focus:ring-0',
  };
  
  // 尺寸样式映射
  const sizeClasses: Record<SelectSize, string> = {
    sm: 'py-1 pl-2 pr-8 text-sm',
    md: 'py-2 pl-3 pr-10 text-base',
    lg: 'py-2.5 pl-4 pr-10 text-lg',
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
  const baseClasses = 'block w-full rounded-md shadow-sm focus:outline-none appearance-none';
  
  // 组合选择框样式
  const selectClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${stateClasses} 
    ${disabledClasses} 
    ${className}
  `;
  
  // 处理选择变化
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
  };
  
  // 选择框组件
  const selectElement = (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        className={selectClasses}
        disabled={isDisabled}
        required={isRequired}
        aria-invalid={isInvalid}
        aria-describedby={
          helperText ? `${props.id}-helper-text` : 
          errorMessage ? `${props.id}-error-message` : undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <FiChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
  
  // 如果没有标签、帮助文本或错误消息，只返回选择框
  if (!label && !helperText && !errorMessage) {
    return selectElement;
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
      
      {/* 选择框 */}
      {selectElement}
      
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

Select.displayName = 'Select';

export default Select; 