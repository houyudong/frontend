import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiUser,
  FiLock,
  FiLoader,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiCpu,
  FiCode,
  FiServer
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { PlatformLogo } from '../../components/branding';

type Role = 'student' | 'teacher' | 'admin';

interface TestAccount {
  username: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
}

/**
 * LoginPage - 登录页面
 *
 * 大气、专业的登录界面，带有嵌入式AI相关的动画背景
 *
 * @component
 */
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<Role>('student');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showTestInfo, setShowTestInfo] = useState<boolean>(false);

  // 引用
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 获取重定向路径
  const from = location.state?.from?.pathname || '/';

  // 初始化表单
  useEffect(() => {
    // 设置默认学生测试账号
    setRole('student');
    setUsername('20250001');

    // 自动聚焦用户名输入框
    if (usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, []);

  // 处理角色切换
  const handleRoleChange = (selectedRole: Role): void => {
    setRole(selectedRole);
    setPassword('');
    setError('');

    // 根据角色设置默认测试账号
    if (selectedRole === 'student') {
      setUsername('20250001');
    } else if (selectedRole === 'teacher') {
      setUsername('teacher001');
    } else if (selectedRole === 'admin') {
      setUsername('superadmin');
    }
  };

  // 处理登录
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // 表单验证
    if (!username.trim()) {
      setError('请输入用户名');
      usernameInputRef.current?.focus();
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(username, password);

      // 记住用户名
      if (rememberMe) {
        localStorage.setItem('savedUsername', username);
        localStorage.setItem('savedRole', role);
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedRole');
      }

      // 重定向到之前尝试访问的页面或首页
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };

  // 测试账号信息
  const getTestAccountInfo = (): TestAccount => {
    if (role === 'student') {
      return {
        username: '20250001',
        password: '20250001'
      };
    } else if (role === 'teacher') {
      return {
        username: 'teacher001',
        password: 'teacher001'
      };
    } else {
      return {
        username: 'superadmin',
        password: 'superadmin'
      };
    }
  };

  // 自动填充测试账号
  const fillTestAccount = (): void => {
    const testAccount = getTestAccountInfo();
    setUsername(testAccount.username);
    setPassword(testAccount.password);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 bg-gradient-animate">
      {/* 动画背景 - 电路板和AI元素 */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="circuit-animation">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="circuit-line"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 200 + 50}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="circuit-node"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 浮动图标 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[FiCpu, FiCode, FiServer].map((Icon, index) => (
          <Icon
            key={index}
            className="text-white/10 absolute animate-float"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              fontSize: `${Math.random() * 40 + 20}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Logo - 不可点击 */}
          <div className="mb-8 flex justify-center">
            <div className="inline-block">
              <PlatformLogo size="large" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl shadow-2xl">
            <div className="px-6 py-8 sm:px-10">
              <h2 className="text-center text-2xl font-bold text-white mb-1">欢迎登录</h2>
              <p className="text-center text-sm text-blue-100 mb-6">登录您的账户以访问嵌入式AI实训平台</p>

              {/* 角色选择 */}
              <div className="grid grid-cols-3 mb-6 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`py-2.5 rounded-md transition-all duration-300 font-medium text-sm ${
                    role === 'student'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  学生登录
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('teacher')}
                  className={`py-2.5 rounded-md transition-all duration-300 font-medium text-sm ${
                    role === 'teacher'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  教师登录
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`py-2.5 rounded-md transition-all duration-300 font-medium text-sm ${
                    role === 'admin'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  管理员
                </button>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-500/20 border border-red-500/30 text-red-100 text-sm flex items-center">
                  <FiAlertCircle className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 登录表单 */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-1">
                    用户名
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      ref={usernameInputRef}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="请输入用户名"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
                    密码
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-blue-200" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      ref={passwordInputRef}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-transparent rounded-md bg-white/10 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="请输入密码"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-blue-200 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-100">
                      记住我
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowTestInfo(!showTestInfo)}
                    className="text-sm text-blue-200 hover:text-white focus:outline-none flex items-center"
                  >
                    <FiInfo className="mr-1" />
                    测试账号
                  </button>
                </div>

                {/* 测试账号信息 */}
                {showTestInfo && (
                  <div className="p-3 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-100 text-sm">
                    <p className="mb-2">当前角色测试账号：</p>
                    <div className="space-y-1">
                      <p>用户名：{getTestAccountInfo().username}</p>
                      <p>密码：{getTestAccountInfo().password}</p>
                    </div>
                    <button
                      type="button"
                      onClick={fillTestAccount}
                      className="mt-2 text-sm text-blue-200 hover:text-white focus:outline-none"
                    >
                      自动填充
                    </button>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        登录中...
                      </>
                    ) : (
                      '登录'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 