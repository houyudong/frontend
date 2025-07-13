import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getSidebarMenu } from '../../../routes/routeUtils';
import { iconMap, NavItem } from '../../../routes/navigation';
import SidebarItem from './SidebarItem';
import { PlatformLogo } from '../../../components/branding';
// 使用绝对路径导入底部图标组件
import BottomIcons from '../../../components/layout/BottomIcons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar - 侧边栏组件
 *
 * 显示应用的导航菜单
 *
 * @component
 * @example
 * ```tsx
 * <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
 * ```
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user, role } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // 获取用户可访问的菜单
  const menuItems = getSidebarMenu(role);

  // 根据当前路径自动展开菜单项
  useEffect(() => {
    const newExpandedItems = { ...expandedItems };

    menuItems.forEach(item => {
      if (item.children) {
        const shouldExpand = item.children.some(child =>
          location.pathname === child.path ||
          location.pathname.startsWith(`${child.path}/`)
        );

        if (shouldExpand) {
          newExpandedItems[item.id] = true;
        }
      }
    });

    setExpandedItems(newExpandedItems);
    // 移除 menuItems 依赖，因为它是基于 role 计算的
    // role 变化时会触发重新渲染，不需要在依赖数组中包含 menuItems
  }, [location.pathname, role]);

  // 切换菜单项展开状态
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // 检查菜单项是否激活
  const isItemActive = (path?: string): boolean => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      {/* 移动端背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:z-30 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* 侧边栏头部 */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link to="/" className="flex items-center">
            <PlatformLogo size="small" />
          </Link>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="关闭侧边栏"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 侧边栏内容 - 添加底部内边距，防止内容被底部图标遮挡 */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto" style={{ paddingBottom: '60px' }}>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isActive={isItemActive(item.path)}
                isExpanded={expandedItems[item.id]}
                toggleExpanded={() => toggleExpanded(item.id)}
                iconMap={iconMap}
              />
            ))}
          </ul>
        </nav>

        {/* 底部图标 - 使用固定定位，确保始终在底部 */}
        <div className="absolute bottom-0 left-0 right-0">
          <BottomIcons />
        </div>
      </div>
    </>
  );
};

export default Sidebar; 