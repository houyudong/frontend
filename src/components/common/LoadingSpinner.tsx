import React from 'react';

/**
 * 加载中动画组件
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-500 text-lg">加载中...</p>
    </div>
  );
};

export default LoadingSpinner; 