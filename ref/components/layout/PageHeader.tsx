import React from 'react';
import Breadcrumb from './Breadcrumb';

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showBreadcrumb?: boolean;
  className?: string;
  [key: string]: any;
}

/**
 * PageHeader - 页面头部组件
 * 
 * 显示页面标题、描述和面包屑导航
 * 
 * @component
 * @example
 * ```tsx
 * <PageHeader
 *   title="课程列表"
 *   description="浏览所有可用的STM32嵌入式开发课程"
 *   actions={<Button>新建课程</Button>}
 * />
 * ```
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  showBreadcrumb = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {/* 面包屑导航 */}
      {showBreadcrumb && (
        <div className="mb-2">
          <Breadcrumb />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* 标题和描述 */}
        <div>
          {title && (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        
        {/* 操作按钮 */}
        {actions && (
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 