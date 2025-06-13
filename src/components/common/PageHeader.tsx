import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  bgImage?: string;
}

/**
 * PageHeader - 页面标题组件
 *
 * 显示页面的标题和描述，可选背景图片。
 *
 * @component
 * @example
 * ```tsx
 * <PageHeader
 *   title="页面标题"
 *   description="页面描述"
 *   bgImage="/images/header-bg.jpg"
 * />
 * ```
 *
 * @returns {ReactElement} PageHeader组件
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  bgImage
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
      style={bgImage ? {
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : undefined}
    >
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeader; 