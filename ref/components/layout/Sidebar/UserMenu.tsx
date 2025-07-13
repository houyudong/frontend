import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiSearch, FiHelpCircle, FiBell } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthContext';

interface User {
  name?: string;
  username: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student' | string;
}

interface UserMenuProps {
  user: User;
  isAuthenticated: boolean;
}

/**
 * UserMenu - 用户菜单组件
 *
 * 显示用户信息和相关操作菜单
 *
 * @component
 * @example
 * ```tsx
 * <UserMenu user={user} isAuthenticated={isAuthenticated} />
 * ```
 */
const UserMenu: React.FC<UserMenuProps> = ({ user, isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // 模拟有通知
  const { logout } = useAuth();

  // 关闭所有弹出菜单
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setSearchOpen(false);
    setHelpOpen(false);
    setNotificationsOpen(false);
  };

  // 如果用户未登录，显示登录按钮
  if (!isAuthenticated) {
    return (
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Link
          to="/login"
          className="flex justify-center items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-150"
        >
          登录
        </Link>
      </div>
    );
  }

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  // 获取用户角色显示文本
  const getRoleText = (role: string): string => {
    switch (role) {
      case 'admin':
        return '管理员';
      case 'teacher':
        return '教师';
      case 'student':
        return '学生';
      default:
        return '用户';
    }
  };

  // 获取用户头像
  const getAvatar = () => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name || user.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    }

    // 如果没有头像，显示首字母
    const initial = (user.name || user.username || 'U').charAt(0).toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg font-medium">
        {initial}
      </div>
    );
  };

  return (
    <div className="relative border-t border-gray-200 bg-gray-50">
      {/* 功能按钮区域 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-around">
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

        {/* 搜索面板 */}
        {searchOpen && (
          <div className="mt-3 p-3 bg-white rounded-md shadow-md">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="搜索课程、实验、文档..."
                autoFocus
              />
              <div className="absolute left-2 top-2.5 text-gray-400">
                <FiSearch className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}

        {/* 帮助面板 */}
        {helpOpen && (
          <div className="mt-3 p-3 bg-white rounded-md shadow-md">
            <h4 className="font-medium text-gray-900 mb-2">帮助中心</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-primary-600 hover:text-primary-800">使用指南</a>
              </li>
              <li>
                <a href="#" className="text-primary-600 hover:text-primary-800">常见问题</a>
              </li>
              <li>
                <a href="#" className="text-primary-600 hover:text-primary-800">联系支持</a>
              </li>
            </ul>
          </div>
        )}

        {/* 通知面板 */}
        {notificationsOpen && (
          <div className="mt-3 bg-white rounded-md shadow-md overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100">
              <h4 className="font-medium text-gray-900">通知</h4>
            </div>
            <div className="max-h-60 overflow-y-auto">
              <div className="px-3 py-2 hover:bg-gray-50 border-b border-gray-100">
                <p className="text-sm text-gray-700">您的实验报告已被评分</p>
                <p className="text-xs text-gray-500">2小时前</p>
              </div>
              <div className="px-3 py-2 hover:bg-gray-50">
                <p className="text-sm text-gray-700">新课程已发布</p>
                <p className="text-xs text-gray-500">昨天</p>
              </div>
            </div>
            <div className="px-3 py-2 border-t border-gray-100 text-center">
              <a href="#" className="text-xs text-primary-600 hover:text-primary-800">查看所有通知</a>
            </div>
          </div>
        )}
      </div>

      {/* 用户信息区域 */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAvatar()}
            <div>
              <div className="font-medium text-gray-900">
                {user.name || user.username}
              </div>
              <div className="text-sm text-gray-500">
                {getRoleText(user.role)}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              closeAllMenus();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 rounded-full hover:bg-gray-200 focus:outline-none transition-colors duration-150"
            aria-label="用户菜单"
          >
            <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-150 ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 用户菜单 */}
        {isMenuOpen && (
          <div className="mt-2 py-1 bg-white rounded-md shadow-lg border border-gray-200">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiUser className="mr-2" />
              个人资料
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiSettings className="mr-2" />
              设置
            </Link>

            {(user.role === 'teacher' || user.role === 'admin') && (
              <Link
                to="/dashboard"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiSettings className="mr-2" />
                控制面板
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              <FiLogOut className="mr-2" />
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu; 