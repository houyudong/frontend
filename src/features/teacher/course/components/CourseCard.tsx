/**
 * 课程卡片组件
 * 
 * 支持网格和列表两种显示模式
 */

import React from 'react';
import { Course } from '../types/Course';

interface CourseCardProps {
  course: Course;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
  onViewDetails: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onTogglePublish,
  onViewDetails
}) => {
  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      case 'archived':
        return '已归档';
      default:
        return status;
    }
  };

  // 网格视图
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        {/* 课程封面 */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center">
            {course.coverImage ? (
              <img 
                src={course.coverImage} 
                alt={course.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="text-white text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <div className="text-lg font-medium">{course.name}</div>
              </div>
            )}
          </div>
          
          {/* 选择框 */}
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {/* 状态标签 */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
              {getStatusText(course.status)}
            </span>
          </div>
        </div>

        {/* 课程信息 */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600">{course.code} • {course.category}</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {course.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-gray-500">学分:</span>
              <span className="ml-1 font-medium">{course.credits}</span>
            </div>
            <div>
              <span className="text-gray-500">学时:</span>
              <span className="ml-1 font-medium">{course.hours}</span>
            </div>
            <div>
              <span className="text-gray-500">学生:</span>
              <span className="ml-1 font-medium">{course.currentStudents}/{course.maxStudents}</span>
            </div>
            <div>
              <span className="text-gray-500">学期:</span>
              <span className="ml-1 font-medium">{course.semester}</span>
            </div>
          </div>
          
          {/* 标签 */}
          {course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {course.tags.slice(0, 3).map(tag => (
                <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
              {course.tags.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  +{course.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <button
              onClick={onViewDetails}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              查看详情
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="编辑"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={onTogglePublish}
                className={`p-2 rounded-lg transition-colors ${
                  course.status === 'published' 
                    ? 'text-green-600 hover:text-green-800 hover:bg-green-100' 
                    : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100'
                }`}
                title={course.status === 'published' ? '取消发布' : '发布课程'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              
              <button
                onClick={onDelete}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="删除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 列表视图
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* 选择框 */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {/* 课程图标 */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              {course.coverImage ? (
                <img 
                  src={course.coverImage} 
                  alt={course.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
          </div>
          
          {/* 课程信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {course.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                    {getStatusText(course.status)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {course.code} • {course.category} • {course.semester}
                </p>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>学分: {course.credits}</span>
                  <span>学时: {course.hours}</span>
                  <span>学生: {course.currentStudents}/{course.maxStudents}</span>
                  <span>更新: {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={onViewDetails}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                >
                  查看详情
                </button>
                
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="编辑"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={onTogglePublish}
                  className={`p-2 rounded-lg transition-colors ${
                    course.status === 'published' 
                      ? 'text-green-600 hover:text-green-800 hover:bg-green-100' 
                      : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100'
                  }`}
                  title={course.status === 'published' ? '取消发布' : '发布课程'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                <button
                  onClick={onDelete}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="删除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
