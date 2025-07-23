import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import NotificationEntry from '../../components/common/NotificationEntry';

/**
 * Navbar - 现代化顶部导航栏
 *
 * 简约美观的顶部导航，优化UI设计和用户体验
 */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      student: '学生',
      teacher: '教师',
      admin: '管理员'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  // 获取用户角色对应的路由前缀
  const getRolePrefix = (role: string) => {
    const rolePrefixes = {
      student: '/student',
      teacher: '/teacher',
      admin: '/admin'
    };
    return rolePrefixes[role as keyof typeof rolePrefixes] || '/student';
  };

  // 处理菜单项点击
  const handleMenuClick = (path: string) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const getRoleIcon = (role: string) => {
    const roleIcons = {
      student: '🎓',
      teacher: '👨‍🏫',
      admin: '👑'
    };
    return roleIcons[role as keyof typeof roleIcons] || '👤';
  };

  const getRoleColor = (role: string) => {
    const roleColors = {
      student: 'from-blue-500 to-indigo-600',
      teacher: 'from-green-500 to-emerald-600',
      admin: 'from-purple-500 to-violet-600'
    };
    return roleColors[role as keyof typeof roleColors] || 'from-gray-500 to-gray-600';
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* 左侧：Logo和导航 */}
          <div className="flex items-center space-x-8">
            {/* Logo区域 */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">STM32 AI</span>
                <span className="hidden sm:inline text-lg font-bold text-gray-900">学习平台</span>
              </div>
            </div>

            {/* 导航菜单 */}
            {user && (
              <div className="hidden md:flex items-center space-x-1">
                <div className={`px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium`}>
                  <div className="flex items-center space-x-1">
                    <span>{getRoleIcon(user.role)}</span>
                    <span>{getRoleDisplayName(user.role)}中心</span>
                  </div>
                </div>

                <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                  课程学习
                </button>

                <button className="px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors">
                  实验中心
                </button>
              </div>
            )}
          </div>

          {/* 右侧：用户操作 */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                {/* 通知中心入口 */}
                <NotificationEntry
                  userRole={user.role as 'student' | 'teacher' | 'admin'}
                  userId={user.id}
                />

                {/* 用户菜单 */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {/* 用户信息 */}
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>

                    {/* 用户头像 */}
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {user.displayName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* 下拉箭头 */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 下拉菜单 */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {/* 用户信息头部 */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{user.displayName}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs">{getRoleIcon(user.role)}</span>
                          <span className="text-xs text-gray-600">{getRoleDisplayName(user.role)}</span>
                        </div>
                      </div>

                      {/* 菜单项 */}
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuClick(`${getRolePrefix(user.role)}/profile`)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>个人中心</span>
                        </button>

                        <button
                          onClick={() => handleMenuClick(`${getRolePrefix(user.role)}/notifications`)}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <span>通知中心</span>
                        </button>

                        <button
                          onClick={() => handleMenuClick('/user-center')}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>设置</span>
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>退出登录</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
