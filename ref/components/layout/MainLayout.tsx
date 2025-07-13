import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import { getPageTitle } from '../../routes/routeUtils';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - 主布局组件
 *
 * 应用的主要布局组件，包含导航栏、侧边栏和页脚
 *
 * @component
 * @example
 * ```tsx
 * <MainLayout>
 *   <HomePage />
 * </MainLayout>
 * ```
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, role } = useAuth();

  // 路由变化时关闭侧边栏
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // 设置页面标题
  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = pageTitle ? `${pageTitle} - STM32 AI嵌入式教学平台` : 'STM32 AI嵌入式教学平台';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 导航栏 */}
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      {/* 侧边栏 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 主内容区域 */}
      <div className="flex-1 lg:ml-64 pt-16 transition-all duration-300">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* 开发环境调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs z-50">
          路径: {location.pathname}
          {isAuthenticated && ` | 角色: ${role}`}
        </div>
      )}
    </div>
  );
};

export default MainLayout; 