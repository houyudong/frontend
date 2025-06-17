import React from 'react';
import { Link } from 'react-router-dom';
import { FiFile, FiDownload, FiExternalLink } from 'react-icons/fi';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'code' | 'link';
  size?: string;
  url: string;
  downloads?: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  description,
  type,
  size,
  url,
  downloads
}) => {
  const getIcon = () => {
    switch (type) {
      case 'document':
        return <FiFile className="w-6 h-6" />;
      case 'code':
        return <FiDownload className="w-6 h-6" />;
      case 'link':
        return <FiExternalLink className="w-6 h-6" />;
      default:
        return <FiFile className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-primary-500">
          {getIcon()}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-2">{description}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            {size && <span>{size}</span>}
            {downloads !== undefined && <span>{downloads} 次下载</span>}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Link
          to={url}
          className="inline-flex items-center text-primary-500 hover:text-primary-600"
          target={type === 'link' ? '_blank' : undefined}
        >
          {type === 'link' ? '访问链接' : '下载资源'}
          <FiExternalLink className="ml-1 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard; 