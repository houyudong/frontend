import React from 'react';

/**
 * 资源卡片组件
 * @param {Object} props - 组件属性
 * @param {Object} props.resource - 资源对象，包含title, url, type等字段
 */
const ResourceCard = ({ resource }) => {
  // 获取资源类型图标
  const getResourceIcon = (type) => {
    switch (type) {
      case 'documentation':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'example':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'tool':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // 获取资源类型文本
  const getResourceTypeText = (type) => {
    switch (type) {
      case 'documentation':
        return '文档';
      case 'video':
        return '视频';
      case 'example':
        return '示例代码';
      case 'tool':
        return '工具';
      default:
        return '其他';
    }
  };

  // 获取资源类型颜色
  const getResourceTypeColor = (type) => {
    switch (type) {
      case 'documentation':
        return 'text-blue-600';
      case 'video':
        return 'text-red-600';
      case 'example':
        return 'text-green-600';
      case 'tool':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <a 
      href={resource.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300"
    >
      <div className="p-5">
        <div className={`flex items-center mb-3 ${getResourceTypeColor(resource.type)}`}>
          {getResourceIcon(resource.type)}
          <span className="ml-2 text-xs font-medium uppercase">
            {getResourceTypeText(resource.type)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{resource.title}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          查看资源
        </div>
      </div>
    </a>
  );
};

export default ResourceCard; 