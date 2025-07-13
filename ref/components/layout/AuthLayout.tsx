import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PlatformLogo } from '../branding';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  [key: string]: any; // 允许其他 HTML 属性
}

/**
 * AuthLayout - 认证页面布局组件
 *
 * 用于登录、注册等认证相关页面的布局
 *
 * @component
 * @example
 * ```tsx
 * <AuthLayout
 *   title="登录"
 *   subtitle="登录您的账户以访问平台"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" {...props}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo - 不可点击 */}
        <div className="flex justify-center">
          <div className="inline-block">
            <PlatformLogo size="medium" />
          </div>
        </div>

        {/* 标题 */}
        {title && (
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
        )}

        {/* 副标题 */}
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* 内容 */}
      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md ${className}`}>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>

        {/* 页脚 */}
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout; 