import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';

/**
 * NotFoundPage - 404页面
 * 
 * 简洁的404错误页面，提供返回功能
 * 遵循奥卡姆原则：简单而友好的错误提示
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        student: '/student/dashboard',
        teacher: '/teacher/dashboard',
        admin: '/admin/dashboard'
      };
      navigate(roleRoutes[user.role]);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404图标 */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
            <span className="text-4xl">🤖</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在或已被移动。
            <br />
            让我们帮您回到正确的地方。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full btn-primary"
          >
            {isAuthenticated ? '返回首页' : '前往登录'}
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full btn-secondary"
          >
            返回上一页
          </button>
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">需要帮助？</h3>
          <p className="text-sm text-blue-700">
            如果您认为这是一个错误，请联系系统管理员或使用右侧的AI助手获取帮助。
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
