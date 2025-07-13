import React, { useState } from 'react';
import { useAuth, UserRole } from '../../../app/providers/AuthProvider';

/**
 * LoginPage - 登录页面
 * 
 * 简洁专业的登录界面，支持三种角色登录
 * 遵循奥卡姆原则：简洁而不简单的设计
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  // 测试账号信息
  const testAccounts = {
    student: { username: '20250001', password: '20250001' },
    teacher: { username: 'teacher001', password: 'teacher001' },
    admin: { username: 'admin', password: 'admin' }
  };

  // 处理登录
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      await login(username, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试');
    }
  };

  // 角色选择处理
  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setError('');
    // 自动填充对应角色的用户名
    setUsername(testAccounts[selectedRole].username);
  };

  // 使用测试账号
  const useTestAccount = () => {
    const account = testAccounts[role];
    setUsername(account.username);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center px-4">
      {/* 动画背景 */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">STM32 AI 学习平台</h1>
          <p className="text-blue-100">嵌入式AI实训开发环境</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-white text-center mb-6">欢迎登录</h2>

          {/* 角色选择 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { id: 'student', name: '学生', icon: '🎓' },
              { id: 'teacher', name: '教师', icon: '👨‍🏫' },
              { id: 'admin', name: '管理员', icon: '👨‍💼' }
            ].map((roleOption) => (
              <button
                key={roleOption.id}
                type="button"
                onClick={() => handleRoleChange(roleOption.id as UserRole)}
                className={`
                  py-3 px-2 rounded-lg transition-all duration-300 font-medium text-sm
                  ${role === roleOption.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-1">
                  <span className="text-lg">{roleOption.icon}</span>
                  <span>{roleOption.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-100 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1">
                用户名
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入用户名"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-200">👤</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入密码"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-blue-200">🔒</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-200 hover:text-white"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-blue-100">
                <input type="checkbox" className="mr-2 rounded" />
                记住我
              </label>
              <button
                type="button"
                onClick={useTestAccount}
                className="text-blue-200 hover:text-white"
              >
                使用测试账号
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  登录中...
                </div>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* 测试账号信息 */}
          <div className="mt-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-100 text-xs">
            <p className="mb-1">测试账号:</p>
            <p>用户名: {testAccounts[role].username}</p>
            <p>密码: {testAccounts[role].password}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
