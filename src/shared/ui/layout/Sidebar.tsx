import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { getRoutesByRole } from '../../../router/routes';

/**
 * Sidebar - 侧边栏组件
 * 
 * 简洁的侧边栏导航，基于用户角色显示菜单
 * 参考ref目录实现，简化复杂功能
 */
const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const routes = getRoutesByRole(user.role);

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* 侧边栏头部 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">STM32 AI</h2>
            <p className="text-sm text-gray-500">学习平台</p>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {routes.map((route) => (
            <div key={route.path}>
              {/* 主菜单项 */}
              <Link
                to={route.children?.[0]?.path || route.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActiveRoute(route.path)
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-lg">{route.icon}</span>
                <span>{route.name}</span>
              </Link>

              {/* 子菜单项 */}
              {route.children && isActiveRoute(route.path) && (
                <div className="ml-6 mt-2 space-y-1">
                  {route.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`
                        flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${location.pathname === child.path
                          ? 'bg-blue-100 text-blue-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }
                      `}
                    >
                      <span className="text-base">{child.icon}</span>
                      <span>{child.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 侧边栏底部 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>系统运行正常</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
