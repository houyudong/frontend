import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage - 404页面未找到组件
 *
 * 当用户访问不存在的页面时显示的404错误页面，提供返回首页的链接。
 *
 * @component
 * @example
 * ```tsx
 * <NotFoundPage />
 * ```
 *
 * @returns {JSX.Element} NotFoundPage组件
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
      <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">页面未找到</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        抱歉，您访问的页面不存在或已被移动。请检查URL或返回首页。
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
};

export default NotFoundPage; 