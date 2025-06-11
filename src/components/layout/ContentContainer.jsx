import React from 'react';

/**
 * ContentContainer - 内容容器组件
 * 
 * 用于包装页面主要内容，提供一致的间距和样式
 * 
 * @component
 * @example
 * ```jsx
 * <ContentContainer>
 *   <p>页面内容</p>
 * </ContentContainer>
 * ```
 */
const ContentContainer = ({
  children,
  className = '',
  padding = true,
  background = true,
  rounded = true,
  shadow = true,
  ...props
}) => {
  // 基础样式
  const baseClasses = 'w-full';
  
  // 可选样式
  const paddingClasses = padding ? 'p-4 sm:p-6' : '';
  const backgroundClasses = background ? 'bg-white' : '';
  const roundedClasses = rounded ? 'rounded-lg' : '';
  const shadowClasses = shadow ? 'shadow-sm' : '';
  
  // 组合样式
  const containerClasses = `
    ${baseClasses}
    ${paddingClasses}
    ${backgroundClasses}
    ${roundedClasses}
    ${shadowClasses}
    ${className}
  `;
  
  return (
    <div className={containerClasses} {...props}>
      {children}
    </div>
  );
};

export default ContentContainer;
