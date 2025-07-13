import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';

interface MenuItem {
  id: string;
  title: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  divider?: boolean;
}

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  toggleExpanded: () => void;
  iconMap: Record<string, IconType>;
  level?: number;
}

/**
 * SidebarItem - 侧边栏菜单项组件
 * 
 * 渲染侧边栏中的单个菜单项，支持子菜单
 * 
 * @component
 * @example
 * ```tsx
 * <SidebarItem
 *   item={menuItem}
 *   isActive={isActive}
 *   isExpanded={isExpanded}
 *   toggleExpanded={toggleExpanded}
 *   iconMap={iconMap}
 * />
 * ```
 */
const SidebarItem: React.FC<SidebarItemProps> = ({ 
  item, 
  isActive, 
  isExpanded, 
  toggleExpanded, 
  iconMap,
  level = 0 
}) => {
  const { id, title, path, icon, children, divider } = item;
  
  // 获取图标组件
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;
  
  // 基础样式
  const baseClasses = "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150";
  
  // 激活状态样式
  const activeClasses = isActive 
    ? "bg-primary-100 text-primary-900" 
    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  
  // 缩进样式
  const indentClasses = level > 0 ? `pl-${level * 3 + 2}` : '';
  
  // 分隔线
  const dividerElement = divider && (
    <div className="my-2 border-t border-gray-200"></div>
  );
  
  // 如果有子菜单，渲染可展开的菜单项
  if (children && children.length > 0) {
    return (
      <>
        <li>
          <button
            className={`${baseClasses} ${activeClasses} ${indentClasses} w-full justify-between`}
            onClick={toggleExpanded}
            aria-expanded={isExpanded}
          >
            <div className="flex items-center">
              {IconComponent && (
                <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
              )}
              <span>{title}</span>
            </div>
            <svg
              className={`h-5 w-5 transform transition-transform duration-150 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* 子菜单 */}
          {isExpanded && (
            <ul className="mt-1 space-y-1">
              {children.map((child) => (
                <SidebarItem
                  key={child.id}
                  item={child}
                  isActive={!!(child.path && window.location.pathname === child.path)}
                  isExpanded={false}
                  toggleExpanded={() => {}}
                  iconMap={iconMap}
                  level={level + 1}
                />
              ))}
            </ul>
          )}
        </li>
        {dividerElement}
      </>
    );
  }
  
  // 如果没有子菜单，渲染普通菜单项
  return (
    <>
      <li>
        <Link
          to={path || '#'}
          className={`${baseClasses} ${activeClasses} ${indentClasses}`}
        >
          {IconComponent && (
            <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
          )}
          <span>{title}</span>
        </Link>
      </li>
      {dividerElement}
    </>
  );
};

export default SidebarItem; 