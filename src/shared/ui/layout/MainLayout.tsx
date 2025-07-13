import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { getRoutesByRole } from '../../../router/routes';
import AIAssistant from '../../../features/aiAssist/components/AIAssistant';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - 主布局组件
 *
 * 基于ref版本的正确滚动机制，修复滚动条消失问题
 * 遵循奥卡姆原则：使用浏览器自然滚动，避免复杂的flex布局
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const routes = getRoutesByRole(user.role);
  const currentMainRoute = routes.find(route => location.pathname.startsWith(route.path));



  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ overflowY: 'scroll', height: '100vh' }}>
      {/* 固定顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧：平台标题 + 直接导航 */}
          <div className="flex items-center space-x-8">
            {/* 平台标题 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">STM32 AI</span>
            </div>

            {/* 直接显示子页面导航 */}
            <div className="hidden md:flex items-center space-x-1">
              {currentMainRoute?.children?.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === child.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span>{child.icon}</span>
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧：用户信息 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="退出登录"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 - 自然滚动 */}
      <div className="pt-20" style={{ overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>

      {/* AI助手 - 独立浮动 */}
      <AIAssistant />
    </div>
  );
};

export default MainLayout;
