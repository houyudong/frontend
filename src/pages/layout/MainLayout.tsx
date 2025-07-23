import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { getRoutesByRole } from '../../router/routes';
import AIAssistant from '../../features/aiAssist/components/AIAssistant';
import { NotificationProvider } from '../../app/providers/NotificationProvider';

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
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const routes = getRoutesByRole(user.role);
  const currentMainRoute = routes.find(route => location.pathname.startsWith(route.path));

  // 如果在用户中心，显示用户角色对应的主路由菜单
  const displayRoute = currentMainRoute || (location.pathname === '/user-center' ? routes[0] : null);



  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // 处理用户中心点击事件
  const handleUserCenterClick = () => {
    navigate('/user-center');
  };

  return (
    <NotificationProvider userId={user.id} userRole={user.role as 'student' | 'teacher' | 'admin'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50" style={{
        overflowY: 'scroll',
        height: '100vh'
      }}>
      {/* 固定顶部导航栏 - 增强设计 */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 shadow-lg border-b border-gray-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：平台标题 + 直接导航 */}
          <div className="flex items-center space-x-8">
            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* 平台标题 - 增强设计 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  STM32 AI
                </span>
                <div className="text-xs text-gray-500 font-medium">嵌入式学习平台</div>
              </div>
            </div>

            {/* 直接显示子页面导航 - 增强设计 */}
            <div className="hidden md:flex items-center space-x-2">
              {/* 如果在用户中心，显示返回按钮 */}
              {location.pathname === '/user-center' && displayRoute && (
                <Link
                  to={displayRoute.path}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm hover:transform hover:scale-105 transition-all duration-200"
                >
                  <span className="text-lg">←</span>
                  <span>返回{displayRoute.name}</span>
                </Link>
              )}

              {/* 显示子页面导航 */}
              {displayRoute?.children?.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  className={`
                    flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${location.pathname === child.path
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                      : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm hover:transform hover:scale-105'
                    }
                  `}
                >
                  <span className="text-lg">{child.icon}</span>
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧：用户信息 - 增强设计 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {/* 用户头像和信息 - 可点击进入用户中心 */}
              <button
                onClick={handleUserCenterClick}
                className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                title="点击进入用户中心"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.displayName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.displayName}</p>
                  <p className="text-xs text-gray-500">{user.username}</p>
                </div>
                {/* 用户中心图标提示 */}
                <div className="ml-2 opacity-60">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              {/* 退出按钮 */}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-105"
                title="退出登录"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-6 py-4 space-y-2">
              {/* 如果在用户中心，显示返回按钮 */}
              {location.pathname === '/user-center' && displayRoute && (
                <Link
                  to={displayRoute.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-lg">←</span>
                  <span>返回{displayRoute.name}</span>
                </Link>
              )}

              {/* 显示子页面导航 */}
              {displayRoute?.children?.map((child) => (
                <Link
                  key={child.path}
                  to={child.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === child.path
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-lg">{child.icon}</span>
                  <span>{child.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* 主内容区域 - 增强设计，优化屏占比 */}
      <div className="pt-24" style={{ overflowY: 'auto', height: 'calc(100vh - 96px)' }}>
        <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            {children}
          </div>
        </main>
      </div>

      {/* AI助手 - 独立浮动 */}
      <AIAssistant />
      </div>
    </NotificationProvider>
  );
};

export default MainLayout;
