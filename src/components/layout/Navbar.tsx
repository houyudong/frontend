import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiInfo, FiSearch, FiHelpCircle, FiBell, FiX } from 'react-icons/fi';
import { getRouteByPath } from '../../routes/routeUtils';
import { PlatformLogo } from '../branding';

interface NavbarProps {
  onMenuClick: () => void;
}

/**
 * Navbar - 导航栏组件
 *
 * 应用顶部导航栏，显示应用标题、页面标题和用户操作
 *
 * @component
 * @example
 * ```tsx
 * <Navbar onMenuClick={handleMenuClick} />
 * ```
 */
const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [hasNotifications, setHasNotifications] = useState<boolean>(true); // 模拟有通知

  // 关闭所有弹出菜单
  const closeAllMenus = (): void => {
    setSearchOpen(false);
    setHelpOpen(false);
    setNotificationsOpen(false);
  };

  // 获取当前路由信息
  const currentRoute = getRouteByPath(location.pathname);
  const pageTitle = currentRoute?.title || '页面';

  // 添加动画样式
  useEffect(() => {
    // 添加动画样式到head
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0% { transform: translateY(0px); }
        25% { transform: translateY(-3px); }
        50% { transform: translateY(-5px); }
        75% { transform: translateY(-3px); }
        100% { transform: translateY(0px); }
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
      }

      @keyframes rotate {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(90deg); }
        50% { transform: rotate(180deg); }
        75% { transform: rotate(270deg); }
        100% { transform: rotate(360deg); }
      }

      .floating {
        animation: float 3s ease-in-out infinite;
      }

      .pulsing {
        animation: pulse 2s ease-in-out infinite;
      }

      .rotating {
        animation: rotate 8s cubic-bezier(0.8, 0, 0.2, 1) infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* 左侧区域 - 菜单按钮和Logo */}
        <div className="flex items-center">
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden focus:outline-none"
            onClick={onMenuClick}
            aria-label="打开菜单"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          <Link to="/" className="hidden lg:flex items-center ml-2">
            <PlatformLogo size="small" />
          </Link>
        </div>

        {/* 中间区域 - 显示当前功能模块名称和动画 */}
        <div className="flex-1 flex justify-center items-center">
          {/* WebIDE页面 */}
          {location.pathname.includes('/webide') && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg p-2">
                <div className="flex items-center mr-3 text-blue-500">
                  <svg className="w-6 h-6 mr-2 floating pulsing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xl font-medium">AI代码IDE</span>
                </div>
                <span className="text-sm text-gray-500">在线编辑、编译和下载嵌入式程序</span>
              </div>

              {/* 使用帮助按钮 */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('webide-show-guide'))}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-3 py-1 text-sm rounded-md flex items-center gap-1 shadow-sm transition-all duration-300 transform hover:scale-105 ml-4"
              >
                <FiInfo className="w-4 h-4 animate-pulse" />
                使用帮助
              </button>
            </div>
          )}

          {/* 代码生成器页面 */}
          {location.pathname.includes('/code-generator') && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg p-2">
                <div className="flex items-center mr-3 text-blue-500">
                  <svg className="w-6 h-6 mr-2 rotating" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span className="text-xl font-medium">代码生成器</span>
                </div>
                <span className="text-sm text-gray-500">智能生成STM32外设初始化代码</span>
              </div>
            </div>
          )}

          {/* 串口调试工具页面 */}
          {location.pathname.includes('/serial-debugger') && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg p-2">
                <div className="flex items-center mr-3 text-blue-500">
                  <svg className="w-6 h-6 mr-2 floating" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  <span className="text-xl font-medium">串口调试工具</span>
                </div>
                <span className="text-sm text-gray-500">连接和监控串行设备</span>
              </div>
            </div>
          )}

          {/* 错误调试助手页面 */}
          {location.pathname.includes('/error-debugger') && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg p-2">
                <div className="flex items-center mr-3 text-blue-500">
                  <svg className="w-6 h-6 mr-2 pulsing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xl font-medium">错误调试</span>
                </div>
                <span className="text-sm text-gray-500">分析和解决编译错误</span>
              </div>
            </div>
          )}

          {/* 首页 */}
          {location.pathname === '/' && (
            <div className="flex items-center justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg p-2">
                <div className="flex items-center mr-3 text-blue-500">
                  <svg className="h-6 w-6 mr-2 floating" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-xl font-medium">首页</span>
                </div>
                <span className="text-sm text-gray-500">STM32嵌入式开发平台</span>
              </div>
            </div>
          )}

          {/* 其他页面 - 显示默认标题 */}
          {!location.pathname.includes('/webide') &&
           !location.pathname.includes('/code-generator') &&
           !location.pathname.includes('/serial-debugger') &&
           !location.pathname.includes('/error-debugger') &&
           location.pathname !== '/' && (
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
          )}
        </div>

        {/* 右侧区域 - 功能按钮 */}
        <div className="flex items-center space-x-2">
          {/* 搜索按钮 */}
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => {
              closeAllMenus();
              setSearchOpen(!searchOpen);
            }}
            aria-label="搜索"
          >
            <FiSearch className="h-5 w-5" />
          </button>

          {/* 帮助按钮 */}
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => {
              closeAllMenus();
              setHelpOpen(!helpOpen);
            }}
            aria-label="帮助"
          >
            <FiHelpCircle className="h-5 w-5" />
          </button>

          {/* 通知按钮 */}
          <div className="relative">
            <button
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                closeAllMenus();
                setNotificationsOpen(!notificationsOpen);
              }}
              aria-label="通知"
            >
              <FiBell className="h-5 w-5" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 搜索面板 */}
      {searchOpen && (
        <div className="border-t border-gray-200 bg-white p-4 shadow-md">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="搜索课程、实验、文档..."
                autoFocus
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* 帮助面板 */}
      {helpOpen && (
        <div className="border-t border-gray-200 bg-white p-4 shadow-md">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">帮助中心</h3>
            <div className="space-y-2">
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-md">
                快速入门指南
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-md">
                常见问题解答
              </a>
              <a href="#" className="block p-2 hover:bg-gray-50 rounded-md">
                联系支持团队
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 通知面板 */}
      {notificationsOpen && (
        <div className="border-t border-gray-200 bg-white p-4 shadow-md">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">通知</h3>
            <div className="space-y-2">
              <div className="p-2 hover:bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">新课程已发布：STM32 GPIO基础</p>
                <p className="text-xs text-gray-400">2小时前</p>
              </div>
              <div className="p-2 hover:bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">系统更新：新增代码生成器功能</p>
                <p className="text-xs text-gray-400">1天前</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 