import React from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';

/**
 * Navbar - 顶部导航栏
 * 
 * 简洁的顶部导航，显示平台标题和用户信息
 * 参考ref目录实现，去除复杂功能
 */
const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      student: '学生',
      teacher: '教师', 
      admin: '管理员'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：平台标题 */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">STM32 AI 学习平台</span>
          </div>
          
          {user && (
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>|</span>
              <span>{getRoleDisplayName(user.role)}中心</span>
            </div>
          )}
        </div>

        {/* 右侧：用户操作 */}
        <div className="flex items-center space-x-4">
          {/* 用户信息 */}
          {user && (
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
              
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user.displayName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
