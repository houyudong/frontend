import React from 'react';

/**
 * Card - 卡片组件
 *
 * 用于展示内容的容器组件，可以包含标题、内容和操作。
 * 支持多种变体和交互式效果。
 *
 * @component
 * @example
 * ```jsx
 * // 基本用法
 * <Card>
 *   <Card.Header>
 *     <Card.Title>卡片标题</Card.Title>
 *     <Card.Subtitle>卡片副标题</Card.Subtitle>
 *   </Card.Header>
 *   <Card.Body>卡片内容</Card.Body>
 *   <Card.Footer>
 *     <Button>操作按钮</Button>
 *   </Card.Footer>
 * </Card>
 *
 * // 不同变体
 * <Card variant="elevated">
 *   <Card.Body>带阴影的卡片</Card.Body>
 * </Card>
 *
 * // 交互式卡片
 * <Card interactive onClick={handleClick}>
 *   <Card.Body>点击我</Card.Body>
 * </Card>
 *
 * // 带图片的卡片
 * <Card>
 *   <Card.Image src="/image.jpg" alt="卡片图片" />
 *   <Card.Body>带图片的卡片</Card.Body>
 * </Card>
 * ```
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 卡片内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @param {string} [props.variant="default"] - 卡片变体，可选值：default, elevated, flat, bordered
 * @param {boolean} [props.interactive=false] - 是否启用交互式效果
 * @returns {ReactElement} Card组件
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...props
}) => {
  // 变体样式映射
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md',
    flat: 'bg-gray-50 border border-gray-100',
    bordered: 'bg-white border-2 border-gray-200',
  };

  // 交互式卡片样式
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-transform hover:translate-y-[-2px] hover:shadow-md'
    : '';

  // 基础样式
  const baseClasses = 'rounded-lg overflow-hidden';

  // 组合所有样式
  const allClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${interactiveClasses} ${className}`;

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Header - 卡片头部组件
 *
 * 用于显示卡片的头部内容，通常包含标题和副标题。
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 头部内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @returns {ReactElement} Card.Header组件
 */
Card.Header = ({ children, className = '', ...props }) => {
  const baseClasses = 'px-4 py-3 border-b border-gray-200';

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Body - 卡片内容组件
 *
 * 用于显示卡片的主要内容。
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 卡片内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @returns {ReactElement} Card.Body组件
 */
Card.Body = ({ children, className = '', ...props }) => {
  const baseClasses = 'p-4';

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Footer - 卡片底部组件
 *
 * 用于显示卡片的底部内容，通常包含操作按钮。
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 底部内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @returns {ReactElement} Card.Footer组件
 */
Card.Footer = ({ children, className = '', ...props }) => {
  const baseClasses = 'px-4 py-3 border-t border-gray-200 bg-gray-50';

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Title - 卡片标题组件
 *
 * 用于显示卡片的标题。
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 标题内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @returns {ReactElement} Card.Title组件
 */
Card.Title = ({ children, className = '', ...props }) => {
  const baseClasses = 'text-lg font-semibold text-gray-900';

  return (
    <h3 className={`${baseClasses} ${className}`} {...props}>
      {children}
    </h3>
  );
};

/**
 * Card.Subtitle - 卡片副标题组件
 *
 * 用于显示卡片的副标题。
 *
 * @param {Object} props - 组件属性
 * @param {ReactNode} props.children - 副标题内容
 * @param {string} [props.className=""] - 自定义CSS类名
 * @returns {ReactElement} Card.Subtitle组件
 */
Card.Subtitle = ({ children, className = '', ...props }) => {
  const baseClasses = 'text-sm text-gray-500 mt-1';

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Card.Image - 卡片图片组件
 *
 * 用于在卡片中显示图片。
 *
 * @param {Object} props - 组件属性
 * @param {string} props.src - 图片源URL
 * @param {string} [props.alt=""] - 图片替代文本
 * @param {string} [props.className=""] - 自定义CSS类名
 * @param {string} [props.position="top"] - 图片位置，可选值：top, left, right
 * @returns {ReactElement} Card.Image组件
 */
Card.Image = ({ src, alt = '', className = '', position = 'top', ...props }) => {
  const positionClasses = {
    top: 'w-full',
    left: 'float-left mr-4 max-w-[40%]',
    right: 'float-right ml-4 max-w-[40%]',
  };

  const baseClasses = 'object-cover';

  return (
    <img
      src={src}
      alt={alt}
      className={`${baseClasses} ${positionClasses[position] || positionClasses.top} ${className}`}
      {...props}
    />
  );
};

export default Card;
